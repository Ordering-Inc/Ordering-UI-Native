import React from 'react'
import { Modal, TouchableWithoutFeedback, Dimensions, StyleSheet, View, Text } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
const deviceHeight = Dimensions.get('window').height

interface Props {
	open: boolean;
	title?: string;
	children?: any;
	onClose?: any;
}
const OBottomPopup = (props: Props) => {
	const {
		open,
		title,
		onClose,
		children
	} = props
	const { top, bottom } = useSafeAreaInsets();
	return (
		<Modal
			animationType='slide'
			transparent={false}
			visible={open}
			onRequestClose={() => onClose()}
			presentationStyle={'fullScreen'}
		>
			<View style={styles.container}>
				<TouchableWithoutFeedback
					style={styles.touchableOutsideStyle}
					onPress={() => onClose()}
				>
					<View style={styles.touchableOutsideStyle} />
				</TouchableWithoutFeedback>
				<View style={styles.bottomContainer}>
					<View style={{ paddingTop: top, paddingBottom: bottom }}>
						{title != '' && (
							<Text style={styles.titleStyle}>
								{title}
							</Text>
						)}
						{children}
					</View>
				</View>
			</View>
		</Modal>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#000000AA',
		justifyContent: 'flex-end',
	},
	touchableOutsideStyle: {
		flex: 1,
		width: '100%'
	},
	bottomContainer: {
		backgroundColor: '#ffffff',
		width: '100%',
		paddingHorizontal: 0,
		height: deviceHeight
	},
	titleStyle: {
		fontSize: 20,
		fontWeight: 'bold',
		marginVertical: 15
	}
})

export default OBottomPopup
