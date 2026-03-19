declare module 'protoo-client' {
	// eslint-disable-next-line @typescript-eslint/no-extraneous-class
	export class WebSocketTransport {
		public constructor(url: string)
	}

	export interface Notification {
		method: string
		data?: Record<string, unknown>
	}

	export interface Request {
		method: string
		data: Record<string, unknown>
	}

	export class Peer {
		public constructor(transport: WebSocketTransport)

		public on(event: 'notification', listener: (notification: Notification) => void): void
		public on(
			event: 'request',
			listener: (
				request: Request,
				accept: (data?: unknown) => void,
				reject: (code?: number, reason?: string) => void
			) => void | Promise<void>
		): void
		public on(event: 'open' | 'failed' | 'close', listener: () => void): void

		public request<T = unknown>(method: string, data?: Record<string, unknown>): Promise<T>
		public close(): void
	}
}
