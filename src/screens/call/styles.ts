import { StyleSheet } from 'react-native-unistyles'

export default StyleSheet.create((theme) => ({
	safeArea: {
		flex: 1,
		backgroundColor: theme.fill.page,
		padding: 16,
	},
	container: {
		flex: 1,
		gap: 10,
	},
	header: {
		gap: 5,
		backgroundColor: theme.fill.box,
		marginHorizontal: -16,
		paddingVertical: 8,
		paddingHorizontal: 16,
	},
	roomText: {
		alignSelf: 'center',
		color: theme.text.main,
	},
	participantText: {
		color: theme.text.main,
	},
	statusText: {
		color: theme.text.main,
		fontSize: 14,
	},
	switchContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: 16,
		backgroundColor: theme.fill.box,
		marginHorizontal: -16,
		paddingVertical: 8,
		paddingHorizontal: 16,
	},
	logs: {
		borderWidth: 1,
		borderColor: theme.input.borderDefault,
		borderRadius: 8,
		paddingHorizontal: 10,
		paddingVertical: 8,
		backgroundColor: theme.fill.box,
		gap: 4,
	},
	logsScrollContainer: {
		maxHeight: 120,
	},
	logsScrollContent: {
		paddingBottom: 2,
	},
	logsTitle: {
		color: theme.text.main,
	},
	logsValue: {
		color: theme.text.muted,
	},
	actions: {
		flexDirection: 'row',
		gap: 10,
	},
	actionButton: {
		flex: 1,
	},
	videoContainer: {
		flex: 1,
		borderRadius: 8,
		overflow: 'hidden',
		borderWidth: 1,
		borderColor: theme.input.borderDefault,
	},
	remoteVideo: {
		flex: 1,
	},
	videoPlaceholder: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	videoPlaceholderLabel: {
		color: theme.text.main,
	},
	localVideoWrapper: {
		position: 'absolute',
		overflow: 'hidden',
		borderRadius: 8,
		zIndex: 99,
	},
	localVideo: {
		flex: 1,
	},
	localVideoTapArea: {
		...StyleSheet.absoluteFillObject,
	},
}))
