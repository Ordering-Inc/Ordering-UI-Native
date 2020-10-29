import * as React from 'react'
import { ImageSourcePropType, ImageStyle, ViewStyle } from 'react-native'
import styled from 'styled-components/native'
import { OIcon } from '.'
import { Theme } from '../../theme'

const Wrapper = styled.View`
    background-color: ${({ theme }): string => theme.background};
    border-radius: 25px;
    border-width: 1px;
    padding: 10px 20px;
    flex-direction: row;
    align-items: center;
`
const Input = styled.TextInput`
    flex-grow: 1;
    min-height: 30px;
    font-size: 15px;
    font-family: 'Poppins-Regular';
    margin-horizontal: 10px;
`
const StyledImage = styled.Image`
    margin-right: 10px;
    width: 20px;
    height: 20px;
    resize-mode: contain;
`

interface Props {
    bgColor?: string,
    borderColor?: string,
    isDisabled?: boolean,
    isSecured?: boolean,
    theme?: Theme,
    style?: ViewStyle,
    placeholder?: string,
    icon?: ImageSourcePropType,
    iconColor?: string,
    iconStyle?: ImageStyle
}

const OInput = (props: Props): React.ReactElement => {
    return (
        <Wrapper
            style={
                { 
                    backgroundColor: props.bgColor,
                    borderColor: props.borderColor, 
                    ...props.style 
                }
            }
        >
            {props.icon
                ? (<OIcon src={props.icon} color={props.iconColor} width={20} height={20} />)
                : null
            }
            <Input
                secureTextEntry={props.isSecured}
                placeholder={props.placeholder ? props.placeholder : ''} />
        </Wrapper>
    )
}

OInput.defaultProps = {
    iconColor: '#959595',
    bgColor: 'white',
    borderColor: 'white'
}

export default OInput;