import { buildProtooUrl, isNewConsumerRequestData, normalizeRouterRtpCapabilities, stringifyError } from '../session.utils'

describe('session utils', () => {
	it('buildProtooUrl appends query params to base ws url', () => {
		const result = new URL(buildProtooUrl('wss://v3demo.mediasoup.org:4443', 'room-1', 'peer-1'))

		expect(result.port).toBe('4443')
		expect(result.searchParams.get('roomId')).toBe('room-1')
		expect(result.searchParams.get('peerId')).toBe('peer-1')
	})

	it('buildProtooUrl keeps explicit port', () => {
		const result = new URL(buildProtooUrl('wss://example.com:5555?x=1', 'room-1', 'peer-1'))

		expect(result.port).toBe('5555')
		expect(result.searchParams.get('x')).toBe('1')
		expect(result.searchParams.get('roomId')).toBe('room-1')
		expect(result.searchParams.get('peerId')).toBe('peer-1')
	})

	it('normalizeRouterRtpCapabilities accepts direct capabilities object', () => {
		const caps = { codecs: [], headerExtensions: [] }

		expect(normalizeRouterRtpCapabilities(caps)).toBe(caps)
	})

	it('normalizeRouterRtpCapabilities unwraps routerRtpCapabilities', () => {
		const caps = { codecs: [], headerExtensions: [] }

		expect(normalizeRouterRtpCapabilities({ routerRtpCapabilities: caps })).toBe(caps)
	})

	it('normalizeRouterRtpCapabilities throws on invalid payload', () => {
		expect(() => normalizeRouterRtpCapabilities({})).toThrow('Invalid getRouterRtpCapabilities response')
	})

	it('isNewConsumerRequestData validates payload shape', () => {
		expect(
			isNewConsumerRequestData({
				peerId: 'peer-1',
				consumerId: 'consumer-1',
				producerId: 'producer-1',
				kind: 'video',
				rtpParameters: {},
			})
		).toBe(true)

		expect(
			isNewConsumerRequestData({
				peerId: 'peer-1',
				kind: 'video',
			})
		).toBe(false)
	})

	it('stringifyError formats Error and non-Error values', () => {
		expect(stringifyError(new Error('boom'))).toBe('boom')
		expect(stringifyError('raw')).toBe('raw')
		expect(stringifyError(42)).toBe('42')
	})
})
