import React, { useRef, useState } from 'react';
import {
  SingleOrderCard as SingleOrderCardController,
  useUtils,
  useOrder,
  useLanguage
} from 'ordering-components/native';
import Lottie from 'lottie-react-native';
import { Animated, Easing, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'styled-components/native';
import { OIcon, OText, OButton } from '../shared';
import IconAntDesign from 'react-native-vector-icons/AntDesign'
import { SingleOrderCardParams } from '../../types';
import { OAlert } from '../../../../../src/components/shared'

import {
  Container,
  InnerContainer,
  Logo,
  CardInfoWrapper,
  ContentHeader,
  ButtonWrapper,
  ContentFooter,
  UnreadMessageCounter,
  Price
} from './styles';
import { LottieProvider } from '../../providers/LottieProvider';

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

  const [reorderSelected, setReorderSelected] = useState<number | null>(null);
  const [confirm, setConfirm] = useState<any>({ open: false, content: null, handleOnAccept: null, id: null, title: null })
  const [isPressed, setIsPressed] = useState(false)

  const allowedOrderStatus = [1, 2, 5, 6, 10, 11, 12];

  const styles = StyleSheet.create({
    logo: {
      borderRadius: 8,
      width: 64,
      height: 64
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
      width: 80,
      height: 40,
      borderRadius: 10,
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
    if (carts[`businessId:${order?.business_id}`] && carts[`businessId:${order?.business_id}`]?.products?.length > 0) {
      setConfirm({
        open: true,
        content: [t('QUESTION_DELETE_PRODUCTS_FROM_CART', 'Are you sure that you want to delete all products from cart?')],
        title: t('ORDER', 'Order'),
        handleOnAccept: async () => {
          handleRemoveCart()
          setConfirm({ ...confirm, open: false })
        }
      })
    } else {
      setReorderSelected(order?.id);
      handleReorder && handleReorder(order?.id);
    }
  };

  const handleClickOrderReview = (order: any) => {
    if (pastOrders) {
      onNavigationRedirect &&
        onNavigationRedirect('ReviewOrder', {
          order: {
            id: order?.id,
            business_id: order?.business_id,
            logo: order?.business?.logo,
            driver: order?.driver,
            products: order?.products,
            review: order?.review,
            user_review: order?.user_review
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

  const handleClickViewOrder = (uuid: string) => {
    if (isMessageView) {
      handleClickOrder(order?.uuid)
      return
    }
    onNavigationRedirect &&
      onNavigationRedirect('OrderDetails', { orderId: uuid });
  };

  const handleChangeFavorite = () => {
    handleFavoriteOrder && handleFavoriteOrder(!order?.favorite)
  };

  const handleOriginalReorder = () => {
    setConfirm({ ...confirm, open: false, title: null })
    setReorderSelected(order?.id);
    handleReorder && handleReorder(order?.id);
  }

  return (
    <>
      <Container
        onPress={() => handleClickViewOrder(order?.uuid)}
        activeOpacity={0.8}
        delayPressIn={20}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        style={styles.cardAnimation}
      >
        <InnerContainer>
          {(!!order.business?.logo || theme?.images?.dummies?.businessLogo) && (
            <Logo style={styles.logoWrapper}>
              <OIcon
                url={optimizeImage(order.business?.logo, 'h_300,c_limit')}
                src={optimizeImage(!order.business?.logo && theme?.images?.dummies?.businessLogo, 'h_300,c_limit')}
                style={styles.logo}
              />
            </Logo>
          )}
          <CardInfoWrapper>
            <ContentHeader>
              <View style={{ flex: 1 }}>
                <OText size={12} lineHeight={18} weight={'600'} numberOfLines={1} ellipsizeMode={'tail'}>
                  {order.business?.name}
                </OText>
              </View>
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
                  {allowedOrderStatus.includes(parseInt(order?.status)) &&
                    !order.review && (
                      <TouchableOpacity
                        onPress={() => handleClickOrderReview(order)}
                        style={styles.reviewButton}>
                        <OText size={10} color={theme.colors.primary} numberOfLines={1}>
                          {t('REVIEW', 'Review')}
                        </OText>
                      </TouchableOpacity>
                    )}
                  {order.cart && (
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
                  {!!!pastOrders && (
                    <>
                      <OText
                        size={10}
                        space
                        color={theme.colors.textSecondary}
                        style={{ marginVertical: 3 }}
                        lineHeight={15}
                        numberOfLines={1}
                      >
                        {t('ORDER_NO', 'Order No') + '.'}
                      </OText>
                      <OText
                        size={10}
                        color={theme.colors.textSecondary}
                        style={{ marginVertical: 3 }}
                        lineHeight={15}
                        numberOfLines={1}
                      >
                        {order.id + ` \u2022 `}
                      </OText>
                    </>
                  )}
                  <OText
                    size={10}
                    lineHeight={15}
                    color={theme.colors.textSecondary}
                    style={{ marginVertical: 3 }}
                    numberOfLines={1}>
                    {order?.delivery_datetime_utc ? parseDate(order?.delivery_datetime_utc) : parseDate(order?.delivery_datetime, { utc: false })}
                  </OText>
                </View>
                <OText
                  color={theme.colors.primary}
                  size={10}
                  lineHeight={15}
                  numberOfLines={1}>
                  {getOrderStatus(order.status)?.value}
                </OText>
              </View>
              {!isMessageView && (
                <LottieProvider
                  src={theme.images?.general?.heart}
                  onClick={handleChangeFavorite}
                  initialValue={order?.favorite ? 0.5 : 0}
                  toValue={order?.favorite ? 0 : 0.5}
                  style={{ marginTop: 5 }}
                >
                  <IconAntDesign
                    name={order?.favorite ? 'heart' : 'hearto'}
                    color={theme.colors.danger5}
                    size={16}
                    style={{ top: 7 }}
                  />
                </LottieProvider>
              )}
            </ContentFooter>
          </CardInfoWrapper>
        </InnerContainer>
      </Container>
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
