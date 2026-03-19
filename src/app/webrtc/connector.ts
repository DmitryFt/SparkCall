import type { MediaStream } from 'react-native-webrtc'

import { createMediasoupSession, type MediasoupSession } from './session'

const DEFAULT_SIGNALING_URL = 'wss://v3demo.mediasoup.org:4443'

interface ConnectOptions {
	roomId?: string
	peerId?: string
	displayName?: string
	signalingUrl?: string
	enableVideo?: boolean
	enableAudio?: boolean
	forceTcp?: boolean
	onLog?: (message: string) => void
	onRemoteStreamUpdated?: (stream: MediaStream) => void
}

export class MediasoupDemoConnector {
	private signalingUrl = DEFAULT_SIGNALING_URL
	private session: MediasoupSession | null = null

	public async connectToRoom(options: ConnectOptions = {}): Promise<void> {
		const roomId = options.roomId ?? `rn-${Date.now().toString(36)}`
		const peerId = options.peerId ?? `rn-${Date.now().toString()}`
		const signalingUrl = options.signalingUrl ?? this.signalingUrl

		if (this.session) {
			await this.disconnect()
		}

		try {
			this.session = await createMediasoupSession({
				signalingUrl,
				roomId,
				peerId,
				displayName: options.displayName ?? peerId,
				enableVideo: options.enableVideo ?? true,
				enableAudio: options.enableAudio ?? true,
				forceTcp: options.forceTcp ?? false,
				...(options.onLog && { onLog: options.onLog }),
				...(options.onRemoteStreamUpdated && { onRemoteStreamUpdated: options.onRemoteStreamUpdated }),
			})

			this.signalingUrl = signalingUrl
		} catch (error) {
			this.session = null
			throw error
		}
	}

	public getLocalStream(): MediaStream | null {
		return this.session?.localStream ?? null
	}

	public getRemoteStream(): MediaStream | null {
		return this.session?.remoteStream ?? null
	}

	public async disconnect(): Promise<void> {
		if (!this.session) {
			return
		}

		const activeSession = this.session
		await activeSession.close()

		if (this.session === activeSession) {
			this.session = null
		}
	}
}
