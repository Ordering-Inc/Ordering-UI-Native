import React, { useState } from 'react';
import { useSession, useApi, useLanguage, useOrder } from 'ordering-components/native';
import stripe from 'tipsi-stripe';

export const StripeCardForm = (props: any) => {
  const {
    UIComponent,
    toSave,
    onNewCard,
    publicKey,
    requirements,
    handleSource,
    handleCustomSubmit
  } = props;

  const [{ user }] = useSession();
  const [orderState] = useOrder();
  const [ordering] = useApi();
  const [, t] = useLanguage();

  stripe.setOptions({
    publishableKey: publicKey,
    // androidPayMode: 'test', // Android only
  })

  const [state, setState] = useState<any>({ error: null, loading: false })

  const stripeTokenHandler = async (tokenId: any, user: any, businessId: any, cardDetails: any) => {
    try {
      const result = await fetch(`${ordering.root}/payments/stripe/cards`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user?.session?.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          business_id: businessId,
          gateway: 'stripe',
          token_id: tokenId,
          user_id: user?.id
        })
      })
      const response = await result.json();
      const obj = typeof response.result === 'string'
        ? {brand: cardDetails?.brand,
          last4: cardDetails?.last4,
          id: response.result}
        : response.result
      onNewCard && onNewCard(obj);
    } catch (error) {
      setState({
        ...state,
        loading: false,
        error
      })
    }
  }

  const handleSubmit = async (creditCardData: any) => {
    if (handleCustomSubmit) {
      return handleCustomSubmit(creditCardData);
    }
    // const card: any = {
    //   'card[number]': creditCardData.values.number.replace(/ /g, ''),
    //   'card[exp_month]': creditCardData.values.expiry.split('/')[0],
    //   'card[exp_year]': creditCardData.values.expiry.split('/')[1],
    //   'card[cvc]': creditCardData.values.cvc
    // };
    setState({ ...state, loading: true })
    if (!requirements && handleSource) {
      try {
        const paymentMethod = await stripe.createPaymentMethod({
          card: {
            number : creditCardData.values.number.replace(/ /g, ''),
            cvc : creditCardData.values.cvc,
            expMonth : parseInt(creditCardData.values.expiry.split('/')[0], 10),
            expYear : parseInt(creditCardData.values.expiry.split('/')[1], 10)
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
        if (paymentMethod?.error) {
          setState({
            ...state,
            loading: false,
            error: paymentMethod?.error
          })
          return
        }
        setState({ ...state, loading: false })
        handleSource && handleSource({
          id: paymentMethod?.id,
          type: 'card',
          card: {
            brand: paymentMethod?.card?.brand,
            last4: paymentMethod?.card?.last4
          }
        })
      } catch (e) {
        setState({
          ...state,
          loading: false,
          error: e?.toString() || e?.message.toString()
        })
      }
      return
    }
    // const response = await fetch('https://api.stripe.com/v1/tokens', {
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/x-www-form-urlencoded',
    //     Authorization: `Bearer ${publicKey}`
    //   },
    //   method: 'post',
    //   body: Object.keys(card)
    //     .map(key => key + '=' + card[key])
    //     .join('&')
    // });

    // const result = await response.json();

    if (!stripe) {
      setState({
        ...state,
        error: t('STRIPE_LOAD_ERROR', 'Faile to load Stripe properly')
      })
      return
    }
    const confirmCard = await stripe.confirmPaymentIntent(
      {
        clientSecret: requirements,
        paymentMethod: {
          card: {
            number : creditCardData.values.number.replace(/ /g, ''),
            cvc : creditCardData.values.cvc,
            expMonth : parseInt(creditCardData.values.expiry.split('/')[0], 10),
            expYear : parseInt(creditCardData.values.expiry.split('/')[1], 10)
          },
          billingDetails: {
            name: `${user.name} ${user.lastname}`,
            email: user.email,
            address: {
              line1: orderState.options.address.address,
              postalCode: orderState.options.address.zipcode
            }
          }
        }
      }
    );

    if (confirmCard?.error) {
      setState({
        ...state,
        loading: false,
        error: confirmCard?.error
      })
      return
    }
    setState({ ...state, loading: false })
    console.log('confirmCard', confirmCard);
    // toSave && stripeTokenHandler(confirmCard?.id, user, props.businessId, confirmCard?.card);
  };

  return (
    <UIComponent
      {...props}
      stateCardForm={state}
      handleSubmit={handleSubmit}
    />
  )
}

StripeCardForm.defaultProps = {
  autosave: true
}
