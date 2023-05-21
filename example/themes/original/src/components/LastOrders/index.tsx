import React from 'react'
import {
  OrderList as OrderListController,
  useUtils,
  useLanguage
} from 'ordering-components/native'
import { View, StyleSheet} from 'react-native'
import { LastOrdersParams } from '../../types'
import {
  Placeholder,
  PlaceholderLine,
  Fade
} from "rn-placeholder"
import { OIcon, OText } from '../shared'
import { NotFoundSource } from '../NotFoundSource'
import { useTheme } from 'styled-components/native'
import {
  OrderContainer,
  OrderInfo
} from './styles'
import { useEffect } from 'react'

const LastOrdersUI = (props: LastOrdersParams) => {
  const {
    orderList,
    onRedirect,
    loadOrders,
    refresh,
    setRefresh
  } = props
  const { loading, error, orders } = orderList

  const [{ parseDate, optimizeImage }] = useUtils()
  const [, t] = useLanguage()
  const theme = useTheme()

  const styles = StyleSheet.create({
    headerLogo: {
      borderRadius: 8,
      width: '100%',
      height: 100
    },
    completedTimeStyle: {
      flexDirection: 'row',
      alignItems: 'center'
    }
  })

  const handleClickViewOrder = (uuid: string) => {
    onRedirect && onRedirect('OrderDetails', { orderId: uuid })
  }

  useEffect(() => {
		if(refresh){
			loadOrders(false, false, false, true)
			setRefresh && setRefresh(false)
		}
	}, [refresh])

  return (
    <>
      {loading ? (
        <>
          {[...Array(3)].map((item, i) => (
            <Placeholder key={i} Animation={Fade}>
              <PlaceholderLine height={100} style={{ marginBottom: 20, borderRadius: 8 }} />
            </Placeholder>
          ))}
        </>
      ) : (
        <>
          {orders.map((order: any) => (
            <OrderContainer
              key={order.id}
              onPress={() => handleClickViewOrder(order?.uuid)}
            >
              <OIcon
                url={optimizeImage(order.business?.header, 'h_300,c_limit')}
                style={styles.headerLogo}
                cover
              />
              <OrderInfo>
                <OText weight={700} size={16} color={theme.colors.white}>{order?.business?.name}</OText>
                {(order.delivery_datetime_utc || order?.delivery_datetime) && (
                  <View style={styles.completedTimeStyle}>
                    <OText size={12} color={theme.colors.white} space>{t('TUTORIAL_ORDER_COMPLETED', 'Order Completed')}</OText>
                    <OText size={12} color={theme.colors.white}>
                      {order.delivery_datetime_utc
                        ? parseDate(order?.delivery_datetime_utc, { outputFormat: 'MMM DD, YY - hh:mm A' })
                        : parseDate(order?.delivery_datetime, { utc: false })}
                      </OText>
                  </View>
                )}
              </OrderInfo>
            </OrderContainer>
          ))}
        </>
      )}
      {!loading && orders.length === 0 && (
				<NotFoundSource
					content={t('NO_RESULTS_FOUND', 'Sorry, no results found')}
					image={theme.images.general.emptyPastOrders}
					conditioned
				/>
			)}
    </>
  )
}

export const LastOrders = (props: any) => {
  const helpProps = {
    ...props,
    UIComponent: LastOrdersUI,
    orderStatus: [1, 11, 15],
    useDefualtSessionManager: true,
    paginationSettings: {
      initialPage: 1,
      pageSize: 3,
      controlType: 'infinity'
    },
    noGiftCardOrders: true
  }
  return <OrderListController {...helpProps} />
}
