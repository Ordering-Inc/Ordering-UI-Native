import {
  ActivityIndicator,
  ImageSourcePropType,
  ImageStyle,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import * as React from 'react';
import styled from 'styled-components/native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import { Icon, IconProps } from 'react-native-vector-icons/Icon';

const StyledButton = styled.View<Props>`
  background-color: ${(props: any) => props.theme.colors.primary};
  border-radius: 6px;
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
  font-size: 18px;
  color: ${(props: any) => props.theme.colors.btnFont};
  margin-left: 10px;
  margin-right: 10px;
  font-family: 'Poppins-Regular';
  font-weight: 700;
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
  width: 15px;
  height: 15px;
  resize-mode: contain;
  right: 20px;
  position: absolute;
  right: 20px;
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
  disabledTextStyle?: TextStyle;
  imgLeftSrc?: ImageSourcePropType;
  imgLeftStyle?: ImageStyle;
  imgRightSrc?: any;
  imgRightStyle?: ImageStyle;
  indicatorColor?: string;
  activeOpacity?: number;
  text?: string;
  isCircle?: boolean;
  bgColor?: string;
  borderColor?: string;
  iconProps?: IconProps;
  IconCustom?: React.FunctionComponent
}

const OButton = (props: Props): React.ReactElement => {
  if (props.isDisabled) {
    return (
      <View style={props.parentStyle}>
        <StyledButtonDisabled style={props.style}>
          <StyledTextDisabled style={props.disabledTextStyle ? props.disabledTextStyle : props.textStyle}>
            {props.text}
          </StyledTextDisabled>
        </StyledButtonDisabled>
      </View>
    );
  }

  if (props.isLoading) {
    return (
      <StyledButton style={props.style}>
        <ActivityIndicator size="small" color={props.indicatorColor} />
      </StyledButton>
    );
  }

  return (
    <TouchableOpacity
      testID={props.testID}
      activeOpacity={props.activeOpacity}
      onPress={props.onClick}
      style={{ width: props.isCircle ? 52 : props.style?.width, ...props.parentStyle }}
    >
      <StyledButton style={props.bgColor ? { ...props.style, backgroundColor: props.bgColor, borderColor: props.borderColor } : props.style}>
        {props.imgLeftSrc ? (
          <StyledImage style={props.imgLeftStyle} source={props.imgLeftSrc} />
        ) : null}
        {props.iconProps ? (
          <>
            {props?.IconCustom ? (
              <props.IconCustom {...props.iconProps} />
            ) : (
              <AntDesignIcon {...props.iconProps} />
            )}
          </>
        ) : null}
        {props.text ? (
          <StyledText style={props.textStyle}>{props.text}</StyledText>
        ) : null}
        {props.imgRightSrc ? (
          <EndImage style={props.imgRightStyle} source={props.imgRightSrc} />
        ) : null}
      </StyledButton>
    </TouchableOpacity>
  );
}

OButton.defaultProps = {
  isLoading: false,
  isDisabled: false,
  indicatorColor: 'white',
  activeOpacity: 0.5
};

export default OButton;
