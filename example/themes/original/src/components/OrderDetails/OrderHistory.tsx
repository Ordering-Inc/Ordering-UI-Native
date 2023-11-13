import React from 'react'
import { useTheme } from 'styled-components/native'
import { ScrollView, StyleSheet, View } from 'react-native'
import { useLanguage, useUtils } from 'ordering-components/native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { OText, OButton } from '../shared'
import { formatSeconds } from '../../utils'

export const OrderHistory = (props: any) => {
  const {
    order,
    messages,
    enableReview,
    onClose,
    handleTriggerReview
  } = props

  const [, t] = useLanguage()
  const [{ parseDate }] = useUtils()
  const theme = useTheme()

  const styles = StyleSheet.create({
    historyItem: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: theme.colors.border
    },
    detailWrapper: {
      marginLeft: 20,
      paddingHorizontal: 13,
      paddingVertical: 16
    },
    container: {
      paddingHorizontal: 20,
      paddingVertical: 15
    }
  });

  const ORDER_STATUS: any = {
    0: 'ORDER_STATUS_PENDING',
    1: 'ORDERS_COMPLETED',
    2: 'ORDER_REJECTED',
    3: 'ORDER_STATUS_IN_BUSINESS',
    4: 'ORDER_READY',
    5: 'ORDER_REJECTED_RESTAURANT',
    6: 'ORDER_STATUS_CANCELLEDBYDRIVER',
    7: 'ORDER_STATUS_ACCEPTEDBYRESTAURANT',
    8: 'ORDER_CONFIRMED_ACCEPTED_BY_DRIVER',
    9: 'ORDER_PICKUP_COMPLETED_BY_DRIVER',
    10: 'ORDER_PICKUP_FAILED_BY_DRIVER',
    11: 'ORDER_DELIVERY_COMPLETED_BY_DRIVER',
    12: 'ORDER_DELIVERY_FAILED_BY_DRIVER',
    13: 'PREORDER',
    14: 'ORDER_NOT_READY',
    15: 'ORDER_PICKEDUP_COMPLETED_BY_CUSTOMER',
    16: 'ORDER_STATUS_CANCELLED_BY_CUSTOMER',
    17: 'ORDER_NOT_PICKEDUP_BY_CUSTOMER',
    18: 'ORDER_DRIVER_ALMOST_ARRIVED_BUSINESS',
    19: 'ORDER_DRIVER_ALMOST_ARRIVED_CUSTOMER',
    20: 'ORDER_CUSTOMER_ALMOST_ARRIVED_BUSINESS',
    21: 'ORDER_CUSTOMER_ARRIVED_BUSINESS',
    22: 'ORDER_LOOKING_FOR_DRIVER',
    23: 'ORDER_DRIVER_ON_WAY',
    24: 'ORDER_DRIVER_WAITING_FOR_ORDER',
    25: 'ORDER_ACCEPTED_BY_DRIVER_COMPANY',
    26: 'ORDER_DRIVER_ARRIVED_CUSTOMER'
  }

  const getLogisticTagStatus = (status: any) => {
    switch (status) {
      case 0:
        return t('PENDING', 'Pending')
      case 1:
        return t('IN_PROGRESS', 'In Progress')
      case 2:
        return t('IN_QUEUE', 'In Queue')
      case 3:
        return t('EXPIRED', 'Logistic expired')
      case 4:
        return t('RESOLVED', 'Resolved')
      default:
        return status
    }
  }

  const handleReview = () => {
    if (enableReview) handleTriggerReview()
    else onClose()
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <OText size={20} style={{ alignSelf: 'center', textAlign: 'center' }} mBottom={10}>
        {t('DETAILS_OF_ORDER', 'Details of Order_NUMBER_').replace('_NUMBER_', ` # ${order?.id}`)}
      </OText>
      {!messages?.loading && order && (
        <View style={styles.historyItem}>
          <MaterialCommunityIcons
            name="checkbox-marked-circle"
            size={20}
            color={theme.colors.primary}
          />
          <View style={styles.detailWrapper}>
            <OText
              size={14}
              weight='bold'
              numberOfLines={1}
              ellipsizeMode='tail'
            >
              {t('ORDER_PLACED', 'Order placed')} {' '}
              {!props.hideViaText && (
                <>
                  {t('VIA', 'Via')}{' '}
                  {order.app_id ? t(order.app_id.toUpperCase(), order.app_id) : t('OTHER', 'Other')}
                </>
              )}
            </OText>
            <OText size={12}>{parseDate(order?.created_at, { outputFormat: 'MMM DD, hh:mm A' })}</OText>
          </View>
        </View>
      )}
      {messages && messages?.messages.map((message: any, i: number) => message.type === 1 && (
        <View
          style={styles.historyItem}
          key={i}
        >
          <MaterialCommunityIcons
            name="checkbox-marked-circle"
            size={20}
            color={theme.colors.primary}
          />
          <View style={styles.detailWrapper}>
            {message.change?.attribute !== 'driver_id' ? (
              <OText
                size={14}
                weight='bold'
                numberOfLines={message.change?.attribute.includes(['delivered_in', 'prepared_in']) ? 2 : 1}
                ellipsizeMode='tail'
              >
                {message.change?.attribute === 'logistic_status'
                  ? getLogisticTagStatus(parseInt(message.change.new, 10))
                  : message.change?.attribute === 'delivered_in' ? (
                    <>
                      {t('TIME_ADDED_BY_DRIVER', 'Time added by driver')}{'\n'}
                      {formatSeconds(parseInt(message.change.new, 10))}
                    </>
                  )
                    : message.change?.attribute === 'prepared_in' ? (
                      <>
                        {t('TIME_ADDED_BY_BUSINESS', 'Time added by business')}{'\n'}
                        {formatSeconds(parseInt(message.change.new, 10))}
                      </>
                    ) : t(ORDER_STATUS[parseInt(message.change.new, 10)])
                }
              </OText>
            ) : (
              <OText
                size={14}
                weight='bold'
                numberOfLines={1}
                ellipsizeMode='tail'
              >
                {message.change.new
                  ? (`${message.driver?.name} ${!!message.driver?.lastname ? message.driver.lastname : ''} ${t('WAS_ASSIGNED_AS_DRIVER', 'Was assigned as driver')}`)
                  : t('DRIVER_UNASSIGNED', 'Driver unassigned')}
              </OText>
            )}
            <OText size={12}>{parseDate(message?.created_at, { outputFormat: 'MMM DD, hh:mm A' })}</OText>
          </View>
        </View>
      ))}
      <OButton
        text={enableReview ? t('REVIEW_ORDER', 'Review order') : t('CONTINUE', 'Continue')}
        textStyle={{ fontSize: 14 }}
        imgRightSrc={theme.images.general.arrow_right}
        imgRightStyle={{ tintColor: theme.colors.white, right: 5, margin: 5 }}
        style={{ borderRadius: 7.6, borderWidth: 1, height: 44, shadowOpacity: 0, marginBottom: 30, marginTop: 20 }}
        onClick={() => handleReview()}
      />
    </ScrollView>
  )
}
