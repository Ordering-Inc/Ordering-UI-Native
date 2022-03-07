import React, { FunctionComponent } from 'react';
import { ImageSourcePropType, ImageStyle, TextStyle, ViewStyle, ActivityIndicator } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useTheme } from 'styled-components/native';

import { OButton, OIcon, OText } from '../shared';
import { Container, InnerContainer, ActivityIndicatorContainer } from './styles';

const OptionCard = (props: Props) => {
  const theme = useTheme();

  return (
    <TouchableOpacity
      onPress={props.onClick}
      activeOpacity={1}
      disabled={props.isDisabled}
    >
      <Container
        source={props.bgImage}
        style={props.style}
      >
        <InnerContainer
          style={props.innerStyle}
          isLoading={props.isLoading}
        >
          {props.isLoading && (
            <ActivityIndicatorContainer>
              <ActivityIndicator size='large' color='#ffffff' />
            </ActivityIndicatorContainer>
          )}
          {props.icon && (
            <OIcon
              src={props.icon}
              style={{ marginBottom: 10, ...props?.iconStyle }}
            />
          )}
          {props.VectorIcon && (
            <props.VectorIcon />
          )}
          <OText
            weight="700"
            color="white"
            size={28}
            mBottom={10}
            style={props.titleStyle}
          >
            {props.title}
          </OText>

          <OText
            color="white"
            mBottom={20}
            size={24}
            style={{ width: 300, ...props?.descriptionStyle }}
          >
            {props.description}
          </OText>

          <OButton
            bgColor="transparent"
            borderColor="transparent"
            text={props.callToActionText}
            textStyle={{
              fontSize: 28,
              marginLeft: 0,
              fontWeight: '700',
              ...props.callToActionTextStyle,
            }}
            imgRightStyle={{
              position: 'relative',
              left: 8,
              width: 24,
              height: 24,
              ...props.callToActionIconStyle,
            }}
            imgRightSrc={
              props.callToActionIcon || theme.images.general.arrow_right_circular_outlined
            }
            style={{ justifyContent: 'flex-start', paddingLeft: 0 }}
          />
        </InnerContainer>
      </Container>
    </TouchableOpacity>
  );
}

interface Props {
  title: string;
  titleStyle?: TextStyle;
  description: string;
  descriptionStyle?: TextStyle;
  isDisabled?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
  style?: ViewStyle;
  bgImage: ImageSourcePropType;
  innerStyle?: ViewStyle;
  icon: ImageSourcePropType;
  iconStyle?: ImageStyle;
  callToActionText: string;
  callToActionTextStyle?: TextStyle;
  callToActionIcon?: ImageSourcePropType;
  callToActionIconStyle?: ImageStyle;
  VectorIcon?: FunctionComponent;
}

export default OptionCard;
