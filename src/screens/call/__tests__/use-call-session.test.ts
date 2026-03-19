import { act, renderHook, waitFor } from '@testing-library/react-native'
import type { MediaStream, MediaStreamTrack } from 'react-native-webrtc'

import { MediasoupDemoConnector } from '../../../app/webrtc/connector'
import { registerStreamStopHandler } from '../../../app/webrtc/lifecycle'
import { useCallSession } from '../use-call-session'

jest.mock('../../../app/webrtc/lifecycle', () => ({
	registerStreamStopHandler: jest.fn(),
}))

jest.mock('../../../app/webrtc/connector', () => ({
	MediasoupDemoConnector: jest.fn(),
}))

interface ConnectorConnectOptions {
	roomId: string
	displayName: string
	enableVideo: boolean
	onRemoteStreamUpdated: (stream: MediaStream) => void
}

interface ConnectorMockInstance {
	connectToRoom: jest.Mock<Promise<void>, [options: ConnectorConnectOptions]>
	disconnect: jest.Mock<Promise<void>, []>
	getLocalStream: jest.Mock<MediaStream | null, []>
	getRemoteStream: jest.Mock<MediaStream | null, []>
}

const registerStreamStopHandlerMock = registerStreamStopHandler as jest.MockedFunction<typeof registerStreamStopHandler>
const connectorConstructorMock = MediasoupDemoConnector as unknown as jest.Mock<ConnectorMockInstance, []>

const createMockStream = (
	url: string,
	tracks: (Partial<MediaStreamTrack> & Pick<MediaStreamTrack, 'readyState'>)[] = [{ readyState: 'live', enabled: true }]
): MediaStream =>
	({
		toURL: () => url,
		getTracks: () => tracks as MediaStreamTrack[],
		getVideoTracks: () => tracks as MediaStreamTrack[],
	}) as unknown as MediaStream

describe('useCallSession', () => {
	let streamStopHandler: (() => Promise<void> | void) | undefined
	let connectorInstance: ConnectorMockInstance

	beforeAll(() => {
		globalThis.requestAnimationFrame = ((callback: FrameRequestCallback) => {
			callback(0)
			return 1
		}) as typeof requestAnimationFrame
	})

	beforeEach(() => {
		jest.clearAllMocks()
		streamStopHandler = undefined

		registerStreamStopHandlerMock.mockImplementation((handler) => {
			streamStopHandler = handler
			return jest.fn()
		})

		connectorInstance = {
			connectToRoom: jest.fn<Promise<void>, [options: ConnectorConnectOptions]>().mockResolvedValue(undefined),
			disconnect: jest.fn<Promise<void>, []>().mockResolvedValue(undefined),
			getLocalStream: jest.fn<MediaStream | null, []>().mockReturnValue(createMockStream('local://stream')),
			getRemoteStream: jest.fn<MediaStream | null, []>().mockReturnValue(createMockStream('remote://stream')),
		}
		connectorConstructorMock.mockImplementation(() => connectorInstance)
	})

	afterEach(() => {
		jest.restoreAllMocks()
	})

	it('connects on mount and reaches connected state', async () => {
		const { result } = renderHook(() =>
			useCallSession({
				roomId: 'room-1',
				displayName: 'user-1',
				enableVideo: true,
				enableAudio: true,
			})
		)

		await waitFor(() => {
			expect(result.current.status).toBe('connected')
		})

		expect(connectorInstance.connectToRoom).toHaveBeenCalledTimes(1)
		expect(result.current.localStreamUrl).toBe('local://stream')
		expect(result.current.remoteStreamUrl).toBe('remote://stream')
		expect(result.current.isVideoEnabled).toBe(true)
	})

	it('sets connection failed and cleans up on connect error', async () => {
		connectorInstance.connectToRoom.mockRejectedValueOnce(new Error('connect failed'))
		const { result } = renderHook(() =>
			useCallSession({
				roomId: 'room-1',
				displayName: 'user-1',
				enableVideo: true,
				enableAudio: true,
			})
		)

		await waitFor(() => {
			expect(result.current.status).toBe('connection failed')
		})

		expect(connectorInstance.disconnect).toHaveBeenCalledTimes(1)
		expect(result.current.localStreamUrl).toBe('')
		expect(result.current.remoteStreamUrl).toBe('')
	})

	it('does not reconnect after manual endCall', async () => {
		const { result } = renderHook(() =>
			useCallSession({
				roomId: 'room-1',
				displayName: 'user-1',
				enableVideo: true,
				enableAudio: true,
			})
		)

		await waitFor(() => {
			expect(result.current.status).toBe('connected')
		})

		await act(async () => {
			await result.current.endCall()
		})

		expect(connectorInstance.connectToRoom).toHaveBeenCalledTimes(1)
		expect(connectorInstance.disconnect).toHaveBeenCalled()
	})

	it('updates remote stream url and key from onRemoteStreamUpdated callback', async () => {
		connectorInstance.getRemoteStream.mockReturnValue(null)
		const { result } = renderHook(() =>
			useCallSession({
				roomId: 'room-1',
				displayName: 'user-1',
				enableVideo: true,
				enableAudio: true,
			})
		)

		await waitFor(() => {
			expect(connectorInstance.connectToRoom).toHaveBeenCalledTimes(1)
		})

		const callOptions = connectorInstance.connectToRoom.mock.calls[0]?.[0]
		expect(callOptions).toBeDefined()

		act(() => {
			callOptions?.onRemoteStreamUpdated(createMockStream('remote://live', [{ readyState: 'live' }]))
		})
		await waitFor(() => {
			expect(result.current.remoteStreamUrl).toBe('remote://live')
			expect(result.current.remoteVideoKey).toBe(1)
		})

		act(() => {
			callOptions?.onRemoteStreamUpdated(createMockStream('remote://ended', [{ readyState: 'ended' }]))
		})
		await waitFor(() => {
			expect(result.current.remoteStreamUrl).toBe('')
			expect(result.current.remoteVideoKey).toBe(2)
		})
	})

	it('disconnects when stream stop handler is called', async () => {
		const { result } = renderHook(() =>
			useCallSession({
				roomId: 'room-1',
				displayName: 'user-1',
				enableVideo: true,
				enableAudio: true,
			})
		)

		await waitFor(() => {
			expect(result.current.status).toBe('connected')
		})

		await act(async () => {
			await streamStopHandler?.()
		})

		expect(connectorInstance.disconnect).toHaveBeenCalled()
	})
})
