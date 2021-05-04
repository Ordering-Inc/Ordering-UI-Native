import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { StripeRedirectForm as StripeRedirectFormController, useSession, useLanguage } from 'ordering-components/native';
import stripe from 'tipsi-stripe';
import { FormRedirect, FormGroup } from './styles';
import { ToastType, useToast } from '../../providers/ToastProvider';
import { OButton, ODropDown, OText } from '../shared';
import { colors } from '../../theme';

const StripeRedirectFormUI = props => {
  const {
    paymethods,
    publicKey,
    handleSubmitPaymentMethod
  } = props;
  stripe.setOptions({
    publishableKey: publicKey // androidPayMode: 'test', // Android only

  });
  const {
    showToast
  } = useToast();
  const {
    control,
    handleSubmit,
    errors
  } = useForm();
  const [{
    user
  }] = useSession();
  const [, t] = useLanguage();
  const [paymentValue, setPaymentValue] = useState('-1');

  const onSubmit = values => {
    console.log('onSubmit', values); // handleSubmitPaymentMethod && handleSubmitPaymentMethod();
  };

  const handleChangeBankOption = option => {
    console.log('option', option); // setPaymentValue(option.value)
  };

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const list = Object.values(errors);
      let stringError = '';
      list.map((item, i) => {
        stringError += i + 1 === list.length ? `- ${item.message}` : `- ${item.message}\n`;
      });
      showToast(ToastType.Error, stringError);
    }
  }, [errors]);

  const handleCreateSource = async () => {
    try {
      // this.setState({ loading: true, source: null })
      const source = await stripe.createSourceWithParams({
        type: 'alipay',
        amount: 50,
        currency: 'USD',
        returnURL: 'https://www.google.com/'
      }); // this.setState({ loading: false, source })

      console.log('source', source);
    } catch (error) {
      // this.setState({ loading: false })
      console.log(error);
    }
  };

  return /*#__PURE__*/React.createElement(FormRedirect, null, /*#__PURE__*/React.createElement(FormGroup, null, /*#__PURE__*/React.createElement(OText, {
    size: 24
  }, t('SELECT_A_PAYMENT_METHOD', 'Select a payment method')), /*#__PURE__*/React.createElement(ODropDown, {
    options: paymethods,
    defaultValue: paymentValue,
    onSelect: option => handleChangeBankOption(option)
  })), /*#__PURE__*/React.createElement(OButton // text={formState.isSubmitting ? t('LOADING', 'Loading...') : t('OK', 'OK')}
  , {
    text: t('OK', 'OK'),
    bgColor: colors.primary,
    borderColor: colors.primary,
    textStyle: {
      color: 'white'
    },
    imgRightSrc: null // isDisabled={formState.isSubmitting}
    // onClick={() => handleSubmit(onSubmit)}
    ,
    onClick: () => handleCreateSource()
  }));
};

export const StripeRedirectForm = props => {
  const stripeRedirectFormProps = { ...props,
    UIComponent: StripeRedirectFormUI
  };
  return /*#__PURE__*/React.createElement(StripeRedirectFormController, stripeRedirectFormProps);
};
//# sourceMappingURL=index.js.map