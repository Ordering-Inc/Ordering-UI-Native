import React, { useState, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'
import LinearGradient from 'react-native-linear-gradient'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Messages } from '../Messages'
import {
  useLanguage,
  OrderDetails as OrderDetailsConTableoller,
  useUtils,
  useConfig,
  useSession
} from 'ordering-components/native'
import {
  OrderDetailsContainer,
  Header,
  OrderContent,
  OrderBusiness,
  Logo,
  OrderData,
  OrderInfo,
  OrderStatus,
  StaturBar,
  StatusImage,
  OrderCustomer,
  CustomerPhoto,
  InfoBlock,
  HeaderInfo,
  Customer,
  OrderProducts,
  Table,
  OrderBill,
  Total,
  NavBack,
  Icons,
  OrderDriver
} from './styles'
import { OIcon, OModal, OText } from '../shared'
import { colors } from '../../theme'
import { ProductItemAccordion } from '../ProductItemAccordion'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { OrderDetailsParams } from '../../types'
import { USER_TYPE } from '../../config/constants'

const appLogo = require('../../assets/images/Logo.png')

const orderStatus0 = require('../../assets/images/status-0.png')
const orderStatus1 = require('../../assets/images/status-1.png')
const orderStatus2 = require('../../assets/images/status-2.png')
const orderStatus3 = require('../../assets/images/status-3.png')
const orderStatus4 = require('../../assets/images/status-4.png')
const orderStatus5 = require('../../assets/images/status-5.png')
const orderStatus6 = require('../../assets/images/status-6.png')
const orderStatus7 = require('../../assets/images/status-7.png')
const orderStatus8 = require('../../assets/images/status-8.png')
const orderStatus9 = require('../../assets/images/status-9.png')
const orderStatus10 = require('../../assets/images/status-10.png')
const orderStatus11 = require('../../assets/images/status-11.png')
const orderStatus12 = require('../../assets/images/status-12.png')


export const OrderDetailsUI = (props: OrderDetailsParams) => {

  const {
    navigation,
    handleOrderRedirect,
    urlToShare,
    messages,
    setMessages,
    readMessages,
    messagesReadList
  } = props

  const [, t] = useLanguage()
  const [{ configs }] = useConfig()
  const [{ parsePrice, parseNumber, parseDate }] = useUtils()
  const [{ user }] = useSession()

  const [openMessages, setOpenMessages] = useState({ business: false, driver: false })
  const [openReview, setOpenReview] = useState(false)
  const [isReviewed, setIsReviewed] = useState(false)
  const [unreadAlert, setUnreadAlert] = useState({ business: false, driver: false })
  const { order, loading, error } = props.order

  const getOrderStatus = (s: string) => {
    const status = parseInt(s)
    const orderStatus = [
      { key: 0, value: t('PENDING', 'Pending'), slug: 'PENDING', percentage: 0.25, image: orderStatus0 },
      { key: 1, value: t('COMPLETED', 'Completed'), slug: 'COMPLETED', percentage: 1, image: orderStatus1 },
      { key: 2, value: t('REJECTED', 'Rejected'), slug: 'REJECTED', percentage: 0, image: orderStatus2 },
      { key: 3, value: t('DRIVER_IN_BUSINESS', 'Driver in business'), slug: 'DRIVER_IN_BUSINESS', percentage: 0.60, image: orderStatus3 },
      { key: 4, value: t('PREPARATION_COMPLETED', 'Preparation Completed'), slug: 'PREPARATION_COMPLETED', percentage: 0.70, image: orderStatus4 },
      { key: 5, value: t('REJECTED_BY_BUSINESS', 'Rejected by business'), slug: 'REJECTED_BY_BUSINESS', percentage: 0, image: orderStatus5 },
      { key: 6, value: t('REJECTED_BY_DRIVER', 'Rejected by Driver'), slug: 'REJECTED_BY_DRIVER', percentage: 0, image: orderStatus6 },
      { key: 7, value: t('ACCEPTED_BY_BUSINESS', 'Accepted by business'), slug: 'ACCEPTED_BY_BUSINESS', percentage: 0.35, image: orderStatus7 },
      { key: 8, value: t('ACCEPTED_BY_DRIVER', 'Accepted by driver'), slug: 'ACCEPTED_BY_DRIVER', percentage: 0.45, image: orderStatus8 },
      { key: 9, value: t('PICK_UP_COMPLETED_BY_DRIVER', 'Pick up completed by driver'), slug: 'PICK_UP_COMPLETED_BY_DRIVER', percentage: 0.80, image: orderStatus9 },
      { key: 10, value: t('PICK_UP_FAILED_BY_DRIVER', 'Pick up Failed by driver'), slug: 'PICK_UP_FAILED_BY_DRIVER', percentage: 0, image: orderStatus10 },
      { key: 11, value: t('DELIVERY_COMPLETED_BY_DRIVER', 'Delivery completed by driver'), slug: 'DELIVERY_COMPLETED_BY_DRIVER', percentage: 1, image: orderStatus11 },
      { key: 12, value: t('DELIVERY_FAILED_BY_DRIVER', 'Delivery Failed by driver'), slug: 'DELIVERY_FAILED_BY_DRIVER', percentage: 0, image: orderStatus12 }
    ]


    const objectStatus = orderStatus.find((o) => o.key === status)

    return objectStatus && objectStatus
  }

  const handleOpenMessages = (data: any) => {
    setOpenMessages(data)
    readMessages && readMessages()
    if (order?.unread_count > 0) {
      data.business
        ? setUnreadAlert({ ...unreadAlert, business: false })
        : setUnreadAlert({ ...unreadAlert, driver: false })
    }
  }

  const unreadMessages = () => {
    const length = messages?.messages.length
    const unreadLength = order?.unread_count
    const unreadedMessages = messages.messages.slice(length - unreadLength, length)
    const business = unreadedMessages.some((message: any) => message?.can_see?.includes(2))
    const driver = unreadedMessages.some((message: any) => message?.can_see?.includes(4))
    setUnreadAlert({ business, driver })
  }

  const handleCloseModal = () => {
    setOpenMessages({ business: false, driver: false })
  }

  useEffect(() => {
    if (messagesReadList?.length) {
      openMessages.business ? setUnreadAlert({ ...unreadAlert, business: false }) : setUnreadAlert({ ...unreadAlert, driver: false })
    }
  }, [messagesReadList])

  return (
    <OrderDetailsContainer>
      <Spinner visible={!order || Object.keys(order).length === 0} />
      {order && Object.keys(order).length > 0 && (
        <>
          <Header>
            <NavBack>
              <MaterialCommunityIcon
                name='arrow-left'
                onPress={() => navigation.goBack()}
                size={24}
                color={colors.white}
                style={{ marginBottom: 10 }}
              />
            </NavBack>
            <HeaderInfo>
              <OIcon src={appLogo} height={50} width={150}></OIcon>
              <OText size={24} color={colors.white}>{order?.customer?.name} {t('THANKS_ORDER', 'thanks for your order!')}</OText>
              <OText color={colors.white}>{t('ORDER_MESSAGE_HEADER_TEXT', 'Once business accepts your order, we will send you an email, thank you!')}</OText>
              <View style={{ ...styles.rowDirection, justifyContent: 'space-between' }}>
                <OText size={20} color={colors.white} space>
                  {t('TOTAL', 'Total')}
                </OText>
                <OText size={20} color={colors.white}>{parsePrice(order?.summary?.total || order?.total)}</OText>
              </View>
            </HeaderInfo>
          </Header>
          <OrderContent>
            <OrderBusiness>
              <Logo>
                <OIcon url={order?.business?.logo} style={styles.logo}></OIcon>
              </Logo>
              <View>
                <OText style={styles.textBold}>{order?.business?.name}</OText>
                <Icons>
                  <TouchableOpacity>
                    <MaterialCommunityIcon
                      name='message-text-outline'
                      size={24}
                      color={colors.backgroundDark}
                      onPress={() => handleOpenMessages({ business: true, driver: false })}
                    />
                  </TouchableOpacity>
                </Icons>
              </View>
            </OrderBusiness>
            <View style={styles.rowDirection}>
              <OrderInfo>
                <OrderData>
                  <OText size={20}>{t('ORDER', 'Order')} #{order?.id}</OText>
                  <OText color={colors.textSecondary}>{t('DATE_TIME_FOR_ORDER', 'Date and time for your order')}</OText>
                  <OText size={18}>
                    {
                      order?.delivery_datetime_utc
                        ? parseDate(order?.delivery_datetime_utc)
                        : parseDate(order?.delivery_datetime, { utc: false })
                    }
                  </OText>
                  <StaturBar>
                    <LinearGradient
                      start={{ x: 0, y: 0 }}
                      end={{ x: getOrderStatus(order?.status)?.percentage || 0, y: 0 }}
                      locations={[getOrderStatus(order?.status)?.percentage || 0, 1]}
                      colors={[colors.primary, colors.disabled]}
                      style={styles.statusBar}
                    />
                  </StaturBar>
                </OrderData>
              </OrderInfo>
              <OrderStatus>
                <StatusImage>
                  <OIcon src={getOrderStatus(order?.status)?.image} width={80} height={80} />
                </StatusImage>
                <OText color={colors.primary}>{getOrderStatus(order?.status)?.value}</OText>
              </OrderStatus>
            </View>
            <OrderCustomer>
              <OText size={18}>{t('CUSTOMER', 'Customer')}</OText>
              <Customer>
                <CustomerPhoto>
                  <OIcon url={user?.photo} width={100} height={100} style={styles.logo} />
                </CustomerPhoto>
                <InfoBlock>
                  <OText size={18}>{order?.customer?.name} {order?.customer?.lastname}</OText>
                  <OText>{order?.customer?.address}</OText>
                </InfoBlock>
              </Customer>
            </OrderCustomer>
            <OrderDriver>
              <OText size={18}>{t('DRIVER', 'Driver')}</OText>
              <Customer>
                <CustomerPhoto>
                  <OIcon url={order?.driver?.photo} width={100} height={100} style={styles.logo} />
                </CustomerPhoto>
                <InfoBlock>
                  <OText size={18}>{order?.driver?.name} {order?.driver?.lastname}</OText>
                  <Icons>
                    <TouchableOpacity>
                      <MaterialCommunityIcon
                        name='message-text-outline'
                        size={24}
                        color={colors.backgroundDark}
                        onPress={() => handleOpenMessages({ driver: true, business: false })}
                      />
                    </TouchableOpacity>
                  </Icons>
                </InfoBlock>

              </Customer>
            </OrderDriver>
            <OrderProducts>
              <OText size={18}>{t('YOUR_ORDER', 'Your Order')}</OText>
              {order?.products?.length && order?.products.map((product: any, i: number) => (
                <ProductItemAccordion
                  key={product?.id || i}
                  product={product}
                />
              ))}
            </OrderProducts>
            <OrderBill>
              <Table>
                <OText>{t('SUBTOTAL', 'Subtotal')}</OText>
                <OText>{parsePrice(order?.summary?.subtotal || order?.subtotal)}</OText>
              </Table>
              <Table>
                <OText>
                  {order?.tax_type === 1
                    ? t('TAX_INCLUDED', 'Tax (included)')
                    : t('TAX', 'Tax')}
                  {`(${parseNumber(order?.tax)}%)`}
                </OText>
                <OText>{parsePrice(order?.summary?.tax || order?.totalTax)}</OText>
              </Table>
              {(order?.summary?.delivery_price > 0 || order?.deliveryFee > 0) && (
                <Table>
                  <OText>{t('DELIVERY_FEE', 'Delivery Fee')}</OText>
                  <OText>{parsePrice(order?.summary?.delivery_price || order?.deliveryFee)}</OText>
                </Table>
              )}
              <Table>
                <OText>
                  {t('DRIVER_TIP', 'Driver tip')}
                  {(order?.summary?.driver_tip > 0 || order?.driver_tip > 0) && (
                    `(${parseNumber(order?.driver_tip)}%)`
                  )}
                </OText>
                <OText>{parsePrice(order?.summary?.driver_tip || order?.totalDriverTip)}</OText>
              </Table>
              <Table>
                <OText>
                  {t('SERVICE_FEE', 'Service Fee')}
                  {`(${parseNumber(order?.service_fee)}%)`}
                </OText>
                <OText>{parsePrice(order?.summary?.service_fee || order?.serviceFee || 0)}</OText>
              </Table>
              {(order?.summary?.discount > 0 || order?.discount > 0) && (
                <Table>
                  {order?.offer_type === 1 ? (
                    <OText>
                      {t('DISCOUNT', 'Discount')}
                      <OText>{`(${parseNumber(order?.offer_rate)}%)`}</OText>
                    </OText>
                  ) : (
                    <OText>{t('DISCOUNT', 'Discount')}</OText>
                  )}
                  <OText>- {parsePrice(order?.summary?.discount || order?.discount)}</OText>
                </Table>
              )}
              <Total>
                <Table>
                  <OText style={styles.textBold}>{t('TOTAL', 'Total')}</OText>
                  <OText style={styles.textBold} color={colors.primary}>{parsePrice(order?.summary?.total || order?.total)}</OText>
                </Table>
              </Total>
            </OrderBill>
          </OrderContent>
        </>
      )}
      <OModal open={openMessages.business || openMessages.driver} EntireModal onClose={() => handleCloseModal()}>
        <Messages
          type={openMessages.business ? USER_TYPE.BUSINESS : USER_TYPE.DRIVER}
          orderId={order?.id}
          messages={messages}
          order={order}
          setMessages={setMessages}
        />
      </OModal>

    </OrderDetailsContainer>
  )
}

const styles = StyleSheet.create({
  rowDirection: {
    flexDirection: 'row'
  },
  statusBar: {
    height: 10,
  },
  logo: {
    width: 75,
    height: 75,
    borderRadius: 10
  },
  textBold: {
    fontWeight: 'bold'
  }
})


export const OrderDetails = (props: OrderDetailsParams) => {
  const orderDetailsProps = {
    ...props,
    UIComponent: OrderDetailsUI
  }

  return (
    <OrderDetailsConTableoller {...orderDetailsProps} />
  )
}
