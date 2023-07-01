import React, { useEffect } from 'react'
import { StyleSheet, Platform, Alert } from 'react-native';
import { useLanguage, SendGiftCard as SendGiftCardController  } from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { OText, OButton, OInput } from '../../shared';
import { useForm, Controller } from 'react-hook-form'

import {
  Container,
  FormController
} from './styles'


const SendGiftCardUI = (props: any) => {
  const {
    actionState,
    handleSendGiftCard
  } = props

  const theme = useTheme()
  const [, t] = useLanguage()

  const { handleSubmit, control, errors } = useForm()

  const style = StyleSheet.create({
    btnStyle: {
      borderRadius: 7.6,
      height: 44,
      marginTop: 20
    },
    inputStyle: {
			borderWidth: 1,
			borderColor: theme.colors.border,
			borderRadius: 7.6,
		},
  })

  const onSubmit = (values) => {
    handleSendGiftCard(values)
  }

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const list = Object.values(errors)
      let stringError = ''
      list.map((item: any, i: number) => {
        stringError += (i + 1) === list.length ? `- ${item.message}` : `- ${item.message}\n`
      })
      Alert.alert(
        t('ERROR', 'Error'),
        stringError,
        [
          { text: t('OK', 'oK'), onPress: () => {} }
        ]
      )
    }
  }, [errors])

  return (
    <Container>
      <OText color={theme.colors.textNormal} size={20} mBottom={10} style={{ fontWeight: Platform.OS == 'ios' ? '600' : 'bold' }}>{t('GIFT_CARD_DETAILS', 'Gift Card details')}</OText>
      <FormController>
        <OText color={theme.colors.textNormal} size={14} mBottom={10}>{t('TO', 'To')}</OText>
        <Controller
          control={control}
          render={({ onChange, value }: any) => (
            <OInput
              placeholder={t('ENTER_AN_EMAIL', 'Enter an email')}
              value={value}
              onChange={(val: any) => onChange(val)}
              autoCompleteType='email'
              autoCapitalize='none'
              autoCorrect={false}
              type='email-address'
              blurOnSubmit={false}
              style={style.inputStyle}
            />
          )}
          name='email'
          rules={{
            required: t('VALIDATION_ERROR_REQUIRED', 'To email is required').replace('_attribute_', t('EMAIL', 'EMail'))
          }}
          defaultValue=""
        />
      </FormController>
      <FormController>
        <OText color={theme.colors.textNormal} size={14} mBottom={10}>{t('NAME', 'Name')}</OText>
        <Controller
          control={control}
          render={({ onChange, value }: any) => (
            <OInput
              placeholder={t('WRITE_A_NAME', 'Write a name')}
              value={value}
              onChange={(val: any) => onChange(val)}
              autoCapitalize='none'
              autoCorrect={false}
              blurOnSubmit={false}
              style={style.inputStyle}
            />
          )}
          name='user_name'
          defaultValue=""
        />
      </FormController>
      <FormController>
        <OText color={theme.colors.textNormal} size={14} mBottom={10}>{t('TITLE', 'Title')}</OText>
        <Controller
          control={control}
          render={({ onChange, value }: any) => (
            <OInput
              placeholder={t('TITLE', 'Title')}
              value={value}
              onChange={(val: any) => onChange(val)}
              autoCapitalize='none'
              autoCorrect={false}
              blurOnSubmit={false}
              style={style.inputStyle}
            />
          )}
          name='title'
          defaultValue=""
        />
      </FormController>
      <FormController>
        <OText color={theme.colors.textNormal} size={14} mBottom={10}>{t('MESSAGES', 'Messages')}</OText>
        <Controller
          control={control}
          render={({ onChange, value }: any) => (
            <OInput
              multiline
              placeholder={t('TYPE_YOUR_MESSAGE_HERE', 'Type your message here')}
              value={value}
              onChange={(val: any) => onChange(val)}
              autoCapitalize='none'
              autoCorrect={false}
              blurOnSubmit={false}
              style={{ ...style.inputStyle, height: 100, alignItems: 'flex-start', }}
            />
          )}
          name='message'
          defaultValue=""
        />
      </FormController>
      <OButton
        onClick={handleSubmit(onSubmit)}
        text={actionState?.loading ? t('LOADING', 'Loading') : t('SEND_GIFT_CARD', 'Send gift card')}
        bgColor={theme.colors.primary}
        borderColor={theme.colors.primary}
        textStyle={{ color: 'white', fontSize: 13 }}
        imgRightSrc={null}
        style={style.btnStyle}
        isDisabled={actionState.loading}
      />
    </Container>
  )
}

export const SendGiftCard = (props: any) => {
  const sendGiftCardProps = {
    ...props,
    showToastMsg: true,
    UIComponent: SendGiftCardUI
  }
  return <SendGiftCardController {...sendGiftCardProps} />
}
