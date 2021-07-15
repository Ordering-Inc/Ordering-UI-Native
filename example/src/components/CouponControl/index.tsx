import React, { useEffect } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { CouponControl as CouponController, useLanguage } from 'ordering-components/native';

import {
  CContainer,
  CCWrapper,
  CCButton
} from './styles';

import { OInput, OButton, OAlert, OText } from '../shared';
import { useTheme } from 'styled-components/native';

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

  const theme = useTheme();

  const styles = StyleSheet.create({
    inputsStyle: {
      borderColor: theme.colors.secundaryContrast,
      borderRadius: 50,
      flex: 1,
      marginRight: 30
    },
  });

  const [, t] = useLanguage()

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
              size={16}
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
          />
          <OButton
            onClick={() => handleButtonApplyClick()}
            bgColor={theme.colors.primary}
            borderColor={theme.colors.primary}
            textStyle={{color: 'white'}}
            imgRightSrc={null}
            text={t('APPLY', 'Apply')}
            isDisabled={!couponInput}
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
