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

  const stripeTokenHandler = async (tokenId: string, user: any, businessId: string) => {
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
      onNewCard && onNewCard(response.result);
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

    if (!stripe) {
      setState({
        ...state,
        error: t('STRIPE_LOAD_ERROR', 'Faile to load Stripe properly')
      })
      return
    }

    setState({ ...state, loading: true });

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
      if (handleSource) {
        handleSource && handleSource({
          id: paymentMethod?.id,
          type: 'card',
          card: {
            brand: paymentMethod?.card?.brand,
            last4: paymentMethod?.card?.last4
          }
        })
        return
      }
      toSave && stripeTokenHandler(paymentMethod?.id, user, props.businessId);
    } catch (e) {
      setState({
        ...state,
        loading: false,
        error: e?.toString() || e?.message.toString()
      })
    }
    setState({ ...state, loading: false });
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
