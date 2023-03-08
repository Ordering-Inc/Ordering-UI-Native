import React, { useState, useEffect } from 'react';
import {
  SingleOrderCard as SingleOrderCardController,
  useUtils,
  useOrder,
  useLanguage
} from 'ordering-components/native';
import FastImage from 'react-native-fast-image'
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'styled-components/native';
import { OIcon, OText, OButton } from '../shared';
import { SingleOrderCardParams } from '../../types';
import { OAlert } from '../../../../../src/components/shared'
import { OrderEta } from '../OrderDetails/OrderEta'
import { useIsFocused } from '@react-navigation/native';
import {
  InnerContainer,
  Logo,
  CardInfoWrapper,
  ContentHeader,
  ButtonWrapper,
  ContentFooter,
  UnreadMessageCounter,
  Price,
  MultiLogosContainer
} from './styles';
import { LottieAnimation } from '../LottieAnimation';
import { CardAnimation } from '../shared/CardAnimation';

const SingleOrderCardUI = (props: SingleOrderCardParams) => {
  const {
    order,
    reorderLoading,
    handleReorder,
    getOrderStatus,
    handleFavoriteOrder,
    onNavigationRedirect,
    pastOrders,
    isMessageView,
    handleClickOrder,
    handleRemoveCart,
    cartState
  } = props;

  const [{ parsePrice, optimizeImage, parseDate }] = useUtils();
  const [, t] = useLanguage();
  const [{ carts }] = useOrder()
  const theme = useTheme();
  const isFocused = useIsFocused();

  let [reorderSelected, setReorderSelected] = useState<number | null>(null);
  const [confirm, setConfirm] = useState<any>({ open: false, content: null, handleOnAccept: null, id: null, title: null })
  const [isPressed, setIsPressed] = useState(false)

  const allowedOrderStatus = [1, 2, 5, 6, 10, 11, 12];

  const styles = StyleSheet.create({
    container: {
      borderRadius: 7.6,
      marginBottom: 10,
      paddingVertical: 5,
    },
    logo: {
      borderRadius: 8,
      width: 64,
      height: 64
    },
    minilogo: {
      borderRadius: 8,
      width: 40,
      height: 40
    },
    logoWrapper: {
      overflow: 'hidden',
      backgroundColor: 'white',
      borderRadius: 8,
      shadowColor: '#000000',
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 1,
      elevation: 3
    },
    buttonText: {
      color: theme.colors.primary,
      fontSize: 10,
      marginLeft: 2,
      marginRight: 2,
    },
    reorderLoading: {
      height: 23,
      paddingLeft: 20,
      paddingRight: 20,
      borderRadius: 23,
      shadowOpacity: 0,
      backgroundColor: theme.colors.primary,
      borderWidth: 0,
    },
    reorderbutton: {
      height: 23,
      paddingLeft: 10,
      paddingRight: 10,
      borderRadius: 23,
      shadowOpacity: 0,
      backgroundColor: theme.colors.primaryContrast,
      borderWidth: 0,
    },
    reviewButton: {
      height: 23,
      maxHeight: 23,
      backgroundColor: theme.colors.white,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 10,
      borderRadius: 23,
      borderWidth: 1,
      borderColor: theme.colors.primaryContrast,
      marginRight: 2
    },
    infoText: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    cardAnimation: {
      elevation: isPressed ? 2 : 0,
      shadowColor: '#888',
      shadowOffset: { width: 0, height: isPressed ? 2 : 0 },
      shadowRadius: 18,
      shadowOpacity: isPressed ? 0.8 : 0,
      borderRadius: 12,
    }
  });

  const handleReorderClick = (order: any) => {
    setReorderSelected(null)
    reorderSelected = null
    const isMultiOrders = Array.isArray(order?.id)

    const isRemoveCart = isMultiOrders
      ? order?.business_id?.some((businessId: any) => !!carts[`businessId:${businessId}`]?.uuid)
      : carts[`businessId:${order?.business_id}`] && !!carts[`businessId:${order?.business_id}`]?.uuid

    if (isRemoveCart) {
      setConfirm({
        open: true,
        content: [t('QUESTION_DELETE_PRODUCTS_FROM_CART', 'Are you sure that you want to delete all products from cart?')],
        title: t('ORDER', 'Order'),
        handleOnAccept: async () => {
          handleRemoveCart(order)
          setConfirm({ ...confirm, open: false })
        }
      })
    } else {
      const orderId = Array.isArray(order?.id) ? order?.id[0] : order?.id
      setReorderSelected(orderId)
      reorderSelected = orderId
      handleReorder && handleReorder(order?.id)
    }
  };

  const handleClickOrderReview = (order: any) => {
    if (pastOrders) {
      onNavigationRedirect &&
        onNavigationRedirect('ReviewOrder', {
          order: {
            id: order?.id,
            business_id: order?.business_id,
            logo: order?.business?.length > 1 ? order?.business?.map?.((business: any) => business?.logo) : order?.business?.logo,
            driver: order?.driver,
            products: order?.products,
            review: order?.review,
            user_review: order?.user_review,
            business: order?.business
          },
        });
      return
    }
    if (isMessageView) {
      handleClickOrder(order?.uuid)
      return
    }
    onNavigationRedirect &&
      onNavigationRedirect('OrderDetails', { orderId: order?.uuid });
  };

  const handleClickViewOrder = (order: any) => {
    if (isMessageView) {
      handleClickOrder(order?.uuid)
      return
    }
    if (order?.cart_group_id) {
      onNavigationRedirect?.('MultiOrdersDetails', { orderId: order?.cart_group_id });
    } else {
      onNavigationRedirect?.('OrderDetails', { orderId: order?.uuid });
    }
  };

  const handleChangeFavorite = () => {
    handleFavoriteOrder && handleFavoriteOrder(!order?.favorite)
  };

  const handleOriginalReorder = () => {
    setConfirm({ ...confirm, open: false, title: null })
  }

  const hideBusinessLogo = theme?.orders?.components?.business_logo?.hidden
  const hideDate = theme?.orders?.components?.date?.hidden
  const hideBusinessName = theme?.orders?.components?.business_name?.hidden
  const hideOrderNumber = theme?.orders?.components?.order_number?.hidden
  const hideReviewOrderButton = theme?.orders?.components?.review_order_button?.hidden
  const hideReorderButton = theme?.orders?.components?.reorder_button?.hidden
  const hideFavorite = theme?.orders?.components?.favorite?.hidden
  const hideOrderStatus = theme?.orders?.components?.order_status?.hidden

  useEffect(() => {
    if (isFocused) setReorderSelected(null)
  }, [isFocused])

  return (
    <>
      <CardAnimation
        onClick={() => handleClickViewOrder(order)}
        style={[styles.container]}
      >
        <InnerContainer>
          {!hideBusinessLogo && (!!order.business?.logo || theme?.images?.dummies?.businessLogo) && (
            <>
              {order?.business?.length > 1 ? (
                <MultiLogosContainer>
                  {order?.business?.map((business: any, i: number) => i < 2 && (
                    <Logo
                      isMulti
                      key={business?.id}
                      style={styles.logoWrapper}
                    >
                      <FastImage
                        style={styles.minilogo}
                        source={business?.logo ? {
                          uri: optimizeImage(business?.logo, 'h_300,c_limit'),
                          priority: FastImage.priority.normal,
                        } : theme?.images?.dummies?.businessLogo}
                        resizeMode={FastImage.resizeMode.contain}
                      />
                    </Logo>
                  ))}
                  {order?.business?.length > 1 && (order?.business?.length - 2) > 0 && (
                    <OText mRight={3}> + {order?.business?.length - 2}</OText>
                  )}
                </MultiLogosContainer>
              ) : (
                <Logo style={styles.logoWrapper}>
                  <FastImage
                    style={styles.logo}
                    source={order.business?.logo ? {
                      uri: optimizeImage(order.business?.logo, 'h_300,c_limit'),
                      priority: FastImage.priority.normal,
                    } : theme?.images?.dummies?.businessLogo}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                </Logo>
              )}
            </>
          )}
          <CardInfoWrapper>
            <ContentHeader>
              {(order?.business?.length > 1 && !hideOrderNumber) || (!order?.business?.length && !hideBusinessName) && (
                <View style={{ flex: 1 }}>
                  <OText size={12} lineHeight={18} weight={'600'} numberOfLines={1} ellipsizeMode={'tail'}>
                    {order?.business?.length > 1 ? `${t('GROUP_ORDER', 'Group Order')} ${t('No', 'No')}. ${order?.cart_group_id}` : order.business?.name}
                  </OText>
                </View>
              )}
              {!!!pastOrders && (
                <>
                  {isMessageView ? (
                    <>
                      {order?.unread_count > 0 && (
                        <UnreadMessageCounter>
                          <OText size={12} color={theme.colors.primary} lineHeight={18} >
                            {order?.unread_count}
                          </OText>
                        </UnreadMessageCounter>
                      )}
                    </>
                  ) : (
                    <Price>
                      <OText size={12} lineHeight={18}>
                        {parsePrice(order?.summary?.total || order?.total)}
                      </OText>
                    </Price>
                  )}
                </>
              )}
              {!!pastOrders && (
                <ButtonWrapper>
                  {!hideReviewOrderButton &&
                    allowedOrderStatus.includes(parseInt(order?.status)) &&
                    !order.review && (
                      <TouchableOpacity
                        onPress={() => handleClickOrderReview(order)}
                        style={styles.reviewButton}>
                        <OText size={10} color={theme.colors.primary} numberOfLines={1}>
                          {t('REVIEW', 'Review')}
                        </OText>
                      </TouchableOpacity>
                    )}
                  {!hideReorderButton && typeof order?.id === 'number' && (
                    <OButton
                      text={t('REORDER', 'Reorder')}
                      imgRightSrc={''}
                      textStyle={styles.buttonText}
                      style={
                        ((reorderLoading && order.id === reorderSelected) || cartState?.loading)
                          ? styles.reorderLoading
                          : styles.reorderbutton
                      }
                      onClick={() => handleReorderClick(order)}
                      isLoading={(reorderLoading && order.id === reorderSelected) || cartState?.loading}
                    />
                  )}
                </ButtonWrapper>
              )}
            </ContentHeader>
            <ContentFooter>
              <View style={{ flex: 1 }}>
                <View style={styles.infoText}>
                  {(!!!pastOrders || order?.business?.length > 1) && !hideOrderNumber && (
                    <>
                      <OText
                        size={10}
                        space
                        color={theme.colors.textSecondary}
                        style={{ marginVertical: 3 }}
                        lineHeight={15}
                        numberOfLines={1}
                      >
                        {order?.business?.length > 1 ? order?.business?.length : (t('ORDER_NO', 'Order No') + '.')}
                      </OText>
                      <OText
                        size={10}
                        color={theme.colors.textSecondary}
                        style={{ marginVertical: 3 }}
                        lineHeight={15}
                        numberOfLines={1}
                      >
                        {order?.business?.length > 1 ? t('ORDERS', 'orders') + ' \u2022 ' : order.id + ` \u2022 `}
                      </OText>
                    </>
                  )}
                  {!hideDate && (
                    <OText
                      size={10}
                      lineHeight={15}
                      color={theme.colors.textSecondary}
                      style={{ marginVertical: 3 }}
                      numberOfLines={1}>
                      {
                        pastOrders
                          ? order?.delivery_datetime_utc ? parseDate(order?.delivery_datetime_utc) : parseDate(order?.delivery_datetime, { utc: false })
                          : <OrderEta order={order} />
                      }
                    </OText>
                  )}
                </View>
                {!hideOrderStatus && (
                  <OText
                    color={theme.colors.primary}
                    size={10}
                    lineHeight={15}
                    numberOfLines={1}>
                    {getOrderStatus(order.status)?.value}
                  </OText>
                )}
              </View>
              {!isMessageView && !order?.business?.length && !hideFavorite && (
                <LottieAnimation
                  type='favorite'
                  onClick={handleChangeFavorite}
                  initialValue={order?.favorite ? 0.5 : 0}
                  toValue={order?.favorite ? 0 : 0.5}
                  style={{ marginBottom: 5 }}
                  iconProps={{ color: theme.colors.danger5, size: 16, style: { top: 7 } }}
                  isActive={order?.favorite}
                />
              )}
            </ContentFooter>
          </CardInfoWrapper>
        </InnerContainer>
      </CardAnimation>
      <OAlert
        open={confirm.open}
        title={confirm.title}
        content={confirm.content}
        onAccept={confirm.handleOnAccept}
        onCancel={() => handleOriginalReorder()}
        onClose={() => handleOriginalReorder()}
      />
    </>

  )
}

export const SingleOrderCard = (props: any) => {
  const singleOrderCardProps = {
    ...props,
    UIComponent: SingleOrderCardUI
  }
  return <SingleOrderCardController {...singleOrderCardProps} />
}
