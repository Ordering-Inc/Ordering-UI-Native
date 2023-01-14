import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
import { FavoriteParams } from '../../types';
import { SingleOrderCard } from '../SingleOrderCard';
import {
  FavoriteList as FavoriteListController,
  useOrder,
  useLanguage
} from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { _setStoreData } from '../../providers/StoreUtil';
import { Container, WrappButton } from './styles'
import { OButton } from '../shared';
import { BusinessController } from '../BusinessController';
import { SingleProductCard } from '../SingleProductCard';
import { NotFoundSource } from '../NotFoundSource';
import moment from 'moment';
import { getOrderStatus } from '../../utils'

const FavoriteListUI = (props: FavoriteParams) => {
  const {
    favoriteList,
    handleUpdateFavoriteList,
    pagination,
    getFavoriteList,
    navigation,
    onNavigationRedirect,
    reorderState,
    handleReorder,
    isBusiness,
    isOrder,
    isProduct
  } = props

  const theme = useTheme();
  const [, t] = useLanguage()
  const [orderState] = useOrder();
  const [{ carts }] = useOrder()

  const pastOrders = [1, 2, 5, 6, 10, 11, 12, 15, 16, 17]

  const onProductClick = (product: any) => {
    const categoryId = product?.category?.id
    const businessId = product?.category?.business?.id
    if (!categoryId || !businessId) return
    onNavigationRedirect && onNavigationRedirect('ProductDetails', {
      isRedirect: 'business',
      productId: product?.id,
      businessId: businessId,
      categoryId: categoryId,
      business: {
        store: product?.category?.business.slug,
        header: product?.category?.header,
      }
    })
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

  const handleBusinessClick = (business: any) => {
    onNavigationRedirect && onNavigationRedirect('Business', {
      store: business.slug,
      header: business.header,
      logo: business.logo,
    });
  }

  const BusinessSkeleton = () => {
    return (
      <Placeholder
        Animation={Fade}
        style={{ marginBottom: 20 }}>
        <View style={{ width: '100%' }}>
          <PlaceholderLine
            height={200}
            style={{ marginBottom: 20, borderRadius: 25 }}
          />
          <View style={{ paddingHorizontal: 10 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <PlaceholderLine
                height={25}
                width={40}
                style={{ marginBottom: 10 }}
              />
              <PlaceholderLine
                height={25}
                width={20}
                style={{ marginBottom: 10 }}
              />
            </View>
            <PlaceholderLine
              height={20}
              width={30}
              style={{ marginBottom: 10 }}
            />
            <PlaceholderLine
              height={20}
              width={80}
              style={{ marginBottom: 10 }}
            />
          </View>
        </View>
      </Placeholder>
    )
  }

  const ProductSkeleton = () => {
    return (
      <Placeholder style={{ padding: 5 }} Animation={Fade}>
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
    )
  }

  const OrderSkeleton = () => {
    return (
      <Placeholder style={{ padding: 5 }} Animation={Fade}>
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
    )
  }

  return (
    <Container>
      {isBusiness && (
        <>
          {favoriteList?.favorites?.length > 0 && (
            favoriteList.favorites?.sort((a: any, b: any) => a?.name?.toLowerCase() > b?.name?.toLowerCase()).map((business: any, i: number) => (
              <BusinessController
                key={`${business.id}_` + i}
                business={business}
                isBusinessOpen={business.open}
                handleCustomClick={handleBusinessClick}
                orderType={orderState?.options?.type}
                navigation={navigation}
                businessHeader={business?.header}
                businessFeatured={business?.featured}
                businessLogo={business?.logo}
                businessReviews={business?.reviews}
                businessDeliveryPrice={business?.delivery_price}
                businessDeliveryTime={business?.delivery_time}
                businessPickupTime={business?.pickup_time}
                businessDistance={business?.distance}
                handleUpdateBusinessList={handleUpdateFavoriteList}
              />
            ))
          )}
          {favoriteList?.loading && (
            [...Array(5).keys()].map(i => (
              <BusinessSkeleton key={i} />
            ))
          )}
          {!favoriteList?.loading && !favoriteList?.favorites?.length && (
            <NotFoundSource
              content={t('NOT_FOUND_FAVORITES_LIST', 'No favorites to show at this time.')
              }
            />
          )}
        </>
      )}

      {isOrder && (
        <>
          {favoriteList?.favorites?.length > 0 && (
            favoriteList.favorites?.sort((a: any, b: any) => moment(a?.delivery_datetime_utc).valueOf() - moment(b?.delivery_datetime_utc).valueOf())
              .map((order: any, i: number) => (
                <SingleOrderCard
                  key={`${order?.id}_${i}`}
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
          {favoriteList?.loading && (
            [...Array(5).keys()].map(i => (
              <OrderSkeleton key={i} />
            ))
          )}
          {!favoriteList?.loading && !favoriteList?.favorites?.length && (
            <NotFoundSource
              content={t('NOT_FOUND_FAVORITES_LIST', 'No favorites to show at this time.')
              }
            />
          )}
        </>
      )}

      {isProduct && (
        <>
          {favoriteList?.favorites?.length > 0 && (
            favoriteList.favorites?.sort((a: any, b: any) => a?.name?.toLowerCase() > b?.name?.toLowerCase()).map((product: any, i: number) => (
              <SingleProductCard
                key={`${product?.id}_${i}`}
                isSoldOut={product?.inventoried && !product?.quantity}
                product={product}
                onProductClick={onProductClick}
                handleUpdateProducts={handleUpdateFavoriteList}
              />
            ))
          )}
          {favoriteList?.loading && (
            [...Array(5).keys()].map(i => (
              <ProductSkeleton key={i} />
            ))
          )}
          {!favoriteList?.loading && !favoriteList?.favorites?.length && (
            <NotFoundSource
              content={t('NOT_FOUND_FAVORITES_LIST', 'No favorites to show at this time.')
              }
            />
          )}
        </>
      )}

      {!favoriteList?.loading && pagination.totalPages && pagination.currentPage < pagination.totalPages && (
        <WrappButton>
          <OButton
            onClick={() => getFavoriteList(pagination?.currentPage + 1)}
            text={t('LOAD_MORE_ITEMS', 'Load more items')}
            imgRightSrc={null}
            textStyle={{ color: theme.colors.white }}
            style={{ borderRadius: 7.6, shadowOpacity: 0, marginTop: 20 }}
          />
        </WrappButton>
      )}
    </Container>
  )
}

export const FavoriteList = (props: any) => {
  const favoriteBusinessesProps = {
    ...props,
    UIComponent: FavoriteListUI
  }
  return <FavoriteListController {...favoriteBusinessesProps} />
}
