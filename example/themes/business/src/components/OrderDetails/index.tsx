import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder';
import { useTheme } from 'styled-components/native';
import {
  ToastType,
  useToast,
  useLanguage,
  OrderDetails as OrderDetailsController,
  useUtils,
  useConfig,
  useSession,
} from 'ordering-components/native';
import {
  Actions,
  OrderDetailsContainer,
  Header,
  OrderContent,
  OrderBusiness,
  OrderCustomer,
  OrderHeader,
  OrderProducts,
  Table,
  OrderBill,
  Total,
  Pickup,
  AssignDriver,
  DriverItem,
} from './styles';
import { AcceptOrRejectOrder } from '../AcceptOrRejectOrder';
import { Chat } from '../Chat';
import { FloatingButton } from '../FloatingButton';
import { ProductItemAccordion } from '../ProductItemAccordion';
import { GoogleMap } from '../GoogleMap';
import { OButton, OModal, OText, OIconButton, OIcon, OLink } from '../shared';
import { OrderDetailsParams } from '../../types';
import { verifyDecimals } from '../../utils';
import { USER_TYPE } from '../../config/constants';
import CountryPicker from 'react-native-country-picker-modal';
import { NotFoundSource } from '../NotFoundSource';

export const OrderDetailsUI = (props: OrderDetailsParams) => {
  const {
    navigation,
    messages,
    setMessages,
    readMessages,
    messagesReadList,
    handleAssignDriver,
    handleChangeOrderStatus,
    isFromCheckout,
    driverLocation,
    actions,
    titleAccept,
    titleReject,
    appTitle,
  } = props;

  const theme = useTheme();
  const [, t] = useLanguage();
  const [{ parsePrice, parseNumber, parseDate }] = useUtils();
  const [{ user, token }] = useSession();
  const [{ configs }] = useConfig();
  const [, { showToast }] = useToast();
  const [unreadAlert, setUnreadAlert] = useState({
    business: false,
    driver: false,
  });
  const { order, businessData, loading, error } = props.order;
  const { drivers, loadingDriver } = props.drivers;
  const itemsDrivers: any = [];
  const [actionOrder, setActionOrder] = useState('');
  const [openModalForBusiness, setOpenModalForBusiness] = useState(false);
  const [openModalForAccept, setOpenModalForAccept] = useState(false);
  const [openModalForMapView, setOpenModalForMapView] = useState(false);
  const [isDriverModalVisible, setIsDriverModalVisible] = useState(false);

  if (order?.status === 7 || order?.status === 4) {
    if (drivers?.length > 0 && drivers) {
      drivers.forEach((driver: any) => {
        itemsDrivers.push({
          available: driver?.available,
          key: driver?.id,
          value: driver?.id,
          label: driver?.name,
        });
      });

      if (
        !drivers?.some((driver: any) => driver?.id === order?.driver?.id) &&
        order?.driver?.id
      ) {
        itemsDrivers.push({
          available: order?.driver?.available,
          key: order?.driver?.id,
          value: order?.driver?.id,
          label: order?.driver?.name,
        });
      }
    }

    if (order?.driver && (!drivers?.length || drivers?.length === 0)) {
      itemsDrivers.push({
        available: order?.driver?.available,
        key: order?.driver?.id,
        value: order?.driver?.id,
        label: order?.driver?.name,
      });
    }

    if (order?.driver) {
      itemsDrivers.push({
        available: true,
        key: null,
        value: null,
        label: t('UNASSIGN_DRIVER', 'Unassign Driver'),
      });
    }

    if (itemsDrivers.length > 0) {
      itemsDrivers.sort((a: any, b: any) => {
        if (a.available > b.available) return -1;
      });
    }
  }

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

  const getProductPrice = (product: any) => {
    let subOptionPrice = 0;
    if (product.options.length > 0) {
      for (const option of product.options) {
        for (const suboption of option.suboptions) {
          subOptionPrice += suboption.quantity * suboption.price;
        }
      }
    }

    const price = product.quantity * (product.price + subOptionPrice);
    return price.toFixed(2);
  };

  const handleCopyClipboard = () => {
    const businessName = !!order?.business?.name
      ? `${order?.business?.name} \n`
      : '';

    const businessEmail = !!order?.business?.email
      ? `${order?.business?.email} \n`
      : '';

    const businessCellphone = !!order?.business?.cellphone
      ? `${order?.business?.cellphone} \n`
      : '';

    const businessPhone = !!order?.business?.phone
      ? `${order?.business?.phone} \n`
      : '';

    const businessAddress = !!order?.business?.address
      ? `${order?.business?.address} \n`
      : '';

    const businessSpecialAddress = !!order?.business?.address_notes
      ? `${order?.business?.address_notes} \n \n`
      : '';

    const customerName = !!order?.customer?.name
      ? `${order?.customer?.name} ${order?.customer?.middle_name || ''} ${
          order?.customer?.lastname || ''
        } ${order?.customer?.second_lastname || ''} \n`
      : '';

    const customerEmail = !!order?.customer.email
      ? `${order?.customer.email} \n`
      : '';

    const customerCellPhone = !!order?.customer?.cellphone
      ? `${order?.customer?.cellphone} \n`
      : '';

    const customerPhone = !!order?.customer?.phone
      ? `${order?.customer?.phone} \n`
      : '';

    const customerAddress = !!order?.customer?.address
      ? `${order?.customer?.address} \n`
      : '';

    const customerSpecialAddress = !!order?.customer?.address_notes
      ? `${order?.customer?.address_notes} \n`
      : '';

    const payment = order?.paymethod?.name
      ? `${order?.paymethod?.name} - ${
          order.delivery_type === 1
            ? t('DELIVERY', 'Delivery')
            : order.delivery_type === 2
            ? t('PICKUP', 'Pickup')
            : order.delivery_type === 3
            ? t('EAT_IN', 'Eat in')
            : order.delivery_type === 4
            ? t('CURBSIDE', 'Curbside')
            : t('DRIVER_THRU', 'Driver thru')
        }\n`
      : '';
    const productsInArray =
      order?.products.length &&
      order?.products.map((product: any, i: number) => {
        return ` ${product?.quantity} X ${product?.name} ${parsePrice(
          product.total ?? getProductPrice(product),
        )}\n`;
      });

    const productsInString = productsInArray.join(' ');
    const orderDetails = `${t(
      'ORDER_DETAILS',
      'Order Details',
    )}:\n${productsInString}\n`;

    const subtotal = `${t('SUBTOTAL', 'Subtotal')}: ${parsePrice(
      order?.subtotal,
    )}\n`;

    const drivertip = `${t('DRIVER_TIP', 'Driver tip')} ${parsePrice(
      order?.summary?.driver_tip || order?.totalDriverTip,
    )}\n`;

    const deliveryFee = `${t('DELIVERY_FEE', 'Delivery fee')} ${verifyDecimals(
      order?.service_fee,
      parseNumber,
    )}% ${parsePrice(order?.summary?.service_fee || order?.serviceFee || 0)}\n`;

    const total = `${t('TOTAL', 'Total')} ${parsePrice(
      order?.summary?.total || order?.total,
    )}\n`;

    const orderStatus = `${t('INVOICE_ORDER_NO', 'Order No.')} ${order.id} ${t(
      'IS',
      'is',
    )} ${getOrderStatus(order?.status)?.value}\n`;

    Clipboard.setString(
      `${orderStatus} ${payment} ${t(
        'BUSINESS_DETAILS',
        'Business Details',
      )}\n ${businessName} ${businessEmail} ${businessCellphone} ${businessPhone} ${businessAddress} ${businessSpecialAddress}${t(
        'CUSTOMER_DETAILS',
        'Customer Details',
      )}\n ${customerName} ${customerEmail} ${customerCellPhone} ${customerPhone} ${customerAddress} ${customerSpecialAddress}\n${orderDetails} ${subtotal} ${drivertip} ${deliveryFee} ${total}`,
    );

    showToast(
      ToastType.Info,
      t('COPY_TO_CLIPBOARD', 'Copy to clipboard.'),
      1000,
    );
  };

  const getOrderStatus = (s: string) => {
    const status = parseInt(s);
    const orderStatus = [
      {
        key: 0,
        value: t('PENDING', 'Pending'),
        slug: 'PENDING',
        percentage: 0.25,
      },
      {
        key: 1,
        value: t('COMPLETED', 'Completed'),
        slug: 'COMPLETED',
        percentage: 1,
      },
      {
        key: 2,
        value: t('REJECTED', 'Rejected'),
        slug: 'REJECTED',
        percentage: 0,
      },
      {
        key: 3,
        value: t('DRIVER_IN_BUSINESS', 'Driver in business'),
        slug: 'DRIVER_IN_BUSINESS',
        percentage: 0.6,
      },
      {
        key: 4,
        value: t('READY_FOR_PICKUP', 'Ready for pickup'),
        slug: 'READY_FOR_PICKUP',
        percentage: 0.7,
      },
      {
        key: 5,
        value: t('REJECTED', 'Rejected'),
        slug: 'REJECTED_BY_BUSINESS',
        percentage: 0,
      },
      {
        key: 6,
        value: t('REJECTED_BY_DRIVER', 'Rejected by Driver'),
        slug: 'REJECTED_BY_DRIVER',
        percentage: 0,
      },
      {
        key: 7,
        value: t('ACCEPTED_BY_BUSINESS', 'Accepted by business'),
        slug: 'ACCEPTED_BY_BUSINESS',
        percentage: 0.35,
      },
      {
        key: 8,
        value: t('ACCEPTED_BY_DRIVER', 'Accepted by driver'),
        slug: 'ACCEPTED_BY_DRIVER',
        percentage: 0.45,
      },
      {
        key: 9,
        value: t('PICK_UP_COMPLETED_BY_DRIVER', 'Pick up completed by driver'),
        slug: 'PICK_UP_COMPLETED_BY_DRIVER',
        percentage: 0.8,
      },
      {
        key: 10,
        value: t('PICK_UP_FAILED_BY_DRIVER', 'Pick up Failed by driver'),
        slug: 'PICK_UP_FAILED_BY_DRIVER',
        percentage: 0,
      },
      {
        key: 11,
        value: t(
          'DELIVERY_COMPLETED_BY_DRIVER',
          'Delivery completed by driver',
        ),
        slug: 'DELIVERY_COMPLETED_BY_DRIVER',
        percentage: 1,
      },
      {
        key: 12,
        value: t('DELIVERY_FAILED_BY_DRIVER', 'Delivery Failed by driver'),
        slug: 'DELIVERY_FAILED_BY_DRIVER',
        percentage: 0,
      },
      {
        key: 13,
        value: t('PREORDER', 'PreOrder'),
        slug: 'PREORDER',
        percentage: 0,
      },
      {
        key: 14,
        value: t('ORDER_NOT_READY', 'Order not ready'),
        slug: 'ORDER_NOT_READY',
        percentage: 0,
      },
      {
        key: 15,
        value: t(
          'ORDER_PICKEDUP_COMPLETED_BY_CUSTOMER',
          'Order picked up completed by customer',
        ),
        slug: 'ORDER_PICKEDUP_COMPLETED_BY_CUSTOMER',
        percentage: 100,
      },
      {
        key: 16,
        value: t('CANCELLED_BY_CUSTOMER', 'Cancelled by customer'),
        slug: 'CANCELLED_BY_CUSTOMER',
        percentage: 0,
      },
      {
        key: 17,
        value: t(
          'ORDER_NOT_PICKEDUP_BY_CUSTOMER',
          'Order not picked up by customer',
        ),
        slug: 'ORDER_NOT_PICKEDUP_BY_CUSTOMER',
        percentage: 0,
      },
      {
        key: 18,
        value: t(
          'DRIVER_ALMOST_ARRIVED_TO_BUSINESS',
          'Driver almost arrived to business',
        ),
        slug: 'DRIVER_ALMOST_ARRIVED_TO_BUSINESS',
        percentage: 0.15,
      },
      {
        key: 19,
        value: t(
          'DRIVER_ALMOST_ARRIVED_TO_CUSTOMER',
          'Driver almost arrived to customer',
        ),
        slug: 'DRIVER_ALMOST_ARRIVED_TO_CUSTOMER',
        percentage: 0.9,
      },
      {
        key: 20,
        value: t(
          'ORDER_CUSTOMER_ALMOST_ARRIVED_BUSINESS',
          'Customer almost arrived to business',
        ),
        slug: 'ORDER_CUSTOMER_ALMOST_ARRIVED_BUSINESS',
        percentage: 90,
      },
      {
        key: 21,
        value: t(
          'ORDER_CUSTOMER_ARRIVED_BUSINESS',
          'Customer arrived to business',
        ),
        slug: 'ORDER_CUSTOMER_ARRIVED_BUSINESS',
        percentage: 95,
      },
    ];

    const objectStatus = orderStatus.find(o => o.key === status);

    return objectStatus && objectStatus;
  };

  const handleOpenMessagesForBusiness = () => {
    setOpenModalForBusiness(true);
    readMessages && readMessages();
    setUnreadAlert({ ...unreadAlert, business: false });
  };

  const handleViewActionOrder = (action: string) => {
    if (openModalForMapView) {
      setOpenModalForMapView(false);
    }
    setActionOrder(action);
    setOpenModalForAccept(true);
  };

  const handleViewSummaryOrder = () => {
    navigation?.navigate &&
      navigation.navigate('OrderSummary', {
        order,
        orderStatus: getOrderStatus(order?.status)?.value,
      });
  };

  const handleCloseModal = () => {
    setOpenModalForBusiness(false);
  };

  const handleOpenMapView = () => {
    setOpenModalForMapView(!openModalForMapView);
  };

  const handleArrowBack: any = () => {
    navigation?.canGoBack() && navigation.goBack();
  };

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
      level: 4,
    },
    {
      ...order?.business?.location,
      title: order?.business?.name,
      icon: order?.business?.logo || theme.images.dummies.businessLogo,
      level: 2,
    },
    {
      ...order?.customer?.location,
      title: t('CUSTOMER', 'Customer'),
      icon:
        order?.customer?.photo ||
        'https://res.cloudinary.com/demo/image/upload/c_thumb,g_face,r_max/d_avatar.png/non_existing_id.png',
      level: 3,
    },
  ];

  useEffect(() => {
    if (openModalForAccept) {
      setOpenModalForAccept(false);
    }

    if (openModalForMapView) {
      setOpenModalForMapView(false);
    }
  }, [loading]);

  const showFloatButtonsAcceptOrReject: any = {
    0: true,
  };

  useEffect(() => {
    if (driverLocation) {
      locations[0] = { ...locations[0], driverLocation };
    }
  }, [driverLocation]);

  const styles = StyleSheet.create({
    driverOff: {
      backgroundColor: theme.colors.notAvailable,
    },
    rowDirection: {
      flexDirection: 'row',
    },
    statusBar: {
      height: 10,
    },
    logo: {
      width: 75,
      height: 75,
      borderRadius: 10,
    },
    textBold: {
      fontWeight: '600',
    },
    btnPickUp: {
      borderWidth: 0,
      backgroundColor: theme.colors.btnBGWhite,
      borderRadius: 8,
    },
    btnBackArrow: {
      borderWidth: 0,
      backgroundColor: theme.colors.backgroundLight,
      borderColor: theme.colors.primary,
      shadowColor: theme.colors.primary,
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      paddingLeft: 0,
      height: 14,
    },
    icons: {
      maxWidth: 40,
      height: 25,
    },
    linkWithIcons: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 5,
      flex: 1,
    },
  });

  const locationsToSend = locations.filter(
    (location: any) => location?.lat && location?.lng,
  );

  return (
    <>
      {(!order || Object.keys(order).length === 0) &&
        (error?.length < 1 || !error) && (
          <View
            style={{
              padding: 20,
              backgroundColor: theme.colors.backgroundLight,
            }}>
            {[...Array(6)].map((item, i) => (
              <Placeholder key={i} Animation={Fade}>
                <View style={{ flexDirection: 'row', marginBottom: 30 }}>
                  <Placeholder>
                    <PlaceholderLine width={90} />
                    <PlaceholderLine width={50} />
                    <PlaceholderLine width={20} />
                    <PlaceholderLine width={10} />
                  </Placeholder>
                </View>
              </Placeholder>
            ))}
          </View>
        )}

      {(!!error || error) && (
        <NotFoundSource
          btnTitle={t('GO_TO_MY_ORDERS', 'Go to my orders')}
          content={
            props.order.error[0] ||
            props.order.error ||
            t('NETWORK_ERROR', 'Network Error')
          }
          onClickButton={() => navigation.navigate('Orders')}
        />
      )}

      {order && Object.keys(order).length > 0 && (error?.length < 1 || !error) && (
        <>
          <Header>
            <OIconButton
              icon={theme.images.general.arrow_left}
              iconStyle={{ width: 20, height: 20 }}
              borderColor={theme.colors.clear}
              style={{ ...styles.icons, justifyContent: 'flex-end' }}
              onClick={() => handleArrowBack()}
            />

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
          </Header>
          <OrderHeader>
            <OText size={13} style={{ marginBottom: 5 }}>
              {order?.delivery_datetime_utc
                ? parseDate(order?.delivery_datetime_utc)
                : parseDate(order?.delivery_datetime, { utc: false })}
            </OText>

            <OText numberOfLines={2} size={20} weight="600">
              <>
                {`${t('INVOICE_ORDER_NO', 'Order No.')} ${order.id} ${t(
                  'IS',
                  'is',
                )} `}
                <OText
                  size={20}
                  weight="600"
                  color={colors[order?.status] || theme.colors.primary}>
                  {getOrderStatus(order?.status)?.value}
                </OText>
              </>
            </OText>
            <OText size={13}>
              {`${order?.paymethod?.name} - ${
                order.delivery_type === 1
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
          </OrderHeader>
          <OrderDetailsContainer keyboardShouldPersistTaps="handled">
            <>
              <OrderContent>
                <OrderBusiness>
                  <OText style={{ marginBottom: 5 }} size={16} weight="600">
                    {t('BUSINESS_DETAILS', 'Business details')}
                  </OText>

                  <OText numberOfLines={1} mBottom={4} ellipsizeMode="tail">
                    {order?.business?.name}
                  </OText>

                  {!!order?.business?.email && (
                    <View style={styles.linkWithIcons}>
                      <OLink
                        PressStyle={styles.linkWithIcons}
                        url={`mailto:${order?.business?.email}`}
                        shorcut={order?.business?.email}
                      />
                    </View>
                  )}

                  {!!order?.business?.cellphone && (
                    <View style={styles.linkWithIcons}>
                      <OLink
                        PressStyle={styles.linkWithIcons}
                        url={`tel:${order?.business?.cellphone}`}
                        shorcut={`${order?.business?.cellphone}`}
                      />
                    </View>
                  )}

                  {!!order?.business?.phone && (
                    <View style={styles.linkWithIcons}>
                      <OLink
                        PressStyle={styles.linkWithIcons}
                        url={`tel:${order?.business?.phone}`}
                        shorcut={order?.business?.phone}
                      />
                    </View>
                  )}

                  {!!order?.business?.address && (
                    <View style={styles.linkWithIcons}>
                      <OLink
                        PressStyle={styles.linkWithIcons}
                        url={Platform.select({
                          ios: `maps:0,0?q=${order?.business?.address}`,
                          android: `geo:0,0?q=${order?.business?.address}`,
                        })}
                        shorcut={order?.business?.address}
                      />
                    </View>
                  )}

                  {!!order?.business?.address_notes && (
                    <View style={styles.linkWithIcons}>
                      <OLink
                        PressStyle={styles.linkWithIcons}
                        url={Platform.select({
                          ios: `maps:0,0?q=${order?.business?.address_notes}`,
                          android: `geo:0,0?q=${order?.business?.address_notes}`,
                        })}
                        shorcut={order?.business?.address_notes}
                      />
                    </View>
                  )}
                </OrderBusiness>

                <OrderCustomer>
                  <OText style={{ marginBottom: 5 }} size={16} weight="600">
                    {t('CUSTOMER_DETAILS', 'Customer details')}
                  </OText>

                  <View style={{ flexDirection: 'row' }}>
                    <OText numberOfLines={2} mBottom={4}>
                      <OText
                        numberOfLines={1}
                        mBottom={4}
                        ellipsizeMode="tail"
                        space>
                        {order?.customer?.name}
                      </OText>

                      <OText
                        numberOfLines={1}
                        mBottom={4}
                        ellipsizeMode="tail"
                        space>
                        {order?.customer?.middle_name}
                      </OText>

                      <OText
                        numberOfLines={1}
                        mBottom={4}
                        ellipsizeMode="tail"
                        space>
                        {order?.customer?.lastname}
                      </OText>

                      <OText
                        numberOfLines={1}
                        mBottom={4}
                        ellipsizeMode="tail"
                        space>
                        {order?.customer?.second_lastname}
                      </OText>
                    </OText>
                  </View>

                  {!!order?.customer?.email && (
                    <View style={styles.linkWithIcons}>
                      <OLink
                        PressStyle={styles.linkWithIcons}
                        url={`mailto:${order?.customer?.email}`}
                        shorcut={order?.customer?.email}
                      />
                    </View>
                  )}

                  {!!order?.customer?.cellphone && (
                    <View style={styles.linkWithIcons}>
                      <OLink
                        PressStyle={styles.linkWithIcons}
                        url={`tel:${order?.customer?.cellphone}`}
                        shorcut={order?.customer?.cellphone}
                      />
                    </View>
                  )}

                  {!!order?.customer?.phone && (
                    <View style={styles.linkWithIcons}>
                      <OLink
                        PressStyle={styles.linkWithIcons}
                        url={`tel:${order?.customer?.phone}`}
                        shorcut={order?.customer?.phone}
                      />
                    </View>
                  )}

                  {!!order?.customer?.address && (
                    <View style={styles.linkWithIcons}>
                      <OLink
                        PressStyle={styles.linkWithIcons}
                        url={Platform.select({
                          ios: `maps:0,0?q=${order?.customer?.address}`,
                          android: `geo:0,0?q=${order?.customer?.address}`,
                        })}
                        shorcut={order?.customer?.address}
                      />
                    </View>
                  )}

                  {!!order?.customer?.internal_number && (
                    <OText numberOfLines={1} mBottom={4} ellipsizeMode="tail">
                      {order?.customer?.internal_number}
                    </OText>
                  )}

                  {!!order?.customer?.address_notes && (
                    <OText numberOfLines={1} mBottom={4} ellipsizeMode="tail">
                      {order?.customer?.address_notes}
                    </OText>
                  )}

                  {!!order?.customer.zipcode && (
                    <OText numberOfLines={1} mBottom={4} ellipsizeMode="tail">
                      {order?.customer?.zipcode}
                    </OText>
                  )}
                </OrderCustomer>

                <OrderProducts>
                  <OText style={{ marginBottom: 5 }} size={16} weight="600">
                    {t('ORDER_DETAILS', 'Order Details')}
                  </OText>

                  {order?.products?.length &&
                    order?.products.map((product: any, i: number) => (
                      <ProductItemAccordion
                        key={product?.id || i}
                        product={product}
                      />
                    ))}
                </OrderProducts>

                <OrderBill>
                  <Table>
                    <OText mBottom={4}>{t('SUBTOTAL', 'Subtotal')}</OText>
                    <OText mBottom={4}>
                      {parsePrice(
                        order.tax_type === 1
                          ? order?.summary?.subtotal + order?.summary?.tax ?? 0
                          : order?.summary?.subtotal ?? 0,
                      )}
                    </OText>
                  </Table>

                  {order?.tax_type !== 1 && (
                    <Table>
                      <OText mBottom={4}>
                        {t('TAX', 'Tax')}
                        {`(${verifyDecimals(
                          order?.summary?.tax_rate,
                          parseNumber,
                        )}%)`}
                      </OText>

                      <OText mBottom={4}>
                        {parsePrice(order?.summary?.tax ?? 0)}
                      </OText>
                    </Table>
                  )}

                  {order?.summary?.discount > 0 && (
                    <Table>
                      {order?.offer_type === 1 ? (
                        <OText mBottom={4}>
                          <OText>{t('DISCOUNT', 'Discount')}</OText>

                          <OText>
                            {`(${verifyDecimals(
                              order?.offer_rate,
                              parsePrice,
                            )}%)`}
                          </OText>
                        </OText>
                      ) : (
                        <OText mBottom={4}>{t('DISCOUNT', 'Discount')}</OText>
                      )}

                      <OText mBottom={4}>
                        - {parsePrice(order?.summary?.discount)}
                      </OText>
                    </Table>
                  )}

                  {order?.summary?.subtotal_with_discount > 0 &&
                    order?.summary?.discount > 0 &&
                    order?.summary?.total >= 0 && (
                      <Table>
                        <OText mBottom={4}>
                          {t(
                            'SUBTOTAL_WITH_DISCOUNT',
                            'Subtotal with discount',
                          )}
                        </OText>
                        {order?.tax_type === 1 ? (
                          <OText mBottom={4}>
                            {parsePrice(
                              order?.summary?.subtotal_with_discount +
                                order?.summary?.tax ?? 0,
                            )}
                          </OText>
                        ) : (
                          <OText mBottom={4}>
                            {parsePrice(
                              order?.summary?.subtotal_with_discount ?? 0,
                            )}
                          </OText>
                        )}
                      </Table>
                    )}

                  {order?.summary?.delivery_price > 0 && (
                    <Table>
                      <OText mBottom={4}>
                        {t('DELIVERY_FEE', 'Delivery Fee')}
                      </OText>

                      <OText mBottom={4}>
                        {parsePrice(order?.summary?.delivery_price)}
                      </OText>
                    </Table>
                  )}

                  <Table>
                    <OText mBottom={4}>
                      {t('DRIVER_TIP', 'Driver tip')}{' '}
                      {order?.summary?.driver_tip > 0 &&
                        parseInt(configs?.driver_tip_type?.value, 10) === 2 &&
                        !parseInt(configs?.driver_tip_use_custom?.value, 10) &&
                        `(${verifyDecimals(
                          order?.summary?.driver_tip,
                          parseNumber,
                        )}%)`}
                    </OText>

                    <OText mBottom={4}>
                      {parsePrice(order?.summary?.driver_tip ?? 0)}
                    </OText>
                  </Table>

                  {order?.summary?.service_fee > 0 && (
                    <Table>
                      <OText mBottom={4}>
                        {t('SERVICE_FEE', 'Service Fee')}{' '}
                        {`(${verifyDecimals(
                          order?.summary?.service_fee,
                          parseNumber,
                        )}%)`}
                      </OText>

                      <OText mBottom={4}>
                        {parsePrice(order?.summary?.service_fee)}
                      </OText>
                    </Table>
                  )}

                  <Total>
                    <Table>
                      <OText mBottom={4} style={styles.textBold}>
                        {t('TOTAL', 'Total')}
                      </OText>

                      <OText
                        mBottom={4}
                        style={styles.textBold}
                        color={theme.colors.primary}>
                        {parsePrice(order?.summary?.total ?? 0)}
                      </OText>
                    </Table>
                  </Total>
                </OrderBill>
              </OrderContent>

              {(order?.status === 7 || order?.status === 4) &&
                order?.delivery_type === 1 && (
                  <AssignDriver>
                    <OText style={{ marginBottom: 5 }} size={16} weight="600">
                      {t('ASSIGN_DRIVER', 'Assign driver')}
                    </OText>

                    <View
                      style={{
                        backgroundColor: theme.colors.inputChat,
                        borderRadius: 7.5,
                      }}>
                      <CountryPicker
                        // @ts-ignore
                        countryCode={undefined}
                        visible={isDriverModalVisible}
                        onClose={() => setIsDriverModalVisible(false)}
                        withCountryNameButton
                        renderFlagButton={() => (
                          <>
                            <TouchableOpacity
                              onPress={() => setIsDriverModalVisible(true)}
                              disabled={
                                itemsDrivers.length === 0 || loadingDriver
                              }>
                              {loadingDriver ? (
                                <DriverItem justifyContent="center">
                                  <ActivityIndicator
                                    size="small"
                                    color={theme.colors.primary}
                                  />
                                </DriverItem>
                              ) : (
                                <DriverItem justifyContent="space-between">
                                  <OText>
                                    {itemsDrivers.length > 0
                                      ? order?.driver?.name ||
                                        t('SELECT_DRIVER', 'Select Driver')
                                      : t('WITHOUT_DRIVERS', 'Without drivers')}
                                  </OText>
                                  <OIcon
                                    src={theme?.images?.general?.chevronDown}
                                    color={theme.colors.backArrow}
                                    width={20}
                                    height={20}
                                  />
                                </DriverItem>
                              )}
                            </TouchableOpacity>
                          </>
                        )}
                        flatListProps={{
                          keyExtractor: (item: any) => item.value,
                          data: itemsDrivers || [],
                          renderItem: ({ item }: any) => (
                            <TouchableOpacity
                              style={!item.available && styles.driverOff}
                              disabled={
                                !item.available ||
                                order?.driver?.id === item.value
                              }
                              onPress={() => {
                                handleAssignDriver &&
                                  handleAssignDriver(item.value);
                                setIsDriverModalVisible(false);
                              }}>
                              <DriverItem>
                                <OText
                                  color={!item.available && theme.colors.grey}>
                                  {item.label}
                                  {!item.available &&
                                    ` (${t('NOT_AVAILABLE', 'Not available')})`}
                                  {item.value === order?.driver?.id &&
                                    ` (${t('SELECTED', 'Selected')})`}
                                </OText>
                              </DriverItem>
                            </TouchableOpacity>
                          ),
                        }}
                      />
                    </View>
                  </AssignDriver>
                )}

              {order?.status === 7 && (
                <Pickup>
                  <OButton
                    style={styles.btnPickUp}
                    textStyle={{ color: theme.colors.primary }}
                    text={t('READY_FOR_PICKUP', 'Ready for pickup')}
                    onClick={() =>
                      handleChangeOrderStatus && handleChangeOrderStatus(4)
                    }
                    imgLeftStyle={{ tintColor: theme.colors.backArrow }}
                    imgRightSrc={false}
                    isLoading={loading}
                  />
                </Pickup>
              )}

              {order?.status === 4 && ![1].includes(order?.delivery_type) && (
                <Pickup>
                  <OButton
                    style={{
                      ...styles.btnPickUp,
                      backgroundColor: theme.colors.green,
                    }}
                    textStyle={{ color: theme.colors.white }}
                    text={t(
                      'PICKUP_COMPLETED_BY_CUSTOMER',
                      'Pickup completed by customer',
                    )}
                    onClick={() =>
                      handleChangeOrderStatus && handleChangeOrderStatus(15)
                    }
                    imgLeftStyle={{ tintColor: theme.colors.backArrow }}
                    imgRightSrc={false}
                    isLoading={loading}
                  />
                </Pickup>
              )}

              {order?.status === 4 && ![1].includes(order?.delivery_type) && (
                <Pickup>
                  <OButton
                    style={{
                      ...styles.btnPickUp,
                      backgroundColor: theme.colors.red,
                    }}
                    textStyle={{ color: theme.colors.white }}
                    text={t(
                      'ORDER_NOT_PICKEDUP_BY_CUSTOMER',
                      'Order not picked up by customer',
                    )}
                    onClick={() =>
                      handleChangeOrderStatus && handleChangeOrderStatus(17)
                    }
                    imgLeftStyle={{ tintColor: theme.colors.backArrow }}
                    imgRightSrc={false}
                    isLoading={loading}
                  />
                </Pickup>
              )}

              <OModal
                open={openModalForBusiness}
                order={order}
                title={`${t('INVOICE_ORDER_NO', 'Order No.')} ${order?.id}`}
                entireModal
                onClose={() => handleCloseModal()}>
                <Chat
                  type={
                    openModalForBusiness ? USER_TYPE.BUSINESS : USER_TYPE.DRIVER
                  }
                  orderId={order?.id}
                  messages={messages}
                  order={order}
                  setMessages={setMessages}
                />
              </OModal>

              <OModal
                open={openModalForAccept}
                onClose={() => setOpenModalForAccept(false)}
                entireModal
                customClose>
                <AcceptOrRejectOrder
                  handleUpdateOrder={handleChangeOrderStatus}
                  closeModal={setOpenModalForAccept}
                  customerCellphone={order?.customer?.cellphone}
                  loading={loading}
                  action={actionOrder}
                  orderId={order?.id}
                  notShowCustomerPhone={false}
                  actions={actions}
                  titleAccept={titleAccept}
                  titleReject={titleReject}
                  appTitle={appTitle}
                />
              </OModal>

              <OModal
                open={openModalForMapView}
                onClose={() => handleOpenMapView()}
                entireModal
                customClose>
                <GoogleMap
                  location={order?.customer?.location}
                  locations={locationsToSend}
                  driverLocation={driverLocation}
                  navigation={navigation}
                  handleViewActionOrder={handleViewActionOrder}
                  handleOpenMapView={handleOpenMapView}
                  readOnly
                  showAcceptOrReject={
                    showFloatButtonsAcceptOrReject[order?.status]
                  }
                />
              </OModal>
            </>
            <View style={{ height: 30 }} />
          </OrderDetailsContainer>

          {order &&
            Object.keys(order).length > 0 &&
            getOrderStatus(order?.status)?.value ===
              t('PENDING', 'Pending') && (
              <>
                <FloatingButton
                  btnText={t('REJECT', 'Reject')}
                  isSecondaryBtn={false}
                  secondButtonClick={() => handleViewActionOrder('accept')}
                  firstButtonClick={() => handleViewActionOrder('reject')}
                  secondBtnText={t('ACCEPT', 'Accept')}
                  secondButton={true}
                  firstColorCustom={theme.colors.red}
                  secondColorCustom={theme.colors.green}
                />
              </>
            )}

          {order &&
            Object.keys(order).length > 0 &&
            getOrderStatus(order?.status)?.value !==
              t('PENDING', 'Pending') && (
              <FloatingButton
                btnText={t('COPY', 'Copy')}
                isSecondaryBtn={false}
                colorTxt1={theme.colors.primary}
                secondButtonClick={handleViewSummaryOrder}
                firstButtonClick={handleCopyClipboard}
                secondBtnText={t('PRINT', 'Print')}
                secondButton={true}
                firstColorCustom="transparent"
                secondColorCustom={theme.colors.primary}
              />
            )}
        </>
      )}
    </>
  );
};

export const OrderDetails = (props: OrderDetailsParams) => {
  const orderDetailsProps = {
    ...props,
    UIComponent: OrderDetailsUI,
  };
  return <OrderDetailsController {...orderDetailsProps} />;
};
