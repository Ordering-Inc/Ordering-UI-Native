import React, { useState, useEffect } from 'react'
import { View, StyleSheet, BackHandler, TouchableOpacity, I18nManager } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import AntIcon from 'react-native-vector-icons/AntDesign'
import { Messages } from '../Messages'
import { ShareComponent } from '../ShareComponent'
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  Icons,
  OrderDriver,
  Map,
  LoadingWrapper,
  Divider
} from './styles'
import { OButton, OIcon, OModal, OText } from '../shared'
import { ProductItemAccordion } from '../ProductItemAccordion'
import { OrderDetailsParams } from '../../types'
import { USER_TYPE } from '../../config/constants'
import { GoogleMap } from '../GoogleMap'
import { verifyDecimals } from '../../utils'
import { useTheme } from 'styled-components/native'
import { NotFoundSource } from '../NotFoundSource'
import { OrderCreating } from '../OrderCreating';
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
    goToBusinessList,
    onNavigationRedirect
  } = props

  const theme = useTheme()

  const styles = StyleSheet.create({
    rowDirection: {
      flexDirection: 'row'
    },
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
      fontWeight: 'bold'
    },
    btnBackArrow: {
      borderWidth: 0,
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
      shadowColor: theme.colors.primary,
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      paddingLeft: 0,
      height: 30
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
  const [isReviewed, setIsReviewed] = useState(false)
  const [openOrderCreating, setOpenOrderCreating] = useState(false)
  const [openTaxModal, setOpenTaxModal] = useState<any>({ open: false, tax: null, type: '' })
  const { order, loading, businessData, error } = props.order

  const getOrderStatus = (s: string) => {
    const status = parseInt(s)
    const orderStatus = [
      { key: 0, value: t('PENDING', 'Pending'), slug: 'PENDING', percentage: 0.25, image: theme.images.order.status0 },
      { key: 1, value: t('COMPLETED', 'Completed'), slug: 'COMPLETED', percentage: 1, image: theme.images.order.status1 },
      { key: 2, value: t('REJECTED', 'Rejected'), slug: 'REJECTED', percentage: 0, image: theme.images.order.status2 },
      { key: 3, value: t('DRIVER_IN_BUSINESS', 'Driver in business'), slug: 'DRIVER_IN_BUSINESS', percentage: 0.60, image: theme.images.order.status3 },
      { key: 4, value: t('PREPARATION_COMPLETED', 'Preparation Completed'), slug: 'PREPARATION_COMPLETED', percentage: 0.70, image: theme.images.order.status4 },
      { key: 5, value: t('REJECTED_BY_BUSINESS', 'Rejected by business'), slug: 'REJECTED_BY_BUSINESS', percentage: 0, image: theme.images.order.status5 },
      { key: 6, value: t('REJECTED_BY_DRIVER', 'Rejected by Driver'), slug: 'REJECTED_BY_DRIVER', percentage: 0, image: theme.images.order.status6 },
      { key: 7, value: t('ACCEPTED_BY_BUSINESS', 'Accepted by business'), slug: 'ACCEPTED_BY_BUSINESS', percentage: 0.35, image: theme.images.order.status7 },
      { key: 8, value: t('ACCEPTED_BY_DRIVER', 'Accepted by driver'), slug: 'ACCEPTED_BY_DRIVER', percentage: 0.45, image: theme.images.order.status8 },
      { key: 9, value: t('PICK_UP_COMPLETED_BY_DRIVER', 'Pick up completed by driver'), slug: 'PICK_UP_COMPLETED_BY_DRIVER', percentage: 0.80, image: theme.images.order.status9 },
      { key: 10, value: t('PICK_UP_FAILED_BY_DRIVER', 'Pick up Failed by driver'), slug: 'PICK_UP_FAILED_BY_DRIVER', percentage: 0, image: theme.images.order.status10 },
      { key: 11, value: t('DELIVERY_COMPLETED_BY_DRIVER', 'Delivery completed by driver'), slug: 'DELIVERY_COMPLETED_BY_DRIVER', percentage: 1, image: theme.images.order.status11 },
      { key: 12, value: t('DELIVERY_FAILED_BY_DRIVER', 'Delivery Failed by driver'), slug: 'DELIVERY_FAILED_BY_DRIVER', percentage: 0, image: theme.images.order.status12 },
      { key: 13, value: t('PREORDER', 'PreOrder'), slug: 'PREORDER', percentage: 0, image: theme.images.order.status13 },
      { key: 14, value: t('ORDER_NOT_READY', 'Order not ready'), slug: 'ORDER_NOT_READY', percentage: 0, image: theme.images.order.status14 },
      { key: 15, value: t('ORDER_PICKEDUP_COMPLETED_BY_CUSTOMER', 'Order picked up completed by customer'), slug: 'ORDER_PICKEDUP_COMPLETED_BY_CUSTOMER', percentage: 100, image: theme.images.order.status15 },
      { key: 16, value: t('CANCELLED_BY_CUSTOMER', 'Cancelled by customer'), slug: 'CANCELLED_BY_CUSTOMER', percentage: 0, image: theme.images.order.status16 },
      { key: 17, value: t('ORDER_NOT_PICKEDUP_BY_CUSTOMER', 'Order not picked up by customer'), slug: 'ORDER_NOT_PICKEDUP_BY_CUSTOMER', percentage: 0, image: theme.images.order.status17 },
      { key: 18, value: t('DRIVER_ALMOST_ARRIVED_TO_BUSINESS', 'Driver almost arrived to business'), slug: 'DRIVER_ALMOST_ARRIVED_TO_BUSINESS', percentage: 0.15, image: theme.images.order.status18 },
      { key: 19, value: t('DRIVER_ALMOST_ARRIVED_TO_CUSTOMER', 'Driver almost arrived to customer'), slug: 'DRIVER_ALMOST_ARRIVED_TO_CUSTOMER', percentage: 0.90, image: theme.images.order.status19 },
      { key: 20, value: t('ORDER_CUSTOMER_ALMOST_ARRIVED_BUSINESS', 'Customer almost arrived to business'), slug: 'ORDER_CUSTOMER_ALMOST_ARRIVED_BUSINESS', percentage: 90, image: theme.images.order.status20 },
      { key: 21, value: t('ORDER_CUSTOMER_ARRIVED_BUSINESS', 'Customer arrived to business'), slug: 'ORDER_CUSTOMER_ARRIVED_BUSINESS', percentage: 95, image: theme.images.order.status21 }
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

  const handleClickOrderReview = (order: any) => {
    navigation.navigate(
      'ReviewOrder',
      {
        order: {
          id: order?.id,
          business_id: order?.business_id,
          logo: order.business?.logo,
          driver: order?.driver,
          products: order?.products,
          review: order?.review,
          user_review: order?.user_review
        },
        setIsReviewed
      }
    )
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

  const getIncludedTaxesDiscounts = () => {
    return order?.taxes?.filter((tax: any) => tax?.type === 1)?.reduce((carry: number, tax: any) => carry + (tax?.summary?.tax_after_discount ?? tax?.summary?.tax), 0)
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

  let locations = [
    { ...order?.driver?.location, title: t('DRIVER', 'Driver'), icon: order?.driver?.photo || 'https://res.cloudinary.com/demo/image/fetch/c_thumb,g_face,r_max/https://www.freeiconspng.com/thumbs/driver-icon/driver-icon-14.png' },
    { ...order?.business?.location, title: order?.business?.name, icon: order?.business?.logo || theme.images.dummies.businessLogo },
    { ...order?.customer?.location, title: t('YOUR_LOCATION', 'Your Location'), icon: order?.customer?.photo || 'https://res.cloudinary.com/demo/image/upload/c_thumb,g_face,r_max/d_avatar.png/non_existing_id.png' }
  ]

  useEffect(() => {
    if (driverLocation) {
      locations[0] = { ...locations[0], lat: driverLocation.lat, lng: driverLocation.lng }
    }
  }, [driverLocation])

  useEffect(() => {
    if (!loading) {
      setOpenOrderCreating(false)
      try {
        AsyncStorage.removeItem('business-address')
      } catch {
        console.log('error')
      }
    }
  }, [loading])

  useEffect(() => {
    AsyncStorage.getItem('business-address', (err, result) => {
      if (result !== null) setOpenOrderCreating(true)
    })
  }, [])

  return (
    <OrderDetailsContainer keyboardShouldPersistTaps='handled'>
      {order && order?.id && !error && !loading && (
        <>
          <Header>
            <OButton
              imgLeftSrc={theme.images.general.arrow_left}
              imgRightSrc={null}
              style={styles.btnBackArrow}
              onClick={() => handleArrowBack()}
              imgLeftStyle={{ tintColor: '#fff' }}
            />
            <HeaderInfo>
              <OIcon
                src={theme.images.logos.logotypeInvert}
                height={50}
                width={180}
              />
              <OText size={28} color={theme.colors.white} style={{ fontWeight: '600', alignItems: 'flex-start' }}>
                {order?.customer?.name} {t('THANKS_ORDER', 'thanks for your order!')}
              </OText>
              <OText color={theme.colors.white}>{t('ORDER_MESSAGE_HEADER_TEXT', 'Once business accepts your order, we will send you an email, thank you!')}</OText>
              <View style={{ ...styles.rowDirection, justifyContent: 'space-between' }}>
                <OText size={20} color={theme.colors.white} space>
                  {t('TOTAL', 'Total')}
                </OText>
                <OText size={20} color={theme.colors.white}>{parsePrice(order?.summary?.total ?? order?.total)}</OText>
              </View>
            </HeaderInfo>
          </Header>
          <OrderContent>
            <OrderBusiness>
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <Logo>
                  <OIcon
                    url={order?.business?.logo}
                    style={styles.logo}
                  />
                </Logo>
                <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '60%' }}>
                  <View>
                    <OText
                      size={20}
                      style={styles.textBold}
                      numberOfLines={1}
                      ellipsizeMode='tail'
                    >
                      {order?.business?.name}
                    </OText>
                  </View>
                  <OText size={17}>{order?.business?.email}</OText>
                  <OText size={17}>{order?.business?.cellphone}</OText>
                </View>
              </View>
              <Icons>
                {order.uuid && order.hash_key && (
                  <ShareComponent orderId={order.uuid} hashkey={order.hash_key} />
                )}
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
            <View style={{ ...styles.rowDirection, backgroundColor: theme.colors.white }}>
              <OrderInfo>
                <OrderData>
                  <View style={{ alignItems: 'flex-start' }}>
                    <OText size={20}>{t('ORDER', 'Order')} #{order?.id}</OText>
                    <OText color={theme.colors.textSecondary}>{t('DATE_TIME_FOR_ORDER', 'Date and time for your order')}</OText>
                    <OText size={18}>
                      {
                        order?.delivery_datetime_utc
                          ? parseDate(order?.delivery_datetime_utc)
                          : parseDate(order?.delivery_datetime, { utc: false })
                      }
                    </OText>
                  </View>
                  <StaturBar>
                    <LinearGradient
                      start={{ x: 0.0, y: 0.0 }}
                      end={{ x: getOrderStatus(order?.status)?.percentage || 0, y: 0 }}
                      locations={[.9999, .9999]}
                      colors={[theme.colors.primary, theme.colors.disabled]}
                      style={styles.statusBar}
                    />
                  </StaturBar>
                </OrderData>
              </OrderInfo>
              <OrderStatus>
                <StatusImage>
                  <OIcon
                    src={getOrderStatus(order?.status)?.image}
                    width={80}
                    height={80}
                  />
                </StatusImage>
                <OText color={theme.colors.primary}>{getOrderStatus(order?.status)?.value}</OText>
              </OrderStatus>
            </View>
            <OrderCustomer>
              <OText size={18} style={{ textAlign: 'left' }}>{t('CUSTOMER', 'Customer')}</OText>
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
                  <OText size={18} style={{ textAlign: 'left' }} >{order?.customer?.name} {order?.customer?.lastname}</OText>
                  <OText style={{ textAlign: 'left' }}>{order?.customer?.address}</OText>
                </InfoBlock>
              </Customer>
              {order?.delivery_option !== undefined && order?.delivery_type === 1 && (
                <View>
                  <OText size={18} style={{ textAlign: 'left' }}>{t('DELIVERY_PREFERENCE', 'Delivery Preference')}</OText>
                  <OText style={{ textAlign: 'left' }}>{order?.delivery_option?.name}</OText>
                </View>
              )}
              {order?.comment && (
                <View>
                  <OText size={18} style={{ textAlign: 'left' }} >{t('COMMENT', 'Comment')}</OText>
                  <OText style={{ textAlign: 'left' }}>{order?.comment}</OText>
                </View>
              )}
              {order?.driver && (
                <>
                  {order?.driver?.location && parseInt(order?.status) === 9 && (
                    <Map>
                      <GoogleMap
                        location={driverLocation ?? order?.driver?.location}
                        locations={locations}
                      />
                    </Map>
                  )}
                </>
              )}
            </OrderCustomer>
            {order?.driver && (
              <OrderDriver>
                <OText size={18}>{t('YOUR_DRIVER', 'Your Driver')}</OText>
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
                    <OText size={18}>{order?.driver?.name} {order?.driver?.lastname}</OText>
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
                <OText>
                  {parsePrice(((order?.summary?.subtotal ?? order?.subtotal) + getIncludedTaxes()))}
                </OText>
              </Table>
              {(order?.summary?.discount > 0 ?? order?.discount > 0) && order?.offers?.length === 0 && (
                <Table>
                  {order?.offer_type === 1 ? (
                    <OText>
                      {t('DISCOUNT', theme?.defaultLanguages?.DISCOUNT || 'Discount')}{' '}
                      <OText>{`(${verifyDecimals(order?.offer_rate, parsePrice)}%)`}</OText>
                    </OText>
                  ) : (
                    <OText>{t('DISCOUNT', theme?.defaultLanguages?.DISCOUNT || 'Discount')}</OText>
                  )}
                  <OText>- {parsePrice(order?.summary?.discount ?? order?.discount)}</OText>
                </Table>
              )}
              {
                order?.offers?.length > 0 && order?.offers?.filter((offer: any) => offer?.target === 1)?.map((offer: any) => (
                  <Table key={offer.id}>
                    <OSRow>
                      <OText numberOfLines={1}>
                        {offer.name}
                        {offer.rate_type === 1 && (
                          <OText>{`(${verifyDecimals(offer?.rate, parsePrice)}%)`}</OText>
                        )}
                      </OText>
                      <TouchableOpacity style={{ marginLeft: 5 }} onPress={() => setOpenTaxModal({ open: true, data: offer, type: 'offer_target_1' })}>
                        <AntIcon name='exclamationcircleo' size={18} color={theme.colors.primary} />
                      </TouchableOpacity>
                    </OSRow>
                    <OText>- {parsePrice(offer?.summary?.discount)}</OText>
                  </Table>
                ))
              }
              <Divider />
              {order?.summary?.subtotal_with_discount > 0 && order?.summary?.discount > 0 && order?.summary?.total >= 0 && (
                <Table>
                  <OText>{t('SUBTOTAL_WITH_DISCOUNT', 'Subtotal with discount')}</OText>
                  {order?.tax_type === 1 ? (
                    <OText>{parsePrice((order?.summary?.subtotal_with_discount + getIncludedTaxesDiscounts() ?? 0))}</OText>
                  ) : (
                    <OText>{parsePrice(order?.summary?.subtotal_with_discount ?? 0)}</OText>
                  )}
                </Table>
              )}
              {
                order?.taxes?.length === 0 && order?.tax_type === 2 && (
                  <Table>
                    <OText>
                      {t('TAX', 'Tax')} {`(${verifyDecimals(order?.tax, parseNumber)}%)`}
                    </OText>
                    <OText>{parsePrice(order?.summary?.tax ?? 0)}</OText>
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
                    <OText>{parsePrice(order?.summary?.service_fee ?? 0)}</OText>
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
                      <TouchableOpacity onPress={() => setOpenTaxModal({ open: true, data: tax, type: 'tax' })}>
                        <AntIcon name='exclamationcircleo' size={18} color={theme.colors.primary} />
                      </TouchableOpacity>
                    </OSRow>
                    <OText>{parsePrice(tax?.summary?.tax_after_discount ?? tax?.summary?.tax ?? 0)}</OText>
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
                      <TouchableOpacity onPress={() => setOpenTaxModal({ open: true, data: fee, type: 'fee' })}>
                        <AntIcon name='exclamationcircleo' size={18} color={theme.colors.primary} />
                      </TouchableOpacity>
                    </OSRow>
                    <OText>{parsePrice(fee?.summary?.fixed + (fee?.summary?.percentage_after_discount ?? fee?.summary?.percentage) ?? 0)}</OText>
                  </Table>
                ))
              }
              {
                order?.offers?.length > 0 && order?.offers?.filter((offer: any) => offer?.target === 3)?.map((offer: any) => (
                  <Table key={offer.id}>
                    <OSRow>
                      <OText numberOfLines={1}>
                        {offer.name}
                        {offer.rate_type === 1 && (
                          <OText>{`(${verifyDecimals(offer?.rate, parsePrice)}%)`}</OText>
                        )}
                      </OText>
                      <TouchableOpacity style={{ marginLeft: 5 }} onPress={() => setOpenTaxModal({ open: true, data: offer, type: 'offer_target_3' })}>
                        <AntIcon name='exclamationcircleo' size={18} color={theme.colors.primary} />
                      </TouchableOpacity>
                    </OSRow>
                    <OText>- {parsePrice(offer?.summary?.discount)}</OText>
                  </Table>
                ))
              }
              {order?.summary?.delivery_price > 0 && (
                <Table>
                  <OText>{t('DELIVERY_FEE', 'Delivery Fee')}</OText>
                  <OText>{parsePrice(order?.summary?.delivery_price)}</OText>
                </Table>
              )}
              {
                order?.offers?.length > 0 && order?.offers?.filter((offer: any) => offer?.target === 2)?.map((offer: any) => (
                  <Table key={offer.id}>
                    <OSRow>
                      <OText numberOfLines={1}>
                        {offer.name}
                        {offer.rate_type === 1 && (
                          <OText>{`(${verifyDecimals(offer?.rate, parsePrice)}%)`}</OText>
                        )}
                      </OText>
                      <TouchableOpacity style={{ marginLeft: 5 }} onPress={() => setOpenTaxModal({ open: true, data: offer, type: 'offer_target_2' })}>
                        <AntIcon name='exclamationcircleo' size={18} color={theme.colors.primary} />
                      </TouchableOpacity>
                    </OSRow>
                    <OText>- {parsePrice(offer?.summary?.discount)}</OText>
                  </Table>
                ))
              }
              {order?.summary?.driver_tip > 0 && (
                <Table>
                  <OText>
                    {t('DRIVER_TIP', 'Driver tip')}
                    {order?.summary?.driver_tip > 0 &&
                      parseInt(configs?.driver_tip_type?.value, 10) === 2 &&
                      !parseInt(configs?.driver_tip_use_custom?.value, 10) &&
                      (
                        `(${verifyDecimals(order?.summary?.driver_tip, parseNumber)}%)`
                      )}
                  </OText>
                  <OText>{parsePrice(order?.summary?.driver_tip ?? order?.totalDriverTip)}</OText>
                </Table>
              )}
              <Total>
                <Table>
                  <OText style={styles.textBold}>{t('TOTAL', 'Total')}</OText>
                  <OText style={styles.textBold} color={theme.colors.primary}>
                    {parsePrice(order?.summary?.total ?? order?.total)}
                  </OText>
                </Table>
              </Total>
              {
                (
                  parseInt(order?.status) === 1 ||
                  parseInt(order?.status) === 11 ||
                  parseInt(order?.status) === 15
                ) && !order.review && !isReviewed && (
                  <OButton
                    onClick={() => handleClickOrderReview(order)}
                    text={t('REVIEW_YOUR_ORDER', 'Review your order')}
                    textStyle={{ color: theme.colors.white }}
                    imgRightSrc=''
                  />
                )}
            </OrderBill>
          </OrderContent>
        </>
      )}

      {loading && !error && (
        <Placeholder Animation={Fade}>
          <LoadingWrapper>
            <PlaceholderLine height={60} style={{ marginBottom: 20 }} />
            <PlaceholderLine height={35} width={60} style={{ marginBottom: 15 }} />
            <PlaceholderLine height={35} width={45} style={{ marginBottom: 35 }} />
            <PlaceholderLine height={60} style={{ marginBottom: 20 }} />
            <PlaceholderLine height={35} width={60} style={{ marginBottom: 15 }} />
            <PlaceholderLine height={35} width={80} style={{ marginBottom: 35 }} />
            <PlaceholderLine height={28} width={50} style={{ marginBottom: 10 }} />
            <PlaceholderLine height={28} width={60} style={{ marginBottom: 10 }} />
            <PlaceholderLine height={28} width={55} style={{ marginBottom: 10 }} />
            <PlaceholderLine height={28} width={80} style={{ marginBottom: 10 }} />
          </LoadingWrapper>
        </Placeholder>
      )}

      {!loading && error && (
        <NotFoundSource
          content={error && error.includes('ERROR_ACCESS_EXPIRED')
            ? t(error[0], 'Sorry, the order has expired.')
            : t('NOT_FOUND_ORDER', 'Sorry, we couldn\'t find the requested order.')
          }
          btnTitle={t('GO_TO_BUSINESSLIST', 'Go to business list')}
          onClickButton={() => onNavigationRedirect('BusinessList')}
        />
      )}

      <OModal
        entireModal
        open={openModalForBusiness || openModalForDriver}
        onClose={() => handleCloseModal()}
      >
        <Messages
          type={openModalForBusiness ? USER_TYPE.BUSINESS : USER_TYPE.DRIVER}
          orderId={order?.id}
          messages={messages}
          order={order}
          setMessages={setMessages}
        />
      </OModal>
      <OModal
        entireModal
        open={openOrderCreating}
        isNotDecoration
        customClose
      >
        <OrderCreating
          isOrderDetail
        />
      </OModal>
      <OModal
        open={openTaxModal.open}
        onClose={() => setOpenTaxModal({ open: false, data: null, type: '' })}
        entireModal
        title={`${openTaxModal.data?.name ||
          t('INHERIT_FROM_BUSINESS', 'Inherit from business')} ${openTaxModal.data?.rate_type !== 2 ? `(${typeof openTaxModal.data?.rate === 'number' ? `${openTaxModal.data?.rate}%` : `${parsePrice(openTaxModal.data?.fixed ?? 0)} + ${openTaxModal.data?.percentage}%`})` : ''}  `}
      >
        <TaxInformation
          type={openTaxModal.type}
          data={openTaxModal.data}
          products={order?.products}
        />
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
