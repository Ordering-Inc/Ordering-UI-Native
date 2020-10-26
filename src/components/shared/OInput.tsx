import * as React from 'react'
import { ImageSourcePropType, ImageStyle, ViewStyle } from 'react-native'
import styled from 'styled-components/native'
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
    min-height: 30px;
    font-size: 15px;
    font-family: 'Poppins-Regular';
    width: 100%;
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
                ? (<StyledImage style={{...props.iconStyle, tintColor: props.iconColor }} source={props.icon} />)
                : null
            }
            <Input
                secureTextEntry={props.isSecured}
                placeholder={props.placeholder ? props.placeholder : ''} />
        </Wrapper>
    )
}

OInput.defaultProps = {
    iconColor: '#f5f5f5',
    bgColor: 'white',
    borderColor: 'white'
}

export default OInput;