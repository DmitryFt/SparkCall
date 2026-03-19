import { StyleSheet } from 'react-native-unistyles'

export default StyleSheet.create((theme, rt) => ({
	safeArea: {
		flex: 1,
		backgroundColor: theme.fill.page,
	},
	container: {
		flex: 1,
		paddingHorizontal: 16,
	},
	overlay: {
		...StyleSheet.absoluteFillObject,
	},
	content: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		gap: 20,
	},
	titleText: {
		alignSelf: 'center',
		color: theme.text.main,
	},
	subtitleText: {
		color: theme.text.main,
		fontSize: 14,
		textAlign: 'center',
	},
	action: {
		width: '100%',
	},
	authErrorText: {
		paddingHorizontal: 32,
		color: theme.input.borderInvalid,
		alignSelf: 'center',
		textAlign: 'center',
	},
	footer: {
		position: 'absolute',
		right: 0,
		bottom: rt.insets.bottom,
		left: 0,
		gap: 16,
		paddingVertical: 8,
		paddingHorizontal: 16,
		backgroundColor: theme.fill.box,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
}))
