
import * as React from 'react'
import { ImageStyle } from 'react-native'
import styled from 'styled-components/native'
import { colors } from '../../theme.json'

const Wrapper = styled.View``

const SImage = styled.Image`
  tint-color: ${colors.primary};
`
interface Props {
  src?: any,
  url?: string,
  dummy?: any,
  color?: string,
  width?: number,
  height?: number,
  style?: ImageStyle,
  isWrap?: boolean,
  cover?: boolean,
  children?: any,
  borderRadius?: number,
}

const OIcon = (props: Props): React.ReactElement => {
  return (
    <Wrapper style={{ borderRadius: props.style?.borderRadius, overflow: 'hidden', marginHorizontal: props.style?.marginHorizontal }}>
      <SImage
        source={props.src ? props.src : props.url ? { uri: props.url } : props.dummy ? props.dummy : require('../../assets/icons/lunch.png')}
        style={{
          tintColor: props.color,
          flex: props.isWrap ? 1 : 0,
          width: props.width,
          height: props.height,
          marginHorizontal: 0,
          borderRadius: props.borderRadius,
          ...props.style,
        }}
        resizeMode={props.cover ? 'cover' : 'contain'}
      >
        {props.children}
      </SImage>
    </Wrapper>
  )
}

OIcon.defaultProps = {
  width: 26,
  height: 26
}

export default OIcon;
