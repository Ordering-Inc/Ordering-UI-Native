import React, { useEffect } from 'react';
import { StyleSheet, Alert, Text } from 'react-native';
import { CouponControl as CouponController, useLanguage } from 'ordering-components/native';

import {
  CContainer,
  CCWrapper,
  CCButton
} from './styles';

import { OInput, OButton, OAlert, OText } from '../shared';
import { colors } from '../../theme.json';

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
              color={colors.white}
              style={{ textAlign: 'center' }}
            >
              {`${t('REMOVE_COUPON', 'Remove Coupon')} ${couponDefault}`}
            </OText>
          </CCButton>
        </OAlert>
      ) : (
        <CCWrapper>
          <OInput
            placeholder={t('HAVE_PROMO_CODE', 'Do you have a promo code?')}
            onChange={(e: any) => onChangeInputCoupon(e)}
            style={styles.inputsStyle}
          />
          <OButton
            onClick={() => handleButtonApplyClick()}
            bgColor={colors.primaryLight}
            borderColor={colors.primaryLight}
            textStyle={styles.textButtonApplyStyle}
            disabledTextStyle={styles.disabledTextButtonApplyStyle}
            style={styles.buttonApplyStyle}
            imgRightSrc={null}
            text={t('APPLY', 'Apply')}
            isDisabled={!couponInput}
          />
        </CCWrapper>
      )}
    </CContainer>
  )
}
const styles = StyleSheet.create({
  inputsStyle: {
    borderColor: colors.disabled,
    borderRadius: 4,
    flex: 1,
    height: 52,
    paddingEnd: 106
  },
  buttonApplyStyle: {
    position: 'absolute',
    right: 8,
    top: 0,
    marginTop: -21,
    height: 42
  },
  textButtonApplyStyle: {
    color: colors.primary,
    marginLeft: 0,
    marginRight: 0
  },
  disabledTextButtonApplyStyle: {
    color: colors.white,
    marginLeft: 0,
    marginRight: 0
  }
});

export const CouponControl = (props: any) => {
  const couponProp = {
    ...props,
    UIComponent: CouponControlUI
  }
  return (
    <CouponController {...couponProp} />
  )
}
