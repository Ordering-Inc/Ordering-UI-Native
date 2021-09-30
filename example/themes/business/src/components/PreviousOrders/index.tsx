// React & React Native
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

// Ordering
import { useTheme } from 'styled-components/native';
import { useLanguage, useUtils } from 'ordering-components/native';

// Own
import { Card, Logo, Information, MyOrderOptions } from './styles';
import { NotFoundSource } from '../NotFoundSource';
import { OIcon, OText, OButton } from '../shared';
import { PreviousOrdersParams } from '../../types';
import dayjs from 'dayjs';

export const PreviousOrders = (props: PreviousOrdersParams) => {
  const {
    data: { orders, pagination, loading, error },
    tab,
    loadOrders,
    isRefreshing,
    tagsFilter,
    getOrderStatus,
    onNavigationRedirect,
  } = props;

  // Hooks
  const [, t] = useLanguage();
  const [{ parseDate, optimizeImage }] = useUtils();
  const theme = useTheme();

  // Handles
  const handlePressOrder = (order: any) => {
    onNavigationRedirect?.('OrderDetails', { order: order });
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
    loadButton: {
      borderRadius: 7.6,
      height: 44,
      marginRight: 10,
      marginBottom: 10,
      marginTop: 5,
    },
    loadButtonText: {
      color: theme.colors.inputTextColor,
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: 18,
    },
  });

  return (
    <>
      {!loading &&
        (!orders?.filter((order: any) => tagsFilter?.includes(order.status))
          ?.length ||
          error ||
          !tagsFilter?.length) && (
          <NotFoundSource
            content={
              !error
                ? t('NO_RESULTS_FOUND', 'Sorry, no results found')
                : error[0]?.message ||
                  error[0] ||
                  t('NETWORK_ERROR', 'Network Error')
            }
            image={theme.images.general.notFound}
            conditioned={false}
          />
        )}

      {orders?.length > 0 &&
        orders
          ?.filter((order: any) => tagsFilter?.includes(order.status))
          ?.sort((a: any, b: any) => {
            return dayjs(b.created_at).unix() - dayjs(a.created_at).unix();
          })
          .map((order: any) => (
            <React.Fragment key={order.id}>
              <TouchableOpacity
                onPress={() => handlePressOrder(order)}
                style={styles.cardButton}
                activeOpacity={1}>
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
                        {` · ${getOrderStatus?.(order.status)}`}
                      </OText>
                    </MyOrderOptions>
                  </Information>
                </Card>
              </TouchableOpacity>
            </React.Fragment>
          ))}

      {!error &&
        pagination?.totalPages &&
        !loading &&
        !isRefreshing &&
        !!orders?.filter((order: any) => tagsFilter?.includes(order.status))
          ?.length &&
        pagination?.currentPage < pagination?.totalPages &&
        !!tagsFilter?.length && (
          <OButton
            onClick={() => loadOrders?.(tab, true)}
            text={t('LOAD_MORE_ORDERS', 'Load more orders')}
            imgRightSrc={null}
            textStyle={styles.loadButtonText}
            style={styles.loadButton}
            bgColor={theme.colors.primary}
            borderColor={theme.colors.primary}
            isDisabled={isRefreshing || loading}
          />
        )}
    </>
  );
};
