import React, { useEffect, useState } from 'react';
import { useApi, useSession } from 'ordering-components/native';

export const StripeElementsForm = (props: any) => {
  const {
    UIComponent,
    toSave
  } = props;

  const [ordering] = useApi();
  const [{ token }] = useSession();
  const [state, setState] = useState({ loading: false, error: null, requirements: null });

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

  useEffect(() => {
    if (!token) return
    toSave && getRequirements()
  }, [token])

  return <UIComponent {...props} values={state} />
}
