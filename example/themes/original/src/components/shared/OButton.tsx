import {
	ActivityIndicator,
	I18nManager,
	ImageSourcePropType,
	ImageStyle,
	TextStyle,
	TouchableOpacity,
	View,
	ViewStyle,
} from 'react-native';

import * as React from 'react';
import styled, { useTheme } from 'styled-components/native';
import { OIcon } from './';

const StyledButton = styled.View<Props>`
	background-color: ${(props: any) => props.theme.colors.primary};
	border-radius: 26px;
	border-width: 2px;
	height: 52px;
	border-color: ${(props: any) => props.theme.colors.primary};
	flex-direction: row;
	align-items: center;
	justify-content: center;
	box-shadow: 1px 1px 2px #00000020;
	padding-left: 20px;
	padding-right: 20px;
	position: relative;
`
const StyledButtonDisabled = styled(StyledButton)`
	background-color: ${(props: any) => props.theme.colors.disabled};
	border-color: ${(props: any) => props.theme.colors.disabled};
`

const StyledText = styled.Text`
	font-size: 16px;
	color: ${(props: any) => props.theme.colors.btnFont};
	margin-left: 10px;
	margin-right: 10px;
	font-family: 'Poppins-Regular';
`

const StyledTextDisabled = styled(StyledText)`
	color: ${(props: any) => props.theme.colors.primary};
`

const StyledImage = styled.Image`
	width: 20px;
	height: 20px;
	resize-mode: contain;
`
const EndImage = styled.Image`
	width: 17px;
	height: 15px;
	resize-mode: contain;
	right: 17.5px;
	position: absolute;
`;

interface Props {
	testID?: string;
	isLoading?: boolean;
	isDisabled?: boolean;
	onClick?: () => void;
	style?: ViewStyle;
	parentStyle?: ViewStyle;
	disabledStyle?: ViewStyle;
	textStyle?: TextStyle;
	imgLeftSrc?: ImageSourcePropType | string;
	imgLeftStyle?: ImageStyle;
	imgRightSrc?: any;
	imgRightStyle?: ImageStyle;
	indicatorColor?: string;
	activeOpacity?: number;
	text?: string;
	isCircle?: boolean;
	bgColor?: string;
	borderColor?: string;
	loadingStyle?: ViewStyle;
	showNextIcon?: boolean;
	isDisabledWithSameStyles?: boolean;
	icon?: any;
	iconProps?: any
}

const OButton = (props: Props): React.ReactElement => {

	const theme = useTheme();

	if (props.isDisabled) {
		return (
			<View style={props.parentStyle}>
				<StyledButtonDisabled style={props.style}>
					<StyledTextDisabled style={props.textStyle}>
						{props.text}
					</StyledTextDisabled>
				</StyledButtonDisabled>
			</View>
		);
	}

	if (props.isLoading) {
		return (
			<StyledButton style={props.style}>
				<ActivityIndicator size="small" color={props.indicatorColor} style={props.loadingStyle} />
			</StyledButton>
		);
	}

	return (
		<TouchableOpacity
			testID={props.testID}
			activeOpacity={props.activeOpacity}
			onPress={props.onClick}
			style={{ width: props.isCircle ? 52 : props.style?.width, ...props.parentStyle }}
			disabled={props.isDisabledWithSameStyles}
		>
			<StyledButton style={props.bgColor ? { ...props.style, backgroundColor: props.bgColor, borderColor: props.borderColor } : props.style}>
				{props.icon ? (
					<props.icon {...props.iconProps} />
				) : null}
				{props.imgLeftSrc ? (
					<OIcon style={props.imgLeftStyle} src={props.imgLeftSrc} color={theme.colors.textNormal} />
				) : null}
				{props.text ? (
					<StyledText style={props.textStyle}>{props.text}</StyledText>
				) : null}
				{props.imgRightSrc ? (
					<EndImage style={props.imgRightStyle} source={props.imgRightSrc} />
				) : props.showNextIcon ?
					<EndImage source={theme.images.general.arrow_left}
						style={{ width: 16, tintColor: 'white', transform: [{ rotate: I18nManager.isRTL ? '0deg' : '180deg' }] }} /> : null}
			</StyledButton>
		</TouchableOpacity>
	);
}

OButton.defaultProps = {
	isLoading: false,
	isDisabled: false,
	indicatorColor: 'white',
	activeOpacity: 0.5,
};

export default OButton;
