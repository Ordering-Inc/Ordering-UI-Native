import * as React from 'react';
import {ImageSourcePropType, ImageStyle, ViewStyle} from 'react-native';
import styled from 'styled-components/native';
import OIcon from './OIcon';
import {colors} from '../../theme';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

const Wrapper = styled.View`
  background-color: ${colors.backgroundLight};
  border-radius: 25px;
  border-width: 1px;
  padding-horizontal: 16px;
  height: 50px;
  flex-direction: row;
  align-items: center;
`;
const Input = styled.TextInput`
  flex-grow: 1;
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
  iconColor?: string;
  iconStyle?: ImageStyle;
  value?: string;
  onChange?: any;
  name?: string;
  type?: string;
  multiline?: boolean;
  vertorIcon?: string;
  vectorIconColor?: string;
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
          style={{marginHorizontal: 10}}
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
      />
    </Wrapper>
  );
};

OInput.defaultProps = {
  iconColor: '#959595',
  bgColor: 'white',
  borderColor: 'white',
};

export default OInput;
