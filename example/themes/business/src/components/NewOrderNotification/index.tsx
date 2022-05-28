import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { View, Modal, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import Sound from 'react-native-sound'
import Icon from 'react-native-vector-icons/Feather'
import { useTheme } from 'styled-components/native'
import { useEvent, useLanguage, useSession, useApi, NewOrderNotification as NewOrderNotificationController } from 'ordering-components/native'

import { OText, OIcon } from '../shared'
import { NotificationContainer } from './styles'
import { useLocation } from '../../hooks/useLocation'

Sound.setCategory('Playback')

const windowWidth = Dimensions.get('screen').width

const NewOrderNotificationUI = () => {
  const [events] = useEvent()
  const theme = useTheme()
  const [, t] = useLanguage()
  const [{ user, token }] = useSession()
  const [ordering] = useApi()
  const { getCurrentLocation } = useLocation();
  const [soundTimeout, setSoundTimeout] = useState<any>(null)
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

  const notificationSound = new Sound(theme.sounds.notification, (e) => { console.log(e) });

  const handlePlayNotificationSound = () => {
    let times = 0
    const _timeout = setInterval(function () {
      notificationSound.play(success => {
        if (success) {
          times = times + 1
        }
      })
      setSoundTimeout(_timeout)
      if (times === 3) {
        clearInterval(_timeout)
        clearInterval(soundTimeout)
      }
    }, 2500)
  }

  const handleCloseModal = () => {
    clearInterval(soundTimeout)
    setCurrentEvent({ evt: null })
  }

  const handleEventNotification = async (evtType: number, value: any) => {
    if (value?.driver) {
      const location = await getCurrentLocation()
      await fetch(`${ordering.root}/users/${user.id}/locations`, {
        method: 'POST',
        body: JSON.stringify({
          location: JSON.stringify({location: `{lat: ${location.latitude}, lng: ${location.longitude}}`})
        }),
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
      })
      const assignedTimeDiff = moment.utc(value?.driver?.last_order_assigned_at).local().fromNow()
      if (assignedTimeDiff === 'a few seconds ago') {
        handlePlayNotificationSound()
        clearInterval(soundTimeout)
        setCurrentEvent({ evt: 2, orderId: value?.id })
      }
      return
    }
    handlePlayNotificationSound()
    clearInterval(soundTimeout)
    setCurrentEvent({
      evt: evtType,
      orderId: evtList[evtType].event === 'messages' ? value?.order_id : value?.id
    })
  }

  useEffect(() => {
    events.on('message_added_notification', (o: any) => handleEventNotification(1, o))
    events.on('order_added_notification', (o: any) => handleEventNotification(2, o))
    events.on('order_updated_notification', (o: any) => handleEventNotification(3, o))
    return () => {
      events.off('message_added_notification', (o: any) => handleEventNotification(1, o))
      events.off('order_added_notification', (o: any) => handleEventNotification(2, o))
      events.off('order_updated_notification', (o: any) => handleEventNotification(3, o))
    }
  }, [])

  useEffect(() => {
    notificationSound.setVolume(1);
    return () => {
      notificationSound.release();
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
              onPress={() => handleCloseModal()}
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
