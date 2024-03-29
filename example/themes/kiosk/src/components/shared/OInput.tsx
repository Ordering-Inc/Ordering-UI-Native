import * as React from 'react';
import {ImageSourcePropType, ImageStyle, ViewStyle, TextInputProps} from 'react-native';
import styled from 'styled-components/native';
import OIcon from './OIcon';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

const Wrapper = styled.View`
  background-color: ${(props: any) => props.theme.colors.backgroundLight};
  border-radius: 6px;
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
`;

interface Props {
  bgColor?: string;
  borderColor?: string;
  isRequired?: boolean;
  requiredMsg?: string;
  isDisabled?: boolean;
  isSecured?: boolean;
  style?: ViewStyle;
  placeholder?: string;
  icon?: ImageSourcePropType;
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
  autoCapitalize?: string;
  autoCompleteType?: string;
  autoCorrect?: boolean;
  keyboardType?: string;
  returnKeyType?: string;
  onSubmitEditing?: any;
  blurOnSubmit?: boolean;
  inputStyle?: TextInputProps
  onFocus?: TextInputProps
  onBlur?: TextInputProps
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
        style={props.inputStyle}
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
        onFocus={props.onFocus}
        onBlur={props.onBlur}
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
