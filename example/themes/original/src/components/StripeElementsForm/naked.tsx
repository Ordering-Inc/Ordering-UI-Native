import React, { useEffect, useState } from 'react';
import { useApi, useSession } from 'ordering-components/native';

export const StripeElementsForm = (props: any) => {
  const {
    UIComponent,
    toSave,
    setCardsList,
    cardsList,
    handleCardClick
  } = props;

  const [ordering] = useApi();
  const [{ token }] = useSession();
  const [state, setState] = useState({ loading: false, loadingAdd: false, error: null, requirements: null });

  const getRequirements = async () => {
    try {
      setState({
        ...state,
        loading: true
      })
      const response = await fetch(
        `${ordering.root}/payments/stripe/requirements?type=add_card`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      const { result } = await response.json();
      setState({
        ...state,
        loading: false,
        requirements: result
      })
    } catch (error) {
      setState({
        ...state,
        loading: false,
        error
      })
    }
  }

  const stripeTokenHandler = async (tokenId: string, user: any, businessId: string, isNewCard: any = true) => {
    try {
      setState({
        ...state,
        loadingAdd: true
      })
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
      isNewCard && props.onSelectCard && props.onSelectCard(response.result);
      setCardsList && setCardsList({
        ...cardsList,
        cards: [
          ...cardsList.cards,
          response.result
        ]
      })
      handleCardClick(response.result)
      setState({
        ...state,
        loadingAdd: false
      })
    } catch (error) {
      setState({
        ...state,
        loadingAdd: false,
        error
      })
    }
  }

  useEffect(() => {
    if (!token || state.requirements) return
    toSave && getRequirements()
  }, [token])

  return (
    <UIComponent
      {...props}
      values={state}
      requirements={state.requirements}
      stripeTokenHandler={stripeTokenHandler}
    />
  )
}
