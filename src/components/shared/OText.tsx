
import * as React from 'react'
import { TextStyle } from 'react-native';
import styled from 'styled-components/native'

const SText = styled.Text`
    color: black;
    font-family: 'Poppins-Regular';
    font-size: 14px;
    flex-wrap: wrap;
`
export interface OTextProps {
    color?: string,
    size?: number,
    weight?: any,
    style?: TextStyle,
    children?: string,
    isWrap?: boolean,
    hasBottom?: boolean,
}

const OText = (props: OTextProps): React.ReactElement => {
    return (
        <SText
            style={{
                color: props.color || 'black', 
                fontSize: props.size, 
                fontWeight: props.weight, 
                flex: props.isWrap ? 1 : 0, 
                marginBottom: props.hasBottom ? 10 : 0,
                ...props.style}}
        >
            {props.children}
        </SText>
    )
}

export default OText;