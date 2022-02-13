import React, { useState, useEffect, useCallback } from 'react';
import PropTypes, { string, object } from 'prop-types';
// import { useSession } from '../../contexts/SessionContext';
// import { useApi } from '../../contexts/ApiContext';
// import { useWebsocket } from '../../contexts/WebsocketContext';
import { useSession, useApi, useWebsocket, useEvent } from 'ordering-components/native';

export const NewOrderNotification = (props) => {
  const {
    UIComponent
  } = props;

  const [{ token, user }] = useSession();
  const [ordering] = useApi();
  const socket = useWebsocket();
  const [events] = useEvent()

  useEffect(() => {
    if (!token) return;

    const messagesOrdersRoom =
      user?.level === 0 ? 'messages_orders' : `messages_orders_${user?.id}`;
    const ordersRoom = user?.level === 0 ? 'orders' : `orders_${user?.id}`;

    socket.on('disconnect', (reason) => {
      socket.join(
        user?.level === 0 ? 'messages_orders' : `messages_orders_${user?.id}`
      );
      socket.join(user?.level === 0 ? 'orders' : `orders_${user?.id}`);
    });

    socket.join(messagesOrdersRoom);
    socket.join(ordersRoom);

    return () => {
      socket.leave(messagesOrdersRoom);
      socket.leave(ordersRoom);
    };
  }, [socket, user]);

  const handleMessage = useCallback(async (message) => {
    events.emit('message_added_noification', message)
  }, []);

  const handleOrder = useCallback(async (order) => {
    events.emit('order_added_noification', order)
  }, []);

  useEffect(() => {
    socket.on('message', handleMessage);
    socket.on('orders_register', handleOrder);
    // socket.on('update_order', handleOrder);

    return () => {
      socket.off('message', handleMessage);
      socket.off('update_order', handleOrder);
      // socket.on('orders_register', handleOrder);
    };
  }, [socket, user]);

  return (
    <>
      {UIComponent && (
        <UIComponent
          {...props}
        />
      )}
    </>
  );
};

NewOrderNotification.propTypes = {
  /**
   * UI Component, this must be containt all graphic elements and use parent props
   */
  UIComponent: PropTypes.elementType,
};

NewOrderNotification.defaultProps = {
  beforeComponents: [],
  afterComponents: [],
  beforeElements: [],
  afterElements: []
};