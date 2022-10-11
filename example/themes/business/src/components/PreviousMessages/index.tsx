import React from 'react';
import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from 'styled-components/native';
import { useLanguage, useUtils } from 'ordering-components/native';
import { Card, Logo, Information, Header, Badge } from './styles';
import { OIcon, OText } from '../shared';
import { PreviousMessagesParams } from '../../types';

export const PreviousMessages = (props: PreviousMessagesParams) => {
  const { orders, onNavigationRedirect, setOrders } = props;

  const [, t] = useLanguage();
  const theme = useTheme();
  const [{ parseDate, optimizeImage }] = useUtils();

  const handlePressOrder = (order: any) => {
    const uuid = order?.id;

    onNavigationRedirect &&
      onNavigationRedirect('OrderMessage', { orderId: uuid, setOrders });
  };

  const getOrderStatus = (s: string) => {
    const status = parseInt(s);
    const orderStatus = [
      {
        key: 0,
        value: t('PENDING', 'Pending'),
        slug: 'PENDING',
        percentage: 0.25,
      },
      {
        key: 1,
        value: t('COMPLETED', 'Completed'),
        slug: 'COMPLETED',
        percentage: 1,
      },
      {
        key: 2,
        value: t('REJECTED', 'Rejected'),
        slug: 'REJECTED',
        percentage: 0,
      },
      {
        key: 3,
        value: t('DRIVER_IN_BUSINESS', 'Driver in business'),
        slug: 'DRIVER_IN_BUSINESS',
        percentage: 0.6,
      },
      {
        key: 4,
        value: t('PREPARATION_COMPLETED', 'Preparation Completed'),
        slug: 'PREPARATION_COMPLETED',
        percentage: 0.7,
      },
      {
        key: 5,
        value: t('REJECTED', 'Rejected'),
        slug: 'REJECTED_BY_BUSINESS',
        percentage: 0,
      },
      {
        key: 6,
        value: t('REJECTED_BY_DRIVER', 'Rejected by Driver'),
        slug: 'REJECTED_BY_DRIVER',
        percentage: 0,
      },
      {
        key: 7,
        value: t('ACCEPTED_BY_BUSINESS', 'Accepted by business'),
        slug: 'ACCEPTED_BY_BUSINESS',
        percentage: 0.35,
      },
      {
        key: 8,
        value: t('ACCEPTED_BY_DRIVER', 'Accepted by driver'),
        slug: 'ACCEPTED_BY_DRIVER',
        percentage: 0.45,
      },
      {
        key: 9,
        value: t('PICK_UP_COMPLETED_BY_DRIVER', 'Pick up completed by driver'),
        slug: 'PICK_UP_COMPLETED_BY_DRIVER',
        percentage: 0.8,
      },
      {
        key: 10,
        value: t('PICK_UP_FAILED_BY_DRIVER', 'Pick up Failed by driver'),
        slug: 'PICK_UP_FAILED_BY_DRIVER',
        percentage: 0,
      },
      {
        key: 11,
        value: t(
          'DELIVERY_COMPLETED_BY_DRIVER',
          'Delivery completed by driver',
        ),
        slug: 'DELIVERY_COMPLETED_BY_DRIVER',
        percentage: 1,
      },
      {
        key: 12,
        value: t('DELIVERY_FAILED_BY_DRIVER', 'Delivery Failed by driver'),
        slug: 'DELIVERY_FAILED_BY_DRIVER',
        percentage: 0,
      },
      {
        key: 13,
        value: t('PREORDER', 'PreOrder'),
        slug: 'PREORDER',
        percentage: 0,
      },
      {
        key: 14,
        value: t('ORDER_NOT_READY', 'Order not ready'),
        slug: 'ORDER_NOT_READY',
        percentage: 0,
      },
      {
        key: 15,
        value: t(
          'ORDER_PICKEDUP_COMPLETED_BY_CUSTOMER',
          'Order picked up completed by customer',
        ),
        slug: 'ORDER_PICKEDUP_COMPLETED_BY_CUSTOMER',
        percentage: 100,
      },
      {
        key: 16,
        value: t('CANCELLED_BY_CUSTOMER', 'Cancelled by customer'),
        slug: 'CANCELLED_BY_CUSTOMER',
        percentage: 0,
      },
      {
        key: 17,
        value: t(
          'ORDER_NOT_PICKEDUP_BY_CUSTOMER',
          'Order not picked up by customer',
        ),
        slug: 'ORDER_NOT_PICKEDUP_BY_CUSTOMER',
        percentage: 0,
      },
      {
        key: 18,
        value: t(
          'DRIVER_ALMOST_ARRIVED_TO_BUSINESS',
          'Driver almost arrived to business',
        ),
        slug: 'DRIVER_ALMOST_ARRIVED_TO_BUSINESS',
        percentage: 0.15,
      },
      {
        key: 19,
        value: t(
          'DRIVER_ALMOST_ARRIVED_TO_CUSTOMER',
          'Driver almost arrived to customer',
        ),
        slug: 'DRIVER_ALMOST_ARRIVED_TO_CUSTOMER',
        percentage: 0.9,
      },
      {
        key: 20,
        value: t(
          'ORDER_CUSTOMER_ALMOST_ARRIVED_BUSINESS',
          'Customer almost arrived to business',
        ),
        slug: 'ORDER_CUSTOMER_ALMOST_ARRIVED_BUSINESS',
        percentage: 90,
      },
      {
        key: 21,
        value: t(
          'ORDER_CUSTOMER_ARRIVED_BUSINESS',
          'Customer arrived to business',
        ),
        slug: 'ORDER_CUSTOMER_ARRIVED_BUSINESS',
        percentage: 95,
      },
      {
        key: 22,
        value: t('ORDER_LOOKING_FOR_DRIVER', 'Looking for driver'),
        slug: 'ORDER_LOOKING_FOR_DRIVER',
        percentage: 35
      },
      {
        key: 23,
        value: t('ORDER_DRIVER_ON_WAY', 'Driver on way'),
        slug: 'ORDER_DRIVER_ON_WAY',
        percentage: 45
      }
    ];

    const objectStatus = orderStatus.find(o => o.key === status);

    return objectStatus && objectStatus;
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
      width: '85%'
    },
    badge: {
      marginBottom: 6,
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: 14,
      color: theme.colors.primary,
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
            key={order?.id}
            onPress={() => handlePressOrder(order)}
            style={styles.cardButton}
            activeOpacity={1}>
            <Card key={order?.id}>
              <Logo style={styles.logo}>
                <OIcon
                  url={optimizeImage(order?.business?.logo, 'h_300,c_limit')}
                  src={!order?.business?.logo && theme?.images?.dummies?.businessLogo}
                  style={styles.icon}
                />
              </Logo>
              <Information>
                <Header>
                  <OText numberOfLines={1} style={styles.title}>
                    {order?.business?.name}
                  </OText>

                  {order?.unread_count > 0 && (
                    <Badge>
                      <OText size={14} style={styles.badge}>
                        {order?.unread_count}
                      </OText>
                    </Badge>
                  )}
                </Header>

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

                <OText
                  style={styles.orderType}
                  mRight={5}
                  numberOfLines={1}
                  adjustsFontSizeToFit>
                  {getOrderStatus(order?.status)?.value}
                </OText>
              </Information>
            </Card>
          </TouchableOpacity>
        ))}
    </>
  );
};
