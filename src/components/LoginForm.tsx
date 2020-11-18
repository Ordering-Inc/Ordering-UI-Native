import * as React from 'react';
import { ViewStyle } from 'react-native';
import styled from 'styled-components/native';
import { IMAGES } from '../config/constants';
import ApiProvider from '../providers/ApiProvider';
import { ToastType, useToast } from '../providers/ToastProvider';
import { colors } from  '../theme';
import { OText, OButton, OInput } from './shared';
import Spinner from 'react-native-loading-spinner-overlay'

export interface ViewInterface {
    navigation?: any,
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

const LoginForm = (props: ViewInterface) => {

    const ordering = ApiProvider();
    const { showToast } = useToast();

    const auth = {
        email: '',
        password: ''
    }

    const [email, onChangEmail] = React.useState(auth.email)
    const [password, onChangPassword] = React.useState(auth.password)
    const [is_loading, setLoading] = React.useState(false)

    React.useEffect(() => {
        onChangEmail(email.toLowerCase().trim());
    }, [email])

    const onLogin = () => {
        if (email.length == 0 || password.length == 0) {
            showToast(ToastType.Info, `Email and Password fields are required.`)
            return
        }
        setLoading(true)
        ordering.users().auth({email: email, password: password})
        .then((res: any) => {
            console.log(res.response.data)
            let resp = res.response.data;
            if (!resp.error) {
                props.navigation.navigate('Home');
            } else {
                var err = ''
                resp.result.map((e: string, index: number) => {
                    err += e + ((index < resp.result.length - 1) ? '\n' : '');
                })
                showToast(ToastType.Error, err)
            }
            setLoading(false)
        })
        .catch(err => {
            setLoading(false)
            console.log(err)
        });
    }
    
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
            <Spinner 
                visible={is_loading}
            />
            { title }
            { sub_title }
            <OInput 
                placeholder={'Email'}
                style={{marginBottom: 10}}
                icon={IMAGES.email}
                value={email}
                onChange={(e:any) => onChangEmail(e)}
                />
            <OInput 
                isSecured={true}
                placeholder={'Password'}
                style={{marginBottom: 25}}
                icon={IMAGES.lock}
                value={password}
                onChange={(p:any) => onChangPassword(p)}
                />
            <OButton 
                onClick={onLogin}
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