import type * as mediasoupClient from 'mediasoup-client'
import type { NewConsumerRequestData } from './signaling-contract'

export function stringifyError(error: unknown): string {
	if (error instanceof Error) {
		return error.message
	}

	return String(error)
}

export function buildProtooUrl(baseUrl: string, roomId: string, peerId: string): string {
	const normalizedBaseUrl = baseUrl.trim()
	const [baseUrlWithoutHash = normalizedBaseUrl] = normalizedBaseUrl.split('#')
	const querySeparatorIndex = baseUrlWithoutHash.indexOf('?')
	const basePath = querySeparatorIndex === -1 ? baseUrlWithoutHash : baseUrlWithoutHash.slice(0, querySeparatorIndex)
	const existingQuery = querySeparatorIndex === -1 ? '' : baseUrlWithoutHash.slice(querySeparatorIndex + 1)
	const searchParams = new URLSearchParams(existingQuery)
	searchParams.set('roomId', roomId)
	searchParams.set('peerId', peerId)

	return `${basePath}?${searchParams.toString()}`
}

export function normalizeRouterRtpCapabilities(
	input: mediasoupClient.types.RtpCapabilities | { routerRtpCapabilities?: mediasoupClient.types.RtpCapabilities }
): mediasoupClient.types.RtpCapabilities {
	if ('codecs' in input || 'headerExtensions' in input) {
		return input
	}

	const capabilities = 'routerRtpCapabilities' in input ? input.routerRtpCapabilities : undefined
	if (capabilities) {
		return capabilities
	}

	throw new Error('Invalid getRouterRtpCapabilities response')
}

export function isNewConsumerRequestData(data: Record<string, unknown> | NewConsumerRequestData): data is NewConsumerRequestData {
	const candidate = data as Partial<NewConsumerRequestData>

	return (
		typeof candidate.peerId === 'string' &&
		typeof candidate.consumerId === 'string' &&
		typeof candidate.producerId === 'string' &&
		(candidate.kind === 'audio' || candidate.kind === 'video') &&
		typeof candidate.rtpParameters === 'object'
	)
}
