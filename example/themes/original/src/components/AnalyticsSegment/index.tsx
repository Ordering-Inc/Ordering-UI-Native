import React, { useEffect, useState } from 'react';
import {
  createClient,
  AnalyticsProvider
} from '@segment/analytics-react-native';
import { useEvent, useConfig, useLanguage } from 'ordering-components/native';

export const AnalyticsSegment = (props: any) => {
  const { children } = props

  const [events] = useEvent()
  const [configState] = useConfig()
  const [, t] = useLanguage()
  const [segmentClient, setSegmentClient] = useState<any>({})

  const handleProductsSearched = (query: any) => {
    segmentClient.track('Products Searched', {
      query: query
    })
  }

  const handleProductListViewed = (category: any) => {
    segmentClient.track('Product List Viewed', {
      business_id: category?.business_id,
      category_id: category?.id,
      category: category?.name
    })
  }

  const handlePromotionViewed = (promotion: any) => {
    segmentClient.track('Promotion Viewed', {
      promotion_id: (promotion?.id || '').toString(),
      name: promotion.name,
      position: promotion.position
    })
  }

  const handlePromotionClicked = (promotion: any) => {
    segmentClient.track('Promotion Clicked', {
      promotion_id: (promotion?.id || '').toString(),
      name: promotion.name,
      position: promotion.position
    })
  }

  const handleClickProduct = (product: any) => {
    segmentClient.track('Product Clicked', {
      id: product.id,
      name: product.name,
      category: product.category_id,
      price: product.price
    })
  }

  const handleProductViewed = (product: any) => {
    segmentClient.track('Product Viewed', {
      id: product.id,
      name: product.name,
      category: product.category_id,
      price: product.price
    })
  }

  const handleProductAdded = (product: any, result: any) => {
    segmentClient.track('Product Added', {
      cart_id: result.uuid,
      product_id: product.id,
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

  const handleCartViewed = (cart: any) => {
    segmentClient.track('Cart Viewed', {
      id: cart.uuid,
      products: cart?.products
    })
  }

  const handleCheckoutStarted = (cart: any) => {
    segmentClient.track('Checkout Started', {
      cart_id: cart?.uuid,
      affiliation: cart?.business?.name,
      revenue: cart?.total,
      tax: cart?.tax_total,
      shipping: cart?.delivery_zone_price
    })
  }

  const handleOrderPlaced = (order: any) => {
    segmentClient.track('Order Placed', {
      order_id: order.id,
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

    if (order?.history?.length) {
      const lasthistory = order.history[order.history.length - 1]
      if (lasthistory?.data) {
        lasthistory.data.forEach(item => {
          if (item.attribute === 'status') {
            if (item.new === 15) {
              segmentClient.track('Order Completed', {
                id: order.id,
                affiliation: order.business?.name,
                revenue: order.total,
                tax: order.tax_total,
                shipping: order.delivery_zone_price
              })
            }
            const orderCancelled = [2, 5, 6, 10, 12, 16, 17]
            if (orderCancelled.includes(item.new)) {
              segmentClient.track('Order Cancelled', {
                id: order.id,
                affiliation: order.business?.name,
                revenue: order.total,
                tax: order.tax_total,
                shipping: order.delivery_zone_price
              })
            }
          }
        })
      }
    }
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

  const handleCouponEntered = (cart: any) => {
    segmentClient.track('Coupon Entered', {
      cart_id: cart.uuid,
      coupon: cart.coupon
    })
  }

  const handleCouponApplied = (cart: any) => {
    const coupon: any = cart?.offers?.find(offer => offer.type === 2)
    if (coupon) {
      segmentClient.track('Coupon Applied', {
        cart_id: cart.uuid,
        coupon_id: coupon.id,
        coupon_name: coupon?.name,
        discount: coupon?.summary?.discount
      })
    }
  }

  const handleCouponDenied = (coupon: any) => {
    segmentClient.track('Coupon Denied', {
      business_id: coupon.business_id,
      coupon: coupon.coupon,
      user_id: coupon?.user_id,
      reason: typeof coupon.reason === 'string' ? t(coupon.reason) : t(coupon.reason[0])
    })
  }

  const handleCouponRemoved = (coupon: any) => {
    segmentClient.track('Coupon Removed', {
      business_id: coupon.business_id,
      coupon_id: coupon.offer_id,
    })
  }

  const handleProductReviewed = (products: any) => {
    products.forEach((product: any) => {
      segmentClient.track('Product Reviewed', {
        product_id: product.product_id,
        review_body: product.comment,
        rating: product.qualification
      })
    })
  }

  const handleLogin = (data: any) => {
    segmentClient.identify(data.id, {
      email: data.email,
      name: data.name
    })
  }

  const handleProductAddedToWishlist = (product: any) => {
    segmentClient.track('Product Added to Wishlist', product)
  }

  const handleProductRemovedFromWishlist = (product: any) => {
    segmentClient.track('Product Removed from Wishlist', product)
  }

  const handleWishlistProductAddedToCart = (product: any, result: any) => {
    segmentClient.track('Wishlist Product Added to Cart', {
      cart_id: result.uuid,
      product_id: product.id,
      name: product.name,
      category: product.categoryId,
      price: product.price,
      quantity: product.quantity
    })
  }

  useEffect(() => {
    if (segmentClient?.config?.writeKey) {
      events.on('products_searched', handleProductsSearched)
      events.on('product_list_viewed', handleProductListViewed)
      events.on('promotion_viewed', handlePromotionViewed)
      events.on('promotion_clicked', handlePromotionClicked)
      events.on('product_clicked', handleClickProduct)
      events.on('product_viewed', handleProductViewed)
      events.on('product_added', handleProductAdded)
      events.on('cart_product_removed', handleProductRemoved)
      events.on('cart_viewed', handleCartViewed)
      events.on('checkout_started', handleCheckoutStarted)
      events.on('order_updated', handleUpdateOrder)
      events.on('coupon_entered', handleCouponEntered)
      events.on('offer_applied', handleCouponApplied)
      events.on('offer_denied', handleCouponDenied)
      events.on('offer_removed', handleCouponRemoved)
      events.on('product_reviewed', handleProductReviewed)
      events.on('userLogin', handleLogin)
      events.on('order_placed', handleOrderPlaced)
      events.on('order_added', handleAddOrder)
      events.on('product_added_to_wishlist', handleProductAddedToWishlist)
      events.on('product_removed_from_wishlist', handleProductRemovedFromWishlist)
      events.on('wishlist_product_added_to_cart', handleWishlistProductAddedToCart)
    }
    return () => {
      if (segmentClient?.config?.writeKey) {
        events.off('products_searched', handleProductsSearched)
        events.off('product_list_viewed', handleProductListViewed)
        events.off('promotion_viewed', handlePromotionViewed)
        events.off('promotion_clicked', handlePromotionClicked)
        events.off('product_clicked', handleClickProduct)
        events.off('product_viewed', handleProductViewed)
        events.off('product_added', handleProductAdded)
        events.off('cart_product_removed', handleProductRemoved)
        events.off('cart_viewed', handleCartViewed)
        events.off('checkout_started', handleCheckoutStarted)
        events.off('order_updated', handleUpdateOrder)
        events.off('coupon_entered', handleCouponEntered)
        events.off('offer_applied', handleCouponApplied)
        events.off('offer_denied', handleCouponDenied)
        events.off('offer_removed', handleCouponRemoved)
        events.off('product_reviewed', handleProductReviewed)
        events.off('userLogin', handleLogin)
        events.off('order_placed', handleOrderPlaced)
        events.off('order_added', handleAddOrder)
        events.off('product_added_to_wishlist', handleProductAddedToWishlist)
        events.off('product_removed_from_wishlist', handleProductRemovedFromWishlist)
        events.off('wishlist_product_added_to_cart', handleWishlistProductAddedToCart)
      }
    }
  }, [segmentClient])

  useEffect(() => {
    if (configState?.configs?.segment_track_id?.value) {
      const _segmentClient: any = createClient({
        writeKey: configState?.configs?.segment_track_id?.value,
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
