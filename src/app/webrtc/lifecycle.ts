type StreamStopHandler = () => Promise<void> | void

const streamStopHandlers = new Set<StreamStopHandler>()

export const registerStreamStopHandler = (handler: StreamStopHandler): (() => void) => {
	streamStopHandlers.add(handler)

	return () => {
		streamStopHandlers.delete(handler)
	}
}

export const stopAllActiveStreams = async (): Promise<void> => {
	const handlers = [...streamStopHandlers.values()]
	await Promise.allSettled(handlers.map(async (handler) => handler()))
}
