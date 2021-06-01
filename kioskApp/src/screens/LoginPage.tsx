import React from 'react'
import { Dimensions, Pressable, StyleSheet, View } from 'react-native'
import { useForm, Controller } from 'react-hook-form';
import { Container } from '../layouts/Container'
import OImage from "../components/shared/OImage"
import OText from "../components/shared/OText"
import OInput from "../components/shared/OInput"
import OButton from "../components/shared/OButton"
import { useLanguage } from "ordering-components/native";
import { colors } from '../theme.json'
import { IMAGES } from "../config/constants";

const LoginPage = () => {
  const [, t] = useLanguage()
  const {control, handleSubmit} = useForm()

  function onSubmit() {

  }

  return (
    <Container>
      <View style={{
        marginTop: 16,
        justifyContent: 'space-around',
        alignItems: 'center'
      }}>

        <OImage
          source={require('../assets/images/logo.png')}
          width={200}
          height={_dim.height * 0.1}
        />

        <View style={{
          width: _dim.width * 0.7
        }}>

          <OText
            size={20}>
            Hi There!
          </OText>

          <OText
            size={24}
            weight={'bold'}>
            Login To start
          </OText>

          <OText
            size={18}>
            You just need to login once.
          </OText>

          <Controller
            control={control}
            render={p => (
              <OInput
                placeholder={t('USER', 'User')}
                style={loginStyle.inputStyle}
                value={p.field.value}
                autoCapitalize="none"
                autoCorrect={false}
                type="email-address"
              />
            )}
            name="email"
            rules={{
              required: t(
                'VALIDATION_ERROR_EMAIL_REQUIRED',
                'The field Email is required',
              ).replace('_attribute_', t('EMAIL', 'Email')),
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: t(
                  'INVALID_ERROR_EMAIL',
                  'Invalid email address',
                ).replace('_attribute_', t('EMAIL', 'Email')),
              },
            }}
            defaultValue=""
          />

          <Controller
            control={control}
            render={p => (
              <OInput
                placeholder={t('PASSWORD', 'Password')}
                style={loginStyle.inputStyle}
                value={p.field.value}
                onChange={(val: any) => p.field.onChange(val)}
              />
            )}
            name="password"
            rules={{
              required: t(
                'VALIDATION_ERROR_PASSWORD_REQUIRED',
                'The field Password is required',
              ).replace('_attribute_', t('PASSWORD', 'Password')),
            }}
            defaultValue=""
          />

          <OButton
            onClick={handleSubmit(onSubmit)}
            text={t('LOGIN', 'Login')}
            textStyle={loginStyle.buttonTextStyle}
            style={loginStyle.buttonStyle}
            imgRightSrc={null}
          />

          <Pressable>
            <OText size={14} mBottom={18} style={loginStyle.forgotStyle}>
              {t('FORGOT_PASSWORD', 'I forgot my password')}
            </OText>
          </Pressable>

          <OText size={12} mBottom={18}>
            {t('FORGOT_PASSWORD', 'If you don\'t have and account, please contact Ordering')} {t('FORGOT_PASSWORD', 'support department')}
          </OText>

        </View>

      </View>

    </Container>
  )
}

const _dim = Dimensions.get('window')

const loginStyle = StyleSheet.create({
  btnOutline: {
    backgroundColor: '#FFF',
    color: colors.primary,
  },
  inputStyle: {
    textAlign: 'center',
    borderRadius: 6,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.disabled,
    height: 44
  },
  buttonStyle: {
    height: 44,
    marginBottom: 16
  },
  buttonTextStyle: {
    color: 'white'
  },
  forgotStyle: {
    textAlign: 'center',
    color: colors.skyBlue
  }
})

export default LoginPage
