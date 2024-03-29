import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder';
import Clipboard from '@react-native-clipboard/clipboard';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  useLanguage,
  OrderDetails as OrderDetailsConTableoller,
  useToast,
  useSession,
  ToastType,
  useUtils,
  useConfig,
  useApi
} from 'ordering-components/native';

import Alert from '../../providers/AlertProvider';
import { AcceptOrRejectOrder } from '../AcceptOrRejectOrder';
import { Chat } from '../Chat';
import { FloatingButton } from '../FloatingButton';
import { DriverMap } from '../DriverMap';
import { OButton, OText } from '../shared';
import { OModal } from '../shared';
import { OrderDetailsParams } from '../../types';
import { USER_TYPE } from '../../config/constants';
import { useTheme } from 'styled-components/native';
import { NotFoundSource } from '../NotFoundSource';
import { verifyDecimals, getProductPrice, getOrderStatus } from '../../utils';
import { OrderHeaderComponent } from './OrderHeaderComponent';
import { OrderContentComponent } from './OrderContentComponent';
import { OrderDetailsContainer, Pickup } from './styles';
import { useOfflineActions } from '../../../../../src/context/OfflineActions';

export const OrderDetailsUI = (props: OrderDetailsParams) => {
  const {
    navigation,
    messages,
    setMessages,
    readMessages,
    messagesReadList,
    permissions,
    askLocationPermission,
    driverLocation,
    actions,
    updateDriverPosition,
    driverUpdateLocation,
    setDriverUpdateLocation,
    orderTitle,
    appTitle,
    handleClickLogisticOrder,
    forceUpdate,
    getPermissions,
    orderAssingId,
    isGrantedPermissions
  } = props;

  const [, { showToast }] = useToast();
  const [{ parsePrice, parseNumber }] = useUtils();
  const [{ configs }] = useConfig();
  const [ordering] = useApi()
  const { order } = props.order
  const isDelosiProject = ['delosi', 'delosipruebas'].includes(ordering?.project)

  const hideTimer = configs?.hidden_driver_eta_time?.value === '1'
  const isAllowedDriverRejectOrder = configs?.allow_driver_reject_order?.value === '1'
  const isHideRejectButtons = configs?.reject_orders_enabled && configs?.reject_orders_enabled?.value !== '1'
  const isEnabledOrderNotReady = configs?.order_not_ready_enabled?.value === '1'
  const isEnabledFailedPickupDriver = configs?.failed_pickup_by_driver_enabled?.value === '1'
  const theme = useTheme();
  const [, t] = useLanguage();
  const [session] = useSession();
  const [{ isNetConnected, canSaveChangesOffline }, { applyOffAction, registerOffOrder }] = useOfflineActions()

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

  const disabledActionsByInternet = isNetConnected !== null && !isNetConnected && canSaveChangesOffline === false

  const validStatusComplete = [9, 19, 23, 26]

  const pendingOrderStatus = [1, 4, 7, 13]

  const logisticOrderStatus = [4, 6, 7]

  const deliveryTypes = [1, 7]


  const showFloatButtonsPickUp: any = {
    8: !isHideRejectButtons,
    3: true,
    18: !isHideRejectButtons,
  };

  const showFloatButtonsAcceptOrReject: any = {
    0: true,
    4: true,
    7: true,
    14: true
  };

  const handleChangeOrderStatus = async (status: number) => {
    if (!isNetConnected && canSaveChangesOffline !== false) {
      const result = applyOffAction({
        event: 'evt_off_change_order_status',
        data: { orderId: order?.id, body: { status } }
      })
    }

    const dataToSave: any = !isNetConnected && canSaveChangesOffline !== false
      ? { dataToSave: { status, unsync: true } }
      : null
    const orderUpdated = await props.handleChangeOrderStatus(status, {}, dataToSave)

    if (!isNetConnected && canSaveChangesOffline !== false) {
      await registerOffOrder(orderUpdated)
    }
  }

  const handleOpenMessagesForBusiness = () => {
    setOpenModalForBusiness(true);
    readMessages && readMessages();
  };

  const goToPermissionPage = () => {
    navigation.navigate('RequestPermissions')
  }

  const handleOpenMapView = async () => {
    if (!isGrantedPermissions) {
      navigation.navigate('RequestPermissions')
      return
    }
    const _permissions = await getPermissions()

    const isBlocked = _permissions.some((_permission: string) => permissions?.locationStatus?.[_permission] === 'blocked')
    const isGranted = _permissions.reduce((allPermissions: boolean, _permission: string) => allPermissions && permissions?.locationStatus?.[_permission] === 'granted', true)

    if (isGranted) {
      setOpenModalForMapView(!openModalForMapView);
    } else if (isBlocked) {
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
      const isGranted = _permissions.reduce((allPermissions: boolean, _permission: string) => allPermissions && response?.locationStatus?.[_permission] === 'granted', true)
      if (isGranted) {
        setOpenModalForMapView(true)
      }
    }
  };

  const getFormattedSubOptionName = ({ quantity, name, position, price }: any) => {
    if (name !== 'No') {
      const pos = position && position !== 'whole' ? `(${t(position.toUpperCase(), position)})` : '';
      return pos
        ? `${quantity} x ${name} ${pos} +${parsePrice(price)}\n`
        : `${quantity} x ${name} +${parsePrice(price)}\n`;
    } else {
      return 'No\n';
    }
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
      ? `${order?.customer?.name} ${order?.customer?.middle_name || ''} ${order?.customer?.lastname || ''
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
      ? `${order?.paymethod?.name} - ${order.delivery_type === 1
        ? t('DELIVERY', 'Delivery')
        : order.delivery_type === 2
          ? t('PICKUP', 'Pickup')
          : order.delivery_type === 3
            ? t('EAT_IN', 'Eat in')
            : order.delivery_type === 4
              ? t('CURBSIDE', 'Curbside')
              : order.delivery_type === 5
                ? t('DRIVER_THRU', 'Driver thru')
                : order.delivery_type === 7
                  ? t('CATERING_DELIVERY', 'Catering delivery')
                  : order.delivery_type === 8
                    ? t('CATERING_PICKUP', 'Catering pickup')
                    : t('DELIVERY', 'Delivery')
      }\n`
      : '';

    const getSuboptions = (suboptions: any) => {
      const array: any = []
      suboptions?.length > 0 &&
        suboptions?.map((suboption: any) => {
          const string = `${getFormattedSubOptionName(suboption)}`
          array.push(string)
        })

      return array.join('')
    }

    const getOptions = (options: any, productComment: string = '') => {
      const array: any = [];

      options?.length &&
        options?.map((option: any) => {
          const string =
            `  ${option.name}\n    ${getSuboptions(option.suboptions)}`;

          array.push(string)
        })

      if (productComment) {
        array.push(`  ${t('COMMENT', 'Comment')}\n    ${productComment}\n`)
      }

      return array.join('')
    }

    const productsInArray =
      order?.products.length &&
      order?.products.map((product: any, i: number) => {
        const string =
          `${product?.quantity} X ${product?.name} ${parsePrice(product.total ?? getProductPrice(product))}\n${getOptions(product.options, product.comment)}`;

        return i === 0 ? ` ${string}` : string
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
    )} ${getOrderStatus(order?.status, t)?.value}\n`;

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

  const handleViewActionOrder = (action: string) => {
    if (action === 'reject' && !isAllowedDriverRejectOrder) {
      setAlertState({
        open: true,
        content: [
          t('DRIVER_NOT_ALLOWED_TO_REJECT_ORDER', 'The driver is not allowed to reject an order.'),
        ],
        key: null,
      })
      return
    }
    if (!isGrantedPermissions) {
      navigation.navigate('RequestPermissions')
      return
    }
    if (openModalForMapView) {
      setOpenModalForMapView(false);
    }
    setActionOrder(action);
    setOpenModalForAccept(true);
  };

  const handleCloseModal = () => {
    setOpenModalForBusiness(false);
  };

  const handleArrowBack: any = () => {
    if (alertState?.open && !isAllowedDriverRejectOrder && !pendingOrderStatus.includes(order?.status)) {
      setAlertState({
        ...alertState,
        open: false
      })
      return
    }
    navigation?.canGoBack() && navigation.goBack();
  };

  const handleRejectLogisticOrder = () => {
    handleClickLogisticOrder?.(2, orderAssingId || order?.logistic_order_id)
    handleArrowBack()
  }

  const handleAcceptLogisticOrder = (order: any) => {
    handleClickLogisticOrder?.(1, orderAssingId || order?.logistic_order_id)
    if (order?.order_group) {
      handleArrowBack()
    }
  }

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
    if (permissions?.locationStatus !== 'granted' && openModalForMapView) {
      setOpenModalForMapView(false);
    }
  }, [permissions?.locationStatus]);

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
  }, [props.order?.loading]);

  useEffect(() => {
    if (order?.driver_id === null && session?.user?.level === 4) {
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
    if (driverLocation) {
      locations[0] = driverLocation;
    }
  }, [driverLocation]);

  useEffect(() => {
    if (messagesReadList?.length) {
      openModalForBusiness
        ? setUnreadAlert({ ...unreadAlert, business: false })
        : setUnreadAlert({ ...unreadAlert, driver: false });
    }
  }, [messagesReadList]);

  useEffect(() => {
    forceUpdate && handleViewActionOrder && handleViewActionOrder(forceUpdate === 9 ? 'forcePickUp' : 'forceDelivery')
  }, [forceUpdate])

  useEffect(() => {
    if (!!props.order?.error || props.order?.error?.length > 0) {
      showToast(ToastType.Error,
        props.order?.error?.[0] ||
        props.order?.error ||
        t('NETWORK_ERROR', 'Network Error'),
        5000)
    }
  }, [props.order?.error])

  const styles = StyleSheet.create({
    btnPickUp: {
      borderWidth: 0,
      backgroundColor: theme.colors.btnBGWhite,
      borderRadius: 8,
    },
  });

  let locationMarker: any;
  let isToFollow = false;
  let isBusinessMarker = false;
  const customerStatusses = [3, 9, 19, 23, 26]
  const businessStatusses = [7, 8, 18]
  const arrivedCustomerStatusses = [9, 19, 23]
  if (businessStatusses?.includes(order?.status)) {
    const markerBusiness = 'Business';
    isBusinessMarker = true;
    locationMarker = locations.find(
      (location: any) => location.type === markerBusiness,
    );

    if (order?.status === 8 || order?.status === 18) {
      isToFollow = true;
    }
  } else if (customerStatusses?.includes(order?.status)) {
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

  const OrderDetailsInformation = (props: { order: any, isOrderGroup?: boolean, lastOrder?: boolean }) => {
    const {
      order,
      isOrderGroup,
      lastOrder,
    } = props
    return (
      <>
        <OrderContentComponent
          order={order}
          logisticOrderStatus={logisticOrderStatus}
          isOrderGroup={isOrderGroup}
          lastOrder={lastOrder}
        />
        {(order?.status === 8 || order?.status === 18) && deliveryTypes?.includes(order?.delivery_type) && !props.order?.loading && (
          <Pickup>
            <OButton
              style={styles.btnPickUp}
              textStyle={{ color: theme.colors.primary }}
              text={t('ARRIVED_TO_BUSINESS', 'Arrived to bussiness')}
              isDisabled={disabledActionsByInternet}
              onClick={() =>
                isGrantedPermissions ? handleChangeOrderStatus(3) : goToPermissionPage()
              }
              imgLeftStyle={{ tintColor: theme.colors.backArrow }}
            />
          </Pickup>
        )}
        {arrivedCustomerStatusses.includes(order?.status) && deliveryTypes?.includes(order?.delivery_type) && !props.order?.loading && (
          <View style={{ paddingVertical: 20, marginBottom: 20 }}>
            <OButton
              style={styles.btnPickUp}
              textStyle={{ color: theme.colors.primary }}
              text={t('ARRIVED_TO_CUSTOMER', 'Arrived to customer')}
              isDisabled={disabledActionsByInternet}
              onClick={() =>
                isGrantedPermissions ? handleChangeOrderStatus(26) : goToPermissionPage()
              }
              imgLeftStyle={{ tintColor: theme.colors.backArrow }}
            />
          </View>
        )}
        {order?.status === 3 && deliveryTypes?.includes(order?.delivery_type) && !isHideRejectButtons && isEnabledOrderNotReady && !props.order?.loading && (
          <View style={{ paddingVertical: 20, marginBottom: 20 }}>
            <OButton
              style={styles.btnPickUp}
              textStyle={{ color: theme.colors.white }}
              text={t('ORDER_NOT_READY', 'Order not ready')}
              onClick={() =>
                handleViewActionOrder && handleViewActionOrder('notReady')
              }
              imgLeftStyle={{ tintColor: theme.colors.backArrow }}
              bgColor={theme.colors.red}
            />
          </View>
        )}
        <View
          style={{
            height:
              order?.status === 8 && deliveryTypes?.includes(order?.delivery_type) ? 50 : 35,
          }}
        />

      </>
    )
  }

  return (
    <>
      {(!order || Object.keys(order).length === 0) &&
        (props.order?.error?.length < 1 || !props.order?.error) && (
          <View style={{ flex: 1 }}>
            {[...Array(6)].map((item, i) => (
              <Placeholder key={i} Animation={Fade}>
                <View style={{ flexDirection: 'row', paddingVertical: 20 }}>
                  <Placeholder>
                    <PlaceholderLine width={100} />
                    <PlaceholderLine width={70} />
                    <PlaceholderLine width={30} />
                    <PlaceholderLine width={20} />
                  </Placeholder>
                </View>
              </Placeholder>
            ))}
          </View>
        )}
      {!((!order || Object.keys(order).length === 0) &&
        (props.order?.error?.length < 1 || !props.order?.error)) && order?.id && (
          <View style={{ flex: 1 }}>
            {order?.unsync && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center'
                }}
              >
                <MCIcon
                  name={'cloud-sync'}
                  color={'#444'}
                  size={16}
                />
                <OText
                  size={14}
                  color={theme.colors.textGray}
                  style={{ marginLeft: 5 }}
                >
                  {t('PENDING_SYNC_CHANGES', 'Pending sync changes')}
                </OText>
              </View>
            )}
            <OrderHeaderComponent
              order={order}
              handleOpenMapView={handleOpenMapView}
              handleOpenMessagesForBusiness={handleOpenMessagesForBusiness}
              handleCopyClipboard={handleCopyClipboard}
              getOrderStatus={getOrderStatus}
              handleArrowBack={handleArrowBack}
              logisticOrderStatus={logisticOrderStatus}
            />
            {order && Object.keys(order).length > 0 && (props.order?.error?.length < 1 || !props.order?.error) && (
              <>
                <OrderDetailsContainer
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                >
                  {order?.order_group && order?.order_group_id && order?.isLogistic ? order?.order_group?.orders.map((order: any, i: number, hash: any) => (
                    <OrderDetailsInformation key={order?.id} order={order} isOrderGroup lastOrder={hash?.length === i + 1} />
                  )) : (
                    <OrderDetailsInformation order={order} />
                  )}
                </OrderDetailsContainer>
                {showFloatButtonsPickUp[order?.status] && (
                  <FloatingButton
                    disabled={props.order?.loading || disabledActionsByInternet}
                    btnText={t('PICKUP_FAILED', 'Pickup failed')}
                    isSecondaryBtn={false}
                    secondButtonClick={() =>
                      isGrantedPermissions ? handleChangeOrderStatus(9) : goToPermissionPage()
                    }
                    firstButtonClick={() =>
                      handleViewActionOrder && handleViewActionOrder('pickupFailed')
                    }
                    secondBtnText={t('PICKUP_COMPLETE', 'Pickup complete')}
                    secondButton={true}
                    firstColorCustom={theme.colors.red}
                    secondColorCustom={theme.colors.green}
                    widthButton={isHideRejectButtons || !isEnabledFailedPickupDriver ? '100%' : '45%'}
                    isHideRejectButtons={isHideRejectButtons || !isEnabledFailedPickupDriver}
                  />
                )}
                {(validStatusComplete.includes(order?.status)) && !(isDelosiProject && order?.status !== 26 && isHideRejectButtons) && (
                  <>
                    <FloatingButton
                      disabled={props.order?.loading || disabledActionsByInternet}
                      btnText={t('DELIVERY_FAILED', 'Delivery Failed')}
                      isSecondaryBtn={false}
                      secondButtonClick={() =>
                        isGrantedPermissions ? handleChangeOrderStatus(11) : goToPermissionPage()
                      }
                      firstButtonClick={() =>
                        handleViewActionOrder && handleViewActionOrder('deliveryFailed')
                      }
                      secondBtnText={t('DELIVERY_COMPLETE', 'Delivery complete')}
                      secondButton={isDelosiProject ? order?.status === 26 : true}
                      firstColorCustom={theme.colors.red}
                      principalButtonColor={theme.colors.red}
                      secondColorCustom={theme.colors.green}
                      widthButton={isHideRejectButtons || (isDelosiProject && order?.status !== 26) ? '100%' : '45%'}
                      isHideRejectButtons={isHideRejectButtons}
                    />
                  </>
                )}
                {showFloatButtonsAcceptOrReject[order?.status] && (
                  <FloatingButton
                    disabled={props.order?.loading || disabledActionsByInternet}
                    widthButton={isHideRejectButtons ? '100%' : '45%'}
                    isHideRejectButtons={isHideRejectButtons}
                    btnText={t('REJECT', 'Reject')}
                    firstColorCustom={theme.colors.red}
                    firstButtonClick={() => order?.isLogistic && (order?.order_group || logisticOrderStatus.includes(order?.status))
                      ? handleRejectLogisticOrder()
                      : handleViewActionOrder('reject')
                    }
                    isSecondaryBtn={false}
                    secondButton={true}
                    secondBtnText={t('ACCEPT', 'Accept')}
                    secondButtonClick={() => hideTimer
                      ? handleChangeOrderStatus(8)
                      : (order?.isLogistic && (order?.order_group || logisticOrderStatus.includes(order?.status)))
                        ? handleAcceptLogisticOrder(order)
                        : handleViewActionOrder('accept')}
                    secondColorCustom={theme.colors.green}
                  />
                )}
              </>
            )}
            {openModalForMapView && (
              <OModal
                open={openModalForMapView}
                onClose={() => handleOpenMapView()}
                entireModal
                customClose>
                <DriverMap
                  navigation={navigation}
                  order={order}
                  orderStatus={getOrderStatus(order?.status, t)?.value || ''}
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
            )}
            {openModalForBusiness && (
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
            )}
            {openModalForAccept && (
              <OModal
                open={openModalForAccept}
                onClose={() => setOpenModalForAccept(false)}
                entireModal
                customClose>
                <AcceptOrRejectOrder
                  handleUpdateOrder={props.handleChangeOrderStatus}
                  closeModal={setOpenModalForAccept}
                  customerCellphone={order?.customer?.cellphone}
                  loading={props.order?.loading}
                  action={actionOrder}
                  orderId={order?.id}
                  notShowCustomerPhone
                  actions={actions}
                  orderTitle={orderTitle}
                  appTitle={appTitle}
                  isLoadingOrder={props.order?.loading}
                />
              </OModal>
            )}
          </View>
        )}

      {(!!props.order?.error || props.order?.error?.length > 0) && (
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
      {alertState?.open && (
        <Alert
          open={alertState.open}
          onAccept={handleArrowBack}
          onClose={handleArrowBack}
          content={alertState.content}
          title={t('WARNING', 'Warning')}
        />
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
