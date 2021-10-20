import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from 'styled-components/native';
import { useLanguage, useUtils } from 'ordering-components/native';
import { OIcon, OText } from '../shared';
import { Card, Logo, Information, MyOrderOptions, NotificationIcon } from './styles';
import EntypoIcon from 'react-native-vector-icons/Entypo'

export const PreviousOrders = (props: any) => {
  const { orders, onNavigationRedirect, getOrderStatus, handleClickOrder } = props;
  const [, t] = useLanguage();
  const [{ parseDate, optimizeImage }] = useUtils();
  const theme = useTheme();

  const handlePressOrder = (order: any) => {
    handleClickOrder && handleClickOrder(order)
    onNavigationRedirect &&
      onNavigationRedirect('OrderDetails', { order: order });
  };

  const styles = StyleSheet.create({
    cardButton: {
      flex: 1,
      minHeight: 64,
      marginBottom: 30,
      marginLeft: 3,
    },
    icon: {
      borderRadius: 7.6,
      width: 75,
      height: 75,
    },
    logo: {
      width: 78,
      height: 78,
      borderRadius: 25,
      shadowColor: 'rgba(0.0, 0.0, 0.0, 0.5)',
      shadowOffset: {
        width: 0,
        height: 1.5,
      },
      shadowOpacity: 0.21,
      shadowRadius: 5,
      elevation: 7,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 3,
    },
    title: {
      marginBottom: 6,
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: '600',
      fontSize: 16,
      color: theme.colors.textGray,
    },
    date: {
      marginBottom: 6,
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: 15,
      color: theme.colors.unselectText,
    },
    orderType: {
      fontSize: 15,
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 'normal',
      color: theme.colors.orderTypeColor,
    },
  });

  let hash: any = {};

  return (
    <>
      {orders && orders?.length > 0 &&
        orders
          .filter((order: any) => hash[order?.id] ? false : (hash[order?.id] = true))
          .map((order: any) =>
      (
        <React.Fragment key={order.id}>
          <TouchableOpacity
            onPress={() => handlePressOrder(order)}
            style={styles.cardButton}
            activeOpacity={1}
          >
            <Card key={order.id}>
              {!!order.business?.logo && (
                <Logo style={styles.logo}>
                  <OIcon
                    url={optimizeImage(
                      order.business?.logo,
                      'h_300,c_limit',
                    )}
                    style={styles.icon}
                  />
                </Logo>
              )}
              <Information>
                <OText numberOfLines={1} style={styles.title}>
                  {order.business?.name}
                </OText>
                <NotificationIcon>
                  <EntypoIcon
                    name="dot-single"
                    size={32}
                    color={theme.colors.primary}
                  />
                </NotificationIcon>
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
                  >
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
        </React.Fragment>
      ))}
    </>
  );
};

PreviousOrders.defaultProps = {
  orders: []
}
