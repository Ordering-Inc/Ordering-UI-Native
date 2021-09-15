import React from 'react';
import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from 'styled-components/native';
import { useLanguage, useUtils } from 'ordering-components/native';
import { OIcon, OText } from '../shared';
import { Card, Logo, Information, MyOrderOptions } from './styles';
import { PreviousOrdersParams } from '../../types';

export const PreviousOrders = (props: PreviousOrdersParams) => {
  const { orders, onNavigationRedirect, getOrderStatus } = props;

  const [, t] = useLanguage();
  const [{ parseDate, optimizeImage }] = useUtils();
  const theme = useTheme();

  const handlePressOrder = (order: any) => {
    onNavigationRedirect &&
      onNavigationRedirect('OrderDetails', { order: order });
  };

  const styles = StyleSheet.create({
    cardButton: {
      flex: 1,
      minHeight: 64,
      marginBottom: 30,
    },
    icon: {
      borderRadius: 7.6,
      width: 70,
      height: 70,
    },
    logo: {
      padding: 2,
      borderRadius: 18,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1.5,
      },
      shadowOpacity: 0.21,
      shadowRadius: 3,
      elevation: 7,
    },
    title: {
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: '600',
      fontSize: 18,
      color: theme.colors.textGray,
    },
    date: {
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: 15,
      color: theme.colors.unselectText,
    },
    orderType: {
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 'normal',
      color: theme.colors.orderTypeColor,
    },
  });

  return (
    <>
      {orders?.length > 0 &&
        orders?.map((order: any) => (
          <TouchableOpacity
            key={order.id}
            onPress={() => handlePressOrder(order)}
            style={styles.cardButton}
            activeOpacity={1}>
            <Card key={order.id}>
              {!!order.business?.logo && (
                <Logo style={styles.logo}>
                  <OIcon
                    url={optimizeImage(order.business?.logo, 'h_300,c_limit')}
                    style={styles.icon}
                  />
                </Logo>
              )}

              <Information>
                <OText numberOfLines={1} style={styles.title}>
                  {order.business?.name}
                </OText>

                <OText
                  style={styles.date}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  size={20}>
                  {t('INVOICE_ORDER_NO', 'Order No.') + order.id + ' · '}
                  {order?.delivery_datetime_utc
                    ? parseDate(order?.delivery_datetime_utc)
                    : parseDate(order?.delivery_datetime, { utc: false })}
                </OText>

                <MyOrderOptions>
                  <OText
                    style={styles.orderType}
                    mRight={5}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    size={18}>
                    {order.delivery_type === 1
                      ? t('DELIVERY', 'Delivery')
                      : order.delivery_type === 2
                      ? t('PICKUP', 'Pickup')
                      : order.delivery_type === 3
                      ? t('EAT_IN', 'Eat in')
                      : order.delivery_type === 4
                      ? t('CURBSIDE', 'Curbside')
                      : t('DRIVER_THRU', 'Driver thru')}
                    {` · ${getOrderStatus(order.status)}`}
                  </OText>
                </MyOrderOptions>
              </Information>
            </Card>
          </TouchableOpacity>
        ))}
    </>
  );
};
