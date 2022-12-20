import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { useTheme } from 'styled-components/native';
import { useLanguage } from 'ordering-components/native';

import {AcceptOrRejectOrder as AcceptOrRejectOrderStyle } from './styles';

import { OButton, OModal } from '../shared';
import { OrderItem } from './OrderItem'
import { OrdersGroupedItem } from './OrdersGroupedItem'
import { AcceptOrRejectOrder } from '../AcceptOrRejectOrder';
import { ReviewCustomer } from '../ReviewCustomer';
import { GoogleMap } from '../GoogleMap';

export const PreviousOrders = (props: any) => {
  const {
    orders,
    ordersGrouped,
    onNavigationRedirect,
    getOrderStatus,
    handleClickOrder,
    isLogisticOrder,
    handleClickLogisticOrder,
    slaSettingTime,
    currentTabSelected,
    currentOrdenSelected,
    handleChangeOrderStatus,
    handleSendCustomerReview
  } = props;

  let hash: any = {};
  const [, t] = useLanguage();
  const theme = useTheme();

  const [, setCurrentTime] = useState()
  const [openModal, setOpenModal] = useState(false)
  const [openReviewModal, setOpenReviewModal] = useState({ order: null, ids: [], customerId: null })
  const [openMapViewModal, setOpenMapViewModal] = useState<any>({ open: false, customerLocation: null, locations: [] })
  const [orderUpdateStatus, setOrderUpdateStatus] = useState<any>({ action: '', ids: [], body: {}, order: {} })

  const pastOrderStatuses = [1, 2, 5, 6, 10, 11, 12, 16, 17]
  const viewMapStatus = [9, 18, 19, 23]

  const handlePressOrder = (order: any) => {
    if (order?.locked && isLogisticOrder) return
    handleClickOrder && handleClickOrder(order)
    if (props.handleClickEvent) {
      props.handleClickEvent({ ...order, isLogistic: isLogisticOrder })
    } else {
      onNavigationRedirect &&
        onNavigationRedirect('OrderDetails', { order: { ...order, isLogistic: isLogisticOrder }, handleClickLogisticOrder });
    }
  };

  const OrdersList = (props: any) => {
    const { order, _order, hideBtns } = props
    return (
      <View
        style={{
          backgroundColor: currentOrdenSelected === order?.id ? theme.colors.gray100 : order?.locked && isLogisticOrder ? '#ccc' : '#fff',
          marginBottom: isLogisticOrder ? 10 : 0
        }}
      >
        <OrderItem
          order={order}
          _order={_order}
          isLogisticOrder={isLogisticOrder}
          handlePressOrder={handlePressOrder}
          currentTabSelected={currentTabSelected}
          getOrderStatus={getOrderStatus}
        />
        {isLogisticOrder && !hideBtns && (
          <AcceptOrRejectOrderStyle>
            {!!order?.order_group_id && !!order?.order_group ? (
              <OButton
                text={t('VIEW_ORDER', 'View order')}
                onClick={() => handlePressOrder({ ...order, logistic_order_id: _order?.id })}
                bgColor={theme.colors.blueLight}
                borderColor={theme.colors.blueLight}
                imgRightSrc={null}
                style={{ borderRadius: 7, height: 40 }}
                parentStyle={{ width: '100%' }}
                textStyle={{ color: theme.colors.primary }}
              />
            ) : (
              <>
                <OButton
                  text={t('REJECT', 'Reject')}
                  onClick={() => handleClickLogisticOrder(2, _order?.id)}
                  bgColor={theme.colors.danger}
                  borderColor={theme.colors.danger}
                  imgRightSrc={null}
                  style={{ borderRadius: 7, height: 40 }}
                  parentStyle={{ width: '45%' }}
                  textStyle={{ color: theme.colors.dangerText }}
                />
                <OButton
                  text={t('ACCEPT', 'Accept')}
                  onClick={() => handleClickLogisticOrder(1, _order?.id)}
                  bgColor={theme.colors.successOrder}
                  borderColor={theme.colors.successOrder}
                  imgRightSrc={null}
                  style={{ borderRadius: 7, height: 40 }}
                  parentStyle={{ width: '45%' }}
                  textStyle={{ color: theme.colors.successText }}
                />
              </>
            )}
          </AcceptOrRejectOrderStyle>
        )}
      </View>
    )
  }

  const ordersGroupAction = (param1 = '', param2 = '', { order, action, body, ids }: any = {}) => {
    setOrderUpdateStatus({ ...orderUpdateStatus, action, ids, body, order })
    if (!param1) setOpenModal(true)
    if (param1) {
      setOpenModal(false)
      handleChangeOrderStatus &&
      handleChangeOrderStatus(param1, orderUpdateStatus.ids, param2)
    }
  }

  const handleOpenMapView = ({ orders }: any) => {
    const locations: any = []

    orders.map((_order: any) => {
      if (_order?.driver?.location) {
        locations.push({
          ..._order?.driver?.location,
          title: _order?.driver?.name ?? t('DRIVER', 'Driver'),
          icon:
            _order?.driver?.photo ||
            'https://res.cloudinary.com/demo/image/fetch/c_thumb,g_face,r_max/https://www.freeiconspng.com/thumbs/driver-icon/driver-icon-14.png',
          level: 4,
        })
      }
      if (_order?.business?.location) {
        locations.push({
          ..._order?.business?.location,
          title: _order?.business?.name,
          address: {
            addressName: _order?.business?.address,
            zipcode: _order?.business?.zipcode
          },
          icon:
            _order?.business?.logo ||
            'https://res.cloudinary.com/demo/image/fetch/c_thumb,g_face,r_max/https://res.cloudinary.com/ordering2/image/upload/v1654619525/hzegwosnplvrbtjkpfi6.png',
          level: 2,
        })
      }
      if (_order?.customer?.location) {
        locations.push({
          ..._order?.customer?.location,
          title: _order?.customer?.name ??  t('CUSTOMER', 'Customer'),
          address: {
            addressName: _order?.customer?.address,
            zipcode: _order?.customer?.zipcode
          },
          icon:
            _order?.customer?.photo ||
            'https://res.cloudinary.com/demo/image/upload/c_thumb,g_face,r_max/d_avatar.png/non_existing_id.png',
          level: 3,
        })
      }
    })

    setOpenMapViewModal({
      ...openMapViewModal,
      open: true,
      locations,
      customerLocation: orders[0]?.customer?.location
    })
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const date: any = Date.now()
      setCurrentTime(date)
    }, slaSettingTime ?? 6000)

    return () => clearInterval(interval)
  }, [])


  return (
    <>
      {ordersGrouped && Object.keys(ordersGrouped)?.length > 0 && (
        <View style={{ marginBottom: 10 }}>
          {Object.keys(ordersGrouped).map(k => (
            <OrdersGroupedItem
              key={k}
              groupId={k}
              orders={ordersGrouped[k]}
            >
              {ordersGrouped[k]?.length > 0 &&
                ordersGrouped[k]
                  ?.filter((order: any) => hash[order?.id] ? false : (hash[order?.id] = true))
                  ?.map((_order: any) => {
                    const order = _order?.isLogistic && !_order?.order_group && isLogisticOrder ? _order?.order : _order
                    return (
                      <OrdersList key={order.id} order={order} _order={_order} hideBtns />
                    )
                  }
                )
              }
              {ordersGrouped[k][0]?.status === 0 && (
                <AcceptOrRejectOrderStyle>
                  <OButton
                    text={t('REJECT_ALL', 'Reject all')}
                    bgColor={theme.colors.danger100}
                    borderColor={theme.colors.danger100}
                    imgRightSrc={null}
                    style={{ borderRadius: 7, height: 40 }}
                    parentStyle={{ width: '45%' }}
                    textStyle={{ color: theme.colors.danger500, fontSize: 12 }}
                    onClick={() => ordersGroupAction('', '', {
                      action: 'reject',
                      order: ordersGrouped[k][0],
                      ids: ordersGrouped[k].map((o: any) => o.id)
                    })}
                  />
                  <OButton
                    text={t('ACCEPT_ALL', 'Accept all')}
                    bgColor={theme.colors.success100}
                    borderColor={theme.colors.success100}
                    imgRightSrc={null}
                    style={{ borderRadius: 7, height: 40 }}
                    parentStyle={{ width: '45%' }}
                    textStyle={{ color: theme.colors.success500, fontSize: 12 }}
                    onClick={() => ordersGroupAction('', '', {
                      action: 'accept',
                      order: ordersGrouped[k][0],
                      ids: ordersGrouped[k].map((o: any) => o.id)
                    })}
                  />
                </AcceptOrRejectOrderStyle>
              )}
              <View>
                {ordersGrouped[k][0]?.status === 7 && (
                  <OButton
                    text={t('READY_FOR_PICKUP', 'Ready for pickup')}
                    bgColor={theme.colors.primaryLight}
                    borderColor={theme.colors.primaryLight}
                    imgRightSrc={null}
                    style={{ borderRadius: 7, height: 40 }}
                    parentStyle={{ width: '100%' }}
                    textStyle={{ color: theme.colors.primary, fontSize: 12 }}
                    onClick={() => handleChangeOrderStatus(
                      4,
                      ordersGrouped[k].map((o: any) => o.id),
                    )}
                  />
                )}
              </View>
              <View>
                {viewMapStatus.includes(ordersGrouped[k][0]?.status) && (
                  <OButton
                    text={t('TRACK_REAL_TIME_POSITION', 'Track real time position')}
                    bgColor={theme.colors.primaryLight}
                    borderColor={theme.colors.primaryLight}
                    imgRightSrc={null}
                    style={{ borderRadius: 7, height: 40 }}
                    parentStyle={{ width: '100%' }}
                    textStyle={{ color: theme.colors.primary, fontSize: 12 }}
                    onClick={() => handleOpenMapView({ orders: ordersGrouped[k] })}
                  />
                )}
              </View>
              {ordersGrouped[k][0]?.status === 4 &&
                ![1].includes(ordersGrouped[k][0]?.delivery_type) &&
              (
                <AcceptOrRejectOrderStyle>
                  <OButton
                    text={t('ORDER_NOT_PICKEDUP_BY_CUSTOMER', 'Order not picked up by customer')}
                    bgColor={theme.colors.danger100}
                    borderColor={theme.colors.danger100}
                    imgRightSrc={null}
                    style={{ borderRadius: 7, height: 40, paddingLeft: 10, paddingRight: 10 }}
                    parentStyle={{ width: '45%' }}
                    textStyle={{ color: theme.colors.danger500, fontSize: 12, textAlign: 'center' }}
                    onClick={() => handleChangeOrderStatus(
                      17,
                      ordersGrouped[k].map((o: any) => o.id),
                    )}
                  />
                  <OButton
                    text={t('PICKUP_COMPLETED_BY_CUSTOMER', 'Pickup completed by customer')}
                    bgColor={theme.colors.success100}
                    borderColor={theme.colors.success100}
                    imgRightSrc={null}
                    style={{ borderRadius: 7, height: 40, paddingLeft: 10, paddingRight: 10 }}
                    parentStyle={{ width: '45%' }}
                    textStyle={{ color: theme.colors.success500, fontSize: 12, textAlign: 'center' }}
                    onClick={() => handleChangeOrderStatus(
                      15,
                      ordersGrouped[k].map((o: any) => o.id),
                    )}
                  />
                </AcceptOrRejectOrderStyle>
              )}
              {!ordersGrouped[k][0]?.user_review &&
                pastOrderStatuses.includes(ordersGrouped[k][0]?.status) &&
              (
                <OButton
                  text={t('REVIEW_CUSTOMER', 'Review customer')}
                  bgColor={theme.colors.primary}
                  borderColor={theme.colors.primary}
                  imgRightSrc={null}
                  style={{ borderRadius: 8, height: 40 }}
                  parentStyle={{ width: '100%' }}
                  textStyle={{ color: theme.colors.white }}
                  onClick={() => setOpenReviewModal({
                    order: ordersGrouped[k][0],
                    customerId: ordersGrouped[k][0]?.customer_id,
                    ids: ordersGrouped[k].map((o: any) => o.id)
                  })}
                />
              )}
            </OrdersGroupedItem>
          ))}
        </View>
      )}
      {orders?.length > 0 &&
        orders
          ?.filter((order: any) => hash[order?.id] ? false : (hash[order?.id] = true))
          ?.map((_order: any) => {
            const order = _order?.isLogistic && !_order?.order_group && isLogisticOrder ? _order?.order : _order
            return (
              <OrdersList key={order.id} order={order} _order={_order} />
            )
          }
        )
      }

      <OModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        entireModal
        customClose
      >
        <AcceptOrRejectOrder
          notShowCustomerPhone={false}
          appTitle={props.appTitle}
          customerCellphone={orderUpdateStatus.order?.customer?.cellphone}
          action={orderUpdateStatus.action}
          orderId={orderUpdateStatus.ids?.[0]}
          actions={props.actions}
          orderTitle={props.orderTitle}
          handleUpdateOrder={ordersGroupAction}
          closeModal={() => setOpenModal(false)}
        />
      </OModal>
      <OModal
        open={!!openReviewModal?.order}
        onClose={() => setOpenReviewModal({ order: null, ids: [], customerId: null })}
        entireModal
        customClose
      >
        <ReviewCustomer
          order={openReviewModal?.order}
          closeModal={() => setOpenReviewModal({ order: null, ids: [], customerId: null })}
          onClose={() => setOpenReviewModal({ order: null, ids: [], customerId: null })}
          handleCustomCustomerReview={(body: any) => handleSendCustomerReview({
            onClose: setOpenReviewModal({ order: null, ids: [], customerId: null }),
            customerId: openReviewModal?.customerId,
            orderIds: openReviewModal?.ids,
            body
          })}
        />
      </OModal>
      <OModal
        open={openMapViewModal.open}
        onClose={() => setOpenMapViewModal({ ...openMapViewModal, open: false })}
        entireModal
        customClose
      >
        <GoogleMap
          readOnly
          navigation={props.navigation}
          location={openMapViewModal.customerLocation}
          locations={openMapViewModal.locations}
          handleOpenMapView={() => setOpenMapViewModal({
            ...openMapViewModal,
            open: !openMapViewModal
          })}
        />
      </OModal>
    </>
  );
};

PreviousOrders.defaultProps = {
  orders: []
}
