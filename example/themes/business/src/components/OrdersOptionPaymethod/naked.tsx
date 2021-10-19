import React, { useEffect, useState } from 'react'
import PropTypes, { string } from 'prop-types'
// import { useApi } from '../../contexts/ApiContext'
// import { useSession } from '../../contexts/SessionContext'
import { useApi, useSession } from 'ordering-components/native'

export const PaymethodList = (props: any) => {
  const {
    paymethods,
    UIComponent
  } = props

  const [ordering] = useApi()
  const [{ token, loading }] = useSession()

  /**
   * Array to save cities
   */
  const [paymethodList, setPaymethodList] = useState({ paymethods: [], loading: true, error: null })

  /**
   * Method to get cities from API
   */
  const getPaymethods = async () => {
    if (loading) return
    try {
      setPaymethodList({ ...paymethodList, loading: true })
      const requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
      const functionFetch = `${ordering.root}/paymethods`

      const response = await fetch(functionFetch, requestOptions)
      const { error, result } = await response.json()
      if (!error) {
        setPaymethodList({
          ...paymethodList,
          loading: false,
          paymethods: result
        })
      } else {
        setPaymethodList({
          ...paymethodList,
          loading: false,
          error: result
        })
      }
    } catch (err: any) {
      setPaymethodList({
        ...paymethodList,
        loading: false,
        error: err
      })
    }
  }

  useEffect(() => {
    if (paymethods) {
      setPaymethodList({ ...paymethodList, loading: false, paymethods: paymethods })
    } else {
      getPaymethods()
    }
  }, [])

  return (
    <>
      {UIComponent && (
        <UIComponent
          {...props}
          paymethodList={paymethodList}
        />
      )}
    </>
  )
}

PaymethodList.propTypes = {
  /**
   * UI Component, this must be containt all graphic elements and use parent props
   */
  UIComponent: PropTypes.elementType,
  /**
   * Components types before my orders
   * Array of type components, the parent props will pass to these components
   */
  beforeComponents: PropTypes.arrayOf(PropTypes.elementType),
  /**
   * Components types after my orders
   * Array of type components, the parent props will pass to these components
   */
  afterComponents: PropTypes.arrayOf(PropTypes.elementType),
  /**
   * Elements before my orders
   * Array of HTML/Components elements, these components will not get the parent props
   */
  beforeElements: PropTypes.arrayOf(PropTypes.element),
  /**
   * Elements after my orders
   * Array of HTML/Components elements, these components will not get the parent props
   */
  afterElements: PropTypes.arrayOf(PropTypes.element)
}

PaymethodList.defaultProps = {
  beforeComponents: [],
  afterComponents: [],
  beforeElements: [],
  afterElements: []
}
