import * as React from 'react';
import { ViewStyle } from 'react-native';
import styled from 'styled-components/native';
import { IMAGES, STORAGE_KEY } from '../../config/constants';
import ApiProvider from '../../providers/ApiProvider';
import { ToastType, useToast } from '../../providers/ToastProvider';
import { buttonTheme } from  '../../globalStyles';
import { OText, OButton, OInput } from '../shared';
import Spinner from 'react-native-loading-spinner-overlay'
import { _setStoreData } from '../../providers/StoreUtil';
import { AuthContext, AuthContextProps } from '../../contexts/AuthContext';
import { Wrapper } from './styles';

export interface ViewInterface {
    navigation?: any,
    title?: string,
    subTitle?: string,
    backgroundColor?: string,
    wrapperStyle?: ViewStyle,
    borderRadius?: any,
    border?: string,
    placeHolderColor?: string,

    isRegister?: boolean,
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
    forgotButtonText?: string
}

const LoginForm = (props: ViewInterface) => {

    const { signIn } = React.useContext(AuthContext) as AuthContextProps;
    const api = new ApiProvider();
    
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
        api.login({email: email, password: password})
            .then((res: any) => {
                console.log(res.response.data)
                let resp = res.response.data;
                if (!resp.error) {
                    setLoading(false)
                    if (resp.result && resp.result.level == 4) {
                        _setStoreData(STORAGE_KEY.USER, resp.result);
                        const token = resp.result.session ? resp.result.session.access_token : null;
                        signIn(token);
                    } else {
                        // don't have permission
                        showToast(ToastType.Error, 'You don\'t have permission to use app.')
                    }
                } else {
                    setLoading(false)
                    var err = ''
                    resp.result.map((e: string, index: number) => {
                        err += e + ((index < resp.result.length - 1) ? '\n' : '');
                    })
                    showToast(ToastType.Error, err)
                }
            })
            .catch(err => {
                setLoading(false)
                console.log(err)
            });
    }

    const onForgot = () => {
        props.navigation.navigate('Forgot');
    }
    
    const onRegister = () => {
        
    }

    let title, sub_title, reg_button
    if (props.title) {
        title = <OText style={{fontSize: 24, color: 'white'}}>{props.title}</OText>
    }
    if (props.subTitle) {
        sub_title = <OText style={{fontSize: 16, color: 'white', marginBottom: 18}}>{ props.subTitle }</OText>
    }
    if (props.isRegister) {
        reg_button = (
            <OButton 
                onClick={onRegister}
                text={props.registerButtonText}
                bgColor={props.registerButtonBackground}
                borderColor={props.registerButtonBorderColor}
                textStyle={{color: buttonTheme.fontColor}}
                style={{marginBottom: 15}}
            />
        )
    }
    return (
        <Wrapper 
            style={{
                ...props.wrapperStyle, 
                backgroundColor: props.backgroundColor,
                borderRadius: props.borderRadius || 0
                }}>
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
                textStyle={{color: buttonTheme.fontColor}}
                style={{marginBottom: 14}}
                />
            { reg_button }
            <OButton 
                onClick={onForgot}
                text={props.forgotButtonText}
                bgColor={buttonTheme.backgroundClear}
                borderColor={buttonTheme.backgroundClear}
                textStyle={{color: buttonTheme.fontColor}}
                imgRightSrc={null}
            />
        </Wrapper>
    );
};

export default LoginForm;