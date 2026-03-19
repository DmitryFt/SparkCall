import { useCallback, useEffect, useRef, useState } from 'react'

import { type MediaStream } from 'react-native-webrtc'

import { MediasoupDemoConnector } from 'app/webrtc/connector'
import { registerStreamStopHandler } from 'app/webrtc/lifecycle'

interface UseCallSessionOptions {
	roomId: string
	displayName: string
	enableVideo: boolean
	enableAudio: boolean
	onSessionReset?: () => void
}

type DisconnectMode = 'normal' | 'preserve_error'
type CallSessionStatus =
	| 'idle'
	| 'connecting'
	| 'connected'
	| 'disconnecting'
	| 'disconnected'
	| 'disconnect failed'
	| 'connection failed'

const hasActiveTracks = (stream: MediaStream): boolean => {
	for (const track of stream.getTracks()) {
		if (track.readyState !== 'ended') {
			return true
		}
	}

	return false
}

export const useCallSession = ({ roomId, displayName, enableVideo, enableAudio, onSessionReset }: UseCallSessionOptions) => {
	const [connector] = useState(() => new MediasoupDemoConnector())
	const remoteVideoKeyRef = useRef(0)
	const isConnectingRef = useRef(false)
	const isMountedRef = useRef(true)
	const shouldReconnectRef = useRef(true)
	const statusRef = useRef<CallSessionStatus>('idle')
	const connectAttemptIdRef = useRef(0)
	const [status, setStatus] = useState<CallSessionStatus>('idle')
	const [localStreamUrl, setLocalStreamUrl] = useState('')
	const [remoteStreamUrl, setRemoteStreamUrl] = useState('')
	const [isVideoEnabled, setIsVideoEnabled] = useState(true)
	const [remoteVideoKey, setRemoteVideoKey] = useState(0)
	const [debugLines, setDebugLines] = useState<string[]>([])

	const appendLog = useCallback((message: string) => {
		const timestamp = new Date().toISOString().slice(11, 19)
		setDebugLines((previousLines) => {
			const nextLines = [...previousLines, `${timestamp} ${message}`]
			return nextLines.slice(-18)
		})
	}, [])

	const finishDisconnect = useCallback(() => {
		isConnectingRef.current = false
		setIsVideoEnabled(true)
		setLocalStreamUrl('')
		setRemoteStreamUrl('')
		remoteVideoKeyRef.current = 0
		setRemoteVideoKey(0)
		onSessionReset?.()
	}, [onSessionReset])

	const disconnect = useCallback(
		async (mode: DisconnectMode = 'normal'): Promise<void> => {
			const shouldUpdateDisconnectStatus = mode === 'normal' && statusRef.current === 'connected'
			appendLog(`disconnect start (${mode})`)
			if (shouldUpdateDisconnectStatus) {
				setStatus('disconnecting')
			}
			await connector.disconnect().catch(() => {
				appendLog('disconnect failed')
				setStatus('disconnect failed')
			})

			finishDisconnect()

			if (mode === 'preserve_error') {
				return
			}

			if (shouldUpdateDisconnectStatus) {
				setStatus('disconnected')
			}
			appendLog(`disconnect done (${mode})`)
		},
		[appendLog, connector, finishDisconnect]
	)

	const endCall = useCallback(async (): Promise<void> => {
		shouldReconnectRef.current = false
		connectAttemptIdRef.current += 1
		await disconnect()
	}, [disconnect])

	useEffect(() => {
		isMountedRef.current = true
		let cancelled = false

		const handleRemoteStreamUpdated = (stream: MediaStream): void => {
			if (!isMountedRef.current || !shouldReconnectRef.current) {
				return
			}

			const hasRemoteTracks = hasActiveTracks(stream)
			requestAnimationFrame(() => {
				if (!isMountedRef.current || !shouldReconnectRef.current) {
					return
				}

				setRemoteStreamUrl(hasRemoteTracks ? stream.toURL() : '')
				const nextRemoteVideoKey = remoteVideoKeyRef.current + 1
				remoteVideoKeyRef.current = nextRemoteVideoKey
				setRemoteVideoKey(nextRemoteVideoKey)
			})
		}

		const connectCall = async (): Promise<void> => {
			if (isConnectingRef.current || !shouldReconnectRef.current) {
				return
			}

			const connectAttemptId = connectAttemptIdRef.current + 1
			connectAttemptIdRef.current = connectAttemptId
			isConnectingRef.current = true
			setStatus('connecting')
			appendLog(`connect attempt #${connectAttemptId.toString()} started`)

			await connector
				.connectToRoom({
					roomId,
					displayName,
					enableVideo,
					enableAudio,
					onLog: appendLog,
					onRemoteStreamUpdated: handleRemoteStreamUpdated,
				})
				.then(async () => {
					if (!isMountedRef.current || connectAttemptIdRef.current !== connectAttemptId) {
						await connector.disconnect()
						isConnectingRef.current = false
						return
					}

					const localStream = connector.getLocalStream()
					const remoteStream = connector.getRemoteStream()
					const localVideoTrack = localStream?.getVideoTracks()[0]

					setLocalStreamUrl(localStream ? localStream.toURL() : '')
					setRemoteStreamUrl(remoteStream ? remoteStream.toURL() : '')
					setIsVideoEnabled(localVideoTrack?.enabled ?? false)
					setStatus('connected')
					appendLog(`connect attempt #${connectAttemptId.toString()} success`)
					isConnectingRef.current = false
				})
				.catch(async () => {
					appendLog(`connect attempt #${connectAttemptId.toString()} failed`)
					setStatus('connection failed')
					await disconnect('preserve_error')
					isConnectingRef.current = false
				})
		}

		void Promise.resolve()
			.then(() => {
				if (cancelled) {
					return
				}
				void connectCall()
			})
			.catch(() => undefined)

		return () => {
			cancelled = true
			isMountedRef.current = false
			shouldReconnectRef.current = false
			connectAttemptIdRef.current += 1
		}
	}, [appendLog, connector, disconnect, displayName, enableAudio, enableVideo, roomId])

	useEffect(() => {
		return registerStreamStopHandler(async () => {
			await disconnect()
		})
	}, [disconnect])

	useEffect(() => {
		return () => {
			connector.disconnect().catch(() => undefined)
		}
	}, [connector])

	useEffect(() => {
		statusRef.current = status
	}, [status])

	return {
		status,
		localStreamUrl,
		remoteStreamUrl,
		isVideoEnabled,
		remoteVideoKey,
		debugLines,
		endCall,
	}
}
