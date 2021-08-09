import React, { useEffect, useRef } from 'react'
import { Modal, TouchableWithoutFeedback, Dimensions, StyleSheet, View, Text, PanResponder, Animated } from 'react-native'
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

	const panY = useRef(new Animated.Value(deviceHeight)).current;
	const resetPositionAnim = Animated.timing(panY, {
		toValue: 0,
		duration: 300,
		useNativeDriver: false
	});
	const closeAnim = Animated.timing(panY, {
		toValue: deviceHeight,
		duration: 500,
		useNativeDriver: false
	});

	const panResponders = useRef(
		PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onMoveShouldSetPanResponder: () => false,
			onPanResponderMove: Animated.event(
				[ null, { dy: panY } ],
				{ useNativeDriver: false }
			),
			onPanResponderRelease: (e, gs) => {
				if (gs.dy > 0 && gs.vy > 1.5) {
					return closeAnim.start(() => handleDismiss())
				}
				return resetPositionAnim.start();
			},
		})
	).current;

	const top = panY.interpolate({
		inputRange: [-1, 0, 1],
		outputRange: [0, 0, 1],
	});

	const handleDismiss = () => {
		panY.setValue(0);
		closeAnim.start(() => onClose());
	}

	useEffect(() => {
		resetPositionAnim.start(() => resetPositionAnim.reset());
	}, [open])

	return (
		<Modal
			animated
			animationType="fade"
			transparent
			visible={open}
			onRequestClose={() => handleDismiss()}
		>
			<View style={styles.overlay}>
				<TouchableWithoutFeedback
					style={styles.touchableOutsideStyle}
					onPress={() => handleDismiss()}
				>
					<View style={styles.touchableOutsideStyle} />
				</TouchableWithoutFeedback>
				<Animated.View style={[styles.container, { top }]} {...panResponders.panHandlers}>
					{title && <Text style={styles.titleStyle}>
						{title}
					</Text>}
					{children}
				</Animated.View>
			</View>
		</Modal>
	)
}

const styles = StyleSheet.create({
	overlay: {
		backgroundColor: '#000000AA',
		flex: 1,
		justifyContent: 'flex-end',
	},
	container: {
		backgroundColor: 'white',
		paddingTop: 12,
		borderTopRightRadius: 12,
		borderTopLeftRadius: 12,
		paddingHorizontal: 40
	},
	box: {
		height: 150,
		width: 150,
		backgroundColor: "blue",
		borderRadius: 5
	 },
	touchableOutsideStyle: {
		flex: 1,
		width: '100%'
	},
	titleStyle: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 18
	}
})

export default OBottomPopup
