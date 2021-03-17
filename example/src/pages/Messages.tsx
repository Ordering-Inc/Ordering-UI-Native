import React from 'react'
import { Messages as MessagesController } from '../components/Messages'

const Messages = ({ navigation, route }: any) => {

  const { 
    orderId, 
    messages, 
    setMessages,
    driverPhoto,
    businessPhoto,
    customerName,
    businessName,
    orderCreated_at,
    app_id
  } = route.params

  const messagesProps = {
    navigation,
    route,
    orderId,
    messages,
    setMessages,
    driverPhoto,
    businessPhoto,
    customerName,
    businessName,
    orderCreated_at,
    app_id
  }

  return <MessagesController {...messagesProps} />
}

export default Messages
