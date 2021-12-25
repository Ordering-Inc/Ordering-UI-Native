//React & React Native
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Platform } from 'react-native';

// Thirds
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder';

//OrderingComponent
import {
  useLanguage,
  OrderDetails as OrderDetailsConTableoller,
  useToast,
  useSession,
  ToastType,
} from 'ordering-components/native';

//Components
import Alert from '../../providers/AlertProvider';
import { AcceptOrRejectOrder } from '../AcceptOrRejectOrder';
import { Chat } from '../Chat';
import { FloatingButton } from '../FloatingButton';
import { DriverMap } from '../DriverMap';
import { OButton } from '../shared';
import { OModal } from '../shared';
import { OrderDetailsParams } from '../../types';
import { USER_TYPE } from '../../config/constants';
import { useTheme } from 'styled-components/native';
import { NotFoundSource } from '../NotFoundSource';
import { getOrderStatus } from '../../utils';
import { OrderHeaderComponent } from './OrderHeaderComponent';
import { OrderContentComponent } from './OrderContentComponent';

//Styles
import { OrderDetailsContainer, Pickup } from './styles';

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
    titleNotReady,
    appTitle,
    handleClickLogisticOrder
  } = props;

  const [, { showToast }] = useToast();
  const { order } = props.order
  const theme = useTheme();
  const [, t] = useLanguage();
  const [session] = useSession();
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

  const showFloatButtonsPickUp: any = {
    8: true,
    3: true,
    18: true,
  };

  const showFloatButtonsAcceptOrReject: any = {
    0: true,
    4: true,
    7: true,
    14: true
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
  }, [order?.loading]);

  const handleCloseModal = () => {
    setOpenModalForBusiness(false);
  };

  const handleArrowBack: any = () => {
    navigation?.canGoBack() && navigation.goBack();
  };

  useEffect(() => {
    if (order?.driver === null && session?.user?.level === 4) {
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

  useEffect(() => {
    if (messagesReadList?.length) {
      openModalForBusiness
        ? setUnreadAlert({ ...unreadAlert, business: false })
        : setUnreadAlert({ ...unreadAlert, driver: false });
    }
  }, [messagesReadList]);

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

  const OrderDetailsInformation = (_order: any) => {
    const { order } = _order
    return (
      <>
        <OrderDetailsContainer
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <>
            <OrderContentComponent order={order} />
            {(order?.status === 8 || order?.status === 18) && order?.delivery_type === 1 && (
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
            {(order?.status === 3) && order?.delivery_type === 1 && (
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
              loading={order?.loading}
              action={actionOrder}
              orderId={order?.id}
              notShowCustomerPhone
              actions={actions}
              titleAccept={titleAccept}
              titleReject={titleReject}
              titleNotReady={titleNotReady}
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

          <View
            style={{
              height:
                order?.status === 8 && order?.delivery_type === 1 ? 50 : 35,
            }}
          />
        </OrderDetailsContainer>

        {showFloatButtonsPickUp[order?.status] && (
          <FloatingButton
            disabled={order?.loading}
            btnText={t('PICKUP_FAILED', 'Pickup failed')}
            isSecondaryBtn={false}
            secondButtonClick={() =>
              handleChangeOrderStatus && handleChangeOrderStatus(9)
            }
            firstButtonClick={() =>
              handleViewActionOrder && handleViewActionOrder('failed')
            }
            secondBtnText={t('PICKUP_COMPLETE', 'Pickup complete')}
            secondButton={true}
            firstColorCustom={theme.colors.red}
            secondColorCustom={theme.colors.green}
            widthButton={'45%'}
          />
        )}
        {(order?.status === 9 || order?.status === 19) && (
          <>
            <FloatingButton
              disabled={order?.loading}
              btnText={t('DELIVERY_FAILED', 'Delivery Failed')}
              isSecondaryBtn={false}
              secondButtonClick={() =>
                handleChangeOrderStatus && handleChangeOrderStatus(11)
              }
              firstButtonClick={() =>
                handleViewActionOrder && handleViewActionOrder('failed')
              }
              secondBtnText={t('DELIVERY_COMPLETE', 'Delivery complete')}
              secondButton={true}
              firstColorCustom={theme.colors.red}
              secondColorCustom={theme.colors.green}
              widthButton={'45%'}
            />
          </>
        )}
        {showFloatButtonsAcceptOrReject[order?.status] && (
          <FloatingButton
            btnText={t('REJECT', 'Reject')}
            isSecondaryBtn={false}
            secondButtonClick={() => order?.isLogistic ? handleClickLogisticOrder?.(1, order?.logistic_order_id) : handleViewActionOrder('accept')}
            firstButtonClick={() => order?.isLogistic ? handleClickLogisticOrder?.(2, order?.logistic_order_id) : handleViewActionOrder('reject')}
            secondBtnText={t('ACCEPT', 'Accept')}
            secondButton={true}
            firstColorCustom={theme.colors.red}
            secondColorCustom={theme.colors.green}
            widthButton={'45%'}
          />
        )}

        <Alert
          open={alertState.open}
          onAccept={handleArrowBack}
          onClose={handleArrowBack}
          content={alertState.content}
          title={t('WARNING', 'Warning')}
        />
      </>
    )
  }

  return (
    <>
      {(!order || Object.keys(order).length === 0) &&
        (order?.error?.length < 1 || !order?.error) && (
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

      {(!!order?.error || order?.error) && (
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
      <View style={{ flex: 1 }}>
        <OrderHeaderComponent
          order={order}
          handleOpenMapView={handleOpenMapView}
          handleOpenMessagesForBusiness={handleOpenMessagesForBusiness}
          getOrderStatus={getOrderStatus}
          handleArrowBack={handleArrowBack}
        />
        {order && Object.keys(order).length > 0 && (order?.error?.length < 1 || !order?.error) && (
          <>
            {order?.order_group && order?.order_group_id ? order?.order_group?.orders.map((order: any) => (
              <OrderDetailsInformation order={order} />
            )) : (
              <OrderDetailsInformation order={order} />
            )}
          </>
        )}
      </View>
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
