
import * as React from 'react'
import { ImageStyle } from 'react-native'
import styled from 'styled-components/native'
import { colors } from '../../globalStyles'

const Wrapper = styled.View`

`
const SImage = styled.Image`
    resize-mode: contain;
    tint-color: ${colors.primary};
`
export interface OIconProps {
    src?: any,
    url?: string,
    dummy?: any,
    color?: string,
    width?: number,
    height?: number,
    style?: ImageStyle,
    isWrap?: boolean
    children?: any,
}

const OImage = (props: OIconProps): React.ReactElement => {
    return (
        <Wrapper style={{borderRadius: props.style?.borderRadius, overflow: 'hidden', marginHorizontal: props.style?.marginHorizontal}}>
            <SImage
                source={props.src ? props.src : props.url ? {uri: props.url} : props.dummy ? props.dummy : require('../../assets/icons/lunch.png')}
                style={{
                    tintColor: props.color, 
                    flex: props.isWrap ? 1 : 0,
                    width: props.width,
                    height: props.height,
                    ...props.style, marginHorizontal: 0}}
            >
                {props.children}
            </SImage>
        </Wrapper>
    )
}

OImage.defaultProps = {
    width: 26,
    height: 26
}

export default OImage;