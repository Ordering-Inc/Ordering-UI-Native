
import * as React from 'react'
import { TextStyle } from 'react-native';
import styled from 'styled-components/native'

const SText = styled.Text`
    color: ${({theme})=>theme.fontColor};
    font-family: 'Poppins-Regular';
    font-size: 14px;
    flex-wrap: wrap;
`
interface Props {
    color?: string,
    size?: number,
    weight?: any,
    style?: TextStyle,
    children?: string,
    isWrap?: boolean
}

const OText = (props: Props): React.ReactElement => {
    return (
        <SText
            style={{color: props.color, fontSize: props.size, fontWeight: props.weight, flex: props.isWrap ? 1 : 0, ...props.style}}
        >
            {props.children}
        </SText>
    )
}

export default OText;