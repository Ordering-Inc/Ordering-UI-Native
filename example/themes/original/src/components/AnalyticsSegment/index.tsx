import React, { useEffect, useState } from 'react';
import { createClient, AnalyticsProvider } from '@segment/analytics-react-native';
import { useEvent, useConfig } from 'ordering-components/native';

export const AnalyticsSegment = (props: any) => {
  const { children } = props

  const [events] = useEvent()
  const [configState] = useConfig()
  const [segmentClient, setSegmentClient] = useState<any>({})

  const handleClickProduct = (product: any) => {
    segmentClient.track('Product Clicked', {
      id: product.id,
      name: product.name,
      category: product.category_id,
      price: product.price
    })
  }

  const handleProductAdded = (product: any) => {
    segmentClient.track('Product Added', {
      id: product.id,
      name: product.name,
      category: product.category_id,
      price: product.price,
      quantity: product.quantity
    })
  }

  const handleProductRemoved = (product: any) => {
    segmentClient.track('Product Removed', {
      id: product.id,
      name: product.name,
      category: product.category_id,
      price: product.price,
      quantity: product.quantity
    })
  }

  const handleOrderPlaced = (order: any) => {
    segmentClient.track('Order Placed', {
      id: order.id,
      affiliation: order.business?.name,
      revenue: order.total,
      tax: order.tax_total,
      shipping: order.delivery_zone_price
    })
    segmentClient.track('Payment Info Entered', {
      order: order.id,
      business: order.business?.name,
      business_id: order.business_id,
      total: order.total,
      tax: order.tax_total,
      delivery: order.delivery_zone_price,
      paymethod: order.paymethod
    })
  }

  const handleUpdateOrder = (order: any) => {
    segmentClient.track('Order Updated', {
      id: order.id,
      affiliation: order.business?.name,
      revenue: order.total,
      tax: order.tax_total,
      shipping: order.delivery_zone_price
    })
  }

  const handleAddOrder = (order: any) => {
    segmentClient.track('Order Added', {
      id: order.id,
      affiliation: order.business?.name,
      revenue: order.total,
      tax: order.tax_total,
      shipping: order.delivery_zone_price
    })
  }

  const handleLogin = (data: any) => {
    segmentClient.identify(data.id, {
      email: data.email,
      name: data.name
    })
  }

  useEffect(() => {
    if (segmentClient?.config?.writeKey) {
      events.on('product_clicked', handleClickProduct)
      events.on('userLogin', handleLogin)
      events.on('product_added', handleProductAdded)
      events.on('order_placed', handleOrderPlaced)
      events.on('order_updated', handleUpdateOrder)
      events.on('order_added', handleAddOrder)
      events.on('cart_product_removed', handleProductRemoved)
    }
    return () => {
      if (segmentClient?.config?.writeKey) {
        events.off('product_clicked', handleClickProduct)
        events.off('userLogin', handleLogin)
        events.off('product_added', handleProductAdded)
        events.off('order_placed', handleOrderPlaced)
        events.off('order_updated', handleUpdateOrder)
        events.off('order_added', handleAddOrder)
        events.off('cart_product_removed', handleProductRemoved)
      }
    }
  }, [segmentClient])

  useEffect(() => {
    if (configState?.configs?.segment_track_id?.value) {
      const _segmentClient: any = createClient({
        writeKey: configState?.configs?.segment_track_id?.value
      });
      setSegmentClient(_segmentClient)
    }
  }, [configState])

  return (
    <>
      <AnalyticsProvider client={segmentClient}>
        {children}
      </AnalyticsProvider>
    </>

  )
}
