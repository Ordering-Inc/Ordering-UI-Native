import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
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
  const [alert, setAlert] = useState<any>({ show: false })

  const styles = StyleSheet.create({
    inputsStyle: {
      borderColor: theme.colors.secundaryContrast,
      borderRadius: 50,
      flex: 1,
      marginRight: 20
    },
  });

  const [, t] = useLanguage()

  const handleOnAccept = () => {
    if (!confirm.error) {
      handleRemoveCouponClick && handleRemoveCouponClick()
    }
    onChangeInputCoupon('')
  }

  useEffect(() => {
    if (confirm.content) {
      setAlert({
        show: true,
        title: t('COUPON_ERROR', 'Coupon Error'),
        onAccept: () => {
          handleOnAccept && handleOnAccept()
          setConfirm({ ...confirm, open: false, error: false })
          setAlert({ show: false })
        },
        onClose: () => {
          setConfirm({ ...confirm, open: false, error: false })
          setAlert({ show: false })
        },
        content: confirm.content
      })
    }
  }, [confirm])

  return (
    <CContainer>
      {couponDefault ? (
        <CCButton
          activeOpacity={1}
          onPress={() => setAlert({
            show: true,
            title: t('REMOVE_COUPON', 'Remove Coupon'),
            onAccept: () => {
              handleOnAccept && handleOnAccept()
              setAlert({ show: false })
            },
            onCancel: () => {
              setAlert({ show: false })
            },
            onClose: () => {
              setAlert({ show: false })
            },
            content: [t('QUESTION_DELETE_COUPON', 'Are you sure that you want to delete the coupon?')]
          })}
        >
          <OText
            size={16}
            color={theme.colors.white}
            style={{ textAlign: 'center' }}
          >
            {`${t('REMOVE_COUPON', 'Remove Coupon')} ${couponDefault}`}
          </OText>
        </CCButton>
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
            textStyle={{ color: 'white', fontSize: 18, maxWidth: 110, minWidth: 60 }}
            textProps={{numberOfLines: 1}}
            imgRightSrc={null}
            text={t('APPLY', 'Apply')}
            isDisabled={!couponInput}
          />
        </CCWrapper>
      )}
      <OAlert
        open={alert.show}
        title={alert.title}
        onAccept={alert.onAccept}
        onClose={alert.onClose}
        onCancel={alert.onCancel}
        content={alert.content}
      />
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
