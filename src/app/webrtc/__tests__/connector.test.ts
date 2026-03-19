import { MediasoupDemoConnector } from '../connector'
import { createMediasoupSession } from '../session'

jest.mock('../session', () => ({
	createMediasoupSession: jest.fn(),
}))

const createSessionMock = createMediasoupSession as jest.MockedFunction<typeof createMediasoupSession>

const createStream = () => ({
	getTracks: jest.fn(() => []),
	toURL: jest.fn(() => 'stream://url'),
})

describe('MediasoupDemoConnector', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	it('creates session with provided options', async () => {
		const localStream = createStream()
		const remoteStream = createStream()
		createSessionMock.mockResolvedValueOnce({
			localStream: localStream as never,
			remoteStream: remoteStream as never,
			close: jest.fn().mockResolvedValue(undefined),
		})
		const connector = new MediasoupDemoConnector()

		await connector.connectToRoom({
			roomId: 'room-1',
			peerId: 'peer-1',
			displayName: 'user-1',
			enableVideo: false,
			forceTcp: true,
		})

		expect(createSessionMock).toHaveBeenCalledWith(
			expect.objectContaining({
				roomId: 'room-1',
				peerId: 'peer-1',
				displayName: 'user-1',
				enableVideo: false,
				forceTcp: true,
			})
		)
		expect(connector.getLocalStream()).toBe(localStream)
		expect(connector.getRemoteStream()).toBe(remoteStream)
	})

	it('disconnects previous session before reconnect', async () => {
		const previousClose = jest.fn().mockResolvedValue(undefined)
		const nextClose = jest.fn().mockResolvedValue(undefined)
		createSessionMock
			.mockResolvedValueOnce({
				localStream: createStream() as never,
				remoteStream: createStream() as never,
				close: previousClose,
			})
			.mockResolvedValueOnce({
				localStream: createStream() as never,
				remoteStream: createStream() as never,
				close: nextClose,
			})
		const connector = new MediasoupDemoConnector()

		await connector.connectToRoom({ roomId: 'first' })
		await connector.connectToRoom({ roomId: 'second' })

		expect(previousClose).toHaveBeenCalledTimes(1)
		expect(createSessionMock).toHaveBeenCalledTimes(2)
		expect(nextClose).toHaveBeenCalledTimes(0)
	})

	it('keeps session null when session creation fails', async () => {
		createSessionMock.mockRejectedValueOnce(new Error('boom'))
		const connector = new MediasoupDemoConnector()

		await expect(connector.connectToRoom({ roomId: 'room-1' })).rejects.toThrow('boom')
		expect(connector.getLocalStream()).toBeNull()
		expect(connector.getRemoteStream()).toBeNull()
	})

	it('waits session close before clearing reference', async () => {
		let resolveClose: (() => void) | undefined
		const closePromise = new Promise<void>((resolve) => {
			resolveClose = resolve
		})
		const localStream = createStream()
		createSessionMock.mockResolvedValueOnce({
			localStream: localStream as never,
			remoteStream: createStream() as never,
			close: jest.fn().mockReturnValue(closePromise),
		})
		const connector = new MediasoupDemoConnector()
		await connector.connectToRoom({ roomId: 'room-1' })

		const disconnectPromise = connector.disconnect()
		expect(connector.getLocalStream()).toBe(localStream)
		resolveClose?.()
		await disconnectPromise
		expect(connector.getLocalStream()).toBeNull()
	})

	it('disconnect is no-op without active session', async () => {
		const connector = new MediasoupDemoConnector()

		await expect(connector.disconnect()).resolves.toBeUndefined()
	})
})
