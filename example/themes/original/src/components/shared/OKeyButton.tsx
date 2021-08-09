import * as React from 'react'
import { ViewStyle } from 'react-native'
import styled from 'styled-components/native'
import OText from './OText'

const Wrapper = styled.TouchableOpacity`
    background-color: white;
    border-radius: 4px;
    height: 50px;
    align-items: center;
    justify-content: center;
`

interface Props {
    title?: string,
    subTitle?: string,
    onClick?: any,
    style?: ViewStyle
}

const OKeyButton = (props: Props) => {
    return (
        <Wrapper 
            style={props.style}
            onPress={props.onClick}
        >
            <OText size={22}>{props.title}</OText>
            {props.subTitle ? (
                <OText>{props.subTitle}</OText>
            ) : null}
        </Wrapper>
    )
}

export default OKeyButton