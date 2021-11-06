import React, { useEffect } from 'react'
import { useEvent, useConfig } from 'ordering-components/native'
import analytics from '@react-native-firebase/analytics'

export const Analytics = (props: any) => {
  const [events] = useEvent()
  const [configState] = useConfig()

  const handleClickProduct = async (product: any) => {
    try {
      await analytics().logAddToCart({
        items: [{
          item_id: `${product.id}`,
          item_name: product.name,
          item_category: `${product.categoryId}`,
          price: product.price
        }]
      })
    } catch (err) {
      console.log(err)
    }
  }
  const handleProductAdded = async (product: any) => {
    try {
      await analytics().logAddToCart({
        items: [{
          item_id: `${product.id}`,
          item_name: product.name,
          item_category: `${product.categoryId}`,
          price: product.price,
          quantity: product.quantity
        }]
      })
    } catch (err) {
      console.log(err)
    }
  }
  const handleLogin = async (data: any) => {
    try {
      await analytics().setUserId(`${data.id}`)
      await analytics().setUserProperties({
        'name': data?.name,
        'email': data?.email,
        'level': `${data?.level}`
      });
    } catch (err) {
      console.log(err)
    }
  }
  const handleOrderPlaced = async (order: any) => {
    try {
      await analytics().logPurchase({
        transaction_id: `${order.id}`,
        affiliation: order.business?.name,
        tax: order.tax_total,
        shipping: order.delivery_zone_price,
        value: order.total,
        currency: 'USD'
      })
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
      events.on('userLogin', handleLogin)
      events.on('product_clicked', handleClickProduct)
      events.on('product_added', handleProductAdded)
      events.on('order_placed', handleOrderPlaced)
    return () => {
      events.off('userLogin', handleLogin)
      events.off('product_clicked', handleClickProduct)
      events.off('product_added', handleProductAdded)
      events.off('order_placed', handleOrderPlaced)
    }
  }, [configState])

  return (
    <>
      {props.children}
    </>
  )
}
