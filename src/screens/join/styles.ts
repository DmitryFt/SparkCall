import { StyleSheet } from 'react-native-unistyles'

export default StyleSheet.create((theme, rt) => ({
	safeArea: {
		flex: 1,
		backgroundColor: theme.fill.page,
	},
	container: {
		flex: 1,
		paddingHorizontal: 16,
		justifyContent: 'center',
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
	footer: {
		position: 'absolute',
		right: 0,
		bottom: rt.insets.bottom,
		left: 0,
		gap: 16,
		paddingVertical: 8,
		paddingHorizontal: 16,
		backgroundColor: theme.fill.box,
	},
	switchContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: 16,
	},
	signOutButton: {
		marginTop: 10,
	},
}))
