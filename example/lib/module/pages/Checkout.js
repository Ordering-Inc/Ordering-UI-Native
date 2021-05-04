import React from 'react';
import { Checkout } from '../components/Checkout';
import { Container } from '../layouts/Container';
import stripe from 'tipsi-stripe';
import { ToastType, useToast } from '../providers/ToastProvider';
import { useOrder, useLanguage } from 'ordering-components/native';
const stripePaymentOptions = ['stripe', 'stripe_direct', 'stripe_connect'];
export const CheckoutPage = props => {
  var _props$route, _props$route$params;

  const {
    showToast
  } = useToast();
  const [, t] = useLanguage();
  const [, {
    confirmCart
  }] = useOrder();
  const checkoutProps = { ...props,
    cartUuid: (props === null || props === void 0 ? void 0 : props.cartUuid) || ((_props$route = props.route) === null || _props$route === void 0 ? void 0 : (_props$route$params = _props$route.params) === null || _props$route$params === void 0 ? void 0 : _props$route$params.cartUuid),
    driverTipsOptions: [0, 10, 15, 20, 25],
    stripePaymentOptions,
    onPlaceOrderClick: async (data, paymethod, cart) => {
      var _cart$order;

      if (cart !== null && cart !== void 0 && (_cart$order = cart.order) !== null && _cart$order !== void 0 && _cart$order.uuid) {
        var _cart$order2;

        props.navigation.navigate('OrderDetails', {
          orderId: (_cart$order2 = cart.order) === null || _cart$order2 === void 0 ? void 0 : _cart$order2.uuid,
          isFromCheckout: true
        });
        return;
      }

      if ((cart === null || cart === void 0 ? void 0 : cart.status) === 2 && stripePaymentOptions.includes(paymethod === null || paymethod === void 0 ? void 0 : paymethod.gateway)) {
        var _cart$paymethod_data, _cart$paymethod_data$, _cart$paymethod_data2, _cart$paymethod_data3, _paymethod$paymethod, _paymethod$paymethod$, _paymethod$paymethod2, _paymethod$paymethod3;

        const clientSecret = cart === null || cart === void 0 ? void 0 : (_cart$paymethod_data = cart.paymethod_data) === null || _cart$paymethod_data === void 0 ? void 0 : (_cart$paymethod_data$ = _cart$paymethod_data.result) === null || _cart$paymethod_data$ === void 0 ? void 0 : _cart$paymethod_data$.client_secret;
        const paymentMethodId = (_cart$paymethod_data2 = cart.paymethod_data) === null || _cart$paymethod_data2 === void 0 ? void 0 : (_cart$paymethod_data3 = _cart$paymethod_data2.data) === null || _cart$paymethod_data3 === void 0 ? void 0 : _cart$paymethod_data3.source_id;
        const publicKey = (paymethod === null || paymethod === void 0 ? void 0 : paymethod.gateway) === 'stripe_connect' ? paymethod === null || paymethod === void 0 ? void 0 : (_paymethod$paymethod = paymethod.paymethod) === null || _paymethod$paymethod === void 0 ? void 0 : (_paymethod$paymethod$ = _paymethod$paymethod.credentials) === null || _paymethod$paymethod$ === void 0 ? void 0 : _paymethod$paymethod$.stripe.publishable : paymethod === null || paymethod === void 0 ? void 0 : (_paymethod$paymethod2 = paymethod.paymethod) === null || _paymethod$paymethod2 === void 0 ? void 0 : (_paymethod$paymethod3 = _paymethod$paymethod2.credentials) === null || _paymethod$paymethod3 === void 0 ? void 0 : _paymethod$paymethod3.publishable;
        stripe.setOptions({
          publishableKey: publicKey
        });

        try {
          const confirmPaymentIntent = await stripe.confirmPaymentIntent({
            clientSecret,
            paymentMethodId
          });

          if ((confirmPaymentIntent === null || confirmPaymentIntent === void 0 ? void 0 : confirmPaymentIntent.status) === 'succeeded') {
            props.handleIsRedirect && props.handleIsRedirect(true);

            try {
              var _confirmCartRes$resul;

              const confirmCartRes = await confirmCart(cart === null || cart === void 0 ? void 0 : cart.uuid);

              if (confirmCartRes.error) {
                showToast(ToastType.Error, confirmCartRes.error.message);
              }

              if ((_confirmCartRes$resul = confirmCartRes.result.order) !== null && _confirmCartRes$resul !== void 0 && _confirmCartRes$resul.uuid) {
                props.navigation.navigate('HomeNavigator', {
                  screen: 'OrderDetails',
                  params: {
                    orderId: confirmCartRes.result.order.uuid,
                    isFromCheckout: true
                  }
                });
              }
            } catch (error) {
              showToast(ToastType.Error, (error === null || error === void 0 ? void 0 : error.toString()) || error.message);
            }

            return;
          }
        } catch (error) {
          const e = error.message === 'failed' ? t('FAILED_PAYMENT', 'The payment has failed') : (error === null || error === void 0 ? void 0 : error.toString()) || error.message;
          showToast(ToastType.Error, e);
        }
      }
    },
    onNavigationRedirect: (page, params) => {
      if (!page) return;
      props.navigation.navigate(page, params);
    }
  };
  return /*#__PURE__*/React.createElement(Container, {
    nopadding: true
  }, /*#__PURE__*/React.createElement(Checkout, checkoutProps));
};
export default CheckoutPage;
//# sourceMappingURL=Checkout.js.map