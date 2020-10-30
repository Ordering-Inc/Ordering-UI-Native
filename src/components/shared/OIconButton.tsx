import * as React from 'react'
import { ViewStyle } from 'react-native'
import styled from 'styled-components/native'
import { colors } from '../../theme'

const Wrapper = styled.TouchableOpacity`
    height: 40px;
    border-radius: 20px;
    flex-direction: row;
    border: 1px solid white;
    padding-horizontal: 20px;
    align-items: center;
    justify-content: center;
`
const DisabledWrapper = styled.View`
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
`
const Title = styled.Text`
    font-size: 16px;
    margin-horizontal: 7px;
`

interface Props {
    icon?: any,
    title?: string,
    onClick?: any,
    height?: number,
    isOutline?: boolean,
    disabled?: boolean,
    color?: string,
    bgColor?: string,
    borderColor?: string,
    textColor?: string,
    iconColor?: string
    style?: ViewStyle,
    iconStyle?: any,
    textStyle?: any
}

const OIconButton = (props: Props) => {
    return (
        <>
        {!props.disabled ? (
            <Wrapper
                onPress={props.onClick}
                style={{
                    borderColor: props.borderColor || props.color,
                    backgroundColor: props.isOutline ? 'white' : props.bgColor || props.color,
                    height: props.height || 40,
                    borderRadius: props.height ? props.height * 0.5 : 20,
                    ...props.style
                }}
            >
                {props.icon ? (
                    <Icon
                        source={props.icon}
                        style={{
                            tintColor: props.iconColor,
                            ...props.iconStyle
                        }}
                    />
                ) : null}
                {props.title ? (
                    <Title style={{
                            color: props.textColor || props.color,
                            ...props.textStyle
                        }}
                    >
                        {props.title}
                    </Title>
                ) : null}
            </Wrapper>
        ) : (
            <DisabledWrapper
                style={{
                    borderColor: colors.backgroundDark,
                    backgroundColor: colors.backgroundDark,
                    height: props.height || 40,
                    borderRadius: props.height ? props.height * 0.5 : 20,
                    ...props.style
                }}
            >
                {props.icon ? (
                    <Icon
                        source={props.icon}
                        style={{
                            tintColor: props.iconColor,
                            ...props.iconStyle
                        }}
                    />
                ) : null}
                {props.title ? (
                    <Title style={{
                            color: props.textColor || props.color,
                            ...props.textStyle
                        }}
                    >
                        {props.title}
                    </Title>
                ) : null}
            </DisabledWrapper>
        )}
        </>
    )
}

OIconButton.defaultProps = {

}

export default OIconButton;