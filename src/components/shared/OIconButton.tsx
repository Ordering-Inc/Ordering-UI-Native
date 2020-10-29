import * as React from 'react'
import styled from 'styled-components/native'

const Wrapper = styled.TouchableOpacity`
    height: 40px;
    border-radius: 20px;
    flex-direction: row;
    border: 1px solid white;
    padding-horizontal: 20px;
    align-items: center;
    justify-content: center;
`
const Icon = styled.Image`
    resize-mode: contain;
    width: 22px;
    height: 22px;
    margin-right: 7px;
`
const Title = styled.Text`
    font-size: 16px;
`

interface Props {
    icon?: any,
    title?: string,
    onClick?: any,
    isOutline?: boolean,
    color?: string,
    bgColor?: string,
    borderColor?: string,
    iconColor?: string
    style?: any,
    iconStyle?: any,
    textStyle?: any
}

const OIconButton = (props: Props) => {
    return (
        <Wrapper
            onPress={props.onClick}
            style={{
                borderColor: props.borderColor,
                backgroundColor: props.isOutline ? 'white' : props.bgColor,
                ...props.style
            }}
        >
            <Icon
                source={props.icon}
                style={{
                    tintColor: props.iconColor,
                    ...props.iconStyle
                }}
            />
            <Title style={{
                    color: props.color,
                    ...props.textStyle
                }}
            >
                {props.title}
            </Title>
        </Wrapper>
    )
}

OIconButton.defaultProps = {

}

export default OIconButton;