import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useLanguage, useUtils } from 'ordering-components/native';
import {
  OrdersContainer,
  Card,
  Information,
  OrderInformation,
  BusinessInformation,
  Price,
  OptionTitle,
  Status,
} from './styles';

import { useTheme } from 'styled-components/native';
import { getTextOrderStatus } from '../../utils';
import { OButton, OText } from '../shared'

export const OrderListOption = (props: any) => {
  const {
    orders,
    titleContent,
    typeStyle,
    allowedOrderStatus,
    isLoadingReorder,
    handleReorder,
    onNavigationRedirect,
  } = props;

  const theme = useTheme();
  const [, t] = useLanguage();
  const [{ parseDate, parsePrice }] = useUtils();

  const [reorderSelected, setReorderSelected] = useState<number | null>(null);
  const [isReviewedOrders, setIsReviewedOrders] = useState<Array<any>>([])

  const handleClickCard = (uuid: string) => {
    onNavigationRedirect &&
      onNavigationRedirect('OrderDetails', { orderId: uuid });
  };

  const handleReviewState = (orderId: any) => {
    if (!orderId || isReviewedOrders.includes(orderId)) return
    setIsReviewedOrders([...isReviewedOrders, orderId])
  }

  const handleClickOrderReview = (order: any) => {
    onNavigationRedirect &&
      onNavigationRedirect('ReviewOrder', {
        order: {
          id: order?.id,
          business_id: order?.business_id,
          logo: order.business?.logo,
          driver: order?.driver,
          products: order?.products,
          review: order?.review,
          user_review: order?.user_review
        },
        handleReviewState: handleReviewState
      });
  };

  const handleReorderClick = (id: number) => {
    setReorderSelected(id);
    handleReorder(id);
  };

  const styles = StyleSheet.create({
    reorderbutton: {
      height: 23,
      paddingLeft: 10,
      paddingRight: 10,
      borderRadius: 23,
      shadowOpacity: 0,
      backgroundColor: theme.colors.primaryContrast,
      borderWidth: 0,
      width: 80
    },
    reorderLoading: {
      width: 80,
      height: 23,
      borderRadius: 23,
      paddingHorizontal: 10,
    },
    reviewButton: {
      width: 80,
      height: 23,
      maxHeight: 23,
      backgroundColor: theme.colors.white,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 10,
      borderRadius: 23,
      borderWidth: 1,
      borderColor: theme.colors.primaryContrast,
    },
    buttonText: {
      color: theme.colors.primary,
      fontSize: 10,
      marginLeft: 2,
      marginRight: 2,
    },
  });

  const OrderStyleOne = ({ order }: any) => (
    <Card
      activeOpacity={1}
      onPress={() => handleClickCard(order?.uuid)}
    >
      <Information>
        <OrderInformation>
          <BusinessInformation>
            <OText size={12} lineHeight={18} weight={600} numberOfLines={1} ellipsizeMode={'tail'}>
              {`${t('ORDER_NO', 'Order No')}.${order.id}`}
            </OText>
            <OText size={10} lineHeight={21} color={theme.colors.textSecondary}>
              {order?.delivery_datetime_utc
                ? parseDate(order?.delivery_datetime_utc)
                : parseDate(order?.delivery_datetime, { utc: false })}
            </OText>
            <OText
              color={theme.colors.primary}
              size={10}
              lineHeight={15}
              weight={400}
              numberOfLines={2}>
              {getTextOrderStatus(order.status, t)?.value}
            </OText>
          </BusinessInformation>
          <Price>
            <OText size={12} lineHeight={18}>
              {parsePrice(order?.summary?.total || order?.total)}
            </OText>
          </Price>
        </OrderInformation>
      </Information>
    </Card>
  );

  const OrderStyleTwo = ({ order }: any) => (
    <TouchableOpacity
      onPress={() => handleClickCard(order?.uuid)}
      activeOpacity={1}
      style={{ flexDirection: 'row' }}
    >
      <Card themetwo>
        <Information themetwo>
          <OText size={12} lineHeight={18} weight={'600'} numberOfLines={1} ellipsizeMode={'tail'}>
            {`${t('ORDER_NO', 'Order No')}.${order.id}`}
          </OText>
          <OText
            size={10}
            lineHeight={21}
            color={theme.colors.textSecondary}
            style={{ marginVertical: 3 }}
            numberOfLines={1}>
            {order?.delivery_datetime_utc
              ? parseDate(order?.delivery_datetime_utc)
              : parseDate(order?.delivery_datetime, { utc: false })}
          </OText>
          <OText
            color={theme.colors.primary}
            size={10}
            lineHeight={15}
            numberOfLines={1}>
            {getTextOrderStatus(order.status, t)?.value}
          </OText>
        </Information>
        <Status>
          <OButton
            text={t('REORDER', 'Reorder')}
            imgRightSrc={''}
            textStyle={styles.buttonText}
            style={
              isLoadingReorder && order.id === reorderSelected
                ? styles.reorderLoading
                : styles.reorderbutton
            }
            onClick={() => handleReorderClick(order.id)}
            isLoading={isLoadingReorder && order.id === reorderSelected}
          />
          {allowedOrderStatus.includes(parseInt(order?.status)) &&
            !order.review && !isReviewedOrders.includes(order?.id) &&
            (
              <TouchableOpacity
                onPress={() => handleClickOrderReview(order)}
                style={styles.reviewButton}>
                <OText size={10} color={theme.colors.primary} numberOfLines={1}>
                  {t('REVIEW', 'Review')}
                </OText>
              </TouchableOpacity>
            )}
        </Status>
      </Card>
    </TouchableOpacity>
  )

  return (
    <>
      <OptionTitle>
        <OText
          size={16}
          color={theme.colors.textPrimary}
          mBottom={10}
        >
          {titleContent}
        </OText>
      </OptionTitle>
      <OrdersContainer>
        {orders.length > 0 &&
          orders.map((order: any, index: any) => (
            <React.Fragment key={order?.id || order?.uuid}>
              {typeStyle === 1 && (
                <OrderStyleOne order={order} />
              )}
              {typeStyle === 2 && (
                <OrderStyleTwo order={order} />
              )}
            </React.Fragment>
          ))}
      </OrdersContainer>
      <View
        style={{
          height: 8,
          backgroundColor: theme.colors.backgroundGray100,
          marginBottom: 10
        }}
      />
    </>
  );
};
