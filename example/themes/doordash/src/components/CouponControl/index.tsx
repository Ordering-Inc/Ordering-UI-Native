import React, { useEffect } from 'react';
import { StyleSheet, Alert, Text, Platform } from 'react-native';
import { CouponControl as CouponController, useLanguage } from 'ordering-components/native';

import {
  CContainer,
  CCWrapper,
  CCButton
} from './styles';
import { useTheme } from 'styled-components/native';
import { OInput, OButton, OAlert, OText } from '../shared';

const CouponControlUI = (props: any) => {
  const {
    couponDefault,
    couponInput,
    handleButtonApplyClick,
    handleRemoveCouponClick,
    onChangeInputCoupon,
    confirm,
    setConfirm
  } = props

  const [, t] = useLanguage()
  const theme = useTheme();
  const styles = StyleSheet.create({
    inputsStyle: {
      borderRadius: 7.6,
      flex: 1,
      marginRight: 14,
      height: 40,
      flexBasis: '70%',
      borderWidth: 0,
      backgroundColor: theme.colors.inputDisabled,
      lineHeight: Platform.OS == 'android' ? 70 : 16,
      textAlign: 'right'
    },
  });

  const handleOnAccept = () => {
    if (!confirm.error) {
      handleRemoveCouponClick && handleRemoveCouponClick()
    }
    onChangeInputCoupon('')
  }

  const cleanSetConfirm = () => {
    setConfirm({ ...confirm, open: false, error: false })
  }

  useEffect(() => {
    if (confirm.content) {
      Alert.alert(
        t('COUPON_ERROR', 'Coupon Error'),
        confirm.content[0],
        [
          {
            text: t('CANCEL', 'cancel'),
            onPress: () => cleanSetConfirm(),
            style: 'cancel'
          },
          {
            text: t('ACCEPT', 'Accept'),
            onPress: () => cleanSetConfirm()
          }
        ],
        { cancelable: false }
      )
    }
  }, [confirm])

  return (
    <CContainer>
      {couponDefault ? (
        <OAlert
          title={t('REMOVE_COUPON', 'Remove Coupon')}
          message={t('QUESTION_DELETE_COUPON', 'Are you sure that you want to delete the coupon?')}
          onAccept={() => handleOnAccept()}
        >
          <CCButton>
            <OText
              size={12}
              color={theme.colors.white}
              style={{ textAlign: 'center' }}
            >
              {`${t('REMOVE_COUPON', 'Remove Coupon')} ${couponDefault}`}
            </OText>
          </CCButton>
        </OAlert>
      ) : (
        <CCWrapper>
          <OInput
            placeholder={t('DISCOUNT_COUPON', 'Discount coupon')}
            onChange={(e: any) => onChangeInputCoupon(e)}
            style={styles.inputsStyle}
            inputStyle={{padding: 0}}
          />
          <OButton
            onClick={() => handleButtonApplyClick()}
            bgColor={theme.colors.primary}
            borderColor={theme.colors.primary}
            textStyle={{ color: theme.colors.white, fontSize: 14, fontWeight: '600' }}
            imgRightSrc={null}
            text={t('APPLY', 'Apply')}
            isDisabled={!couponInput}
            style={{ height: 40, shadowOpacity: 0, maxWidth: 105, paddingHorizontal: 10 }}
          />
        </CCWrapper>
      )}
    </CContainer>
  )
}

export const CouponControl = (props: any) => {
  const couponProp = {
    ...props,
    UIComponent: CouponControlUI
  }
  return (
    <CouponController {...couponProp} />
  )
}
