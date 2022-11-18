import React from 'react'
import { Modal, TouchableWithoutFeedback, TouchableOpacity, Dimensions, StyleSheet, View, Text, Platform, StatusBar } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { OIcon } from '.';
const deviceHeight = Dimensions.get('window').height

interface Props {
	open: boolean;
	transparent?: boolean;
	title?: string;
	children?: any;
	onClose?: any;
	isStatusBar?: boolean;
	bottomContainerStyle?: any;
	titleStyle?: any;
	closeIcon?: any;
	presentationStyle?: "fullScreen" | "pageSheet" | "formSheet" | "overFullScreen" | undefined
}
const OBottomPopup = (props: Props) => {
	const {
		open,
		transparent,
		title,
		onClose,
		children,
		isStatusBar,
		titleStyle,
		bottomContainerStyle,
		closeIcon,
		presentationStyle
	} = props
	const { top, bottom } = useSafeAreaInsets();
	
	return (
		<Modal
			animationType='fade'
			transparent={transparent}
			visible={open}
			onRequestClose={() => onClose()}
			presentationStyle={presentationStyle || 'fullScreen'}
		>
			{isStatusBar && <StatusBar translucent={false} />}
			<View style={styles.container}>
				<TouchableWithoutFeedback
					style={styles.touchableOutsideStyle}
					onPress={() => onClose()}
				>
					<View style={styles.touchableOutsideStyle} />
				</TouchableWithoutFeedback>
				<View style={{ ...styles.bottomContainer, ...bottomContainerStyle }}>
					<View style={{ paddingTop: top, paddingBottom: bottom }}>
						<View style={styles.modalTitleStyle}>
							{closeIcon && (
								<TouchableOpacity onPress={() => onClose()} style={styles.closeIconStyle}>
									<OIcon
										src={closeIcon}
										width={20}
										height={20}
									/>
								</TouchableOpacity>
							)}
							{!!title && (
								<Text style={{ ...styles.titleStyle, ...titleStyle }}>
									{title}
								</Text>
							)}
						</View>
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
		justifyContent: 'flex-end'
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
		fontWeight: 'bold'
	},
	closeIconStyle: {
		position: 'absolute',
		left: 25,
		top: 25,
		zIndex: 100
	},
	modalTitleStyle: {
		position: 'relative',
		paddingHorizontal: 10,
		paddingVertical: 20
	}
})

export default OBottomPopup
