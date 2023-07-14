import * as React from 'react';
import {
  ImageSourcePropType,
  ImageStyle,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import styled from 'styled-components/native';
import OIcon from './OIcon';

const Wrapper = styled.View`
  background-color: ${(props: any) => props.theme.colors.backgroundLight};
  border-radius: ${(props: any) => (props.border ? props.border : '25px')};
  border-width: 1px;
  padding-horizontal: ${(props: any) =>
    props.paddingHorizontal ? props.paddingHorizontal : '16px'};
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

interface Props extends TextInputProps {
  bgColor?: string;
  borderColor?: string;
  isRequired?: boolean;
  requiredMsg?: string;
  isDisabled?: boolean;
  isSecured?: boolean;
  style?: ViewStyle;
  placeholder?: string;
  placeholderTextColor?: string;
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
  selectionColor?: string;
  maxLength?: number;
  autoCapitalize?: any;
  autoCompleteType?: any;
  autoCorrect?: any;
  returnKeyType?: any;
  onSubmitEditing?: any;
  blurOnSubmit?: any;
  color?: any;
  isValueSync?: boolean
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
          style={{ marginRight: 10 }}
        />
      ) : null}
      {props.vertorIcon && (
        <MaterialIcon
          name={props?.vertorIcon}
          size={20}
          color={props?.vectorIconColor}
          style={{ marginHorizontal: 10 }}
        />
      )}
      <Input
        name={props.name}
        secureTextEntry={props.isSecured}
        onChangeText={(txt: any) =>
          props.name
            ? props.onChange({ target: { name: props.name, value: txt } })
            : props.onChange(txt)
        }
        defaultValue={props.value}
        placeholder={props.placeholder ? props.placeholder : ''}
        placeholderTextColor={
          props.placeholderTextColor && props.placeholderTextColor
        }
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
        selectionColor={props.selectionColor}
        color={props.color}
        maxLength={props.maxLength || 1000}
        value={props.isValueSync && props.value}
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
