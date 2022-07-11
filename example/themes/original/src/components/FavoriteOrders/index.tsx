import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
import { SingleOrderCard } from '../SingleOrderCard';
import { OButton } from '../shared';
import {
	FavoriteList,
	useOrder,
  useLanguage
} from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { Container, WrappButton } from './styles';
import { _setStoreData } from '../../providers/StoreUtil';
import { FavoriteParams } from '../../types';

const FavoriteOrdersUI = (props: FavoriteParams) => {
	const {
    handleUpdateFavoriteList,
    favoriteList,
    pagination,
    getFavoriteList,
    onNavigationRedirect,
    reorderState,
    handleReorder
	} = props

	const theme = useTheme();
  const [, t] = useLanguage()
  const [{ carts }] = useOrder()

  const pastOrders = [1, 2, 5, 6, 10, 11, 12, 15, 16, 17]

  const getOrderStatus = (s: any) => {
    const status = parseInt(s)
    const orderStatus = [
      { key: 0, value: t('PENDING', theme?.defaultLanguages?.PENDING || 'Pending') },
      { key: 1, value: t('COMPLETED', theme?.defaultLanguages?.COMPLETED || 'Completed') },
      { key: 2, value: t('REJECTED', theme?.defaultLanguages?.REJECTED || 'Rejected') },
      { key: 3, value: t('DRIVER_IN_BUSINESS', theme?.defaultLanguages?.DRIVER_IN_BUSINESS || 'Driver in business') },
      { key: 4, value: t('PREPARATION_COMPLETED', theme?.defaultLanguages?.PREPARATION_COMPLETED || 'Preparation Completed') },
      { key: 5, value: t('REJECTED_BY_BUSINESS', theme?.defaultLanguages?.REJECTED_BY_BUSINESS || 'Rejected by business') },
      { key: 6, value: t('REJECTED_BY_DRIVER', theme?.defaultLanguages?.REJECTED_BY_DRIVER || 'Rejected by Driver') },
      { key: 7, value: t('ACCEPTED_BY_BUSINESS', theme?.defaultLanguages?.ACCEPTED_BY_BUSINESS || 'Accepted by business') },
      { key: 8, value: t('ACCEPTED_BY_DRIVER', theme?.defaultLanguages?.ACCEPTED_BY_DRIVER || 'Accepted by driver') },
      { key: 9, value: t('PICK_UP_COMPLETED_BY_DRIVER', theme?.defaultLanguages?.PICK_UP_COMPLETED_BY_DRIVER || 'Pick up completed by driver') },
      { key: 10, value: t('PICK_UP_FAILED_BY_DRIVER', theme?.defaultLanguages?.PICK_UP_FAILED_BY_DRIVER || 'Pick up Failed by driver') },
      { key: 11, value: t('DELIVERY_COMPLETED_BY_DRIVER', theme?.defaultLanguages?.DELIVERY_COMPLETED_BY_DRIVER || 'Delivery completed by driver') },
      { key: 12, value: t('DELIVERY_FAILED_BY_DRIVER', theme?.defaultLanguages?.DELIVERY_FAILED_BY_DRIVER || 'Delivery Failed by driver') },
      { key: 13, value: t('PREORDER', theme?.defaultLanguages?.PREORDER || 'PreOrder') },
      { key: 14, value: t('ORDER_NOT_READY', theme?.defaultLanguages?.ORDER_NOT_READY || 'Order not ready') },
      { key: 15, value: t('ORDER_PICKEDUP_COMPLETED_BY_CUSTOMER', theme?.defaultLanguages?.ORDER_PICKEDUP_COMPLETED_BY_CUSTOMER || 'Order picked up completed by customer') },
      { key: 16, value: t('ORDER_STATUS_CANCELLED_BY_CUSTOMER', theme?.defaultLanguages?.ORDER_STATUS_CANCELLED_BY_CUSTOMER || 'Order cancelled by customer') },
      { key: 17, value: t('ORDER_NOT_PICKEDUP_BY_CUSTOMER', theme?.defaultLanguages?.ORDER_NOT_PICKEDUP_BY_CUSTOMER || 'Order not picked up by customer') },
      { key: 18, value: t('ORDER_DRIVER_ALMOST_ARRIVED_BUSINESS', theme?.defaultLanguages?.ORDER_DRIVER_ALMOST_ARRIVED_BUSINESS || 'Driver almost arrived to business') },
      { key: 19, value: t('ORDER_DRIVER_ALMOST_ARRIVED_CUSTOMER', theme?.defaultLanguages?.ORDER_DRIVER_ALMOST_ARRIVED_CUSTOMER || 'Driver almost arrived to customer') },
      { key: 20, value: t('ORDER_CUSTOMER_ALMOST_ARRIVED_BUSINESS', theme?.defaultLanguages?.ORDER_CUSTOMER_ALMOST_ARRIVED_BUSINESS || 'Customer almost arrived to business') },
      { key: 21, value: t('ORDER_CUSTOMER_ARRIVED_BUSINESS', theme?.defaultLanguages?.ORDER_CUSTOMER_ARRIVED_BUSINESS || 'Customer arrived to business') },
      { key: 22, value: t('ORDER_LOOKING_FOR_DRIVER', theme?.defaultLanguages?.ORDER_LOOKING_FOR_DRIVER || 'Looking for driver') },
      { key: 23, value: t('ORDER_DRIVER_ON_WAY', theme?.defaultLanguages?.ORDER_DRIVER_ON_WAY || 'Driver on way') }
    ]

    const objectStatus = orderStatus.find((o) => o.key === status)

    return objectStatus && objectStatus
  }

  useEffect(() => {
		const _businessId = 'businessId:' + reorderState?.result?.business_id
		if (reorderState?.error) {
		  if (reorderState?.result?.business_id) {
			_setStoreData('adjust-cart-products', JSON.stringify(_businessId))
			onNavigationRedirect && onNavigationRedirect('Business', { store: reorderState?.result?.business?.slug })
		  }
		}
		if (!reorderState?.error && reorderState.loading === false && reorderState?.result?.business_id) {
		  const cartProducts = carts?.[_businessId]?.products
		  const available = cartProducts.every((product: any) => product.valid === true)
		  const orderProducts = favoriteList?.favorites.find((order: any) => order?.id === reorderState?.result?.orderId)?.products

		  if (available && reorderState?.result?.uuid && (cartProducts?.length === orderProducts?.length)) {
			onNavigationRedirect && onNavigationRedirect('CheckoutNavigator', { cartUuid: reorderState?.result.uuid })
		  } else {
			_setStoreData('adjust-cart-products', JSON.stringify(_businessId))
			cartProducts?.length !== orderProducts?.length && _setStoreData('already-removed', JSON.stringify('removed'))
			onNavigationRedirect && onNavigationRedirect('Business', { store: reorderState?.result?.business?.slug })
		  }
		}
	  }, [reorderState])

	return (
		<Container>
      {favoriteList?.loading && (
        [...Array(5).keys()].map(i => (
          <Placeholder key={i} style={{ padding: 5 }} Animation={Fade}>
            <View style={{ flexDirection: 'row' }}>
              <PlaceholderLine
                width={24}
                height={70}
                style={{ marginRight: 10, marginBottom: 10 }}
              />
              <Placeholder style={{ paddingVertical: 10 }}>
                <PlaceholderLine width={60} style={{ marginBottom: 25 }} />
                <PlaceholderLine width={20} />
              </Placeholder>
            </View>
          </Placeholder>
        ))
      )}
      {!favoriteList?.loading && favoriteList?.favorites?.length > 0 && (
        favoriteList.favorites.map((order: any) => (
          <SingleOrderCard
            key={order?.id}
            order={order}
            getOrderStatus={getOrderStatus}
            onNavigationRedirect={onNavigationRedirect}
            pastOrders={pastOrders.includes(order?.status)}
            handleUpdateOrderList={handleUpdateFavoriteList}
            handleUpdateFavoriteList={handleUpdateFavoriteList}
            handleReorder={handleReorder}
            reorderLoading={reorderState?.loading}
          />
        ))
      )}
      {!favoriteList?.loading && pagination.totalPages && pagination.currentPage < pagination.totalPages && (
				<WrappButton>
					<OButton
						onClick={() => getFavoriteList(pagination?.currentPage + 1)}
						text={t('LOAD_MORE_ORDERS', 'Load more orders')}
						imgRightSrc={null}
						textStyle={{ color: theme.colors.white }}
						style={{ borderRadius: 7.6, shadowOpacity: 0, marginTop: 20 }}
					/>
				</WrappButton>
			)}
    </Container>
	)
}

export const FavoriteOrders = (props: any) => {
  const favoriteBusinessesProps = {
    ...props,
    UIComponent: FavoriteOrdersUI,
    favoriteURL: 'favorite_orders',
    originalURL: 'orders'
  }
  return <FavoriteList {...favoriteBusinessesProps} />
}
