import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { useTheme } from 'styled-components/native';
import { useLanguage } from 'ordering-components/native';

import {AcceptOrRejectOrder as AcceptOrRejectOrderStyle } from './styles';

import { OButton, OModal } from '../shared';
import { OrderItem } from './OrderItem'
import { OrdersGroupedItem } from './OrdersGroupedItem'
import { AcceptOrRejectOrder } from '../AcceptOrRejectOrder';

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
    handleChangeOrderStatus
  } = props;

  let hash: any = {};
  const [, t] = useLanguage();
  const theme = useTheme();

  const [, setCurrentTime] = useState()
  const [openModal, setOpenModal] = useState(false)
  const [orderUpdateStatus, setOrderUpdateStatus] = useState<any>({ action: '', ids: [], body: {}, order: {} })

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

  useEffect(() => {
    const interval = setInterval(() => {
      const date: any = Date.now()
      setCurrentTime(date)
    }, slaSettingTime ?? 6000)

    return () => clearInterval(interval)
  }, [])


  return (
    <>
      {Object.keys(ordersGrouped)?.length > 0 && (
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
                )}
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
    </>
  );
};

PreviousOrders.defaultProps = {
  orders: [],
  appTitle: { key: 'BUSINESS_APP', text: 'Business App' },
  actions: { accept: 'acceptByBusiness', reject: 'rejectByBusiness' },
  orderTitle: {
    accept: { key: 'PREPARATION_TIME', text: 'Preparation time', btnKey: 'ACCEPT', btnText: 'Accept' },
    reject: { key: 'REJECT_ORDER', text: 'Reject Order', btnKey: 'REJECT', btnText: 'Reject' }
  },
}
