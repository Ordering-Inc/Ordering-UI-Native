import React, { useEffect } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { CouponControl as CouponController, useLanguage } from 'ordering-components/native';
import { CContainer, CCWrapper, CCButton } from './styles';
import { OInput, OButton, OAlert, OText } from '../shared';
import { colors } from '../../theme';

const CouponControlUI = props => {
  const {
    couponDefault,
    couponInput,
    handleButtonApplyClick,
    handleRemoveCouponClick,
    onChangeInputCoupon,
    confirm,
    setConfirm
  } = props;
  const [, t] = useLanguage();

  const handleOnAccept = () => {
    if (!confirm.error) {
      handleRemoveCouponClick && handleRemoveCouponClick();
    }

    onChangeInputCoupon('');
  };

  const cleanSetConfirm = () => {
    setConfirm({ ...confirm,
      open: false,
      error: false
    });
  };

  useEffect(() => {
    if (confirm.content) {
      Alert.alert(t('COUPON_ERROR', 'Coupon Error'), confirm.content[0], [{
        text: t('CANCEL', 'cancel'),
        onPress: () => cleanSetConfirm(),
        style: 'cancel'
      }, {
        text: t('ACCEPT', 'Accept'),
        onPress: () => cleanSetConfirm()
      }], {
        cancelable: false
      });
    }
  }, [confirm]);
  return /*#__PURE__*/React.createElement(CContainer, null, couponDefault ? /*#__PURE__*/React.createElement(OAlert, {
    title: t('REMOVE_COUPON', 'Remove Coupon'),
    message: t('QUESTION_DELETE_COUPON', 'Are you sure that you want to delete the coupon?'),
    onAccept: () => handleOnAccept()
  }, /*#__PURE__*/React.createElement(CCButton, null, /*#__PURE__*/React.createElement(OText, {
    size: 16,
    color: colors.white,
    style: {
      textAlign: 'center'
    }
  }, `${t('REMOVE_COUPON', 'Remove Coupon')} ${couponDefault}`))) : /*#__PURE__*/React.createElement(CCWrapper, null, /*#__PURE__*/React.createElement(OInput, {
    placeholder: t('DISCOUNT_COUPON', 'Discount coupon'),
    onChange: e => onChangeInputCoupon(e),
    style: styles.inputsStyle
  }), /*#__PURE__*/React.createElement(OButton, {
    onClick: () => handleButtonApplyClick(),
    bgColor: colors.primary,
    borderColor: colors.primary,
    textStyle: {
      color: 'white'
    },
    imgRightSrc: null,
    text: t('APPLY', 'Apply'),
    isDisabled: !couponInput
  })));
};

const styles = StyleSheet.create({
  inputsStyle: {
    borderColor: colors.secundaryContrast,
    borderRadius: 50,
    flex: 1,
    marginRight: 30
  }
});
export const CouponControl = props => {
  const couponProp = { ...props,
    UIComponent: CouponControlUI
  };
  return /*#__PURE__*/React.createElement(CouponController, couponProp);
};
//# sourceMappingURL=index.js.map