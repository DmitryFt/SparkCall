export type CloseReason = 'disconnect' | 'logout' | 'kicked' | 'transportclose' | 'producerclose' | 'unknown'

export interface NewConsumerRequestData {
	peerId: string
	consumerId: string
	producerId: string
	kind: 'audio' | 'video'
	rtpParameters: Record<string, unknown>
	appData?: {
		source?: string
	}
}

export interface NewDataConsumerRequestData {
	peerId?: string
	dataConsumerId?: string
	dataProducerId?: string
	label?: string
	protocol?: string
	sctpStreamParameters?: Record<string, unknown>
}

export type SignalingServerRequestPayload =
	| {
			method: 'newConsumer'
			data: NewConsumerRequestData
	  }
	| {
			method: 'newDataConsumer'
			data: NewDataConsumerRequestData
	  }
	| {
			method: string
			data: Record<string, unknown>
	  }

export type SignalingNotificationPayload =
	| {
			method: 'consumerClosed'
			data?: {
				consumerId?: string
			}
	  }
	| {
			method: 'peerLeft'
			data?: {
				peerId?: string
				reason?: CloseReason
			}
	  }
	| {
			method: 'producerPaused' | 'producerResumed'
			data?: {
				peerId?: string
				producerId?: string
				kind?: 'audio' | 'video'
			}
	  }
	| {
			method: 'entityClosed'
			data?: {
				entityType?: 'transport' | 'producer' | 'consumer' | 'dataProducer' | 'dataConsumer'
				entityId?: string
				peerId?: string
				reason?: CloseReason
			}
	  }
	| {
			method: string
			data?: Record<string, unknown>
	  }

export type SignalingErrorCode =
	| 'TRANSPORT_CONNECT_FAILED'
	| 'PRODUCE_FAILED'
	| 'CONSUME_FAILED'
	| 'CLOSE_PRODUCER_FAILED'
	| 'BAD_REQUEST'
	| 'UNAUTHORIZED'
	| 'INTERNAL_ERROR'

export type SignalingAck<TData = Record<string, unknown>> =
	| {
			ok: true
			data: TData
	  }
	| {
			ok: false
			error: {
				code: SignalingErrorCode
				message: string
				retryable?: boolean
			}
	  }
