import { StyleSheet } from 'react-native-unistyles'

const TRACK_WIDTH = 42
const TRACK_HEIGHT = 26
const THUMB_SIZE = 20
const THUMB_MARGIN = 3

export const THUMB_TRANSLATE_X = TRACK_WIDTH - THUMB_SIZE - THUMB_MARGIN * 2

export default StyleSheet.create((theme) => ({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: 8,
		width: '100%',
	},
	labelText: {
		color: theme.text.main,
		flexShrink: 1,
	},
	pressed: {
		opacity: 0.8,
	},
	track: {
		width: TRACK_WIDTH,
		height: TRACK_HEIGHT,
		borderRadius: 16,
		justifyContent: 'center',
		variants: {
			value: {
				true: {
					backgroundColor: theme.switch.trackOn,
					borderColor: theme.switch.trackOnBorder,
				},
				false: {
					backgroundColor: theme.switch.trackOff,
					borderWidth: 0.5,
					borderColor: theme.switch.trackOffBorder,
				},
			},
			disabled: {
				true: {},
			},
		},
		compoundVariants: [
			{
				disabled: true,
				value: true,
				styles: {
					borderColor: theme.static.opacity,
					borderWidth: 0,
				},
			},
		],
	},
	thumb: {
		width: THUMB_SIZE,
		height: THUMB_SIZE,
		borderRadius: 99,
		position: 'absolute',
		left: THUMB_MARGIN,
		// top: THUMB_MARGIN - 0.5,
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: theme.static.dark,
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 3,
		variants: {
			value: {
				true: {
					backgroundColor: theme.switch.thumbOn,
				},
				false: {
					backgroundColor: theme.switch.thumbOff,
				},
			},
		},
	},
	thumbContent: {
		width: THUMB_SIZE,
		height: THUMB_SIZE,
		alignItems: 'center',
		justifyContent: 'center',
	},
	disabledOverlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: theme.switch.disabledOverlay,
		opacity: 0.5,
		zIndex: 1,
	},
}))
