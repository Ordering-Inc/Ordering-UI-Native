import React, { useState } from 'react';
import { useSession, useApi, useLanguage } from 'ordering-components/native';

export const StripeCardForm = (props: any) => {
  const {
    UIComponent,
    toSave,
    onNewCard,
    publicKey,
    // requirements,
    // handleSource,
    handleCustomSubmit
  } = props;

  const [{ user }] = useSession();
  const [ordering] = useApi();
  const [, t] = useLanguage();

  const [state, setState] = useState<any>({ error: null, loading: false })

  const stripeTokenHandler = async (tokenId: any, user: any, businessId: any) => {
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
      console.log('response', response);
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
    const card: any = {
      'card[number]': creditCardData.values.number.replace(/ /g, ''),
      'card[exp_month]': creditCardData.values.expiry.split('/')[0],
      'card[exp_year]': creditCardData.values.expiry.split('/')[1],
      'card[cvc]': creditCardData.values.cvc
    };

    try {
      setState({
        ...state,
        loading: true
      })
      const response = await fetch('https://api.stripe.com/v1/tokens', {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${publicKey}`
        },
        method: 'post',
        body: Object.keys(card)
          .map(key => key + '=' + card[key])
          .join('&')
      });

      const result = await response.json();

      if (result?.error) {
        setState({
          ...state,
          loading: false,
          error: t('STRIPE_ERROR', 'Payment service error. Try again')
        })
        return
      }
      setState({
        ...state,
        loading: false
      })
      toSave && stripeTokenHandler(result?.id, user, props.businessId);
    } catch (error) {
      setState({
        ...state,
        loading: false,
        error
      })
    }
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
