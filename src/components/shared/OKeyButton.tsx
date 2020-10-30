import * as React from 'react'
import styled from 'styled-components/native'
import OText from './OText'

const Wrapper = styled.TouchableOpacity`
    background-color: white;
    border-radius: 4px;
    height: 48px;
    align-items: center;
    justify-content: center;
`

interface Props {
    title?: string,
    subTitle?: string,
    onClick?: any
}

const OKeyButton = (props: Props) => {
    return (
        <Wrapper 
            onPress={props.onClick}
        >
            <OText>{props.title}</OText>
            {props.subTitle ? (
                <OText>{props.subTitle}</OText>
            ) : null}
        </Wrapper>
    )
}

export default OKeyButton;