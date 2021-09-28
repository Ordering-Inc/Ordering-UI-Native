//React & React Native
import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

// Thirds
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder';

//OrderingComponent
import {
  useLanguage,
  OrderDetails as OrderDetailsConTableoller,
  useUtils,
  useConfig,
  useToast,
  ToastType,
} from 'ordering-components/native';

//Components
import Alert from '../../providers/AlertProvider';
import { AcceptOrRejectOrder } from '../AcceptOrRejectOrder';
import { Chat } from '../Chat';
import { FloatingButton } from '../FloatingButton';
import { DriverMap } from '../DriverMap';
import { OButton, OText, OIconButton } from '../shared';
import { OModal } from '../shared';
import { OrderDetailsParams } from '../../types';
import { ProductItemAccordion } from '../ProductItemAccordion';
import { USER_TYPE } from '../../config/constants';
import { useTheme } from 'styled-components/native';
import { verifyDecimals } from '../../utils';
import { NotFoundSource } from '../NotFoundSource';

//Styles
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
} from './styles';

export const OrderDetailsUI = (props: OrderDetailsParams) => {
  const {
    navigation,
    messages,
    setMessages,
    readMessages,
    messagesReadList,
    handleChangeOrderStatus,
    permissions,
    askLocationPermission,
    driverLocation,
    actions,
    updateDriverPosition,
    driverUpdateLocation,
    setDriverUpdateLocation,
    titleAccept,
    titleReject,
    appTitle,
  } = props;

  const [, { showToast }] = useToast();
  const { order, loading, error } = props.order;
  const theme = useTheme();
  const [, t] = useLanguage();
  const [{ parsePrice, parseNumber, parseDate }] = useUtils();
  const [{ configs }] = useConfig();
  const [actionOrder, setActionOrder] = useState('');
  const [unreadAlert, setUnreadAlert] = useState({
    business: false,
    driver: false,
  });
  const [openModalForMapView, setOpenModalForMapView] = useState(false);
  const [openModalForBusiness, setOpenModalForBusiness] = useState(false);
  const [openModalForAccept, setOpenModalForAccept] = useState(false);
  const [alertState, setAlertState] = useState<{
    open: boolean;
    content: Array<string>;
    key?: string | null;
  }>({ open: false, content: [], key: null });

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
        value: t('PREPARATION_COMPLETED', 'Preparation Completed'),
        slug: 'PREPARATION_COMPLETED',
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

  const showFloatButtonsPickUp: any = {
    8: true,
    3: true,
  };

  const showFloatButtonsAcceptOrReject: any = {
    0: true,
    7: true,
  };

  const marginContainer: any = {
    0: true,
    3: true,
    7: true,
    8: true,
    9: true,
  };

  const handleOpenMessagesForBusiness = () => {
    setOpenModalForBusiness(true);
    readMessages && readMessages();
    setUnreadAlert({ ...unreadAlert, business: false });
  };

  const handleOpenMapView = async () => {
    if (permissions.locationStatus === 'granted') {
      setOpenModalForMapView(!openModalForMapView);
    } else if (permissions.locationStatus === 'blocked') {
      // redirectToSettings();
      showToast(
        ToastType.Error,
        t(
          'GEOLOCATION_SERVICE_PERMISSION_BLOCKED',
          'Geolocation service  permissions blocked.',
        ),
      );
    } else {
      const response = await askLocationPermission();
      if (response === 'granted') {
        setOpenModalForMapView(!openModalForMapView);
      }
    }
  };

  const handleViewActionOrder = (action: string) => {
    if (openModalForMapView) {
      setOpenModalForMapView(false);
    }
    setActionOrder(action);
    setOpenModalForAccept(true);
  };

  useEffect(() => {
    if (permissions.locationStatus !== 'granted' && openModalForMapView) {
      setOpenModalForMapView(false);
    }
  }, [permissions.locationStatus]);

  useEffect(() => {
    if (openModalForAccept) {
      setOpenModalForAccept(false);
    }

    if (openModalForBusiness) {
      setOpenModalForBusiness(false);
    }

    if (openModalForMapView) {
      setOpenModalForMapView(false);
    }
  }, [loading]);

  const handleCloseModal = () => {
    setOpenModalForBusiness(false);
  };

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

  const handleArrowBack: any = () => {
    navigation?.canGoBack() && navigation.goBack();
  };

  useEffect(() => {
    if (order?.driver === null) {
      setAlertState({
        open: true,
        content: [
          t(
            'YOU_HAVE_BEEN_REMOVED_FROM_THE_ORDER',
            'You have been removed from the order',
          ),
        ],
        key: null,
      });
    }
  }, [order?.driver]);

  useEffect(() => {
    if (messagesReadList?.length) {
      openModalForBusiness
        ? setUnreadAlert({ ...unreadAlert, business: false })
        : setUnreadAlert({ ...unreadAlert, driver: false });
    }
  }, [messagesReadList]);

  const locations = [
    {
      ...order?.business?.location,
      title: order?.business?.name,
      icon: order?.business?.logo || theme.images.dummies.businessLogo,
      type: 'Business',
    },
    {
      ...order?.customer?.location,
      title: order?.customer?.name,
      icon:
        order?.customer?.photo ||
        'https://res.cloudinary.com/demo/image/upload/c_thumb,g_face,r_max/d_avatar.png/non_existing_id.png',
      type: 'Customer',
    },
  ];

  useEffect(() => {
    if (driverLocation) {
      locations[0] = driverLocation;
    }
  }, [driverLocation]);

  const styles = StyleSheet.create({
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
  });

  let locationMarker;
  let isToFollow = false;
  let isBusinessMarker = false;

  if (order?.status === 7 || order?.status === 8) {
    const markerBusiness = 'Business';
    isBusinessMarker = true;
    locationMarker = locations.find(
      (location: any) => location.type === markerBusiness,
    );

    if (order?.status === 8) {
      isToFollow = true;
    }
  } else if (order?.status === 3 || order?.status === 9) {
    const markerCustomer = 'Customer';
    isToFollow = true;
    isBusinessMarker = false;
    locationMarker = locations.find(
      (location: any) => location.type === markerCustomer,
    );
  } else {
    const markerBusiness = 'Business';
    locationMarker = locations.find(
      (location: any) => location.type === markerBusiness,
    );
  }

  return (
    <>
      {(!order || Object.keys(order).length === 0) && !error && (
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
      {error?.length > 0 && (
        <NotFoundSource
          btnTitle={t('GO_TO_MY_ORDERS', 'Go to my orders')}
          content={props.order.error[0]}
          onClickButton={() => navigation.navigate('Orders')}
        />
      )}
      {order && Object.keys(order).length > 0 && !error && (
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
          </OrderHeader>
          <OrderDetailsContainer
            style={{
              marginBottom: marginContainer[order?.status] ? 60 : 0,
            }}
            keyboardShouldPersistTaps="handled">
            <>
              <OrderContent>
                <OrderBusiness>
                  <OText style={{ marginBottom: 5 }} size={16} weight="600">
                    {t('BUSINESS_DETAILS', 'Business details')}
                  </OText>

                  <OText numberOfLines={1} mBottom={4} ellipsizeMode="tail">
                    {order?.business?.name}
                  </OText>

                  <OText numberOfLines={1} mBottom={4} ellipsizeMode="tail">
                    {order?.business?.email}
                  </OText>

                  <OText numberOfLines={1} mBottom={4} ellipsizeMode="tail">
                    {order?.business?.cellphone}
                  </OText>

                  <OText numberOfLines={1} mBottom={4} ellipsizeMode="tail">
                    {order?.business?.address}
                  </OText>
                </OrderBusiness>

                <OrderCustomer>
                  <OText style={{ marginBottom: 5 }} size={16} weight="600">
                    {t('CUSTOMER_DETAILS', 'Customer details')}
                  </OText>

                  <OText numberOfLines={1} mBottom={4} ellipsizeMode="tail">
                    {order?.customer?.name}
                  </OText>

                  <OText numberOfLines={1} mBottom={4} ellipsizeMode="tail">
                    {order?.customer?.email}
                  </OText>

                  <OText numberOfLines={1} mBottom={4} ellipsizeMode="tail">
                    {order?.customer?.cellphone}
                  </OText>

                  <OText numberOfLines={1} mBottom={4} ellipsizeMode="tail">
                    {order?.customer?.address}
                  </OText>
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
                        comment={order.comment ? order.comment : ' '}
                      />
                    ))}
                </OrderProducts>

                <OrderBill>
                  <Table>
                    <OText mBottom={4}>{t('SUBTOTAL', 'Subtotal')}</OText>

                    <OText mBottom={4}>{parsePrice(order?.subtotal)}</OText>
                  </Table>

                  {order?.tax_type !== 1 && (
                    <Table>
                      <OText mBottom={4}>
                        {t('TAX', 'Tax')}
                        {`(${verifyDecimals(order?.tax, parseNumber)}%)`}
                      </OText>

                      <OText mBottom={4}>
                        {parsePrice(order?.summary?.tax || order?.totalTax)}
                      </OText>
                    </Table>
                  )}

                  {(order?.summary?.discount > 0 || order?.discount > 0) && (
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
                        -{' '}
                        {parsePrice(
                          order?.summary?.discount || order?.discount,
                        )}
                      </OText>
                    </Table>
                  )}

                  {(order?.summary?.delivery_price > 0 ||
                    order?.deliveryFee > 0) && (
                    <Table>
                      <OText mBottom={4}>
                        {t('DELIVERY_FEE', 'Delivery Fee')}
                      </OText>

                      <OText mBottom={4}>
                        {parsePrice(
                          order?.summary?.delivery_price || order?.deliveryFee,
                        )}
                      </OText>
                    </Table>
                  )}

                  <Table>
                    <OText mBottom={4}>
                      {t('DRIVER_TIP', 'Driver tip')}
                      {(order?.summary?.driver_tip > 0 ||
                        order?.driver_tip > 0) &&
                        parseInt(configs?.driver_tip_type?.value, 10) === 2 &&
                        !parseInt(configs?.driver_tip_use_custom?.value, 10) &&
                        `(${verifyDecimals(order?.driver_tip, parseNumber)}%)`}
                    </OText>

                    <OText mBottom={4}>
                      {parsePrice(
                        order?.summary?.driver_tip || order?.totalDriverTip,
                      )}
                    </OText>
                  </Table>

                  <Table>
                    <OText mBottom={4}>
                      {t('SERVICE_FEE', 'Service Fee')}
                      {`(${verifyDecimals(order?.service_fee, parseNumber)}%)`}
                    </OText>

                    <OText mBottom={4}>
                      {parsePrice(
                        order?.summary?.service_fee || order?.serviceFee || 0,
                      )}
                    </OText>
                  </Table>

                  <Total>
                    <Table>
                      <OText mBottom={4} style={styles.textBold}>
                        {t('TOTAL', 'Total')}
                      </OText>

                      <OText
                        mBottom={4}
                        style={styles.textBold}
                        color={theme.colors.primary}>
                        {parsePrice(order?.summary?.total || order?.total)}
                      </OText>
                    </Table>
                  </Total>
                </OrderBill>
              </OrderContent>

              {order?.status === 8 && order?.delivery_type === 1 && (
                <Pickup>
                  <OButton
                    style={styles.btnPickUp}
                    textStyle={{ color: theme.colors.primary }}
                    text={t('ARRIVED_TO_BUSINESS', 'Arrived to bussiness')}
                    onClick={() =>
                      handleChangeOrderStatus && handleChangeOrderStatus(3)
                    }
                    imgLeftStyle={{ tintColor: theme.colors.backArrow }}
                  />
                </Pickup>
              )}
            </>

            <OModal
              open={openModalForBusiness}
              order={order}
              title={`${t('INVOICE_ORDER_NO', 'Order No.')} ${order.id}`}
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
              <DriverMap
                navigation={navigation}
                order={order}
                orderStatus={getOrderStatus(order?.status)?.value || ''}
                location={locationMarker}
                readOnly
                updateDriverPosition={updateDriverPosition}
                driverUpdateLocation={driverUpdateLocation}
                setDriverUpdateLocation={setDriverUpdateLocation}
                handleViewActionOrder={handleViewActionOrder}
                isBusinessMarker={isBusinessMarker}
                isToFollow={isToFollow}
                showAcceptOrReject={
                  showFloatButtonsAcceptOrReject[order?.status]
                }
                handleOpenMapView={handleOpenMapView}
              />
            </OModal>

            <View style={{ height: 30 }} />
          </OrderDetailsContainer>

          {showFloatButtonsPickUp[order?.status] && (
            <FloatingButton
              disabled={loading}
              btnText={t('FAILED', 'Failed')}
              isSecondaryBtn={false}
              secondButtonClick={() =>
                handleChangeOrderStatus && handleChangeOrderStatus(9)
              }
              firstButtonClick={() =>
                handleChangeOrderStatus && handleChangeOrderStatus(12)
              }
              secondBtnText={t('PICKUP_COMPLETE', 'Pickup complete')}
              secondButton={true}
              firstColorCustom={theme.colors.red}
              secondColorCustom={theme.colors.green}
            />
          )}
          {order?.status === 9 && (
            <FloatingButton
              disabled={loading}
              btnText={t('FAILED', 'Failed')}
              isSecondaryBtn={false}
              secondButtonClick={() =>
                handleChangeOrderStatus && handleChangeOrderStatus(11)
              }
              firstButtonClick={() =>
                handleChangeOrderStatus && handleChangeOrderStatus(12)
              }
              secondBtnText={t('DELIVERY_COMPLETE', 'Delivery complete')}
              secondButton={true}
              firstColorCustom={theme.colors.red}
              secondColorCustom={theme.colors.green}
            />
          )}
          {showFloatButtonsAcceptOrReject[order?.status] && (
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
          )}
          <Alert
            open={alertState.open}
            onAccept={handleArrowBack}
            onClose={handleArrowBack}
            content={alertState.content}
            title={t('ERROR', 'Error')}
          />
        </>
      )}
    </>
  );
};

export const OrderDetailsDelivery = (props: OrderDetailsParams) => {
  const orderDetailsProps = {
    ...props,
    UIComponent: OrderDetailsUI,
  };
  return <OrderDetailsConTableoller {...orderDetailsProps} />;
};
