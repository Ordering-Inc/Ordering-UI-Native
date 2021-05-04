function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React, { useState } from 'react';
import { useSession, useApi, useLanguage, useOrder } from 'ordering-components/native';
import stripe from 'tipsi-stripe';
export const StripeCardForm = props => {
  const {
    UIComponent,
    toSave,
    onNewCard,
    publicKey,
    requirements,
    handleSource,
    handleCustomSubmit
  } = props;
  const [{
    user
  }] = useSession();
  const [orderState] = useOrder();
  const [ordering] = useApi();
  const [, t] = useLanguage();
  stripe.setOptions({
    publishableKey: publicKey // androidPayMode: 'test', // Android only

  });
  const [state, setState] = useState({
    error: null,
    loading: false
  });

  const stripeTokenHandler = async (tokenId, user, businessId) => {
    try {
      var _user$session;

      const result = await fetch(`${ordering.root}/payments/stripe/cards`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user === null || user === void 0 ? void 0 : (_user$session = user.session) === null || _user$session === void 0 ? void 0 : _user$session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          business_id: businessId,
          gateway: 'stripe',
          token_id: tokenId,
          user_id: user === null || user === void 0 ? void 0 : user.id
        })
      });
      const response = await result.json();
      onNewCard && onNewCard(response.result);
    } catch (error) {
      setState({ ...state,
        loading: false,
        error
      });
    }
  };

  const handleSubmit = async creditCardData => {
    if (handleCustomSubmit) {
      return handleCustomSubmit(creditCardData);
    }

    if (!stripe) {
      setState({ ...state,
        error: t('STRIPE_LOAD_ERROR', 'Faile to load Stripe properly')
      });
      return;
    }

    setState({ ...state,
      loading: true
    });

    try {
      const paymentMethod = await stripe.createPaymentMethod({
        card: {
          number: creditCardData.values.number.replace(/ /g, ''),
          cvc: creditCardData.values.cvc,
          expMonth: parseInt(creditCardData.values.expiry.split('/')[0], 10),
          expYear: parseInt(creditCardData.values.expiry.split('/')[1], 10)
        },
        billingDetails: {
          name: `${user.name} ${user.lastname}`,
          email: user.email,
          address: {
            line1: orderState.options.address.address,
            postalCode: orderState.options.address.zipcode
          }
        }
      });

      if (paymentMethod !== null && paymentMethod !== void 0 && paymentMethod.error) {
        setState({ ...state,
          loading: false,
          error: paymentMethod === null || paymentMethod === void 0 ? void 0 : paymentMethod.error
        });
        return;
      }

      setState({ ...state,
        loading: false
      });

      if (handleSource) {
        var _paymentMethod$card, _paymentMethod$card2;

        handleSource && handleSource({
          id: paymentMethod === null || paymentMethod === void 0 ? void 0 : paymentMethod.id,
          type: 'card',
          card: {
            brand: paymentMethod === null || paymentMethod === void 0 ? void 0 : (_paymentMethod$card = paymentMethod.card) === null || _paymentMethod$card === void 0 ? void 0 : _paymentMethod$card.brand,
            last4: paymentMethod === null || paymentMethod === void 0 ? void 0 : (_paymentMethod$card2 = paymentMethod.card) === null || _paymentMethod$card2 === void 0 ? void 0 : _paymentMethod$card2.last4
          }
        });
        return;
      }

      toSave && stripeTokenHandler(paymentMethod === null || paymentMethod === void 0 ? void 0 : paymentMethod.id, user, props.businessId);
    } catch (e) {
      setState({ ...state,
        loading: false,
        error: (e === null || e === void 0 ? void 0 : e.toString()) || (e === null || e === void 0 ? void 0 : e.message.toString())
      });
    }

    setState({ ...state,
      loading: false
    });
  };

  return /*#__PURE__*/React.createElement(UIComponent, _extends({}, props, {
    stateCardForm: state,
    handleSubmit: handleSubmit
  }));
};
StripeCardForm.defaultProps = {
  autosave: true
};
//# sourceMappingURL=naked.js.map