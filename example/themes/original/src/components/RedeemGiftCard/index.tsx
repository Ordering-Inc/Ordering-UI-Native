import React, { useEffect } from 'react'
import {
  useLanguage, useUtils, RedeemGiftCard as RedeemGiftCardController
} from 'ordering-components/native'
import { useForm, Controller } from 'react-hook-form'
import { StyleSheet, View, Alert } from 'react-native';
import { useTheme } from 'styled-components/native';
import { OText, OButton, OInput } from '../shared';

import {
  Container,
  FormController
} from './styles'

const RedeemGiftCardUI = (props: any) => {
  const {
    actionState,
    redeemedGiftCard,
    handleApply,
    onClose,
    setRedeemedGiftCard
  } = props

  const theme = useTheme()
  const [, t] = useLanguage()
  const { handleSubmit, control, errors } = useForm()
  const [{ parsePrice }] = useUtils()

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
    handleApply(values)
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

  useEffect(() => {
    if (!actionState.error) return
    let stringError = ''
    if (typeof actionState.error === 'string') {
      stringError = actionState.error
    } else {
      actionState.error.map(item => {
        stringError += `- ${item}\n`
      })
    }
    Alert.alert(
      t('ERROR', 'Error'),
      stringError,
      [
        { text: t('OK', 'oK'), onPress: () => {} }
      ]
    )
  }, [actionState.error])

  return (
    <Container>
      {!redeemedGiftCard ? (
        <View>
          <OText color={theme.colors.textNormal} weight='bold' size={20} mBottom={40}>{t('REDEEM_GIFT_CARD', 'Redeem a gift card')}</OText>
          <FormController>
            <OText color={theme.colors.textNormal} size={14} mBottom={10}>{t('GIFT_CARD_CODE', 'Gift card code')}</OText>
            <Controller
              control={control}
              render={({ onChange, value }: any) => (
              <OInput
                placeholder='0000 0000'
                value={value}
                onChange={(val: any) => onChange(val)}
                autoCapitalize='none'
                autoCorrect={false}
                blurOnSubmit={false}
                style={style.inputStyle}
              />
              )}
              name='code'
              rules={{
                required: t('VALIDATION_ERROR_REQUIRED', 'Code is required').replace('_attribute_', t('CODE', 'Code'))
              }}
              defaultValue=""
            />
          </FormController>
          <FormController>
            <OText color={theme.colors.textNormal} size={14} mBottom={10}>{t('PASSWORD', 'Password')}</OText>
            <Controller
              control={control}
              render={({ onChange, value }: any) => (
                <OInput
                  isSecured
                  placeholder={t('PASSWORD', 'Password')}
                  value={value}
                  onChange={(val: any) => onChange(val)}
                  autoCapitalize='none'
                  autoCompleteType='password'
                  autoCorrect={false}
                  blurOnSubmit={false}
                  style={style.inputStyle}
                />
              )}
              name='password'
              rules={{
                required: t('VALIDATION_ERROR_REQUIRED', 'Password is required').replace('_attribute_', t('PASSWORD', 'Password'))
              }}
              defaultValue=""
            />
          </FormController>
          <OButton
            onClick={handleSubmit(onSubmit)}
            text={actionState?.loading ? t('LOADING', 'Loading') : t('APPLY_TO_YOUR_BALANCE', 'Apply to your balance')}
            bgColor={theme.colors.primary}
            borderColor={theme.colors.primary}
            textStyle={{ color: 'white', fontSize: 13 }}
            imgRightSrc={null}
            style={style.btnStyle}
            isDisabled={actionState.loading}
          />
        </View>
      ) : (
        <>
          <OText color={theme.colors.textNormal} weight='bold' size={20} mBottom={40}>{t('GIFT_CARD', 'Gift card')}</OText>
          <View>
            <OText color={theme.colors.textNormal} size={14} mBottom={6}>{t('TYPE', 'Type')}: {redeemedGiftCard?.type}</OText>
            <OText color={theme.colors.textNormal} size={14} mBottom={6}>{t('AMOUNT', 'Amount')}: {parsePrice(redeemedGiftCard?.amount)}</OText>
            <OText color={theme.colors.textNormal} size={14} mBottom={6}>{t('FROM', 'From')}: {redeemedGiftCard?.receiver?.name} {redeemedGiftCard?.receiver?.lastname}</OText>
            <OText color={theme.colors.textNormal} size={14} mBottom={6}>{t('TITLE', 'Title')}: {redeemedGiftCard?.title}</OText>
            <OText color={theme.colors.textNormal} size={14} mBottom={6}>{t('MESSAGES', 'Messages')}: {redeemedGiftCard?.message}</OText>
            <OButton
              onClick={() => {
                setRedeemedGiftCard(null)
                onClose()
              }}
              text={t('OK', 'Ok')}
              bgColor={theme.colors.primary}
              borderColor={theme.colors.primary}
              textStyle={{ color: 'white', fontSize: 13 }}
              imgRightSrc={null}
              style={style.btnStyle}
            />
          </View>
        </>
      )}
    </Container>
  )
}

export const RedeemGiftCard = (props: any) => {
  const redeemGiftCardProps = {
    ...props,
    UIComponent: RedeemGiftCardUI
  }
  return <RedeemGiftCardController {...redeemGiftCardProps} />
}
