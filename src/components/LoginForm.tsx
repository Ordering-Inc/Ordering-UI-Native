import * as React from 'react';
import { ViewStyle } from 'react-native';
import styled from 'styled-components/native';
import { colors } from  '../theme';
import { OText, OButton, OInput } from './shared'

export interface ViewInterface {
    onLogin?: any,
    title?: string,
    subTitle?: string,
    backgroundColor?: string,
    wrapperStyle?: ViewStyle,
    borderRadius?: any,
    border?: string,
    placeHolderColor?: string,
    buttonBackground?: string,
    inputMargin?: string,
    loginButtonText?: string,
    loginButtonBackground?: string,
    loginButtonBorder?: string,
    buttonBorder?: string,
    registerButtonText?: string,
    registerButtonBackground?: string,
    registerButtonBorderColor?: string,
    loginButtonBorderColor?: string,
    onRegister?: any,
    onForgot?: any,
    forgotButtonText?: string
}

export const Wrapper = styled.View<ViewInterface>`
    background-color: ${ props => props.backgroundColor };
    border: ${ props => props.border };
    border-radius: 20px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
`

export const IMAGES = {
    email: require('../assets/icons/ic_email.png'),
    lock: require('../assets/icons/ic_lock.png'),
}

const LoginForm = (props: ViewInterface) => {
    
    let title, sub_title, reg_button
    if (props.title) {
        title = <OText style={{fontSize: 24, color: 'white'}}>{props.title}</OText>
    }
    if (props.subTitle) {
        sub_title = <OText style={{fontSize: 16, color: 'white', marginBottom: 18}}>{ props.subTitle }</OText>
    }
    if (props.onRegister) {
        reg_button = (
            <OButton 
                onClick={props.onRegister}
                text={props.registerButtonText}
                bgColor={props.registerButtonBackground}
                borderColor={props.registerButtonBorderColor}
                textStyle={{color: 'white'}}
                style={{marginBottom: 15}}
            />
        )
    }
    return (
        <Wrapper 
            backgroundColor={props.backgroundColor} 
            borderRadius={ props.borderRadius || '0px' }
            style={props.wrapperStyle}
            border={ props.border }>
            { title }
            { sub_title }
            <OInput 
                placeholder={'Email'}
                style={{marginBottom: 10}}
                icon={IMAGES.email}
                />
            <OInput 
                isSecured={true}
                placeholder={'Password'}
                style={{marginBottom: 25}}
                icon={IMAGES.lock}
                />
            <OButton 
                onClick={props.onLogin}
                text={props.loginButtonText}
                bgColor={props.loginButtonBackground}
                borderColor={props.loginButtonBackground}
                textStyle={{color: 'white'}}
                style={{marginBottom: 14}}
                />
            { reg_button }
            <OButton 
                onClick={props.onForgot}
                text={props.forgotButtonText}
                bgColor={colors.clear}
                borderColor={colors.clear}
                textStyle={{color: 'white'}}
                imgRightSrc={null}
            />
        </Wrapper>
    );
};

export default LoginForm;