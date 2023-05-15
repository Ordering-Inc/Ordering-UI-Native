import moment from 'moment'
import { NewOrderNotification as NewOrderNotificationController, useApi, useEvent, useLanguage, useSession } from 'ordering-components/native'
import React, { useEffect, useState } from 'react'
import { Dimensions, Modal, StyleSheet, TouchableOpacity, View } from 'react-native'
import Sound from 'react-native-sound'
import Icon from 'react-native-vector-icons/Feather'
import { useTheme } from 'styled-components/native'

import { useLocation } from '../../hooks/useLocation'
import { OIcon, OText } from '../shared'
import { NotificationContainer } from './styles'

Sound.setCategory('Playback', true)
Sound.setMode('Default')

const windowWidth = Dimensions.get('screen').width

const SOUND_LOOP = 3

const NewOrderNotificationUI = (props: any) => {
  const { isBusinessApp } = props
  const [events] = useEvent()
  const theme = useTheme()
  const [, t] = useLanguage()
  const [{ user, token }] = useSession()
  const [ordering] = useApi()
  const { getCurrentLocation } = useLocation();
  const [currentEvent, setCurrentEvent] = useState<any>(null)

  const evtList: any = {
    1: {
      event: 'messages',
      message: t('NEW_MESSAGES_RECEIVED', 'New messages have been received!'),
      message2: t('ORDER_N_UNREAD_MESSAGES', 'Order #_order_id_ has unread messages.').replace('_order_id_', currentEvent?.orderId),
    },
    2: {
      event: 'order_added',
      message: t('NEW_ORDERS_RECEIVED', 'New orders have been received!'),
      message2: t('ORDER_N_ORDERED', 'Order #_order_id_ has been ordered.').replace('_order_id_', currentEvent?.orderId),
    },
    3: {
      event: 'order_updated',
      message: t('NEW_ORDERS_UPDATED', 'New orders have been updated!'),
      message2: t('ORDER_N_UPDATED', 'Order #_order_id_ has been updated.').replace('_order_id_', currentEvent?.orderId),
    },
  }

  const soundSrc = 'https://d33aymufw4jvwf.cloudfront.net/notification.mp3' ?? theme.sounds.notification

  const notificationSound = new Sound(soundSrc, '', () => { });

  let _timeout: any = null
  let times = 0

  const handleCloseEvents = () => {
    setCurrentEvent(null)
    clearInterval(_timeout)
  }

  const handlePlayNotificationSound = (eventObj: any = null) => {
    setCurrentEvent(eventObj)
    if (times > 0) {
      if (times === 3) {
        times = 0
        return
      }
      return
    }
    _timeout = setInterval(() => {
      if (times < SOUND_LOOP) {
        notificationSound.play()
        times++
      } else {
        clearInterval(_timeout)
        return
      }
    }, 2500)
  }

  const handleEventNotification = async (evtType: number, value: any) => {
    if (value?.driver) {
      try {
        const location = await getCurrentLocation()
        await fetch(`${ordering.root}/users/${user.id}/locations`, {
          method: 'POST',
          body: JSON.stringify({
            location: JSON.stringify({ location: `{lat: ${location.latitude}, lng: ${location.longitude}}` })
          }),
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
        })
      } catch { }
      const duration = moment.duration(moment().diff(moment.utc(value?.last_driver_assigned_at)))
      const assignedSecondsDiff = duration.asSeconds()
      if (assignedSecondsDiff < 5 && !isBusinessApp && !value?.logistic_status) {
        handlePlayNotificationSound({ evt: 2, orderId: value?.id })
      }
    }
    if (evtType === 3 || value?.author_id === user.id) return
    setTimeout(() => handlePlayNotificationSound({
      evt: evtType,
      orderId: value?.driver ? value?.order_id : evtList[evtType].event === 'messages' ? value?.order?.id : value?.order_id ?? value?.id
    }), 1000)
  }

  useEffect(() => {
    events.on('message_added_notification', (o: any) => handleEventNotification(1, o))
    events.on('order_added_notification', (o: any) => handleEventNotification(2, o))
    events.on('order_updated_notification', (o: any) => handleEventNotification(3, o))
    events.on('request_register_notification', (o: any) => handleEventNotification(2, o))
    events.on('request_update_notification', (o: any) => handleEventNotification(3, o))

    return () => {
      events.off('message_added_notification', (o: any) => handleEventNotification(1, o))
      events.off('order_added_notification', (o: any) => handleEventNotification(2, o))
      events.off('order_updated_notification', (o: any) => handleEventNotification(3, o))
      events.off('request_register_notification', (o: any) => handleEventNotification(2, o))
      events.off('request_update_notification', (o: any) => handleEventNotification(3, o))
    }
  }, [])

  useEffect(() => {
    return () => {
      handleCloseEvents()
      notificationSound.stop()
      notificationSound.release()
    }
  }, [])

  return (
    <>
      <Modal
        animationType='slide'
        transparent={true}
        visible={!!currentEvent?.orderId}
      >
        <NotificationContainer>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.wrapperIcon}
              onPress={() => handleCloseEvents()}
            >
              <Icon name="x" size={30} />
            </TouchableOpacity>
            <OText
              size={18}
              color={theme.colors.textGray}
              weight={600}
            >
              {evtList[currentEvent?.evt]?.message}
            </OText>
            <OIcon
              src={theme.images.general.newOrder}
              width={250}
              height={200}
            />
            <OText
              color={theme.colors.textGray}
              mBottom={15}
            >
              {evtList[currentEvent?.evt]?.message2}
            </OText>
          </View>
        </NotificationContainer>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  modalView: {
    backgroundColor: '#FFF',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingTop: 65,
    paddingBottom: 20,
    maxWidth: windowWidth - 60,
  },
  wrapperIcon: {
    position: 'absolute',
    right: 20,
    top: 20
  }
})

export const NewOrderNotification = (props: any) => {
  const newOrderNotificationProps = {
    ...props,
    UIComponent: NewOrderNotificationUI
  };

  return <NewOrderNotificationController {...newOrderNotificationProps} />;
};
