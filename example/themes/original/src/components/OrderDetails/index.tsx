import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, BackHandler, Platform, Linking, RefreshControl } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { _setStoreData } from '../../providers/StoreUtil';
import {
  useLanguage,
  OrderDetails as OrderDetailsConTableoller,
  useUtils,
  useOrder,
  useConfig
} from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { showLocation } from 'react-native-map-link';
import {
  OrderDetailsContainer,
  Header,
  OrderContent,
  OrderBusiness,
  OrderData,
  OrderInfo,
  StaturBar,
  OrderCustomer,
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
  Divider,
  OrderAction,
  PlaceSpotWrapper,
  ProfessionalPhoto
} from './styles';
import { OButton, OIcon, OModal, OText } from '../shared';
import { ProductItemAccordion } from '../ProductItemAccordion';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { OrderDetailsParams } from '../../types';
import { GoogleMap } from '../GoogleMap';
import { verifyDecimals, getOrderStatus } from '../../utils';
import { OSRow } from '../OrderSummary/styles';
import AntIcon from 'react-native-vector-icons/AntDesign'
import { TaxInformation } from '../TaxInformation';
import { Placeholder, PlaceholderLine } from 'rn-placeholder';
import NavBar from '../NavBar'
import { OrderHistory } from './OrderHistory';
import { PlaceSpot } from '../PlaceSpot'
import { SendGiftCard } from '../GiftCard/SendGiftCard'
export const OrderDetailsUI = (props: OrderDetailsParams) => {
  const {
    navigation,
    messages,
    setMessages,
    readMessages,
    isFromCheckout,
    driverLocation,
    onNavigationRedirect,
    reorderState,
    handleReorder,
    getOrder
  } = props;

  const theme = useTheme();

  const styles = StyleSheet.create({
    rowDirection: {
      flexDirection: 'row',
    },
    statusBar: {
      height: 12,
      borderRadius: 8
    },
    logo: {
      width: 75,
      height: 75,
      borderRadius: 10,
    },
    textBold: {
      fontWeight: 'bold',
    },
    btnBackArrow: {
      borderWidth: 0,
      backgroundColor: theme.colors.clear,
      borderColor: theme.colors.clear,
      shadowColor: theme.colors.clear,
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      paddingLeft: 0,
      height: 30,
      width: 30,
      marginTop: Platform.OS === 'ios' ? 0 : 30
    },
    linkWrapper: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row'
    },
    professionalBlock: {
      borderBottomColor: theme.colors.border,
      borderBottomWidth: 1,
      marginVertical: 10,
      paddingVertical: 5
    }
  });

  const [, t] = useLanguage();
  const [{ parsePrice, parseNumber, parseDate }] = useUtils();
  const [{ configs }] = useConfig();
  const [{ carts }] = useOrder()

  const [isReviewed, setIsReviewed] = useState(false)
  const [isGiftCardSent, setIsGiftCardSent] = useState(false)
  const [isOrderHistory, setIsOrderHistory] = useState(false)
  const [openTaxModal, setOpenTaxModal] = useState<any>({ open: false, tax: null, type: '' })
  const [refreshing] = useState(false);
  const { order, businessData } = props.order;
  const mapValidStatuses = [9, 19, 23]
  const placeSpotTypes = [3, 4, 5]
  const directionTypes = [2, 3, 4, 5]
  const activeStatus = [0, 3, 4, 7, 8, 9, 14, 18, 19, 20, 21, 22, 23]
  const enabledPoweredByOrdering = configs?.powered_by_ordering_module?.value
  const isGiftCardOrder = !order?.business_id

  const walletName: any = {
    cash: {
      name: t('PAY_WITH_CASH_WALLET', 'Pay with Cash Wallet'),
    },
    credit_point: {
      name: t('PAY_WITH_CREDITS_POINTS_WALLET', 'Pay with Credit Points Wallet'),
    }
  }

  const handleGoToMessages = (type: string) => {
    readMessages && readMessages();
    navigation.navigate(
      'MessageDetails',
      {
        type,
        order,
        messages,
        setMessages,
        orderId: order?.id,
        business: type === 'business',
        driver: type === 'driver',
        onClose: () => navigation?.canGoBack()
          ? navigation.goBack()
          : navigation.navigate('BottomTab', { screen: 'MyOrders' }),
      }
    )
  }

  const handleArrowBack: any = () => {
    if (!isFromCheckout) {
      navigation?.canGoBack() && navigation.goBack();
      return;
    }
    navigation.navigate('BottomTab');
  };

  const getIncludedTaxes = () => {
    if (order?.taxes?.length === 0 || !order?.taxes) {
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

  const handleTriggerReview = () => {
    setIsOrderHistory(false);
    (
      parseInt(order?.status) === 1 ||
      parseInt(order?.status) === 11 ||
      parseInt(order?.status) === 15
    ) && !order.review && !isReviewed && handleClickOrderReview(order)
  }

  
  const resfreshOrder = () => {
    getOrder()
  }

  useEffect(() => {
    const _businessId = 'businessId:' + businessData?.id
    if (reorderState?.error) {
      if (businessData?.id) {
        _setStoreData('adjust-cart-products', JSON.stringify(_businessId))
        navigation.navigate('Business', { store: businessData?.slug })
      }
    }
    if (!reorderState?.error && reorderState.loading === false && businessData?.id) {
      const products = carts?.[_businessId]?.products
      const available = products?.every((product: any) => product.valid === true)

      if (available && reorderState?.result?.uuid && (products?.length === order?.products.length)) {
        onNavigationRedirect && onNavigationRedirect('CheckoutNavigator', { cartUuid: reorderState?.result.uuid })
      } else {
        _setStoreData('adjust-cart-products', JSON.stringify(_businessId))
        products?.length !== order?.products.length && _setStoreData('already-removed', JSON.stringify('removed'))
        navigation.navigate('Business', { store: businessData?.slug })
      }
    }
  }, [reorderState])

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleArrowBack);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleArrowBack);
    };
  }, []);

  const locations = [
    {
      ...order?.driver?.location,
      title: t('DRIVER', 'Driver'),
      icon:
        order?.driver?.photo ||
        'https://res.cloudinary.com/demo/image/fetch/c_thumb,g_face,r_max/https://www.freeiconspng.com/thumbs/driver-icon/driver-icon-14.png',
    },
    {
      ...order?.business?.location,
      title: order?.business?.name,
      icon: order?.business?.logo || theme.images.dummies.businessLogo,
    },
    {
      ...order?.customer?.location,
      title: t('YOUR_LOCATION', 'Your Location'),
      icon:
        order?.customer?.photo ||
        'https://res.cloudinary.com/demo/image/upload/c_thumb,g_face,r_max/d_avatar.png/non_existing_id.png',
    },
  ];
  const driverLocationString = typeof order?.driver?.location?.location === 'string' && order?.driver?.location?.location?.split(',').map((l: string) => l.replace(/[^-.0-9]/g, ''))
  const parsedLocations = locations.map(location => typeof location?.location === 'string' ? {
    ...location,
    lat: parseFloat(location?.location?.split(',')[0].replace(/[^-.0-9]/g, '')),
    lng: parseFloat(location?.location?.split(',')[1].replace(/[^-.0-9]/g, ''))
  } : location)

  const getProductList = () => {
    const professionalList = order?.products.reduce((prev: any, current: any) => {
      const found = prev.find((item: any) => item.id === current?.calendar_event?.professional?.id)
      if (found || !current?.calendar_event) {
        return prev
      }
      return [...prev, current?.calendar_event?.professional]
    }, [])

    return (
      <>
        {professionalList?.length > 0 && professionalList.map((professional: any, i: number) => (
          <View key={i} style={styles.professionalBlock}>
            <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
              {professional?.photo ? (
                <ProfessionalPhoto
                  source={{
                    uri: professional?.photo
                  }}
                  imageStyle={{ borderRadius: 8 }}
                />
              ) : (
                <OIcon
                  src={theme.images.general.user}
                  cover={false}
                  width={80}
                  height={80}
                />
              )}
              <OText size={12} lineHeight={18} weight={'500'} numberOfLines={1}>{professional?.name} {professional?.lastname}</OText>
            </View>
            {order?.products.filter((product: any) => product?.calendar_event?.professional?.id === professional?.id).map((product: any, i: number) => (
              <ProductItemAccordion
                key={product?.id || i}
                product={product}
                isFromCheckout
              />
            ))}
          </View>
        ))}
        {order?.products.filter((product: any) => !product?.calendar_event).map((product: any, i: number) => (
          <ProductItemAccordion
            key={product?.id || i}
            product={product}
            isFromCheckout
          />
        ))}
      </>
    )
  }

  const sortedProductList = useMemo(() => getProductList(), [order?.products])

  useEffect(() => {
    if (driverLocation) {
      parsedLocations[0] = {
        ...locations[0],
        ...driverLocation
      }
    }
  }, [driverLocation]);

  return (
    <OrderDetailsContainer 
      keyboardShouldPersistTaps="handled"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => resfreshOrder()}
        />
      }
    >
      {(!order || Object.keys(order).length === 0) && (
        <Placeholder style={{ marginTop: 30 }}>
          <Header>
            <OrderInfo>
              <OrderData>
                <PlaceholderLine width={60} height={15} />
                <PlaceholderLine width={60} height={10} />
                <StaturBar>
                  <PlaceholderLine height={15} />
                  <PlaceholderLine width={40} height={20} />
                </StaturBar>
              </OrderData>
              <View
                style={{
                  height: 8,
                  backgroundColor: theme.colors.backgroundGray100,
                  marginTop: 18,
                  marginHorizontal: -40,
                }}
              />
            </OrderInfo>
          </Header>
          <OrderContent>
            <OrderBusiness>
              <PlaceholderLine width={30} height={20} />
              <PlaceholderLine width={60} height={15} />
              <PlaceholderLine width={75} height={10} />
              <PlaceholderLine width={40} height={10} />
              <PlaceholderLine width={95} height={10} />
            </OrderBusiness>
          </OrderContent>
          <View
            style={{
              height: 8,
              backgroundColor: theme.colors.backgroundGray100,
              marginTop: 18,
              marginHorizontal: -40,
            }}
          />
          <OrderCustomer>
            <PlaceholderLine width={20} height={20} />
            <PlaceholderLine width={70} height={15} />
            <PlaceholderLine width={65} height={10} />
            <PlaceholderLine width={80} height={10} />
            <PlaceholderLine width={70} height={10} />
            <View style={{ marginTop: 10 }}>
              <PlaceholderLine width={60} height={20} />
              <PlaceholderLine width={40} height={10} />
            </View>
          </OrderCustomer>
        </Placeholder>
      )}
      {order && Object.keys(order).length > 0 && (
        <>
          <Header>
            <NavBar
              title={`${t('ORDER', 'Order')} #${order?.id}`}
              titleAlign={'center'}
              onActionLeft={handleArrowBack}
              showCall={false}
              btnStyle={{ paddingLeft: 0 }}
              style={{ marginTop: Platform.OS === 'ios' ? 0 : 20 }}
              titleWrapStyle={{ paddingHorizontal: 0 }}
              titleStyle={{ marginRight: 0, marginLeft: 0 }}
              subTitle={<OText size={12} lineHeight={18} color={theme.colors.textNormal}>
                {
                  activeStatus.includes(order?.status)
                    ? order?.eta_time + 'min'
                    : order?.delivery_datetime_utc
                        ? parseDate(order?.delivery_datetime_utc)
                        : parseDate(order?.delivery_datetime, { utc: false })
                }
              </OText>}
            />
            {enabledPoweredByOrdering && (
              <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <OText>
                  Powered By Ordering.co
                </OText>
              </View>
            )}
            {!isGiftCardOrder && (
              <OrderInfo>
                <OrderData>
                  <View style={styles.linkWrapper}>
                    {
                      (
                        parseInt(order?.status) === 1 ||
                        parseInt(order?.status) === 11 ||
                        parseInt(order?.status) === 15
                      ) && !order.review && !isReviewed && (
                        <TouchableOpacity
                          activeOpacity={0.7}
                          style={{ marginTop: 6, marginRight: 10 }}
                          onPress={() => handleClickOrderReview(order)}
                        >
                          <OText
                            size={12}
                            lineHeight={15}
                            color={theme.colors.primary}
                            style={{ textDecorationLine: 'underline' }}
                          >
                            {t('REVIEW_YOUR_ORDER', 'Review your order')}
                          </OText>
                        </TouchableOpacity>
                      )}
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={{ marginTop: 6 }}
                      onPress={() => setIsOrderHistory(true)}
  
                    >
                      <OText
                        size={12}
                        lineHeight={15}
                        color={theme.colors.primary}
                        style={{ textDecorationLine: 'underline', textTransform: 'capitalize' }}
                      >
                        {t('VIEW_DETAILS', 'View Details')}
                      </OText>
                    </TouchableOpacity>
                  </View>
  
                  <StaturBar>
                    <LinearGradient
                      start={{ x: 0.0, y: 0.0 }}
                      end={{
                        x: getOrderStatus(order?.status)?.percentage || 0,
                        y: 0,
                      }}
                      locations={[0.9999, 0.9999]}
                      colors={[theme.colors.primary, theme.colors.backgroundGray100]}
                      style={styles.statusBar}
                    />
                  </StaturBar>
                  <OText
                    size={16}
                    lineHeight={24}
                    weight={'600'}
                    color={theme.colors.textNormal}>
                    {getOrderStatus(order?.status)?.value}
                  </OText>
                </OrderData>
                <View
                  style={{
                    height: 8,
                    backgroundColor: theme.colors.backgroundGray100,
                    marginTop: 18,
                    marginHorizontal: -40,
                  }}
                />
              </OrderInfo>
            )}
          </Header>
          <OrderContent>
            {!isGiftCardOrder && (
              <OrderBusiness>
                <OText
                  size={16}
                  lineHeight={24}
                  weight={'500'}
                  color={theme.colors.textNormal}
                  mBottom={12}>
                  {t('FROM', 'From')}
                </OText>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <OText
                      size={13}
                      lineHeight={20}
                      color={theme.colors.textNormal}
                      style={{ flexGrow: 1, flexBasis: '80%' }}>
                      {order?.business?.name}
                    </OText>
                    <Icons>
                      {!!order?.business?.cellphone && (
                        <TouchableOpacity
                          onPress={() => order?.business?.cellphone &&
                            Linking.openURL(`tel:${order?.business?.cellphone}`)
                          }
                          style={{ paddingEnd: 5 }}
                        >
                          <OIcon
                            src={theme.images.general.phone}
                            width={16}
                            color={theme.colors.disabled}
                          />
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        style={{ paddingStart: 5 }}
                        onPress={() => handleGoToMessages('business')}>
                        <OIcon
                          src={theme.images.general.chat}
                          width={16}
                          color={theme.colors.disabled}
                        />
                      </TouchableOpacity>
                    </Icons>
                  </View>
                  <OText
                    size={12}
                    lineHeight={18}
                    color={theme.colors.textNormal}
                    mBottom={2}>
                    {order?.business?.email}
                  </OText>
                  {!!order?.business?.cellphone && (
                    <OText
                      size={12}
                      lineHeight={18}
                      color={theme.colors.textNormal}
                      mBottom={2}>
                      {order?.business?.cellphone}
                    </OText>
                  )}
                  <OText size={12} lineHeight={18} color={theme.colors.textNormal}>
                    {order?.business?.address}
                  </OText>
                </View>
                {directionTypes.includes(order?.delivery_type) && (
                  <OButton
                    text={t('GET_DIRECTIONS', 'Get Directions')}
                    imgRightSrc=''
                    textStyle={{ color: theme.colors.white }}
                    style={{
                      alignSelf: 'center',
                      borderRadius: 10,
                      marginTop: 30
                    }}
                    onClick={() => showLocation({
                      latitude: order?.business?.location?.lat,
                      longitude: order?.business?.location?.lng,
                      naverCallerName: 'com.reactnativeappstemplate5',
                      dialogTitle: t('GET_DIRECTIONS', 'Get Directions'),
                      dialogMessage: t('WHAT_APP_WOULD_YOU_USE', 'What app would you like to use?'),
                      cancelText: t('CANCEL', 'Cancel'),
                    })}
                  />
                )}
              </OrderBusiness>
            )}
            
            {!isGiftCardOrder && placeSpotTypes.includes(order?.delivery_type) && (
              <PlaceSpotWrapper>
                <PlaceSpot
                  isInputMode
                  cart={order}
                  spotNumberDefault={order?.spot_number}
                  vehicleDefault={order?.vehicle}
                />
              </PlaceSpotWrapper>
            )}

            <View
              style={{
                height: 8,
                backgroundColor: theme.colors.backgroundGray100,
                marginTop: 18,
                marginHorizontal: -40,
              }}
            />
            <OrderCustomer>
              <OText
                size={16}
                lineHeight={24}
                weight={'500'}
                color={theme.colors.textNormal}
                mBottom={12}>
                {isGiftCardOrder ? t('CUSTOMER', 'Customer') : t('TO', 'To')}
              </OText>
              <Customer>
                <InfoBlock>
                  <OText
                    size={12}
                    lineHeight={18}
                    color={theme.colors.textNormal}
                    mBottom={2}>
                    {order?.customer?.name} {order?.customer?.lastname}
                  </OText>
                  <OText
                    size={12}
                    lineHeight={18}
                    color={theme.colors.textNormal}
                    mBottom={2}>
                    {order?.customer?.address}
                  </OText>
                  {(!!order?.customer?.cellphone) && (
                    <OText
                      size={12}
                      lineHeight={18}
                      color={theme.colors.textNormal}
                      mBottom={2}>
                      {`${!!order?.customer?.country_phone_code ? '+' + order?.customer?.country_phone_code : ''} ${order?.customer?.cellphone}`}
                    </OText>
                  )}
                </InfoBlock>
              </Customer>
              {!isGiftCardOrder && order?.delivery_option !== undefined && order?.delivery_type === 1 && (
                <View style={{ marginTop: 15 }}>
                  <OText size={16} style={{ textAlign: 'left' }} color={theme.colors.textNormal}>
                    {t('DELIVERY_PREFERENCE', 'Delivery Preference')}
                  </OText>
                  <OText size={12} style={{ textAlign: 'left' }} color={theme.colors.textNormal}>
                    {order?.delivery_option?.name ? t(order?.delivery_option?.name.toUpperCase().replace(/\s/g, '_')) : t('EITHER_WAY', 'Either way')}
                  </OText>
                </View>
              )}
              {!!order?.comment && (
                <View style={{ marginTop: 15 }}>
                  <OText size={16} style={{ textAlign: 'left' }} color={theme.colors.textNormal}>
                    {t('COMMENT', 'Comment')}
                  </OText>
                  <OText size={12} style={{ textAlign: 'left' }} color={theme.colors.textNormal}>{order?.comment}</OText>
                </View>
              )}
              {order?.driver && (
                <>
                  {order?.driver?.location && mapValidStatuses.includes(parseInt(order?.status)) && (
                    <Map>
                      <GoogleMap
                        location={typeof order?.driver?.location?.location === 'string'
                          ? {
                            lat: parseFloat(driverLocationString[0]),
                            lng: parseFloat(driverLocationString[1]),
                          } : driverLocation ?? order?.driver?.location
                        }
                        locations={parsedLocations}
                        readOnly
                      />
                    </Map>
                  )}
                </>
              )}
            </OrderCustomer>
            {order?.driver && (
              <>
                <View
                  style={{
                    height: 8,
                    backgroundColor: theme.colors.backgroundGray100,
                    marginTop: 18,
                    marginHorizontal: -40,
                  }}
                />
                <OrderDriver>
                  <OText size={16} lineHeight={24} weight={'500'} style={{ marginBottom: 10 }}>{t('YOUR_DRIVER', 'Your Driver')}</OText>
                  <Customer>
                    <InfoBlock>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                        <OText size={12} lineHeight={18} color={theme.colors.textNormal} mBottom={2} style={{ flexGrow: 1, flexBasis: '80%' }}>
                          {order?.driver?.name} {order?.driver?.lastname}
                        </OText>
                        <Icons>
                          <TouchableOpacity
                            onPress={() => handleGoToMessages('driver')}>
                            <OIcon
                              src={theme.images.general.chat}
                              width={16}
                              color={theme.colors.disabled}
                            />
                          </TouchableOpacity>
                        </Icons>
                      </View>
                      <OText size={12} lineHeight={18} color={theme.colors.textNormal} mBottom={2}>
                        {order?.driver?.cellphone}
                      </OText>
                    </InfoBlock>
                  </Customer>
                </OrderDriver>
              </>
            )}
            <View
              style={{
                height: 8,
                backgroundColor: theme.colors.backgroundGray100,
                marginTop: 18,
                marginHorizontal: -40,
              }}
            />
            <HeaderInfo>
              <OText
                size={24}
                color={theme.colors.textNormal}
                style={{ fontWeight: Platform.OS == 'ios' ? '600' : 'bold', marginBottom: 16 }}>
                {t(
                  'YOUR_ORDER_HAS_BEEN_RECEIVED',
                  'Your Order has been received',
                )}
              </OText>
              <OText color={theme.colors.textNormal} size={14} weight={'500'}>
                {t(
                  'ORDER_MESSAGE_HEADER_TEXT',
                  'Once business accepts your order, we will send you an email, thank you!',
                )}
              </OText>
              <OrderAction>
                <OButton
                  text={t('YOUR_ORDERS', 'Your Orders')}
                  textStyle={{ fontSize: 14, color: theme.colors.primary }}
                  imgRightSrc={null}
                  borderColor={theme.colors.primary}
                  bgColor={theme.colors.clear}
                  style={{ borderRadius: 7.6, borderWidth: 1, height: 44, shadowOpacity: 0 }}
                  parentStyle={{ marginTop: 29, marginEnd: 15 }}
                  onClick={() => navigation.navigate('BottomTab', { screen: 'MyOrders' })}
                />
                {(
                  parseInt(order?.status) === 1 ||
                  parseInt(order?.status) === 2 ||
                  parseInt(order?.status) === 5 ||
                  parseInt(order?.status) === 6 ||
                  parseInt(order?.status) === 10 ||
                  parseInt(order?.status) === 11 ||
                  parseInt(order?.status) === 12
                ) && (
                    <OButton
                      text={order.id === reorderState?.loading ? t('LOADING', 'Loading..') : t('REORDER', 'Reorder')}
                      textStyle={{ fontSize: 14, color: theme.colors.primary }}
                      imgRightSrc={null}
                      borderColor='transparent'
                      bgColor={theme.colors.primary + 10}
                      style={{ borderRadius: 7.6, borderWidth: 1, height: 44, shadowOpacity: 0, marginTop: 29 }}
                      onClick={() => handleReorder && handleReorder(order.id)}
                    />
                  )}
              </OrderAction>
            </HeaderInfo>
            <OrderProducts>
              {sortedProductList}
            </OrderProducts>
            <OrderBill>
              <View style={{ height: 1, backgroundColor: theme.colors.border, marginBottom: 17 }} />
              <Table>
                <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>{t('SUBTOTAL', 'Subtotal')}</OText>
                <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>
                  {parsePrice(((order?.summary?.subtotal ?? order?.subtotal) + getIncludedTaxes()))}
                </OText>
              </Table>
              {(order?.summary?.discount > 0 ?? order?.discount > 0) && order?.offers?.length === 0 && (
                <Table>
                  {order?.offer_type === 1 ? (
                    <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>
                      {t('DISCOUNT', 'Discount')}
                      <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>{`(${verifyDecimals(
                        order?.offer_rate,
                        parsePrice,
                      )}%)`}</OText>
                    </OText>
                  ) : (
                    <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>{t('DISCOUNT', 'Discount')}</OText>
                  )}
                  <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>
                    - {parsePrice(order?.summary?.discount || order?.discount)}
                  </OText>
                </Table>
              )}
              {
                order?.offers?.length > 0 && order?.offers?.filter((offer: any) => offer?.target === 1)?.map((offer: any) => (
                  <Table key={offer.id}>
                    <OSRow>
                      <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal} numberOfLines={1}>
                        {offer.name}
                        {offer.rate_type === 1 && (
                          <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>{`(${verifyDecimals(offer?.rate, parsePrice)}%)`}</OText>
                        )}
                      </OText>
                      <TouchableOpacity style={{ marginLeft: 5 }} onPress={() => setOpenTaxModal({ open: true, data: offer, type: 'offer_target_1' })}>
                        <AntIcon name='infocirlceo' size={16} color={theme.colors.primary} />
                      </TouchableOpacity>
                    </OSRow>
                    <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>- {parsePrice(offer?.summary?.discount)}</OText>
                  </Table>
                ))
              }
              {!isGiftCardOrder && (
                <Divider />
              )}
              {order?.summary?.subtotal_with_discount > 0 && order?.summary?.discount > 0 && order?.summary?.total >= 0 && (
                <Table>
                  <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>{t('SUBTOTAL_WITH_DISCOUNT', 'Subtotal with discount')}</OText>
                  {order?.tax_type === 1 ? (
                    <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>{parsePrice((order?.summary?.subtotal_with_discount + getIncludedTaxesDiscounts() ?? 0))}</OText>
                  ) : (
                    <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>{parsePrice(order?.summary?.subtotal_with_discount ?? 0)}</OText>
                  )}
                </Table>
              )}
              {
                order?.taxes?.length === 0 && order?.tax_type === 2 && (
                  <Table>
                    <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>
                      {t('TAX', 'Tax')} {`(${verifyDecimals(order?.tax, parseNumber)}%)`}
                    </OText>
                    <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>{parsePrice(order?.summary?.tax || 0)}</OText>
                  </Table>
                )
              }
              {
                order?.fees?.length === 0 && (
                  <Table>
                    <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>
                      {t('SERVICE_FEE', 'Service fee')}
                      {`(${verifyDecimals(order?.service_fee, parseNumber)}%)`}
                    </OText>
                    <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>{parsePrice(order?.summary?.service_fee || 0)}</OText>
                  </Table>
                )
              }
              {
                order?.taxes?.length > 0 && order?.taxes?.filter((tax: any) => tax?.type === 2 && tax?.rate !== 0).map((tax: any) => (
                  <Table key={tax.id}>
                    <OSRow>
                      <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal} numberOfLines={1}>
                        {tax.name || t('INHERIT_FROM_BUSINESS', 'Inherit from business')}
                        {`(${verifyDecimals(tax?.rate, parseNumber)}%)`}{' '}
                      </OText>
                      <TouchableOpacity onPress={() => setOpenTaxModal({ open: true, data: tax, type: 'tax' })}>
                        <AntIcon name='infocirlceo' size={16} color={theme.colors.primary} />
                      </TouchableOpacity>
                    </OSRow>
                    <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>{parsePrice(tax?.summary?.tax_after_discount ?? tax?.summary?.tax ?? 0)}</OText>
                  </Table>
                ))
              }
              {
                order?.fees?.length > 0 && order?.fees?.filter((fee: any) => !(fee.fixed === 0 && fee.percentage === 0))?.map((fee: any) => (
                  <Table key={fee.id}>
                    <OSRow>
                      <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal} numberOfLines={1}>
                        {fee.name || t('INHERIT_FROM_BUSINESS', 'Inherit from business')}
                        ({fee?.fixed > 0 && `${parsePrice(fee?.fixed)}${fee.percentage > 0 ? ' + ' : ''}`}{fee.percentage > 0 && `${fee.percentage}%`}){' '}
                      </OText>
                      <TouchableOpacity onPress={() => setOpenTaxModal({ open: true, data: fee, type: 'fee' })}>
                        <AntIcon name='infocirlceo' size={16} color={theme.colors.primary} />
                      </TouchableOpacity>
                    </OSRow>
                    <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>{parsePrice(fee?.summary?.fixed + (fee?.summary?.percentage_after_discount ?? fee?.summary?.percentage) ?? 0)}</OText>
                  </Table>
                ))
              }
              {
                order?.offers?.length > 0 && order?.offers?.filter((offer: any) => offer?.target === 3)?.map((offer: any) => (
                  <Table key={offer.id}>
                    <OSRow>
                      <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal} numberOfLines={1}>
                        {offer.name}
                        {offer.rate_type === 1 && (
                          <OText>{`(${verifyDecimals(offer?.rate, parsePrice)}%)`}</OText>
                        )}
                      </OText>
                      <TouchableOpacity style={{ marginLeft: 5 }} onPress={() => setOpenTaxModal({ open: true, data: offer, type: 'offer_target_3' })}>
                        <AntIcon name='infocirlceo' size={16} color={theme.colors.primary} />
                      </TouchableOpacity>
                    </OSRow>
                    <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>- {parsePrice(offer?.summary?.discount)}</OText>
                  </Table>
                ))
              }
              {order?.summary?.delivery_price > 0 && (
                <Table>
                  <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>{t('DELIVERY_FEE', 'Delivery Fee')}</OText>
                  <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>{parsePrice(order?.summary?.delivery_price)}</OText>
                </Table>
              )}
              {
                order?.offers?.length > 0 && order?.offers?.filter((offer: any) => offer?.target === 2)?.map((offer: any) => (
                  <Table key={offer.id}>
                    <OSRow>
                      <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal} numberOfLines={1}>
                        {offer.name}
                        {offer.rate_type === 1 && (
                          <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>{`(${verifyDecimals(offer?.rate, parsePrice)}%)`}</OText>
                        )}
                      </OText>
                      <TouchableOpacity style={{ marginLeft: 5 }} onPress={() => setOpenTaxModal({ open: true, data: offer, type: 'offer_target_2' })}>
                        <AntIcon name='infocirlceo' size={16} color={theme.colors.primary} />
                      </TouchableOpacity>
                    </OSRow>
                    <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>- {parsePrice(offer?.summary?.discount)}</OText>
                  </Table>
                ))
              }
              {order?.summary?.driver_tip > 0 && (
                <Table>
                  <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>
                    {t('DRIVER_TIP', 'Driver tip')}
                    {order?.summary?.driver_tip > 0 &&
                      parseInt(configs?.driver_tip_type?.value, 10) === 2 &&
                      !parseInt(configs?.driver_tip_use_custom?.value, 10) &&
                      (
                        `(${verifyDecimals(order?.summary?.driver_tip, parseNumber)}%)`
                      )}
                  </OText>
                  <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>{parsePrice(order?.summary?.driver_tip ?? order?.totalDriverTip)}</OText>
                </Table>
              )}
              <Total>
                <Table>
                  <OText size={14} style={{ fontWeight: 'bold' }} color={theme.colors.textNormal}>{t('TOTAL', 'Total')}</OText>
                  <OText size={14} style={{ fontWeight: 'bold' }} color={theme.colors.textNormal}>
                    {parsePrice(order?.summary?.total ?? order?.total)}
                  </OText>
                </Table>
              </Total>
              {order?.payment_events?.length > 0 && (
                <View style={{ marginTop: 10 }}>
                  <OText size={20} weight='bold' color={theme.colors.textNormal}>{t('PAYMENTS', 'Payments')}</OText>
                  <View
                    style={{
                      width: '100%',
                      marginTop: 10
                    }}
                  >
                    {order?.payment_events?.map((event: any) => event.amount > 0 && (
                      <View
                        key={event.id}
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: 10
                        }}
                      >
                        <View
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                          }}
                        >
                          <OText>
                            {event?.wallet_event
                              ? walletName[event?.wallet_event?.wallet?.type]?.name
                              : event?.paymethod?.name}
                          </OText>
                          {event?.data?.charge_id && (
                            <OText>
                              {`${t('CODE', 'Code')}: ${event?.data?.charge_id}`}
                            </OText>
                          )}
                        </View>
                        <OText>
                          -{parsePrice(event.amount, { isTruncable: true })}
                        </OText>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </OrderBill>
            {isGiftCardOrder && order?.products[0]?.gift_card?.status === 'pending' && !isGiftCardSent && (
              <>
                <View
                  style={{
                    height: 8,
                    backgroundColor: theme.colors.backgroundGray100,
                    marginTop: 10,
                    marginHorizontal: -40,
                    marginBottom: 20
                  }}
                />
                <SendGiftCard
                  giftCardId={order?.products[0]?.gift_card?.id}
                  setIsGiftCardSent={setIsGiftCardSent}
                />
              </>
            )}
          </OrderContent>
        </>
      )}
      <OModal
        open={openTaxModal.open}
        onClose={() => setOpenTaxModal({ open: false, data: null, type: '' })}
        entireModal
      >
        <TaxInformation
          type={openTaxModal.type}
          data={openTaxModal.data}
          products={order?.products}
        />
      </OModal>
      <OModal
        open={isOrderHistory}
        onClose={() => setIsOrderHistory(false)}
        entireModal
      >
        <OrderHistory
          order={order}
          messages={messages}
          enableReview={(
            parseInt(order?.status) === 1 ||
            parseInt(order?.status) === 11 ||
            parseInt(order?.status) === 15
          ) && !order.review && !isReviewed}
          onClose={() => setIsOrderHistory(false)}
          handleTriggerReview={handleTriggerReview}
        />
      </OModal>
    </OrderDetailsContainer>
  );
};

export const OrderDetails = (props: OrderDetailsParams) => {
  const orderDetailsProps = {
    ...props,
    UIComponent: OrderDetailsUI,
  };

  return <OrderDetailsConTableoller {...orderDetailsProps} />;
};
