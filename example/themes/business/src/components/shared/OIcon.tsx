import * as React from 'react';
import { ImageStyle } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from 'styled-components/native';

const Wrapper = styled.View``;

const SImage = styled.Image`
  tint-color: ${(props: any) => props.theme.colors.primary};
`;
interface Props {
  src?: any;
  url?: string;
  dummy?: any;
  color?: string;
  width?: number;
  height?: number;
  style?: ImageStyle;
  isWrap?: boolean;
  cover?: boolean;
  children?: any;
  borderRadius?: number;
  borderBottomWidth?: number
}

const OImage = (props: Props): React.ReactElement => {
  const theme = useTheme();
  return (
    <Wrapper
      style={{
        borderRadius: props.style?.borderRadius,
        overflow: 'hidden',
        marginHorizontal: props.style?.marginHorizontal,
        borderBottomWidth: props.borderBottomWidth
      }}>
      <SImage
        source={
          props.src
            ? props.src
            : props.url
            ? { uri: props.url }
            : props.dummy
            ? props.dummy
            : theme.images.logos.logo
        }
        style={{
          tintColor: props.color,
          flex: props.isWrap ? 1 : 0,
          width: props.width,
          height: props.height,
          marginHorizontal: 0,
          borderRadius: props.borderRadius,
          ...props.style,
        }}
        resizeMode={props.cover ? 'cover' : 'contain'}>
        {props.children}
      </SImage>
    </Wrapper>
  );
};

OImage.defaultProps = {
  width: 26,
  height: 26,
};

export default OImage;
