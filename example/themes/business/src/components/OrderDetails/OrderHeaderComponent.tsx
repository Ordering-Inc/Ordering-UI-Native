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
import { StyleSheet } from 'react-native';

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
  logisticOrderStatus?: Array<number>
}

export const OrderHeaderComponent = (props: OrderHeader) => {
  const {
    order,
    handleArrowBack,
    handleOpenMapView,
    handleOpenMessagesForBusiness,
    getOrderStatus,
    logisticOrderStatus
  } = props
  const theme = useTheme();
  const [, t] = useLanguage();
  const [{ parseDate }] = useUtils();

  const styles = StyleSheet.create({
    icons: {
      maxWidth: 40,
      height: 25,
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

  return (
    <>
      <Header>
        <OIconButton
          icon={theme.images.general.arrow_left}
          iconStyle={{ width: 20, height: 20 }}
          borderColor={theme.colors.clear}
          style={{ ...styles.icons, justifyContent: 'flex-end' }}
          onClick={() => handleArrowBack()}
        />

        {
          (!order?.isLogistic || !logisticOrderStatus?.includes(order?.status)) && (
            <Actions>
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
      <OrderHeader>
        <OText size={13} style={{ marginBottom: 5 }}>
          {order?.delivery_datetime_utc
            ? parseDate(order?.delivery_datetime_utc)
            : parseDate(order?.delivery_datetime, { utc: false })}
        </OText>

        <OText numberOfLines={2} size={20} weight="600">
          <>
            {`${t('INVOICE_ORDER_NO', 'Order No.')} ${order.id} `}
            {(!order?.isLogistic || !logisticOrderStatus?.includes(order?.status)) && (
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
        {(!order?.isLogistic || !logisticOrderStatus?.includes(order?.status)) && (
          <OText size={13}>
            {`${order?.paymethod?.name} - ${order.delivery_type === 1
              ? t('DELIVERY', 'Delivery')
              : order.delivery_type === 2
                ? t('PICKUP', 'Pickup')
                : order.delivery_type === 3
                  ? t('EAT_IN', 'Eat in')
                  : order.delivery_type === 4
                    ? t('CURBSIDE', 'Curbside')
                    : t('DRIVER_THRU', 'Driver thru')
              }`}
          </OText>
        )}
      </OrderHeader>
    </>
  )
}
