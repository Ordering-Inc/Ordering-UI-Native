import * as React from 'react';
import {ImageSourcePropType, ImageStyle, ViewStyle, TextInputProps, I18nManager} from 'react-native';
import styled from 'styled-components/native';
import OIcon from './OIcon';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

const Wrapper = styled.View`
  background-color: ${(props: any) => props.theme.colors.backgroundLight};
  border-radius: 25px;
  border-width: 1px;
  padding-horizontal: 16px;
  height: 50px;
  flex-direction: row;
  align-items: center;
  flex: 1;
  justify-content: center;
`;

const Input = styled.TextInput`
  flex-grow: 1;
  flex: 1;
  min-height: 30px;
  font-size: 15px;
  font-family: 'Poppins-Regular';
  text-align: ${I18nManager.isRTL ? 'right' : 'left'};
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
  autoCapitalize?: any;
  autoCompleteType?: any;
  autoCorrect?: any;
  returnKeyType?: any;
  onSubmitEditing?: any;
  blurOnSubmit?: any;
}

const OInput = (props: Props): React.ReactElement => {
  return (
    <Wrapper
      style={{
        backgroundColor: props.bgColor,
        borderColor: props.borderColor,
        ...props.style,
      }}>
      {props.icon ? (
        <OIcon
          src={props.icon}
          color={props.iconColor}
          width={20}
          height={20}
          style={{marginRight: 10}}
        />
      ) : null}
      {props.vertorIcon && (
        <MaterialIcon name={props?.vertorIcon} size={20} color={props?.vectorIconColor} style={{marginHorizontal: 10}} />
      )}
      <Input
        name={props.name}
        secureTextEntry={props.isSecured}
        onChangeText={(txt: any) => props.name ? props.onChange({target: {name: props.name, value: txt}}) : props.onChange(txt)}
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
        ref={props.forwardRef}
      />
      {props.iconRight && (
        <OIcon
          src={props.iconRight}
          color={props.iconRightColor}
          width={20}
          height={20}
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
