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
import { StyledButtonDisabled, StyledButton, StyledTextDisabled, StyledImage, StyledText, EndImage } from './OButton.style';
import { COMP_ICONS } from '../../index.conf';

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
  imgRightSrc: COMP_ICONS.arrow_right
};

export default OButton;
