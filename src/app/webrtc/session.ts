/* eslint-disable sonarjs/cognitive-complexity */
import * as mediasoupClient from 'mediasoup-client'
import { PermissionsAndroid, Platform, type Permission } from 'react-native'
import { mediaDevices, MediaStream, registerGlobals } from 'react-native-webrtc'

import { SignalingClient } from './signaling'
import { buildProtooUrl, isNewConsumerRequestData, normalizeRouterRtpCapabilities, stringifyError } from './session.utils'

interface TransportOptions {
	transportId: string
	iceParameters: mediasoupClient.types.IceParameters
	iceCandidates: mediasoupClient.types.IceCandidate[]
	dtlsParameters: mediasoupClient.types.DtlsParameters
	sctpParameters?: mediasoupClient.types.SctpParameters
}

interface ProducingPayload {
	kind: string
	rtpParameters: unknown
	appData: Record<string, unknown>
}

interface ProducerResponse {
	id?: string
	producerId?: string
}

interface ConnectTransportData {
	[key: string]: unknown
	transportId: string
	dtlsParameters: mediasoupClient.types.DtlsParameters
}

export interface SessionOptions {
	signalingUrl: string
	roomId: string
	peerId: string
	displayName: string
	enableVideo: boolean
	enableAudio: boolean
	forceTcp?: boolean
	onLog?: (message: string) => void
	onRemoteStreamUpdated?: (stream: MediaStream) => void
}

export interface MediasoupSession {
	localStream: MediaStream
	remoteStream: MediaStream
	close: () => Promise<void>
}

const SIGNALING_METHODS = {
	join: 'join',
	getRouterRtpCapabilities: 'getRouterRtpCapabilities',
	createWebRtcTransport: 'createWebRtcTransport',
	connectWebRtcTransport: 'connectWebRtcTransport',
	produce: 'produce',
} as const

const NOOP = (): void => undefined

const ensureAndroidMediaPermissions = async (
	requestAudio: boolean,
	requestVideo: boolean
): Promise<{ canUseAudio: boolean; canUseVideo: boolean }> => {
	if (Platform.OS !== 'android') {
		return {
			canUseAudio: requestAudio,
			canUseVideo: requestVideo,
		}
	}

	const permissions: Permission[] = []
	if (requestAudio) {
		permissions.push(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO)
	}
	if (requestVideo) {
		permissions.push(PermissionsAndroid.PERMISSIONS.CAMERA)
	}

	if (permissions.length === 0) {
		return {
			canUseAudio: false,
			canUseVideo: false,
		}
	}

	const statuses = (await PermissionsAndroid.requestMultiple(permissions)) as Partial<Record<Permission, string>>
	const canUseAudio =
		requestAudio && statuses[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === PermissionsAndroid.RESULTS.GRANTED
	const canUseVideo = requestVideo && statuses[PermissionsAndroid.PERMISSIONS.CAMERA] === PermissionsAndroid.RESULTS.GRANTED

	return { canUseAudio, canUseVideo }
}

export async function createMediasoupSession(options: SessionOptions): Promise<MediasoupSession> {
	const signalingClient = new SignalingClient()

	const log = (message: string): void => {
		options.onLog?.(message)
	}

	const call = async <T>(method: string, data?: Record<string, unknown>): Promise<T> => {
		log(`-> ${method}`)
		const startedAt = Date.now()

		try {
			const response = await signalingClient.request<T>(method, data)
			log(`<-${method} ok (${(Date.now() - startedAt).toString()}ms)`)
			return response
		} catch (error) {
			log(`<-${method} fail: ${stringifyError(error)}`)
			throw error
		}
	}

	registerGlobals()
	log('registerGlobals done')

	const protooUrl = buildProtooUrl(options.signalingUrl, options.roomId, options.peerId)
	await signalingClient.connect(protooUrl)
	log(`socket connected: ${protooUrl}`)

	const consumers = new Map<string, mediasoupClient.types.Consumer>()
	const consumerPeerById = new Map<string, string>()
	const consumerIdsByPeer = new Map<string, Set<string>>()
	const producers = new Map<string, mediasoupClient.types.Producer>()

	let sendTransport: mediasoupClient.types.Transport | undefined
	let recvTransport: mediasoupClient.types.Transport | undefined
	let localStream: MediaStream | undefined

	let unsubscribeServerRequests: () => void = NOOP
	let unsubscribeNotifications: () => void = NOOP

	const cleanupSetupFailure = (): void => {
		for (const producer of producers.values()) {
			producer.close()
		}
		producers.clear()

		for (const consumer of consumers.values()) {
			consumer.close()
		}
		consumers.clear()
		consumerPeerById.clear()
		consumerIdsByPeer.clear()

		sendTransport?.close()
		recvTransport?.close()

		if (localStream) {
			for (const track of localStream.getTracks()) {
				track.stop()
			}
		}

		unsubscribeServerRequests()
		unsubscribeNotifications()

		signalingClient.close()
	}

	try {
		const rawRouterRtpCapabilities = await call<
			mediasoupClient.types.RtpCapabilities | { routerRtpCapabilities?: mediasoupClient.types.RtpCapabilities }
		>(SIGNALING_METHODS.getRouterRtpCapabilities)

		const routerRtpCapabilities = normalizeRouterRtpCapabilities(rawRouterRtpCapabilities)
		log('routerRtpCapabilities received')
		log(`router codecs: ${(routerRtpCapabilities.codecs?.length ?? 0).toString()}`)

		const device = new mediasoupClient.Device()
		await device.load({ routerRtpCapabilities })
		log(`device loaded: ${device.handlerName}`)

		log(`device canProduce audio=${String(device.canProduce('audio'))} video=${String(device.canProduce('video'))}`)
		const requestedAudio = options.enableAudio && device.canProduce('audio')
		const requestedVideo = options.enableVideo && device.canProduce('video')
		const { canUseAudio, canUseVideo } = await ensureAndroidMediaPermissions(requestedAudio, requestedVideo)
		const canProduceAudio = Platform.OS === 'android' ? canUseAudio : requestedAudio
		const canProduceVideo = Platform.OS === 'android' ? canUseVideo : requestedVideo

		const sendTransportOptions = await call<TransportOptions>(SIGNALING_METHODS.createWebRtcTransport, {
			forceTcp: options.forceTcp ?? false,
			appData: {
				direction: 'producer',
			},
		})
		log(`send transport options: ${sendTransportOptions.transportId}`)

		const createdSendTransport = device.createSendTransport({
			id: sendTransportOptions.transportId,
			iceParameters: sendTransportOptions.iceParameters,
			iceCandidates: sendTransportOptions.iceCandidates,
			dtlsParameters: sendTransportOptions.dtlsParameters,
			...(sendTransportOptions.sctpParameters && { sctpParameters: sendTransportOptions.sctpParameters }),
		})
		sendTransport = createdSendTransport

		createdSendTransport.on('connect', ({ dtlsParameters }, callback, errback) => {
			void (async () => {
				try {
					const payload: ConnectTransportData = {
						transportId: createdSendTransport.id,
						dtlsParameters,
					}

					await call<unknown>(SIGNALING_METHODS.connectWebRtcTransport, payload)
					callback()
					log(`send transport connected: ${createdSendTransport.id}`)
				} catch (error) {
					errback(error as Error)
				}
			})()
		})

		createdSendTransport.on('produce', ({ kind, rtpParameters, appData }, callback, errback) => {
			void (async () => {
				try {
					const payload: ProducingPayload = {
						kind,
						rtpParameters,
						appData,
					}

					const response = await call<ProducerResponse>(SIGNALING_METHODS.produce, {
						transportId: createdSendTransport.id,
						...payload,
					})

					const id = response.id ?? response.producerId
					if (!id) {
						throw new Error('produce response does not contain id')
					}

					callback({ id })
					log(`producer created: ${id}`)
				} catch (error) {
					errback(error as Error)
				}
			})()
		})

		const recvTransportOptions = await call<TransportOptions>(SIGNALING_METHODS.createWebRtcTransport, {
			forceTcp: options.forceTcp ?? false,
			appData: {
				direction: 'consumer',
			},
		})
		log(`recv transport options: ${recvTransportOptions.transportId}`)

		const createdRecvTransport = device.createRecvTransport({
			id: recvTransportOptions.transportId,
			iceParameters: recvTransportOptions.iceParameters,
			iceCandidates: recvTransportOptions.iceCandidates,
			dtlsParameters: recvTransportOptions.dtlsParameters,
			...(recvTransportOptions.sctpParameters && { sctpParameters: recvTransportOptions.sctpParameters }),
		})
		recvTransport = createdRecvTransport

		const createdRemoteStream = new MediaStream()

		createdRecvTransport.on('connect', ({ dtlsParameters }, callback, errback) => {
			void (async () => {
				try {
					const payload: ConnectTransportData = {
						transportId: createdRecvTransport.id,
						dtlsParameters,
					}

					await call<unknown>(SIGNALING_METHODS.connectWebRtcTransport, payload)
					callback()
					log(`recv transport connected: ${createdRecvTransport.id}`)
				} catch (error) {
					errback(error as Error)
				}
			})()
		})

		const removeConsumerById = (consumerId: string): void => {
			const consumer = consumers.get(consumerId)
			if (!consumer) {
				return
			}

			consumers.delete(consumerId)
			const peerId = consumerPeerById.get(consumerId)
			if (peerId) {
				const peerConsumerIds = consumerIdsByPeer.get(peerId)
				if (peerConsumerIds) {
					peerConsumerIds.delete(consumerId)
					if (peerConsumerIds.size === 0) {
						consumerIdsByPeer.delete(peerId)
					}
				}
			}
			consumerPeerById.delete(consumerId)
			consumer.close()
			createdRemoteStream.removeTrack(consumer.track as unknown as Parameters<MediaStream['removeTrack']>[0])
			options.onRemoteStreamUpdated?.(createdRemoteStream)
		}

		const removeConsumersByPeerId = (peerId: string): void => {
			const peerConsumerIds = consumerIdsByPeer.get(peerId)
			if (!peerConsumerIds) {
				return
			}

			const consumerIds = [...peerConsumerIds.values()]
			for (const consumerId of consumerIds) {
				removeConsumerById(consumerId)
			}
		}

		const clearAllConsumers = (): void => {
			for (const consumer of consumers.values()) {
				consumer.close()
				createdRemoteStream.removeTrack(consumer.track as unknown as Parameters<MediaStream['removeTrack']>[0])
			}
			consumers.clear()
			consumerPeerById.clear()
			consumerIdsByPeer.clear()
			options.onRemoteStreamUpdated?.(createdRemoteStream)
		}

		unsubscribeServerRequests = signalingClient.onServerRequest(async (request, controls) => {
			log(`server request: ${request.method}`)

			if (request.method === 'newDataConsumer') {
				log('server request ignored: newDataConsumer')
				controls.accept()
				return true
			}

			if (request.method !== 'newConsumer') {
				return false
			}

			if (!isNewConsumerRequestData(request.data)) {
				controls.reject(400, 'Invalid newConsumer payload')
				return true
			}

			const data = request.data

			try {
				const streamId =
					data.appData?.source === 'screensharing' ? `${data.peerId}-screensharing` : `${data.peerId}-audio-video`

				const consumer = await createdRecvTransport.consume({
					id: data.consumerId,
					producerId: data.producerId,
					kind: data.kind,
					rtpParameters: data.rtpParameters as mediasoupClient.types.RtpParameters,
					appData: data.appData ?? {},
					streamId,
				})

				consumers.set(consumer.id, consumer)
				consumerPeerById.set(consumer.id, data.peerId)
				const peerConsumerIds = consumerIdsByPeer.get(data.peerId) ?? new Set<string>()
				peerConsumerIds.add(consumer.id)
				consumerIdsByPeer.set(data.peerId, peerConsumerIds)
				createdRemoteStream.addTrack(consumer.track as unknown as Parameters<MediaStream['addTrack']>[0])
				log(`consumer created: ${consumer.id}`)
				options.onRemoteStreamUpdated?.(createdRemoteStream)

				controls.accept()
				return true
			} catch (error) {
				controls.reject(500, stringifyError(error))
				return true
			}
		})

		await call<{ peers: unknown[] }>(SIGNALING_METHODS.join, {
			displayName: options.displayName,
			device: {
				flag: 'react-native',
				name: 'React Native',
				version: '0.84.1',
			},
			rtpCapabilities: device.recvRtpCapabilities,
		})
		log(`joined room: ${options.roomId}`)

		const createdLocalStream = new MediaStream()
		localStream = createdLocalStream
		let producedTracks = 0
		const produceErrors: string[] = []

		if (canProduceAudio) {
			log('capturing audio track')
			try {
				const audioStream = await mediaDevices.getUserMedia({
					audio: true,
					video: false,
				})
				const audioTrack = audioStream.getAudioTracks()[0]

				if (audioTrack) {
					createdLocalStream.addTrack(audioTrack)
					log('producing track start: audio')
					const producer = await createdSendTransport.produce({
						track: audioTrack as unknown as MediaStreamTrack,
						appData: { source: 'audio' },
					})
					producers.set(producer.id, producer)
					producedTracks += 1
					log('producing track done: audio')
				} else {
					produceErrors.push('audio: track missing')
					log('producing track fail: audio - track missing')
				}
			} catch (error) {
				const message = stringifyError(error)
				produceErrors.push(`audio: ${message}`)
				log(`producing track fail: audio - ${message}`)
			}
		} else if (options.enableAudio) {
			log('skip audio: device cannot produce audio')
		}

		if (canProduceVideo) {
			log('capturing video track')
			try {
				const videoStream = await mediaDevices.getUserMedia({
					audio: false,
					video: {
						width: { ideal: 640 },
						height: { ideal: 360 },
						frameRate: { ideal: 30, max: 30 },
						facingMode: 'user',
					},
				})
				const videoTrack = videoStream.getVideoTracks()[0]

				if (videoTrack) {
					if (Platform.OS !== 'android') {
						try {
							await videoTrack.applyConstraints({
								frameRate: { ideal: 30, max: 30 },
							})
						} catch (error) {
							log(`video constraints skipped: ${stringifyError(error)}`)
						}
					}

					createdLocalStream.addTrack(videoTrack)
					log('producing track start: video')
					const producer = await createdSendTransport.produce({
						track: videoTrack as unknown as MediaStreamTrack,
						appData: { source: 'video' },
					})
					producers.set(producer.id, producer)
					producedTracks += 1
					log('producing track done: video')
				} else {
					produceErrors.push('video: track missing')
					log('producing track fail: video - track missing')
				}
			} catch (error) {
				const message = stringifyError(error)
				produceErrors.push(`video: ${message}`)
				log(`producing track fail: video - ${message}`)
			}
		} else if (options.enableVideo) {
			log('skip video: device cannot produce video')
		}

		const hasEnabledLocalMedia = options.enableAudio || options.enableVideo
		if (producedTracks === 0 && hasEnabledLocalMedia) {
			const reason = produceErrors.length > 0 ? ` (${produceErrors.join('; ')})` : ''
			throw new Error(`cannot produce local media${reason}`)
		}

		log(`local stream ready: ${String(createdLocalStream.getTracks().length)} tracks`)

		unsubscribeNotifications = signalingClient.onNotification((notification) => {
			if (notification.method === 'consumerClosed') {
				const consumerId = notification.data?.consumerId
				if (typeof consumerId !== 'string') {
					return
				}

				removeConsumerById(consumerId)
				log(`consumer closed by server: ${consumerId}`)
				return
			}

			if (notification.method === 'peerLeft') {
				const peerId = notification.data?.peerId
				if (typeof peerId === 'string') {
					removeConsumersByPeerId(peerId)
				} else {
					clearAllConsumers()
				}
				log(`peer left: ${typeof peerId === 'string' ? peerId : 'unknown'}`)
				return
			}

			if (notification.method === 'entityClosed') {
				const entityType = notification.data?.entityType
				const entityId = notification.data?.entityId
				if (entityType === 'consumer' && typeof entityId === 'string') {
					removeConsumerById(entityId)
					log(`consumer entity closed: ${entityId}`)
					return
				}

				if (entityType === 'transport') {
					const peerId = notification.data?.peerId
					if (typeof peerId === 'string') {
						removeConsumersByPeerId(peerId)
					} else {
						clearAllConsumers()
					}
					const reason = notification.data?.reason
					log(`transport entity closed: ${typeof reason === 'string' ? reason : 'unknown'}`)
				}
			}
		})

		let isClosed = false
		const close = (): Promise<void> => {
			if (isClosed) {
				return Promise.resolve()
			}
			isClosed = true
			log('closing session')
			for (const producer of producers.values()) {
				producer.close()
			}
			producers.clear()

			for (const consumer of consumers.values()) {
				consumer.close()
			}
			consumers.clear()
			consumerPeerById.clear()
			consumerIdsByPeer.clear()
			createdSendTransport.close()
			createdRecvTransport.close()
			for (const track of createdLocalStream.getTracks()) {
				track.stop()
			}
			unsubscribeServerRequests()
			unsubscribeNotifications()
			signalingClient.close()
			log('session closed')
			return Promise.resolve()
		}

		return {
			localStream: createdLocalStream,
			remoteStream: createdRemoteStream,
			close,
		}
	} catch (error) {
		cleanupSetupFailure()
		throw error
	}
}
