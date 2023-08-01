import React from 'react';

//Styles
import {
  Actions,
  Header,
  OrderHeader,
} from './styles';

//Components
import {
  OIcon,
  OIconButton,
  OText,
} from '../shared'

import { useTheme } from 'styled-components/native';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

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
  const [{ parseDate, parsePrice }] = useUtils();
  const paymethodsLength = order?.payment_events?.filter((item: any) => item.event === 'payment')?.length

  const styles = StyleSheet.create({
    icons: {
      maxWidth: 40,
      height: 40,
      padding: 10,
      alignItems: 'flex-end',
      color: theme.colors.textGray,
    },
    btnBackArrow: {
      borderWidth: 0,
      width: 32,
      height: 32,
      tintColor: theme.colors.textGray,
      backgroundColor: theme.colors.clear,
      borderColor: theme.colors.clear,
      shadowColor: theme.colors.clear,
      paddingLeft: 0,
      paddingRight: 0,
      marginTop: 10
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

  const handlePaymethodsListString = () => {
    const paymethodsList = order?.payment_events?.filter((item: any) => item.event === 'payment').map((paymethod: any) => {
      return paymethod?.wallet_event
        ? walletName[paymethod?.wallet_event?.wallet?.type]?.name
        : paymethod?.paymethod?.gateway && paymethod?.paymethod?.gateway === 'cash' && order?.cash > 0
          ? `${t(paymethod?.paymethod?.gateway?.toUpperCase(), paymethod?.paymethod?.name)} (${t('CASH_CHANGE_OF', 'Change of :amount:').replace(':amount:', parsePrice(order?.cash))})`
          : paymethod?.paymethod?.gateway
            ? t(paymethod?.paymethod?.gateway?.toUpperCase(), paymethod?.paymethod?.name)
            : t(order?.paymethod?.gateway?.toUpperCase(), order?.paymethod?.name)
    })
    return paymethodsList.join(', ')
  }

  const deliveryDate = () => {
    const dateString = order?.delivery_datetime_utc ? order?.delivery_datetime_utc : order?.delivery_datetime
    const currentDate = new Date();
    const receivedDate: any = new Date(dateString.replace(/-/g, '/'));
    const formattedDate = receivedDate <= currentDate
      ? `${t('ASAP_ABBREVIATION', 'ASAP')}(${parseDate(receivedDate.toLocaleString(), { utc: !!order?.delivery_datetime_utc })})`
      : parseDate(receivedDate.toLocaleString(), { utc: !!order?.delivery_datetime_utc })
    return formattedDate
  }

  return (
    <>
      {!props.isCustomView && (
        <Header>
          <TouchableOpacity onPress={() => handleArrowBack()} style={styles.btnBackArrow}>
            <OIcon src={theme.images.general.arrow_left} color={theme.colors.textGray} />
          </TouchableOpacity>
          {(!order?.isLogistic || (!logisticOrderStatus?.includes(order?.status) && !order?.order_group)) && (
            <Actions>
              {getOrderStatus(order?.status, t)?.value !==
                t('PENDING', 'Pending') && (
                  <>
                    <TouchableOpacity onPress={() => handleCopyClipboard?.()}>
                      <MaterialCommunityIcons
                        name='content-copy'
                        color={theme.colors.textGray}
                        size={20}
                        style={styles.icons}
                      />
                    </TouchableOpacity>
                    {!!handleViewSummaryOrder && (
                      <TouchableOpacity onPress={() => handleViewSummaryOrder?.()}>
                        <SimpleLineIcons
                          name='printer'
                          color={theme.colors.textGray}
                          size={20}
                          style={styles.icons}
                        />
                      </TouchableOpacity>
                    )}
                  </>
                )}
              <OIconButton
                icon={theme.images.general.map}
                iconStyle={{
                  width: 20,
                  height: 20,
                  tintColor: theme.colors.textGray,
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
                  tintColor: theme.colors.textGray,
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
            {deliveryDate()}
          </OText>
        ) : (
          <Header style={{ alignItems: 'center' }}>
            <OText size={13} style={{ marginBottom: 5 }}>
              {deliveryDate()}
            </OText>

            {(!order?.isLogistic || (!logisticOrderStatus?.includes(order?.status) && !order?.order_group)) && (
              <Actions>
                {getOrderStatus(order?.status, t)?.value !==
                  t('PENDING', 'Pending') && (
                    <>
                      <TouchableOpacity onPress={() => handleCopyClipboard?.()}>
                        <MaterialCommunityIcons
                          name='content-copy'
                          color={theme.colors.textGray}
                          size={20}
                          style={styles.icons}
                        />
                      </TouchableOpacity>
                      {!!handleViewSummaryOrder && (
                        <TouchableOpacity onPress={() => handleViewSummaryOrder?.()}>
                          <SimpleLineIcons
                            name='printer'
                            color={theme.colors.textGray}
                            size={20}
                            style={styles.icons}
                          />
                        </TouchableOpacity>
                      )}
                    </>
                  )}
                <OIconButton
                  icon={theme.images.general.map}
                  iconStyle={{
                    width: 20,
                    height: 20,
                    tintColor: theme.colors.textGray,
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
                    tintColor: theme.colors.textGray,
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
        {order?.external_id && (
          <OText size={13}>
            <OText size={13} weight='bold'>{`${t('EXTERNAL_ID', 'External ID :')} `}</OText>
            {order?.external_id}
          </OText>
        )}
        {!order?.isLogistic && !!order?.delivery_type && (!order?.order_group_id || !logisticOrderStatus?.includes(order?.status)) && (
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
            <OText>
              <OText size={13} weight='bold'>
                {`${t(paymethodsLength > 1 ? 'PAYMENT_METHODS' : 'PAYMENT_METHOD', paymethodsLength > 1 ? 'Payment methods' : 'Payment method')}: `}
              </OText>
              {order?.payment_events?.length > 0 ? (
                <OText size={13}>{`${handlePaymethodsListString()}`}</OText>
              ) : (
                <OText size={13}>{t(order?.paymethod?.gateway?.toUpperCase(), order?.paymethod?.name)}</OText>
              )}
            </OText>
            {order?.spot_number && (
              <OText size={13}>
                <OText size={13} weight='bold'>
                  {`${order?.delivery_type === 3
                    ? t('EATIN_SPOT_NUMBER', 'Table number')
                    : order?.delivery_type === 5
                      ? t('DRIVE_THRU_SPOT_NUMBER', 'Drive thru lane')
                      : t('CURBSIDE_SPOT_NUMBER', 'Spot number')}: `}
                </OText>
                {order.spot_number}
              </OText>
            )}
          </>
        )}
      </OrderHeader>
    </>
  )
}
