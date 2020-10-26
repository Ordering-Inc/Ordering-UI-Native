import * as React from 'react';
import { Platform } from "react-native";
import styled from 'styled-components/native'
// @ts-ignore
// import { LoginForm } from 'ordering-login-form';
import LoginForm from '../components/LoginForm'

const BgWrapper = styled.ImageBackground`
  flex: 1;
`
const LoginWrapper = styled.View`
  flex: 1;
  justify-content: flex-end;
  margin-bottom: 0;
`
const KeyboardView = styled.KeyboardAvoidingView`
  flex-grow: 1;
`

export const bgImage = require('../assets/images/home_bg.png'); 
export const bdRadius = { topRight: '20px', topLeft: '20px', bottomRigt: '0px', bottomLeft: '0px'}

const Login = ({ navigation }: any) => {

    let login = () => {
        navigation.navigate('RecieveOrder', { is_online: false });
    }
    let register = () => {
        alert('This is test register button');
    }
    let forgot = () => {
        navigation.navigate('Forgot');
    }

    return (
        <BgWrapper
            source={ bgImage }>

            <KeyboardView enabled behavior={ Platform.OS === 'ios'? "padding" : "height"}>
                <LoginWrapper>
                    <LoginForm
                        title="Welcome to login!"
                        subTitle="Let's start your delivery orders!"
                        padding="10% 5%"
                        border="1px solid"
                        borderRadius="20px"
                        backgroundColor="#11142C"
                        loginButtonText="Login"
                        registerButtonText="Register"
                        forgotButtonText="Forgot password?"
                        onLogin={login}
                        onForgot={forgot}
                        loginButtonBackground="#06B7AE"/>
                </LoginWrapper>
            </KeyboardView>

        </BgWrapper>
    )
}

export default Login;