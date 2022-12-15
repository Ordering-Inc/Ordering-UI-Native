import React from 'react';

//Styles
import {
  Actions,
  Header,
  OrderHeader,
} from './styles';

//Components
import {
  OIconButton,
  OText,
} from '../shared'

import { useTheme } from 'styled-components/native';
import { StyleSheet, View } from 'react-native';

import {
  useLanguage,
  useUtils,
} from 'ordering-components/native';

interface OrderHeader {
  order?: any,
  handleArrowBack?: any,
  handleOpenMapView?: any,
  handleOpenMessagesForBusiness?: any,
  getOrderStatus?: any,
  logisticOrderStatus?: Array<number>,
  handleViewSummaryOrder?: any;
  handleCopyClipboard?: any
  isCustomView?: any
}

export const OrderHeaderComponent = (props: OrderHeader) => {
  const {
    order,
    handleArrowBack,
    handleOpenMapView,
    handleOpenMessagesForBusiness,
    getOrderStatus,
    logisticOrderStatus,
    handleViewSummaryOrder,
    handleCopyClipboard
  } = props
  const theme = useTheme();
  const [, t] = useLanguage();
  const [{ parseDate }] = useUtils();

  const styles = StyleSheet.create({
    icons: {
      maxWidth: 40,
      height: 40,
      padding: 10,
      alignItems: 'flex-end',
    },
  })

  const colors: any = {
    //BLUE
    0: theme.colors.statusOrderBlue,
    3: theme.colors.statusOrderBlue,
    4: theme.colors.statusOrderBlue,
    7: theme.colors.statusOrderBlue,
    8: theme.colors.statusOrderBlue,
    9: theme.colors.statusOrderBlue,
    13: theme.colors.statusOrderBlue,
    14: theme.colors.statusOrderBlue,
    18: theme.colors.statusOrderBlue,
    19: theme.colors.statusOrderBlue,
    20: theme.colors.statusOrderBlue,
    21: theme.colors.statusOrderBlue,
    //GREEN
    1: theme.colors.statusOrderGreen,
    11: theme.colors.statusOrderGreen,
    15: theme.colors.statusOrderGreen,
    //RED
    2: theme.colors.statusOrderRed,
    5: theme.colors.statusOrderRed,
    6: theme.colors.statusOrderRed,
    10: theme.colors.statusOrderRed,
    12: theme.colors.statusOrderRed,
    16: theme.colors.statusOrderRed,
    17: theme.colors.statusOrderRed,
  };

  const walletName: any = {
    cash: {
      name: t('CASH_WALLET', 'Cash Wallet'),
    },
    credit_point: {
      name: t('CREDITS_POINTS_WALLET', 'Credit Points Wallet'),
    }
  }

  const orderTypes = (type: number) => type === 1
    ? t('DELIVERY', 'Delivery')
    : order.delivery_type === 2
      ? t('PICKUP', 'Pickup')
      : order.delivery_type === 3
        ? t('EAT_IN', 'Eat in')
        : order.delivery_type === 4
          ? t('CURBSIDE', 'Curbside')
          : t('DRIVER_THRU', 'Driver thru')

  return (
    <>
      {!props.isCustomView && (
        <Header>
          <OIconButton
            icon={theme.images.general.arrow_left}
            iconStyle={{ width: 20, height: 20 }}
            borderColor={theme.colors.clear}
            style={{ ...styles.icons, justifyContent: 'flex-end' }}
            onClick={() => handleArrowBack()}
          />

          {(!order?.isLogistic || (!logisticOrderStatus?.includes(order?.status) && !order?.order_group)) && (
            <Actions>
              {getOrderStatus(order?.status, t)?.value !==
                t('PENDING', 'Pending') && (
                  <>
                    <OIconButton
                      icon={theme.images.general.copy}
                      iconStyle={{
                        width: 20,
                        height: 25,
                        top: 2,
                        tintColor: theme.colors.backArrow,
                      }}
                      borderColor={theme.colors.clear}
                      style={styles.icons}
                      onClick={() => handleCopyClipboard?.()}
                    />
                    <OIconButton
                      icon={theme.images.general.print}
                      iconStyle={{
                        width: 25,
                        height: 22,
                        tintColor: theme.colors.backArrow,
                      }}
                      borderColor={theme.colors.clear}
                      style={styles.icons}
                      onClick={() => handleViewSummaryOrder?.()}
                    />
                  </>
                )}
              <OIconButton
                icon={theme.images.general.map}
                iconStyle={{
                  width: 20,
                  height: 20,
                  tintColor: theme.colors.backArrow,
                }}
                borderColor={theme.colors.clear}
                style={styles.icons}
                onClick={() => handleOpenMapView()}
              />

              <OIconButton
                icon={theme.images.general.messages}
                iconStyle={{
                  width: 20,
                  height: 20,
                  tintColor: theme.colors.backArrow,
                }}
                borderColor={theme.colors.clear}
                style={styles.icons}
                onClick={() => handleOpenMessagesForBusiness()}
              />
            </Actions>
          )}
        </Header>
      )}
      <OrderHeader>
        {!props.isCustomView ? (
          <OText size={13} style={{ marginBottom: 5 }}>
            {order?.delivery_datetime_utc
              ? parseDate(order?.delivery_datetime_utc)
              : parseDate(order?.delivery_datetime, { utc: false })}
          </OText>
        ) : (
          <Header style={{ alignItems: 'center' }}>
            <OText size={13} style={{ marginBottom: 5 }}>
              {order?.delivery_datetime_utc
                ? parseDate(order?.delivery_datetime_utc)
                : parseDate(order?.delivery_datetime, { utc: false })}
            </OText>

            {(!order?.isLogistic || (!logisticOrderStatus?.includes(order?.status) && !order?.order_group)) && (
              <Actions>
                {getOrderStatus(order?.status, t)?.value !==
                  t('PENDING', 'Pending') && (
                    <>
                      <OIconButton
                        icon={theme.images.general.copy}
                        iconStyle={{
                          width: 20,
                          height: 25,
                          top: 2,
                          tintColor: theme.colors.backArrow,
                        }}
                        borderColor={theme.colors.clear}
                        style={styles.icons}
                        onClick={() => handleCopyClipboard?.()}
                      />
                      <OIconButton
                        icon={theme.images.general.print}
                        iconStyle={{
                          width: 25,
                          height: 22,
                          tintColor: theme.colors.backArrow,
                        }}
                        borderColor={theme.colors.clear}
                        style={styles.icons}
                        onClick={() => handleViewSummaryOrder?.()}
                      />
                    </>
                  )}
                <OIconButton
                  icon={theme.images.general.map}
                  iconStyle={{
                    width: 20,
                    height: 20,
                    tintColor: theme.colors.backArrow,
                  }}
                  borderColor={theme.colors.clear}
                  style={styles.icons}
                  onClick={() => handleOpenMapView()}
                />

                <OIconButton
                  icon={theme.images.general.messages}
                  iconStyle={{
                    width: 20,
                    height: 20,
                    tintColor: theme.colors.backArrow,
                  }}
                  borderColor={theme.colors.clear}
                  style={styles.icons}
                  onClick={() => handleOpenMessagesForBusiness()}
                />
              </Actions>
            )}
          </Header>
        )}

        <OText numberOfLines={2} size={20} weight="600">
          <>
            {`${t('INVOICE_ORDER_NO', 'Order No.')} ${order?.id} `}
            {!order?.isLogistic && (!order?.order_group_id || !logisticOrderStatus?.includes(order?.status)) && (
              <>
                {t('IS', 'is')}{' '}
                <OText
                  size={20}
                  weight="600"
                  color={colors[order?.status] || theme.colors.primary}>
                  {getOrderStatus(order?.status, t)?.value}
                </OText>
              </>
            )}
          </>
        </OText>
        {!order?.isLogistic && order?.delivery_type && (!order?.order_group_id || !logisticOrderStatus?.includes(order?.status)) && (
          <>
            <OText size={13}>
              <OText size={13} weight='bold'>{`${t('ORDER_TYPE', 'Order Type')}: `}</OText>
              {orderTypes(order.delivery_type)}
            </OText>
            {order?.delivery_option && (
              <OText size={13}>
                <OText size={13} weight='bold'>{`${t('DELIVERY_PREFERENCE', 'Delivery Preference')}: `}</OText>
                {t(order?.delivery_option?.name?.toUpperCase()?.replace(/ /g, '_'), order?.delivery_option?.name)}
              </OText>
            )}
            {order?.payment_events?.length > 0 && (
              <View>
                <OText size={13}>
                  <OText size={13} weight='bold'>
                    {`${t('PAYMENT_METHODS', 'Payment methods')}: `}
                  </OText>
                  {order?.payment_events?.map((event: any, idx: number) => {
                    return event?.wallet_event
                      ? idx < order?.payment_events?.length - 1
                        ? `${walletName[event?.wallet_event?.wallet?.type]?.name} - `
                        : walletName[event?.wallet_event?.wallet?.type]?.name
                      : idx < order?.payment_events?.length - 1
                        ? `${t(event?.paymethod?.name?.toUpperCase()?.replace(/ /g, '_'), event?.paymethod?.name)} - `
                        : t(event?.paymethod?.name?.toUpperCase()?.replace(/ /g, '_'), event?.paymethod?.name)
                  })}
                </OText>
              </View>
            )}
          </>
        )}
      </OrderHeader>
    </>
  )
}
