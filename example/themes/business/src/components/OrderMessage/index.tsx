import React, { useState, useEffect } from 'react';
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder';
import { Chat } from '../Chat';
import { View } from 'react-native';
import {
  useLanguage,
  OrderDetails as OrderDetailsController,
} from 'ordering-components/native';
import { OrderMessageContainer } from './styles';

import { OModal } from '../shared';
import { OrderDetailsParams } from '../../types';
import { USER_TYPE } from '../../config/constants';
import { useTheme } from 'styled-components/native';

export const OrderMessageUI = (props: OrderDetailsParams) => {
  const { navigation, messages, setMessages, readMessages, messagesReadList } =
    props;

  const theme = useTheme();
  const [, t] = useLanguage();
  const [openModalForBusiness, setOpenModalForBusiness] = useState(true);
  const [unreadAlert, setUnreadAlert] = useState({
    business: false,
    driver: false,
  });
  const { order, loading } = props.order;

  const handleCloseModal = () => {
    setOpenModalForBusiness(false);
    navigation?.canGoBack() && navigation.goBack();
    return;
  };

  useEffect(() => {
    if (messagesReadList?.length) {
      openModalForBusiness
        ? setUnreadAlert({ ...unreadAlert, business: false })
        : setUnreadAlert({ ...unreadAlert, driver: false });
    }
  }, [messagesReadList]);

  return (
    <>
      {(!order || Object.keys(order).length === 0 || loading) && (
        <View
          style={{
            padding: 40,
            flex: 1,
            backgroundColor: theme.colors.backgroundLight,
            justifyContent: 'space-between',
          }}>
          <Placeholder>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <PlaceholderLine width={40} />
              <PlaceholderLine
                width={20}
                style={{
                  marginLeft: 20,
                  borderRadius: 50,
                  width: 40,
                  height: 40,
                }}
              />
              <PlaceholderLine
                width={20}
                style={{
                  marginLeft: 10,
                  borderRadius: 50,
                  width: 40,
                  height: 40,
                }}
              />
              <PlaceholderLine
                width={20}
                style={{
                  marginLeft: 10,
                  borderRadius: 50,
                  width: 40,
                  height: 40,
                }}
              />
            </View>
          </Placeholder>

          <Placeholder>
            <View style={{ flexDirection: 'column' }}>
              <PlaceholderLine width={60} />
              <PlaceholderLine width={40} />
              <PlaceholderLine width={20} />
              <PlaceholderLine width={20} />
            </View>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
              }}>
              <PlaceholderLine width={60} />
              <PlaceholderLine width={40} />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <PlaceholderLine
                width={20}
                style={{
                  marginLeft: 20,
                  borderRadius: 50,
                  width: 50,
                  height: 50,
                }}
              />
              <PlaceholderLine
                width={20}
                style={{
                  marginLeft: 20,
                  borderRadius: 50,
                  width: 50,
                  height: 50,
                }}
              />
            </View>
            <PlaceholderLine width={100} />
            <PlaceholderLine
              width={100}
              style={{ borderRadius: 50, width: '100%', height: 30 }}
            />
          </Placeholder>
        </View>
      )}

      {order && Object.keys(order).length > 0 && !loading && (
        <>
          <OrderMessageContainer keyboardShouldPersistTaps="handled">
            {/* <Spinner
              visible={!order || Object.keys(order).length === 0 || loading}
            /> */}

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
          </OrderMessageContainer>
        </>
      )}
    </>
  );
};

export const OrderMessage = (props: OrderDetailsParams) => {
  const orderDetailsProps = {
    ...props,
    driverAndBusinessId: true,
    UIComponent: OrderMessageUI,
  };
  return <OrderDetailsController {...orderDetailsProps} />;
};
