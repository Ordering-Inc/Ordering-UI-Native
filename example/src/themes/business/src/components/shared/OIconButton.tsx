import * as React from 'react';
import { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from 'styled-components/native';

const Wrapper = styled.TouchableOpacity`
  height: 40px;
  border-radius: 20px;
  flex-direction: row;
  border: 1px solid white;
  padding-horizontal: 20px;
  align-items: center;
  justify-content: center;
`;
const DisabledWrapper = styled.View`
  height: 40px;
  border-radius: 20px;
  flex-direction: row;
  border: 1px solid white;
  padding-horizontal: 20px;
  align-items: center;
  justify-content: center;
`;
const Icon = styled.Image`
  width: 22px;
  height: 22px;
`;
const Title = styled.Text`
  font-size: 16px;
  margin-horizontal: 7px;
`;

interface Props {
  icon?: any;
  title?: string;
  onClick?: any;
  height?: number;
  isOutline?: boolean;
  disabled?: boolean;
  color?: string;
  bgColor?: string;
  borderColor?: string;
  textColor?: string;
  iconColor?: string;
  style?: ViewStyle;
  iconStyle?: ImageStyle;
  textStyle?: TextStyle;
  disabledColor?: string;
  iconCover?: boolean;
  urlIcon?: any;
  cover?: any;
}

const OIconButton = (props: Props) => {
  const theme = useTheme();
  return (
    <>
      {!props.disabled ? (
        <Wrapper
          onPress={props.onClick}
          style={{
            borderColor: props.borderColor || props.color,
            backgroundColor: props.isOutline
              ? 'white'
              : props.bgColor || props.color,
            height: props.height || 40,
            borderRadius: props.height ? props.height * 0.5 : 20,
            ...props.style,
          }}>
          {props.icon ? (
            <Icon
              source={props.icon}
              style={{
                tintColor: props.iconColor,
                ...props.iconStyle,
              }}
            />
          ) : null}
          {props.title ? (
            <Title
              style={{
                color: props.textColor || props.color,
                ...props.textStyle,
              }}>
              {props.title}
            </Title>
          ) : null}
        </Wrapper>
      ) : (
        <DisabledWrapper
          style={{
            borderColor: theme.colors.backgroundDark,
            backgroundColor: props.disabledColor
              ? props.disabledColor
              : theme.colors.backgroundDark,
            height: props.height || 40,
            borderRadius: props.height ? props.height * 0.5 : 20,
            ...props.style,
          }}>
          {props.icon ? (
            <Icon
              source={props.urlIcon ? { uri: props.icon } : props.icon}
              resizeMode={props.cover ? 'cover' : 'contain'}
              style={{
                tintColor: props.iconColor,
                ...props.iconStyle,
              }}
            />
          ) : null}
          {props.title ? (
            <Title
              style={{
                color: props.textColor || props.color,
                ...props.textStyle,
              }}>
              {props.title}
            </Title>
          ) : null}
        </DisabledWrapper>
      )}
    </>
  );
};

OIconButton.defaultProps = {};

export default OIconButton;
