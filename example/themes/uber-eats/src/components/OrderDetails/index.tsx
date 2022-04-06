import React, { useState, useEffect } from 'react'
import { View, StyleSheet, BackHandler, TouchableOpacity, I18nManager, Animated, Pressable } from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Messages } from '../Messages'
import {
  useLanguage,
  OrderDetails as OrderDetailsConTableoller,
  useUtils,
  useConfig,
  useSession,
  useOrder
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
  StatusBar,
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
  Icons,
  OrderDriver,
  Map,
  WrapperStatusBarItem,
  StatusItem
} from './styles'
import { OButton, OIcon, OModal, OText } from '../shared'
import { ProductItemAccordion } from '../ProductItemAccordion'
import { OrderDetailsParams } from '../../types'
import { USER_TYPE } from '../../config/constants'
import { GoogleMap } from '../GoogleMap'
import { verifyDecimals } from '../../utils'
import { useTheme } from 'styled-components/native'
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import AntIcon from 'react-native-vector-icons/AntDesign'
import { OSRow } from '../OrderSummary/styles';
import { TaxInformation } from '../TaxInformation';

export const OrderDetailsUI = (props: OrderDetailsParams) => {
  const {
    navigation,
    messages,
    setMessages,
    readMessages,
    messagesReadList,
    isFromCheckout,
    isFromRoot,
    driverLocation,
    goToBusinessList
  } = props

  const theme = useTheme()

  const styles = StyleSheet.create({
    statusBar: {
      transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
      height: 10,
    },
    logo: {
      width: 75,
      height: 75,
      borderRadius: 10
    },
    textBold: {
      fontWeight: '500'
    },
    btnBackArrow: {
      width: 40,
      height: 40,
    },
  })

  const [, t] = useLanguage()
  const [{ parsePrice, parseNumber, parseDate }] = useUtils()
  const [{ user }] = useSession()
  const [{ configs }] = useConfig()
  const [, { refreshOrderOptions }] = useOrder()
  const [openModalForBusiness, setOpenModalForBusiness] = useState(false)
  const [openModalForDriver, setOpenModalForDriver] = useState(false)
  const [unreadAlert, setUnreadAlert] = useState({ business: false, driver: false })
  const [openTaxModal, setOpenTaxModal] = useState<any>({ open: false, data: null })

  const { order, businessData } = props.order

  const getOrderStatus = (s: string) => {
    const status = parseInt(s)
    const orderStatus = [
      { key: 0, value: t('PENDING', 'Pending'), slug: 'PENDING', progress: 1 },
      { key: 1, value: t('COMPLETED', 'Completed'), slug: 'COMPLETED', progress: 3 },
      { key: 2, value: t('REJECTED', 'Rejected'), slug: 'REJECTED', progress: 0 },
      { key: 3, value: t('DRIVER_IN_BUSINESS', 'Driver in business'), slug: 'DRIVER_IN_BUSINESS', progress: 2 },
      { key: 4, value: t('PREPARATION_COMPLETED', 'Preparation Completed'), slug: 'PREPARATION_COMPLETED', progress: 2 },
      { key: 5, value: t('REJECTED_BY_BUSINESS', 'Rejected by business'), slug: 'REJECTED_BY_BUSINESS', progress: 0 },
      { key: 6, value: t('REJECTED_BY_DRIVER', 'Rejected by Driver'), slug: 'REJECTED_BY_DRIVER', progress: 0 },
      { key: 7, value: t('ACCEPTED_BY_BUSINESS', 'Accepted by business'), slug: 'ACCEPTED_BY_BUSINESS', progress: 2 },
      { key: 8, value: t('ACCEPTED_BY_DRIVER', 'Accepted by driver'), slug: 'ACCEPTED_BY_DRIVER', progress: 2 },
      { key: 9, value: t('PICK_UP_COMPLETED_BY_DRIVER', 'Pick up completed by driver'), slug: 'PICK_UP_COMPLETED_BY_DRIVER', progress: 2 },
      { key: 10, value: t('PICK_UP_FAILED_BY_DRIVER', 'Pick up Failed by driver'), slug: 'PICK_UP_FAILED_BY_DRIVER', progress: 0 },
      { key: 11, value: t('DELIVERY_COMPLETED_BY_DRIVER', 'Delivery completed by driver'), slug: 'DELIVERY_COMPLETED_BY_DRIVER', progress: 3 },
      { key: 12, value: t('DELIVERY_FAILED_BY_DRIVER', 'Delivery Failed by driver'), slug: 'DELIVERY_FAILED_BY_DRIVER', progress: 0 },
      { key: 13, value: t('PREORDER', 'PreOrder'), slug: 'PREORDER', progress: 1 },
      { key: 14, value: t('ORDER_NOT_READY', 'Order not ready'), slug: 'ORDER_NOT_READY', progress: 0 },
      { key: 15, value: t('ORDER_PICKEDUP_COMPLETED_BY_CUSTOMER', 'Order picked up completed by customer'), slug: 'ORDER_PICKEDUP_COMPLETED_BY_CUSTOMER', process: 3 },
      { key: 16, value: t('CANCELLED_BY_CUSTOMER', 'Cancelled by customer'), slug: 'CANCELLED_BY_CUSTOMER', progress: 0 },
      { key: 17, value: t('ORDER_NOT_PICKEDUP_BY_CUSTOMER', 'Order not picked up by customer'), slug: 'ORDER_NOT_PICKEDUP_BY_CUSTOMER', progress: 0 },
      { key: 18, value: t('DRIVER_ALMOST_ARRIVED_TO_BUSINESS', 'Driver almost arrived to business'), slug: 'DRIVER_ALMOST_ARRIVED_TO_BUSINESS', progress: 2 },
      { key: 19, value: t('DRIVER_ALMOST_ARRIVED_TO_CUSTOMER', 'Driver almost arrived to customer'), slug: 'DRIVER_ALMOST_ARRIVED_TO_CUSTOMER', progress: 2 },
      { key: 20, value: t('ORDER_CUSTOMER_ALMOST_ARRIVED_BUSINESS', 'Customer almost arrived to business'), slug: 'ORDER_CUSTOMER_ALMOST_ARRIVED_BUSINESS', progress: 2 },
      { key: 21, value: t('ORDER_CUSTOMER_ARRIVED_BUSINESS', 'Customer arrived to business'), slug: 'ORDER_CUSTOMER_ARRIVED_BUSINESS', progress: 2 },
      { key: 22, value: t('ORDER_LOOKING_FOR_DRIVER', 'Looking for driver'), slug: 'ORDER_LOOKING_FOR_DRIVER', progress: 2 },
      { key: 23, value: t('ORDER_DRIVER_ON_WAY', 'Driver on way'), slug: 'ORDER_DRIVER_ON_WAY', progress: 2 }
    ]

    const objectStatus = orderStatus.find((o) => o.key === status)
    return objectStatus && objectStatus
  }

  const handleOpenMessagesForBusiness = () => {
    setOpenModalForBusiness(true)
    readMessages && readMessages()
    setUnreadAlert({ ...unreadAlert, business: false })
  }

  const handleOpenMessagesForDriver = () => {
    setOpenModalForDriver(true)
    readMessages && readMessages()
    setUnreadAlert({ ...unreadAlert, driver: false })
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
    setOpenModalForBusiness(false)
    setOpenModalForDriver(false)
  }

  const handleArrowBack: any = () => {
    if ((!isFromCheckout && !goToBusinessList) || isFromRoot) {
      navigation?.canGoBack() && navigation.goBack();
      return
    }
    if (goToBusinessList) {
      refreshOrderOptions()
    }
    navigation.navigate('BottomTab');
  }

  const getIncludedTaxes = () => {
    if (order?.taxes?.length === 0) {
      return order.tax_type === 1 ? order?.summary?.tax ?? 0 : 0
    } else {
      return order?.taxes.reduce((taxIncluded: number, tax: any) => {
        return taxIncluded + (tax.type === 1 ? tax.summary?.tax : 0)
      }, 0)
    }
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleArrowBack);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleArrowBack);
    }
  }, [])

  useEffect(() => {
    if (messagesReadList?.length) {
      openModalForBusiness ? setUnreadAlert({ ...unreadAlert, business: false }) : setUnreadAlert({ ...unreadAlert, driver: false })
    }
  }, [messagesReadList])

  const locations = [
    { ...order?.driver?.location, title: t('DRIVER', 'Driver'), icon: order?.driver?.photo || 'https://res.cloudinary.com/demo/image/fetch/c_thumb,g_face,r_max/https://www.freeiconspng.com/thumbs/driver-icon/driver-icon-14.png' },
    { ...order?.business?.location, title: order?.business?.name, icon: order?.business?.logo || theme.images.dummies.businessLogo },
    { ...order?.customer?.location, title: t('YOUR_LOCATION', 'Your Location'), icon: order?.customer?.photo || 'https://res.cloudinary.com/demo/image/upload/c_thumb,g_face,r_max/d_avatar.png/non_existing_id.png' }
  ]

  useEffect(() => {
    if (driverLocation) {
      locations[0] = driverLocation
    }
  }, [driverLocation])

  return (
    <OrderDetailsContainer
      keyboardShouldPersistTaps='handled'
      showsVerticalScrollIndicator={false}
    >
      <Header>
        <TouchableOpacity
          onPress={() => handleArrowBack()}
        >
          <MaterialComIcon
            name='arrow-left'
            color={theme.colors.black}
            size={24}
          />
        </TouchableOpacity>
        <OText size={20} style={{ flex: 1, textAlign: 'center', paddingRight: 24 }}>{t('ORDER', 'Order')} {order?.id}</OText>
      </Header>
      <Spinner visible={!order || Object.keys(order).length === 0} />
      {order && Object.keys(order).length > 0 && (
        <>
          <OrderContent>
            <OrderBusiness>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  width: '70%'
                }}
              >
                <View>
                  <OText
                    size={26}
                    style={styles.textBold}
                    numberOfLines={1}
                    ellipsizeMode='tail'
                  >
                    {order?.business?.name}
                  </OText>
                </View>
                <OText color={theme.colors.gray} numberOfLines={1}>
                  {order?.business?.address}
                </OText>
                <OText>
                  {
                    order?.delivery_datetime_utc
                      ? parseDate(order?.delivery_datetime_utc)
                      : parseDate(order?.delivery_datetime, { utc: false })
                  }
                </OText>
              </View>
              <Icons>
                <MaterialCommunityIcon
                  name='store'
                  size={28}
                  color={theme.colors.backgroundDark}
                  onPress={() => props.navigation.navigate('Business', { store: businessData?.slug })}
                />
                <TouchableOpacity onPress={() => handleOpenMessagesForBusiness()}>
                  <MaterialCommunityIcon
                    name='message-text-outline'
                    size={26}
                    color={theme.colors.backgroundDark}
                  />
                </TouchableOpacity>
              </Icons>
            </OrderBusiness>
            <View style={{ backgroundColor: theme.colors.white, flex: 1 }}>
              <OrderStatus>
                <OText color={theme.colors.green} style={{ textAlign: 'left' }}>{getOrderStatus(order?.status)?.value}</OText>
              </OrderStatus>
              <OrderInfo>
                <OrderData>
                  <StatusBar>
                    <WrapperStatusBarItem>
                      <StatusItem
                        active={(getOrderStatus(order?.status)?.progress || 0) >= 1}
                      />
                      <OIcon
                        src={theme.images.order.pending}
                        width={20}
                        style={{ tintColor: (getOrderStatus(order?.status)?.progress || 0) >= 1 ? theme.colors.green : theme.colors.gray }}
                      />
                    </WrapperStatusBarItem>
                    <WrapperStatusBarItem>
                      <StatusItem
                        active={(getOrderStatus(order?.status)?.progress || 0) >= 2}
                      />
                      <OIcon
                        src={theme.images.order.inProgress}
                        width={20}
                        style={{ tintColor: (getOrderStatus(order?.status)?.progress || 0) >= 2 ? theme.colors.green : theme.colors.gray }}
                      />
                    </WrapperStatusBarItem>
                    <WrapperStatusBarItem>
                      <StatusItem
                        active={(getOrderStatus(order?.status)?.progress || 0) === 3}
                      />
                      <OIcon
                        src={theme.images.order.completed}
                        width={20}
                        style={{ tintColor: (getOrderStatus(order?.status)?.progress || 0) === 3 ? theme.colors.green : theme.colors.gray }}
                      />
                    </WrapperStatusBarItem>
                  </StatusBar>
                </OrderData>
              </OrderInfo>
            </View>
            <OrderProducts>
              <OText size={18} style={{ textAlign: 'left' }}>{t('YOUR_ORDER', 'Your Order')}</OText>
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
                <OText>{parsePrice(((order?.summary?.subtotal || order?.subtotal) + getIncludedTaxes()))}</OText>
              </Table>
              {(order?.summary?.discount > 0 || order?.discount > 0) && (
                <Table>
                  {order?.offer_type === 1 ? (
                    <OText>
                      {t('DISCOUNT', 'Discount')}
                      <OText>{`(${verifyDecimals(order?.offer_rate, parsePrice)}%)`}</OText>
                    </OText>
                  ) : (
                    <OText>{t('DISCOUNT', 'Discount')}</OText>
                  )}
                  <OText>- {parsePrice(order?.summary?.discount || order?.discount)}</OText>
                </Table>
              )}
              {
                order?.taxes?.length === 0 && order?.tax_type === 2 && (
                  <Table>
                    <OText>
                      {t('TAX', 'Tax')} {`(${verifyDecimals(order?.tax, parseNumber)}%)`}
                    </OText>
                    <OText>{parsePrice(order?.summary?.tax || 0)}</OText>
                  </Table>
                )
              }
              {
                order?.fees?.length === 0 && (
                  <Table>
                    <OText>
                      {t('SERVICE_FEE', 'Service fee')}
                      {`(${verifyDecimals(order?.service_fee, parseNumber)}%)`}
                    </OText>
                    <OText>{parsePrice(order?.summary?.service_fee || 0)}</OText>
                  </Table>
                )
              }
              {
                order?.taxes?.length > 0 && order?.taxes?.filter((tax: any) => tax?.type === 2 && tax?.rate !== 0).map((tax: any) => (
                  <Table key={tax.id}>
                    <OSRow>
                      <OText numberOfLines={1}>
                        {tax.name || t('INHERIT_FROM_BUSINESS', 'Inherit from business')}
                        {`(${verifyDecimals(tax?.rate, parseNumber)}%)`}{' '}
                      </OText>
                      <TouchableOpacity onPress={() => setOpenTaxModal({ open: true, data: tax })}>
                        <AntIcon name='exclamationcircleo' size={18} color={theme.colors.primary} />
                      </TouchableOpacity>
                    </OSRow>
                    <OText>{parsePrice(tax?.summary?.tax || 0)}</OText>
                  </Table>
                ))
              }
              {
                order?.fees?.length > 0 && order?.fees?.filter((fee: any) => !(fee.fixed === 0 && fee.percentage === 0))?.map((fee: any) => (
                  <Table key={fee.id}>
                    <OSRow>
                      <OText numberOfLines={1}>
                        {fee.name || t('INHERIT_FROM_BUSINESS', 'Inherit from business')}
                        ({parsePrice(fee?.fixed)} + {fee.percentage}%){' '}
                      </OText>
                      <TouchableOpacity onPress={() => setOpenTaxModal({ open: true, data: fee })}>
                        <AntIcon name='exclamationcircleo' size={18} color={theme.colors.primary} />
                      </TouchableOpacity>
                    </OSRow>
                    <OText>{parsePrice(fee?.fixed + fee?.summary?.percentage || 0)}</OText>
                  </Table>
                ))
              }
              {(order?.summary?.delivery_price > 0 || order?.deliveryFee > 0) && (
                <Table>
                  <OText>{t('DELIVERY_FEE', 'Delivery Fee')}</OText>
                  <OText>{parsePrice(order?.summary?.delivery_price || order?.deliveryFee)}</OText>
                </Table>
              )}
              <Table>
                <OText>
                  {t('DRIVER_TIP', 'Driver tip')}
                  {(order?.summary?.driver_tip > 0 || order?.driver_tip > 0) &&
                    parseInt(configs?.driver_tip_type?.value, 10) === 2 &&
                    !parseInt(configs?.driver_tip_use_custom?.value, 10) &&
                    (
                      `(${verifyDecimals(order?.driver_tip, parseNumber)}%)`
                    )}
                </OText>
                <OText>{parsePrice(order?.summary?.driver_tip || order?.totalDriverTip)}</OText>
              </Table>
              <Total>
                <Table>
                  <OText style={styles.textBold}>{t('TOTAL', 'Total')}</OText>
                  <OText style={styles.textBold} color={theme.colors.primary}>{parsePrice(order?.summary?.total || order?.total)}</OText>
                </Table>
              </Total>
              {order?.comment && (
                <Table>
                  <OText style={{ flex: 1 }}>{t('COMMENT', 'Comment')}</OText>
                  <OText style={{ maxWidth: '70%' }}>
                    {order?.comment}
                  </OText>
                </Table>
              )}
            </OrderBill>
            <OrderCustomer>
              <OText size={18} mBottom={5} style={{ textAlign: 'left' }}>{t('CUSTOMER', 'Customer')}</OText>
              <Customer>
                <CustomerPhoto>
                  <OIcon
                    url={user?.photo}
                    width={100}
                    height={100}
                    style={styles.logo}
                  />
                </CustomerPhoto>
                <InfoBlock>
                  <OText style={{ textAlign: 'left' }}>{order?.customer?.name} {order?.customer?.lastname}</OText>
                  <OText style={{ textAlign: 'left' }}>{order?.customer?.address}</OText>
                </InfoBlock>
              </Customer>
              {order?.driver && (
                <>
                  {order?.driver?.location && parseInt(order?.status) === 9 && (
                    <Map>
                      <GoogleMap
                        location={order?.driver?.location}
                        locations={locations}
                        readOnly
                      />
                    </Map>
                  )}
                </>
              )}
            </OrderCustomer>
            {order?.driver && (
              <OrderDriver>
                <OText size={18} mBottom={5} style={{ textAlign: 'left' }}>{t('YOUR_DRIVER', 'Your Driver')}</OText>
                <Customer>
                  <CustomerPhoto>
                    <OIcon
                      url={order?.driver?.photo}
                      width={100}
                      height={100}
                      style={styles.logo}
                    />
                  </CustomerPhoto>
                  <InfoBlock>
                    <OText style={{ textAlign: 'left' }}>{order?.driver?.name} {order?.driver?.lastname}</OText>
                    <Icons>
                      <TouchableOpacity onPress={() => handleOpenMessagesForDriver()}>
                        <MaterialCommunityIcon
                          name='message-text-outline'
                          size={24}
                          color={theme.colors.backgroundDark}
                        />
                      </TouchableOpacity>
                    </Icons>
                  </InfoBlock>
                </Customer>
              </OrderDriver>
            )}
          </OrderContent>
        </>
      )}
      <OModal open={openModalForBusiness || openModalForDriver} entireModal onClose={() => handleCloseModal()}>
        <Messages
          type={openModalForBusiness ? USER_TYPE.BUSINESS : USER_TYPE.DRIVER}
          orderId={order?.id}
          messages={messages}
          order={order}
          setMessages={setMessages}
        />
      </OModal>
      <OModal
        open={openTaxModal.open}
        onClose={() => setOpenTaxModal({ open: false, data: null })}
        entireModal
      >
        <TaxInformation data={openTaxModal.data} products={order?.products} />
      </OModal>
    </OrderDetailsContainer>
  )
}

export const OrderDetails = (props: OrderDetailsParams) => {
  const orderDetailsProps = {
    ...props,
    UIComponent: OrderDetailsUI
  }

  return (
    <OrderDetailsConTableoller {...orderDetailsProps} />
  )
}
