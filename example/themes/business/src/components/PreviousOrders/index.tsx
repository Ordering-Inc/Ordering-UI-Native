import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { useTheme } from 'styled-components/native';
import { useLanguage } from 'ordering-components/native';

import { AcceptOrRejectOrder as AcceptOrRejectOrderStyle } from './styles';

import { OButton, OModal } from '../shared';
import { OrdersGroupedItem } from './OrdersGroupedItem'
import { OrdersList } from './OrderList';
import { AcceptOrRejectOrder } from '../AcceptOrRejectOrder';
import { ReviewCustomer } from '../ReviewCustomer';
import { GoogleMap } from '../GoogleMap';

export const PreviousOrders = (props: any) => {
  const {
    orders,
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

  // const [, setCurrentTime] = useState()
  const [openModal, setOpenModal] = useState(false)
  const [openReviewModal, setOpenReviewModal] = useState({ order: null, ids: [], customerId: null })
  const [openMapViewModal, setOpenMapViewModal] = useState<any>({ open: false, customerLocation: null, locations: [] })
  const [orderUpdateStatus, setOrderUpdateStatus] = useState<any>({ action: '', ids: [], body: {}, order: {} })

  const pastOrderStatuses = [1, 2, 5, 6, 10, 11, 12, 16, 17]
  const viewMapStatus = [9, 18, 19, 23]
  const deliveryPickupBtn = props.appTitle?.text?.includes('Delivery') && [3, 8, 18]
  const deliveryStatusCompleteBtn = props.appTitle?.text?.includes('Delivery') && [9, 19, 23]

  const handlePressOrder = (order: any) => {
    if (order?.locked && isLogisticOrder) return
    handleClickOrder && handleClickOrder(order)
    if (props.handleClickEvent) {
      props.handleClickEvent({ ...order, isLogistic: isLogisticOrder })
    } else {
      if (isLogisticOrder) {
        onNavigationRedirect &&
          onNavigationRedirect('OrderDetailsLogistic', { order: { ...order, isLogistic: isLogisticOrder }, handleClickLogisticOrder });
      } else {
        onNavigationRedirect &&
          onNavigationRedirect('OrderDetails', { order });
      }
    }
  };

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
          title: _order?.customer?.name ?? t('CUSTOMER', 'Customer'),
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

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const date: any = Date.now()
  //     setCurrentTime(date)
  //   }, slaSettingTime ?? 6000)

  //   return () => clearInterval(interval)
  // }, [])


  return (
    <>
      {orders && orders?.length > 0 && orders.map((_order: any) => {
        const order = !Array.isArray(_order) && (_order?.isLogistic && !_order?.order_group && isLogisticOrder ? _order?.order : _order)
        const _ordersGrouped = Array.isArray(_order) && Object.fromEntries(_order)
        return (
          _ordersGrouped ? (
            <View key={_order[0]} style={{ marginBottom: 10 }}>
              {Object.keys(_ordersGrouped).map((k, idx) => (
                <OrdersGroupedItem
                  key={`${k}_${idx}`}
                  groupId={k}
                  orders={_ordersGrouped[k]}
                >
                  {_ordersGrouped[k]?.length > 0 &&
                    _ordersGrouped[k]
                      ?.filter((order: any) => hash[order?.id] ? false : (hash[order?.id] = true))
                      ?.map((_order: any) => {
                        const order_ = _order?.isLogistic && !_order?.order_group && isLogisticOrder ? _order?.order : _order
                        return (
                          <OrdersList
                            key={order_.id}
                            order={order_}
                            _order={_order}
                            hideBtns
                            currentOrdenSelected={currentOrdenSelected}
                            isLogisticOrder={isLogisticOrder}
                            handlePressOrder={handlePressOrder}
                            currentTabSelected={currentTabSelected}
                            getOrderStatus={getOrderStatus}
                            handleClickLogisticOrder={handleClickLogisticOrder}
                          />
                        )
                      }
                      )
                  }
                  {_ordersGrouped[k][0]?.status === 0 && (
                    <AcceptOrRejectOrderStyle>
                      <OButton
                        text={t('REJECT_ALL', 'Reject all')}
                        bgColor={theme.colors.danger100}
                        borderColor={theme.colors.danger100}
                        imgRightSrc={null}
                        style={{ borderRadius: 7, height: 40 }}
                        parentStyle={{ width: '45%' }}
                        textStyle={{ color: theme.colors.danger500, fontSize: 12 }}
                        onClick={() => onNavigationRedirect('AcceptOrRejectOrder', {
                          action: 'reject',
                          order: _ordersGrouped[k][0],
                          ids: _ordersGrouped[k].map((o: any) => o.id),
                          handleChangeOrderStatus
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
                        onClick={() => onNavigationRedirect('AcceptOrRejectOrder', {
                          action: 'accept',
                          order: _ordersGrouped[k][0],
                          ids: _ordersGrouped[k].map((o: any) => o.id),
                          handleChangeOrderStatus
                        })}
                      />
                    </AcceptOrRejectOrderStyle>
                  )}
                  {_ordersGrouped[k][0]?.status === 7 && (
                    <View>
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
                          _ordersGrouped[k].map((o: any) => o.id),
                        )}
                      />
                    </View>
                  )}
                  {(_ordersGrouped[k][0]?.status === 8 || _ordersGrouped[k][0]?.status === 18) &&
                    _ordersGrouped[k][0]?.delivery_type === 1 &&
                    (
                      <AcceptOrRejectOrderStyle>
                        <OButton
                          text={t('ARRIVED_TO_BUSINESS', 'Arrived to bussiness')}
                          bgColor={theme.colors.btnBGWhite}
                          borderColor={theme.colors.btnBGWhite}
                          imgRightSrc={null}
                          style={{ borderRadius: 7, height: 40 }}
                          parentStyle={{ width: '100%' }}
                          textStyle={{ color: theme.colors.primary, fontSize: 12 }}
                          onClick={() => handleChangeOrderStatus(
                            3,
                            _ordersGrouped[k].map((o: any) => o.id),
                          )}
                        />
                      </AcceptOrRejectOrderStyle>
                    )}
                  {_ordersGrouped[k][0]?.status === 3 && _ordersGrouped[k][0]?.delivery_type === 1 &&
                    (
                      <AcceptOrRejectOrderStyle>
                        <OButton
                          text={t('ORDER_NOT_READY', 'Order not ready')}
                          bgColor={theme.colors.red}
                          borderColor={theme.colors.red}
                          imgRightSrc={null}
                          style={{ borderRadius: 7, height: 40 }}
                          parentStyle={{ width: '100%' }}
                          textStyle={{ color: theme.colors.white, fontSize: 12 }}
                          onClick={() => onNavigationRedirect('AcceptOrRejectOrder', {
                            action: 'notReady',
                            order: _ordersGrouped[k][0],
                            ids: _ordersGrouped[k].map((o: any) => o.id),
                            handleChangeOrderStatus
                          })}
                        />
                      </AcceptOrRejectOrderStyle>
                    )}
                  {viewMapStatus.includes(_ordersGrouped[k][0]?.status) &&
                    props.appTitle?.text?.includes('Business') &&
                    (
                      <View>
                        <OButton
                          text={t('TRACK_REAL_TIME_POSITION', 'Track real time position')}
                          bgColor={theme.colors.primaryLight}
                          borderColor={theme.colors.primaryLight}
                          imgRightSrc={null}
                          style={{ borderRadius: 7, height: 40 }}
                          parentStyle={{ width: '100%' }}
                          textStyle={{ color: theme.colors.primary, fontSize: 12 }}
                          onClick={() => handleOpenMapView({ orders: _ordersGrouped[k] })}
                        />
                      </View>
                    )}
                  {_ordersGrouped[k][0]?.status === 4 &&
                    ![1].includes(_ordersGrouped[k][0]?.delivery_type) &&
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
                            _ordersGrouped[k].map((o: any) => o.id),
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
                            _ordersGrouped[k].map((o: any) => o.id),
                          )}
                        />
                      </AcceptOrRejectOrderStyle>
                    )}
                  {!_ordersGrouped[k][0]?.user_review &&
                    pastOrderStatuses.includes(_ordersGrouped[k][0]?.status) &&
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
                          order: _ordersGrouped[k][0],
                          customerId: _ordersGrouped[k][0]?.customer_id,
                          ids: _ordersGrouped[k].map((o: any) => o.id)
                        })}
                      />
                    )}
                  {!!deliveryPickupBtn && deliveryPickupBtn?.includes(_ordersGrouped[k][0]?.status) && (
                    <AcceptOrRejectOrderStyle>
                      <OButton
                        text={t('PICKUP_FAILED', 'Pickup failed')}
                        bgColor={theme.colors.danger100}
                        borderColor={theme.colors.danger100}
                        imgRightSrc={null}
                        style={{ borderRadius: 7, height: 40, paddingLeft: 10, paddingRight: 10 }}
                        parentStyle={{ width: '45%' }}
                        textStyle={{ color: theme.colors.danger500, fontSize: 12, textAlign: 'center' }}
                        onClick={() => onNavigationRedirect('AcceptOrRejectOrder', {
                          action: 'pickupFailed',
                          order: _ordersGrouped[k][0],
                          ids: _ordersGrouped[k].map((o: any) => o.id),
                          handleChangeOrderStatus
                        })}
                      />
                      <OButton
                        text={t('PICKUP_COMPLETE', 'Pickup complete')}
                        bgColor={theme.colors.success100}
                        borderColor={theme.colors.success100}
                        imgRightSrc={null}
                        style={{ borderRadius: 7, height: 40, paddingLeft: 10, paddingRight: 10 }}
                        parentStyle={{ width: '45%' }}
                        textStyle={{ color: theme.colors.success500, fontSize: 12, textAlign: 'center' }}
                        onClick={() => handleChangeOrderStatus(
                          9,
                          _ordersGrouped[k].map((o: any) => o.id),
                        )}
                      />
                    </AcceptOrRejectOrderStyle>
                  )}
                  {!!deliveryStatusCompleteBtn && deliveryStatusCompleteBtn.includes(_ordersGrouped[k][0]?.status) && (
                    <AcceptOrRejectOrderStyle>
                      <OButton
                        text={t('DELIVERY_FAILED', 'Delivery Failed')}
                        bgColor={theme.colors.danger100}
                        borderColor={theme.colors.danger100}
                        imgRightSrc={null}
                        style={{ borderRadius: 7, height: 40, paddingLeft: 10, paddingRight: 10 }}
                        parentStyle={{ width: '45%' }}
                        textStyle={{ color: theme.colors.danger500, fontSize: 12, textAlign: 'center' }}
                        onClick={() => onNavigationRedirect('AcceptOrRejectOrder', {
                          action: 'deliveryFailed',
                          order: _ordersGrouped[k][0],
                          ids: _ordersGrouped[k].map((o: any) => o.id),
                          handleChangeOrderStatus
                        })}
                      />
                      <OButton
                        text={t('DELIVERY_COMPLETE', 'Delivery complete')}
                        bgColor={theme.colors.success100}
                        borderColor={theme.colors.success100}
                        imgRightSrc={null}
                        style={{ borderRadius: 7, height: 40, paddingLeft: 10, paddingRight: 10 }}
                        parentStyle={{ width: '45%' }}
                        textStyle={{ color: theme.colors.success500, fontSize: 12, textAlign: 'center' }}
                        onClick={() => handleChangeOrderStatus(
                          11,
                          _ordersGrouped[k].map((o: any) => o.id),
                        )}
                      />
                    </AcceptOrRejectOrderStyle>
                  )}
                </OrdersGroupedItem>
              ))}
            </View>
          ) : (
            <View key={order.id}>
              <OrdersList
                order={order}
                _order={_order}
                currentOrdenSelected={currentOrdenSelected}
                isLogisticOrder={isLogisticOrder}
                handlePressOrder={handlePressOrder}
                currentTabSelected={currentTabSelected}
                getOrderStatus={getOrderStatus}
                handleClickLogisticOrder={handleClickLogisticOrder}
              />
            </View>
          )
        )
      })}

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
