import * as React from 'react';
import { ImageSourcePropType, ImageStyle, ViewStyle, TextInputProps, TextStyle } from 'react-native';
import styled from 'styled-components/native';
import OIcon from './OIcon';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

const Input = styled.TextInput`
  flex-grow: 1;
  flex: 1;
  min-height: 30px;
  font-size: 15px;
  font-family: 'Poppins-Regular';
`;

interface Props extends TextInputProps {
	bgColor?: string;
	borderColor?: string;
	isRequired?: boolean;
	requiredMsg?: string;
	isDisabled?: boolean;
	isSecured?: boolean;
	style?: ViewStyle;
	placeholder?: string;
	icon?: ImageSourcePropType | string;
	iconRight?: ImageSourcePropType;
	iconColor?: string;
	iconRightColor?: string;
	iconStyle?: ImageStyle;
	iconRightStyle?: ImageStyle;
	iconCustomRight?: any;
	value?: string;
	onChange?: any;
	name?: string;
	type?: string;
	multiline?: boolean;
	vertorIcon?: string;
	vectorIconColor?: string;
	forwardRef?: any;
	inputStyle?: TextStyle;
	wrapperRef?: any;
	onPress?: any;
}

const Wrapper = styled.Pressable`
	background-color: ${(props: any) => props.theme.colors.backgroundLight};
	border-radius: 25px;
	border-width: 1px;
	padding-horizontal: 16px;
	height: 50px;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	width: 100%;
`;

const OInput = (props: Props): React.ReactElement => {
	return (
		<Wrapper
			onPress={() => { props.forwardRef?.current?.focus?.(); props.onPress && props.onPress() }}
			style={{
				backgroundColor: props.bgColor,
				borderColor: props.borderColor,
				...props.style,
			}}>
			{props.icon ? (
				<OIcon
					src={props.icon}
					color={props.iconColor}
					width={16}
					height={20}
					style={{ marginRight: 10, ...props.iconStyle }}
				/>
			) : null}
			{props.vertorIcon && (
				<MaterialIcon name={props?.vertorIcon} size={20} color={props?.vectorIconColor} style={{ marginHorizontal: 10 }} />
			)}
			<Input
				autoFocus={props?.autoFocus}
				name={props.name}
				secureTextEntry={props.isSecured}
				onChangeText={(txt: any) => props.name ? props.onChange({ target: { name: props.name, value: txt } }) : props.onChange(txt)}
				defaultValue={props.value}
				placeholder={props.placeholder ? props.placeholder : ''}
				keyboardType={props.type || 'default'}
				multiline={props.multiline}
				scrollEnabled={props.multiline}
				editable={!props.isDisabled}
				autoCapitalize={props.autoCapitalize}
				autoCompleteType={props.autoCompleteType}
				autoCorrect={props.autoCorrect}
				returnKeyType={props.returnKeyType}
				onSubmitEditing={props.onSubmitEditing}
				blurOnSubmit={props.blurOnSubmit}
				ref={(e: any) => {
					props.forwardRef && (props.forwardRef.current = e)
				}}
				style={props?.inputStyle}
			/>
			{props.iconRight && (
				<OIcon
					src={props.iconRight}
					color={props.iconRightColor}
					width={16}
					height={16}
					style={{ ...props.iconRightStyle }}
				/>
			)}
			{props.iconCustomRight}
		</Wrapper>
	);
};

OInput.defaultProps = {
	iconColor: '#959595',
	bgColor: 'white',
	borderColor: 'white',
};

export default OInput;
