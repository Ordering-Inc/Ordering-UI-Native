import * as React from 'react';
import { Platform, View, Text } from "react-native";
import styled from 'styled-components/native'
import LoginForm from '../components/LoginForm';
import { colors } from '../theme';
//@ts-ignore
// import { LoginForm } from 'ordering-components/_modules/native';

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

export const TestForm = () => {
    return(
        <View style={{backgroundColor: 'red', height: 100, flex: 1}}>
            <Text>{'Ok this is test'}</Text>
        </View>
    )
}

const Login = ({ navigation }: any) => {
    
    const register = () => {
        alert('This is test register button');
    }
    const forgot = () => {
        navigation.navigate('Forgot');
    }

    return (
        <BgWrapper
            source={ bgImage }>

            <KeyboardView enabled behavior={ Platform.OS === 'ios'? "padding" : "height"}>
                <LoginWrapper>
                    {/* <LoginForm UIcomponent={TestForm} /> */}
                    <LoginForm
                        navigation={navigation}
                        title="Welcome to login!"
                        subTitle="Let's start your delivery orders!"
                        wrapperStyle={{padding: 20}}
                        border="1px solid"
                        borderRadius="20px"
                        backgroundColor={colors.secondary}
                        loginButtonText="Login"
                        registerButtonText="Register"
                        forgotButtonText="Forgot password?"
                        onForgot={forgot}
                        loginButtonBackground={colors.primary}/>
                </LoginWrapper>
            </KeyboardView>

        </BgWrapper>
    )
}

export default Login;