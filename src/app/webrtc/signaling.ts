import * as protooClient from 'protoo-client'

import type { SignalingNotificationPayload, SignalingServerRequestPayload } from './signaling-contract'

export type NotificationPayload = SignalingNotificationPayload
export type ServerRequestPayload = SignalingServerRequestPayload

type NotificationHandler = (notification: SignalingNotificationPayload) => void

interface ProtooPeer {
	on(event: 'notification', listener: (notification: SignalingNotificationPayload) => void): void
	on(
		event: 'request',
		listener: (
			request: SignalingServerRequestPayload,
			accept: (data?: unknown) => void,
			reject: (code?: number, reason?: string) => void
		) => void | Promise<void>
	): void
	on(event: 'open' | 'close', listener: () => void): void
	on(event: 'failed', listener: (currentAttempt?: number) => void): void
	request<T = unknown>(method: string, data?: Record<string, unknown>): Promise<T>
	close(): void
}

const protoo = protooClient as unknown as {
	WebSocketTransport: new (url: string, options?: { origin?: string; headers?: Record<string, string> }) => unknown
	Peer: new (transport: unknown) => ProtooPeer
}

const toWebSocketOrigin = (url: string): string | undefined => {
	if (url.startsWith('wss://v3demo.mediasoup.org')) {
		return 'https://v3demo.mediasoup.org'
	}
	return undefined
}

type ServerRequestHandler = (
	payload: SignalingServerRequestPayload,
	controls: {
		accept: (data?: unknown) => void
		reject: (code?: number, reason?: string) => void
	}
) => Promise<boolean> | boolean

export class SignalingClient {
	private peer: ProtooPeer | null = null
	private readonly notificationHandlers = new Set<NotificationHandler>()
	private readonly serverRequestHandlers = new Set<ServerRequestHandler>()

	public async connect(url: string): Promise<void> {
		if (this.peer) {
			return
		}

		const origin = toWebSocketOrigin(url)
		const transportOptions = origin
			? {
					origin,
					headers: {
						Origin: origin,
					},
				}
			: undefined
		const transport = new protoo.WebSocketTransport(url, transportOptions)

		const peer = new protoo.Peer(transport)

		peer.on('notification', (notification: NotificationPayload) => {
			for (const handler of this.notificationHandlers) {
				handler(notification)
			}
		})

		peer.on(
			'request',
			async (
				request: ServerRequestPayload,
				accept: (data?: unknown) => void,
				reject: (code?: number, reason?: string) => void
			) => {
				for (const handler of this.serverRequestHandlers) {
					const handled = await handler(request, { accept, reject })
					if (handled) {
						return
					}
				}

				reject(404, `Unhandled request method: ${request.method}`)
			}
		)

		await new Promise<void>((resolve, reject) => {
			let settled = false
			let failedAttempts = 0
			const timeout = setTimeout(() => {
				if (settled) {
					return
				}

				settled = true
				if (failedAttempts > 0) {
					reject(new Error(`Protoo connection timeout after ${failedAttempts.toString()} attempts`))
					return
				}
				reject(new Error('Protoo connection timeout'))
			}, 20_000)

			peer.on('open', () => {
				if (settled) {
					return
				}

				settled = true
				clearTimeout(timeout)
				resolve()
			})

			peer.on('failed', (currentAttempt?: number) => {
				if (settled) {
					return
				}

				failedAttempts = typeof currentAttempt === 'number' ? currentAttempt : failedAttempts + 1
			})

			peer.on('close', () => {
				if (settled) {
					return
				}

				settled = true
				clearTimeout(timeout)
				if (failedAttempts > 0) {
					reject(new Error(`Protoo connection failed after ${failedAttempts.toString()} attempts`))
					return
				}
				reject(new Error('Protoo connection closed'))
			})
		})

		this.peer = peer
	}

	public onNotification(handler: NotificationHandler): () => void {
		this.notificationHandlers.add(handler)

		return () => {
			this.notificationHandlers.delete(handler)
		}
	}

	public onServerRequest(handler: ServerRequestHandler): () => void {
		this.serverRequestHandlers.add(handler)

		return () => {
			this.serverRequestHandlers.delete(handler)
		}
	}

	public async request<T = unknown>(method: string, data?: Record<string, unknown>): Promise<T> {
		if (!this.peer) {
			throw new Error('Protoo is not connected')
		}

		const response = await this.peer.request(method, data)

		return response as T
	}

	public close(): void {
		if (!this.peer) {
			return
		}

		this.peer.close()
		this.peer = null
	}
}
