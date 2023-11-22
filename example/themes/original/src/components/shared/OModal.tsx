import * as React from 'react';
import { Modal, StyleSheet, Text, SafeAreaView, View, TouchableOpacity, Platform } from "react-native";
import styled from 'styled-components/native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import { Toast } from '../../../../../src/components/shared/OToast'
interface Props {
	open?: boolean;
	title?: string;
	children?: any;
	onAccept?: any;
	onCancel?: any;
	onClose?: any;
	style?: any;
	acceptText?: string;
	cancelText?: string;
	isTransparent?: boolean;
	hideCloseDefault?: boolean;
	entireModal?: boolean;
	customClose?: boolean;
	titleSectionStyle?: any;
	isNotDecoration?: boolean;
	styleCloseButton?: any,
	isAvoidKeyBoardView?: boolean;
	styleContainerCloseButton?: any;
	showToastInsideModal?: boolean;
}
const KeyboardView = styled.KeyboardAvoidingView`
  flex-grow: 1;
  flex-shrink: 1;
`;

const OModal = (props: Props): React.ReactElement => {
	const {
		open,
		title,
		children,
		onAccept,
		onCancel,
		onClose,
		acceptText,
		cancelText,
		isTransparent,
		hideCloseDefault,
		entireModal,
		customClose,
		titleSectionStyle,
		isNotDecoration,
		style,
		styleCloseButton,
		styleContainerCloseButton,
		isAvoidKeyBoardView,
		showToastInsideModal
	} = props

	const renderSafeAreaView = () => (
		<SafeAreaView style={styles.container}>
			{!entireModal ? (
				<View style={styles.centeredView}>
					<View style={titleSectionStyle ? titleSectionStyle : styles.titleSection}>
						<TouchableOpacity style={{ ...styles.wrapperIcon, ...styleContainerCloseButton }} onPress={onClose}>
							<AntDesignIcon
								name='close'
								size={26}
								style={isNotDecoration && (styleCloseButton || styles.cancelBtn)}
							/>
						</TouchableOpacity>
						<Text style={styles.modalText}>{title || ''}</Text>
					</View>
					{children}
				</View>
			) :
				<View>
					{!customClose && (
						<View style={titleSectionStyle ? titleSectionStyle : styles.titleSection}>
							<TouchableOpacity style={styles.wrapperIcon} onPress={onClose}>
								<AntDesignIcon
									name='close'
									size={26}
									style={styleCloseButton || styles.cancelBtn}
								/>
							</TouchableOpacity>
							<Text style={styles.modalText}>{title || ''}</Text>
						</View>
					)}
					{children}
				</View>
			}
		</SafeAreaView>
	)

	return (
		<Modal
			animationType="slide"
			transparent={isTransparent}
			visible={open}
			onRequestClose={() => onClose && onClose()}
			style={{ height: '100%', flex: 1, position: 'absolute', ...style, zIndex: 9999 }}
		>
			{showToastInsideModal && (
				<Toast />
			)}
			{isAvoidKeyBoardView ? (
				<KeyboardView
					enabled
					behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				>
					{renderSafeAreaView()}
				</KeyboardView>
			) : (
				renderSafeAreaView()
			)}
		</Modal>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	centeredView: {
		justifyContent: "center",
		alignItems: 'flex-start',
		position: 'relative',
		width: '100%',
	},
	titleSection: {
		width: '100%',
		flex: 1,
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		paddingLeft: 20,
		paddingRight: 20,
		marginBottom: 40
	},
	cancelBtn: {
		//  position: 'absolute',
		//  left: 0,
		//  margin: 15,
		// zIndex: 10000
	},
	modalText: {
		marginTop: 15,
		fontSize: 20,
		lineHeight: 30,
		fontWeight: '600',
		textAlign: "center",
		zIndex: 10
	},
	wrapperIcon: {
		overflow: 'hidden',
		backgroundColor: 'transparent',
		width: 35,
		height: 35,
		marginStart: -9,
		marginTop: 12,
		alignItems: 'center',
		justifyContent: 'center',
		zIndex: 99999
	},

	modalView: {
		margin: 20,
		backgroundColor: "white",
		borderRadius: 20,
		padding: 35,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5
	},
	button: {
		borderRadius: 20,
		padding: 10,
		elevation: 2
	},
	buttonOpen: {
		backgroundColor: "#F194FF",
	},
	buttonClose: {
		backgroundColor: "#2196F3",
	},
	textStyle: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center"
	},
});

export default OModal;
