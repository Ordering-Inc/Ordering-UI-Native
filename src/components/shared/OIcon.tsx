
import * as React from 'react'
import { ImageStyle } from 'react-native'
import styled from 'styled-components/native'

const SImage = styled.Image`
    resize-mode: contain;
    tint-color: ${({theme})=>theme.primaryColor};
`
interface Props {
    src?: any,
    url?: string,
    color?: string,
    width?: number,
    height?: number,
    style?: ImageStyle,
    isWrap?: boolean
    children?: any,
}

const OImage = (props: Props): React.ReactElement => {
    return (
        <SImage
            source={props.src ? props.src : props.url ? {uri: props.url} : require('../../assets/icons/lunch.png')}
            style={{
                tintColor: props.color, 
                flex: props.isWrap ? 1 : 0,
                width: props.width,
                height: props.height,
                ...props.style}}
        >
            {props.children}
        </SImage>
    )
}

OImage.defaultProps = {
    width: 26,
    height: 26
}

export default OImage;