import {
  ActivityIndicator,
  ImageSourcePropType,
  ImageStyle,
  Pressable,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

import * as React from 'react';
import styled from 'styled-components/native';

export const StyledButton = styled.View<Props>`
    background-color: ${props => props.theme.btnPrimary};
    border-radius: 26px;
    border-width: 2px;
    height: 52px;
    border-color: ${({ theme }): string => theme.btnPrimary};
    flex-direction: row;
    align-items: center;
    justify-content: center;
    box-shadow: 1px 1px 2px #00000020;
    elevation: 2;
    padding-left: 20px;
    padding-right: 20px;
    position: relative;
  `;
const StyledButtonDisabled = styled(StyledButton)`
    background-color: ${({ theme }): string => theme.btnDisabled};
    border-color: rgb(200, 200, 200);
  `;

const StyledText = styled.Text`
    font-size: 16px;
    color: ${({ theme }): string => theme.btnPrimaryFont};
    margin-left: 10px;
    margin-right: 10px;
    font-family: 'Poppins-Regular';
  `;

const StyledTextDisabled = styled(StyledText)`
    color: ${({ theme }): string => theme.textDisabled};
  `;

const StyledImage = styled.Image`
    width: 24px;
    height: 24px;
    resize-mode: contain;
  `;
const EndImage = styled.Image`
  width: 15px;
  height: 15px;
  resize-mode: contain;
  right 20px;
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
}

const OButton = (props: Props): React.ReactElement => {
  if (props.isDisabled) {
    return (
      <StyledButtonDisabled style={props.disabledStyle}>
        <StyledTextDisabled style={props.textStyle}>
          {props.text}
        </StyledTextDisabled>
      </StyledButtonDisabled>
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
  activeOpacity: 0.5,
  imgRightSrc: require('../../assets/icons/arrow_right.png')
};

export default OButton;
