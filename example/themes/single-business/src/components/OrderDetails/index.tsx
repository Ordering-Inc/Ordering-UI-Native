import React, { useState, useEffect } from 'react';
import { View, StyleSheet, BackHandler } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import LinearGradient from 'react-native-linear-gradient';
import { Messages } from '../Messages';
import {
  useLanguage,
  OrderDetails as OrderDetailsConTableoller,
  useUtils,
  useConfig,
  useSession,
} from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
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
  OrderDriver,
  Map,
} from './styles';
import { OButton, OIcon, OModal, OText, OLink } from '../shared';
import { ProductItemAccordion } from '../ProductItemAccordion';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { OrderDetailsParams } from '../../types';
import { USER_TYPE } from '../../config/constants';
import { GoogleMap } from '../GoogleMap';
import { verifyDecimals } from '../../utils';
import NavBar from '../NavBar';
import { OSRow } from '../OrderSummary/styles';
import { TaxInformation } from '../TaxInformation';
import AntIcon from 'react-native-vector-icons/AntDesign'

export const OrderDetailsUI = (props: OrderDetailsParams) => {
  const {
    navigation,
    messages,
    setMessages,
    readMessages,
    messagesReadList,
    isFromCheckout,
    driverLocation,
    onNavigationRedirect
  } = props;

  const theme = useTheme();

  const styles = StyleSheet.create({
    rowDirection: {
      flexDirection: 'row',
    },
    statusBar: {
      height: 12,
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
      width: 40,
    },
  });

  const [, t] = useLanguage();
  const [{ parsePrice, parseNumber, parseDate }] = useUtils();
  const [{ user }] = useSession();
  const [{ configs }] = useConfig();

  const [openModalForBusiness, setOpenModalForBusiness] = useState(false);
  const [openModalForDriver, setOpenModalForDriver] = useState(false);
  const [isReviewed, setIsReviewed] = useState(false)
  const [unreadAlert, setUnreadAlert] = useState({
    business: false,
    driver: false,
  });
  const [openTaxModal, setOpenTaxModal] = useState<any>({ open: false, data: null })

  const { order, businessData } = props.order;

  const getOrderStatus = (s: string) => {
    const status = parseInt(s);
    const orderStatus = [
      {
        key: 0,
        value: t('PENDING', 'Pending'),
        slug: 'PENDING',
        percentage: 0.25,
        image: theme.images.order.status0,
      },
      {
        key: 1,
        value: t('COMPLETED', 'Completed'),
        slug: 'COMPLETED',
        percentage: 1,
        image: theme.images.order.status1,
      },
      {
        key: 2,
        value: t('REJECTED', 'Rejected'),
        slug: 'REJECTED',
        percentage: 0,
        image: theme.images.order.status2,
      },
      {
        key: 3,
        value: t('DRIVER_IN_BUSINESS', 'Driver in business'),
        slug: 'DRIVER_IN_BUSINESS',
        percentage: 0.6,
        image: theme.images.order.status3,
      },
      {
        key: 4,
        value: t('PREPARATION_COMPLETED', 'Preparation Completed'),
        slug: 'PREPARATION_COMPLETED',
        percentage: 0.7,
        image: theme.images.order.status4,
      },
      {
        key: 5,
        value: t('REJECTED_BY_BUSINESS', 'Rejected by business'),
        slug: 'REJECTED_BY_BUSINESS',
        percentage: 0,
        image: theme.images.order.status5,
      },
      {
        key: 6,
        value: t('REJECTED_BY_DRIVER', 'Rejected by Driver'),
        slug: 'REJECTED_BY_DRIVER',
        percentage: 0,
        image: theme.images.order.status6,
      },
      {
        key: 7,
        value: t('ACCEPTED_BY_BUSINESS', 'Accepted by business'),
        slug: 'ACCEPTED_BY_BUSINESS',
        percentage: 0.35,
        image: theme.images.order.status7,
      },
      {
        key: 8,
        value: t('ACCEPTED_BY_DRIVER', 'Accepted by driver'),
        slug: 'ACCEPTED_BY_DRIVER',
        percentage: 0.45,
        image: theme.images.order.status8,
      },
      {
        key: 9,
        value: t('PICK_UP_COMPLETED_BY_DRIVER', 'Pick up completed by driver'),
        slug: 'PICK_UP_COMPLETED_BY_DRIVER',
        percentage: 0.8,
        image: theme.images.order.status9,
      },
      {
        key: 10,
        value: t('PICK_UP_FAILED_BY_DRIVER', 'Pick up Failed by driver'),
        slug: 'PICK_UP_FAILED_BY_DRIVER',
        percentage: 0,
        image: theme.images.order.status10,
      },
      {
        key: 11,
        value: t(
          'DELIVERY_COMPLETED_BY_DRIVER',
          'Delivery completed by driver',
        ),
        slug: 'DELIVERY_COMPLETED_BY_DRIVER',
        percentage: 1,
        image: theme.images.order.status11,
      },
      {
        key: 12,
        value: t('DELIVERY_FAILED_BY_DRIVER', 'Delivery Failed by driver'),
        slug: 'DELIVERY_FAILED_BY_DRIVER',
        percentage: 0,
        image: theme.images.order.status12,
      },
      {
        key: 13,
        value: t('PREORDER', 'PreOrder'),
        slug: 'PREORDER',
        percentage: 0,
        image: theme.images.order.status13,
      },
      {
        key: 14,
        value: t('ORDER_NOT_READY', 'Order not ready'),
        slug: 'ORDER_NOT_READY',
        percentage: 0,
        image: theme.images.order.status13,
      },
      {
        key: 15,
        value: t(
          'ORDER_PICKEDUP_COMPLETED_BY_CUSTOMER',
          'Order picked up completed by customer',
        ),
        slug: 'ORDER_PICKEDUP_COMPLETED_BY_CUSTOMER',
        percentage: 100,
        image: theme.images.order.status1,
      },
      {
        key: 16,
        value: t('CANCELLED_BY_CUSTOMER', 'Cancelled by customer'),
        slug: 'CANCELLED_BY_CUSTOMER',
        percentage: 0,
        image: theme.images.order.status2,
      },
      {
        key: 17,
        value: t(
          'ORDER_NOT_PICKEDUP_BY_CUSTOMER',
          'Order not picked up by customer',
        ),
        slug: 'ORDER_NOT_PICKEDUP_BY_CUSTOMER',
        percentage: 0,
        image: theme.images.order.status2,
      },
      {
        key: 18,
        value: t(
          'DRIVER_ALMOST_ARRIVED_TO_BUSINESS',
          'Driver almost arrived to business',
        ),
        slug: 'DRIVER_ALMOST_ARRIVED_TO_BUSINESS',
        percentage: 0.15,
        image: theme.images.order.status3,
      },
      {
        key: 19,
        value: t(
          'DRIVER_ALMOST_ARRIVED_TO_CUSTOMER',
          'Driver almost arrived to customer',
        ),
        slug: 'DRIVER_ALMOST_ARRIVED_TO_CUSTOMER',
        percentage: 0.9,
        image: theme.images.order.status11,
      },
      {
        key: 20,
        value: t(
          'ORDER_CUSTOMER_ALMOST_ARRIVED_BUSINESS',
          'Customer almost arrived to business',
        ),
        slug: 'ORDER_CUSTOMER_ALMOST_ARRIVED_BUSINESS',
        percentage: 90,
        image: theme.images.order.status7,
      },
      {
        key: 21,
        value: t(
          'ORDER_CUSTOMER_ARRIVED_BUSINESS',
          'Customer arrived to business',
        ),
        slug: 'ORDER_CUSTOMER_ARRIVED_BUSINESS',
        percentage: 95,
        image: theme.images.order.status7,
      },
    ];

    const objectStatus = orderStatus.find((o) => o.key === status);

    return objectStatus && objectStatus;
  };

  const handleOpenMessagesForBusiness = () => {
    setOpenModalForBusiness(true);
    readMessages && readMessages();
    setUnreadAlert({ ...unreadAlert, business: false });
  };

  const handleOpenMessagesForDriver = () => {
    setOpenModalForDriver(true);
    readMessages && readMessages();
    setUnreadAlert({ ...unreadAlert, driver: false });
  };

  const unreadMessages = () => {
    const length = messages?.messages.length;
    const unreadLength = order?.unread_count;
    const unreadedMessages = messages.messages.slice(
      length - unreadLength,
      length,
    );
    const business = unreadedMessages.some((message: any) =>
      message?.can_see?.includes(2),
    );
    const driver = unreadedMessages.some((message: any) =>
      message?.can_see?.includes(4),
    );
    setUnreadAlert({ business, driver });
  };

  const handleCloseModal = () => {
    setOpenModalForBusiness(false);
    setOpenModalForDriver(false);
  };

  const handleArrowBack: any = () => {
    if (!isFromCheckout) {
      navigation?.canGoBack() && navigation.goBack();
      return;
    }
    navigation.navigate('BottomTab');
  };

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
    };
  }, []);

  useEffect(() => {
    if (messagesReadList?.length) {
      openModalForBusiness
        ? setUnreadAlert({ ...unreadAlert, business: false })
        : setUnreadAlert({ ...unreadAlert, driver: false });
    }
  }, [messagesReadList]);

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

  useEffect(() => {
    if (driverLocation) {
      locations[0] = driverLocation;
    }
  }, [driverLocation]);

  return (
    <OrderDetailsContainer keyboardShouldPersistTaps="handled">
      <Spinner visible={!order || Object.keys(order).length === 0} />
      {order && Object.keys(order).length > 0 && (
        <>
          <Header>
            <NavBar
              style={{ paddingBottom: 0, marginLeft: -20, backgroundColor: 'transparent' }}
              btnStyle={{ backgroundColor: 'transparent' }}
              leftImageStyle={{ tintColor: theme.colors.textThird }}
              onActionLeft={() => handleArrowBack()}
            />
            <OrderInfo>
              <OrderData>
                <OText
                  size={20}
                  lineHeight={30}
                  weight={'600'}
                  color={theme.colors.textNormal}>
                  {t('ORDER', 'Order')} #{order?.id}
                </OText>
                <OText size={12} lineHeight={18} color={theme.colors.textNormal}>
                  {order?.delivery_datetime_utc
                    ? parseDate(order?.delivery_datetime_utc)
                    : parseDate(order?.delivery_datetime, { utc: false })}
                </OText>
                {(
                  parseInt(order?.status, 10) === 1 ||
                  parseInt(order?.status, 10) === 11 ||
                  parseInt(order?.status, 10) === 15
                ) && !order.review && !isReviewed && (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={{ marginTop: 6 }}
                      onPress={() => onNavigationRedirect('ReviewOrder', {
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
                      })}
                    >
                      <OText
                        size={10}
                        lineHeight={15}
                        color={theme.colors.textSecondary}
                        style={{ textDecorationLine: 'underline' }}>
                        {t('REVIEW_ORDER', 'Review order')}
                      </OText>
                    </TouchableOpacity>
                  )}

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
          </Header>
          <OrderContent>
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
                    {(!!order?.business?.cellphone || !!order?.business?.phone) && (
                      <View style={{ paddingEnd: 5 }}>
                        <OLink
                          url={`tel:${order?.business?.cellphone ?? order?.business?.phone}`}
                        >
                          <OIcon
                            src={theme.images.general.phone}
                            width={16}
                            color={theme.colors.disabled}
                          />
                        </OLink>
                      </View>
                    )}
                    <TouchableOpacity
                      style={{ paddingStart: 5 }}
                      onPress={() => handleOpenMessagesForBusiness()}>
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
                <OText
                  size={12}
                  lineHeight={18}
                  color={theme.colors.textNormal}
                  mBottom={2}>
                  {order?.business?.cellphone}
                </OText>
                <OText size={12} lineHeight={18} color={theme.colors.textNormal}>
                  {order?.business?.address}
                </OText>
              </View>
            </OrderBusiness>
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
                {t('TO', 'To')}
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
                  <OText
                    size={12}
                    lineHeight={18}
                    color={theme.colors.textNormal}
                    mBottom={2}>
                    {order?.customer?.cellphone}
                  </OText>
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
                            onPress={() => handleOpenMessagesForDriver()}>
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
                style={{ fontWeight: '600', marginBottom: 16 }}>
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
              <OButton
                text={t('YOUR_ORDERS', 'Your Orders')}
                textStyle={{ fontSize: 14, color: theme.colors.primary }}
                imgRightSrc={null}
                borderColor={theme.colors.primary}
                bgColor={theme.colors.clear}
                style={{ borderRadius: 7.6, borderWidth: 1, height: 44, shadowOpacity: 0 }}
                parentStyle={{ marginTop: 29, width: '50%' }}
                onClick={() => navigation.navigate('BottomTab', { screen: 'MyOrders' })}
              />
            </HeaderInfo>
            <OrderProducts>
              {order?.products?.length &&
                order?.products.map((product: any, i: number) => (
                  <ProductItemAccordion
                    key={product?.id || i}
                    product={product}
                    isFromCheckout
                  />
                ))}
            </OrderProducts>
            <OrderBill>
              <View style={{ height: 1, backgroundColor: theme.colors.border, marginBottom: 17 }} />
              <Table>
                <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>{t('SUBTOTAL', 'Subtotal')}</OText>
                <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>
                  {parsePrice(((order?.summary?.subtotal || order?.subtotal) + getIncludedTaxes()))}
                </OText>
              </Table>
              {(order?.summary?.discount > 0 || order?.discount > 0) && (
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
                order?.taxes?.length === 0 && order?.tax_type === 2 && (
                  <Table>
                    <OText size={12}>
                      {t('TAX', 'Tax')} {`(${verifyDecimals(order?.tax, parseNumber)}%)`}
                    </OText>
                    <OText size={12}>{parsePrice(order?.summary?.tax || 0)}</OText>
                  </Table>
                )
              }
              {
                order?.fees?.length === 0 && (
                  <Table>
                    <OText size={12}>
                      {t('SERVICE_FEE', 'Service fee')}
                      {`(${verifyDecimals(order?.service_fee, parseNumber)}%)`}
                    </OText>
                    <OText size={12}>{parsePrice(order?.summary?.service_fee || 0)}</OText>
                  </Table>
                )
              }
              {
                order?.taxes?.length > 0 && order?.taxes?.filter((tax: any) => tax?.type === 2 && tax?.rate !== 0).map((tax: any) => (
                  <Table key={tax.id}>
                    <OSRow>
                      <OText size={12} numberOfLines={1}>
                        {tax.name || t('INHERIT_FROM_BUSINESS', 'Inherit from business')}
                        {`(${verifyDecimals(tax?.rate, parseNumber)}%)`}{' '}
                      </OText>
                      <TouchableOpacity onPress={() => setOpenTaxModal({ open: true, data: tax })}>
                        <AntIcon name='exclamationcircleo' size={14} color={theme.colors.primary} />
                      </TouchableOpacity>
                    </OSRow>
                    <OText size={12}>{parsePrice(tax?.summary?.tax || 0)}</OText>
                  </Table>
                ))
              }
              {
                order?.fees?.length > 0 && order?.fees?.filter((fee: any) => !(fee.fixed === 0 && fee.percentage === 0))?.map((fee: any) => (
                  <Table key={fee.id}>
                    <OSRow>
                      <OText size={12} numberOfLines={1}>
                        {fee.name || t('INHERIT_FROM_BUSINESS', 'Inherit from business')}
                        ({parsePrice(fee?.fixed)} + {fee.percentage}%){' '}
                      </OText>
                      <TouchableOpacity onPress={() => setOpenTaxModal({ open: true, data: fee })}>
                        <AntIcon name='exclamationcircleo' size={14} color={theme.colors.primary} />
                      </TouchableOpacity>
                    </OSRow>
                    <OText size={12}>{parsePrice(fee?.fixed + fee?.summary?.percentage || 0)}</OText>
                  </Table>
                ))
              }
              {(order?.summary?.delivery_price > 0 ||
                order?.deliveryFee > 0) && (
                  <Table>
                    <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>{t('DELIVERY_FEE', 'Delivery Fee')}</OText>
                    <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>
                      {parsePrice(
                        order?.summary?.delivery_price || order?.deliveryFee,
                      )}
                    </OText>
                  </Table>
                )}
              <Table>
                <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>
                  {t('DRIVER_TIP', 'Driver tip')}
                  {(order?.summary?.driver_tip > 0 || order?.driver_tip > 0) &&
                    parseInt(configs?.driver_tip_type?.value, 10) === 2 &&
                    !parseInt(configs?.driver_tip_use_custom?.value, 10) &&
                    `(${verifyDecimals(order?.driver_tip, parseNumber)}%)`}
                </OText>
                <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>
                  {parsePrice(
                    order?.summary?.driver_tip || order?.totalDriverTip,
                  )}
                </OText>
              </Table>
              <Total>
                <Table>
                  <OText size={20} lineHeight={30} weight={'600'} color={theme.colors.textNormal}>{t('TOTAL', 'Total')}</OText>
                  <OText size={20} lineHeight={30} weight={'600'} color={theme.colors.textNormal}>
                    {parsePrice(order?.summary?.total || order?.total)}
                  </OText>
                </Table>
              </Total>
              {order?.comment && (
                <Table>
                  <OText
                    style={{ flex: 1 }}
                    size={12}
                    lineHeight={18}
                    weight={'400'}
                    color={theme.colors.textNormal}
                  >
                    {t('COMMENT', 'Comment')}
                  </OText>
                  <OText style={{ maxWidth: '70%' }} size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>
                    {order?.comment}
                  </OText>
                </Table>
              )}
            </OrderBill>
          </OrderContent>
        </>
      )}
      <OModal
        open={openModalForBusiness || openModalForDriver}
        customClose
        entireModal
        onClose={() => handleCloseModal()}>
        <Messages
          type={openModalForBusiness ? USER_TYPE.BUSINESS : USER_TYPE.DRIVER}
          orderId={order?.id}
          messages={messages}
          order={order}
          setMessages={setMessages}
          onClose={() => handleCloseModal()}
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
  );
};

export const OrderDetails = (props: OrderDetailsParams) => {
  const orderDetailsProps = {
    ...props,
    UIComponent: OrderDetailsUI,
  };

  return <OrderDetailsConTableoller {...orderDetailsProps} />;
};
