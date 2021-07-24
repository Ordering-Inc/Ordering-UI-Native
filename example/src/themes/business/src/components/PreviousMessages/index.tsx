import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { useLanguage, useUtils } from 'ordering-components/native';
import { OIcon, OText, OModal } from '../shared';
import { Card, Logo, Information } from './styles';
import { useTheme } from 'styled-components/native';
import { PreviousOrdersParams } from '../../types';
import { USER_TYPE } from '../../config/constants';
import { Chat } from '../Chat';

export const PreviousMessages = (props: PreviousOrdersParams) => {
  const { orders, messages, setMessages, loadMessages } = props;

  const [, t] = useLanguage();
  const theme = useTheme();
  const [{ parseDate, optimizeImage }] = useUtils();

  const [messageModal, setMessageModal] = useState(1);
  const [openModal, setOpenModal] = useState(false);

  const handleCloseModal = () => {
    setMessages && setMessages({ ...messages, messages: [] });
    setOpenModal(!openModal);
  };

  const handlePressOrder = (uuid: number) => {
    if (messages) {
      loadMessages && loadMessages(uuid);
      setOpenModal(!openModal);
      setMessageModal(uuid);
    }
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

  const styles = StyleSheet.create({
    cardButton: {
      flex: 1,
      minHeight: 64,
      marginBottom: 0,
    },
    icon: {
      borderRadius: 7.6,
      width: 73,
      height: 73,
    },
    title: {
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: '600',
      fontSize: 18,
      lineHeight: 18,
      color: theme.colors.textGray,
    },
    date: {
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: 15,
      lineHeight: 18,
      color: theme.colors.unselectText,
    },
    orderType: {
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: 18,
      lineHeight: 18,
      color: theme.colors.orderTypeColor,
    },
  });

  return (
    <>
      <Spinner visible={messages?.loading} />

      <ScrollView style={{ height: '80%' }}>
        {orders.map((order: any) => (
          <TouchableOpacity
            key={order.id}
            onPress={() => handlePressOrder(order.id)}
            style={styles.cardButton}>
            <Card key={order.id}>
              {!!order.business?.logo && (
                <Logo>
                  <OIcon
                    url={optimizeImage(order.business?.logo, 'h_300,c_limit')}
                    style={styles.icon}
                  />
                </Logo>
              )}

              <Information>
                <OText numberOfLines={1} style={styles.title}>
                  {order.business?.name}
                </OText>

                <OText style={styles.date} numberOfLines={1}>
                  Order No.{order.id + ' · '}
                  {order?.delivery_datetime_utc
                    ? parseDate(order?.delivery_datetime_utc)
                    : parseDate(order?.delivery_datetime, { utc: false })}
                </OText>

                <OText style={styles.orderType} mRight={5} numberOfLines={1}>
                  {getOrderStatus(order.status)?.value}
                </OText>
              </Information>
            </Card>
          </TouchableOpacity>
        ))}

        {openModal && (
          <OModal
            open={openModal}
            title={`Order No. ${messageModal}`}
            order={messageModal}
            entireModal
            onClose={() => handleCloseModal()}>
            <Chat
              type={USER_TYPE.BUSINESS}
              orderId={messageModal}
              messages={messages}
              order={messageModal}
              setMessages={setMessages}
            />
          </OModal>
        )}
      </ScrollView>
    </>
  );
};
