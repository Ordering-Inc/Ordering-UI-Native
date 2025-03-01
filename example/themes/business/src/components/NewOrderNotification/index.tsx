import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import { useTheme } from 'styled-components/native'
import moment from 'moment'
import Icon from 'react-native-vector-icons/Feather'
import SoundPlayer from 'react-native-sound-player'

import {
  NewOrderNotification as NewOrderNotificationController,
  useApi,
  useEvent,
  useLanguage,
  useSession,
  useToast,
  ToastType
} from 'ordering-components/native'

import { OIcon, OText } from '../shared'
import { NotificationContainer } from './styles'
import { useLocation } from '../../hooks/useLocation'

const DELAY_SOUND = 2500 // 2 sec
const windowWidth = Dimensions.get('screen').width

const SoundPlayerComponent = (props: any) => {
  const { evtList, currentEvent, handleCloseEvents } = props

  const theme = useTheme()
  const URL_SOUND = 'https://d33aymufw4jvwf.cloudfront.net/notification.mp3'

  useEffect(() => {
    if (!currentEvent?.orderId) return
    const playSound = () => {
      try {
        SoundPlayer.playUrl(URL_SOUND)
      } catch (e) {
        console.log('Sound Error - ', err.message)
      }
    }

    const interval = setInterval(() => {
      playSound()
    }, DELAY_SOUND)

    return () => clearInterval(interval)
  }, [currentEvent?.orderId])

  return (
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
            {evtList(currentEvent)[currentEvent?.evt]?.message}
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
            {evtList(currentEvent)[currentEvent?.evt]?.message2}
          </OText>
        </View>
      </NotificationContainer>
    </Modal>
  )
}

const NewOrderNotificationUI = (props: any) => {
  const { isBusinessApp, evtList, orderStatus } = props
  const [, t] = useLanguage()
  const [events] = useEvent()
  const [{ user, token }] = useSession()
  const [ordering] = useApi()
  const [, { showToast }] = useToast()
  const { getCurrentLocation } = useLocation()
  const [currentEvent, setCurrentEvent] = useState<any>(null)

  const handleEventNotification = async (evtType: number, value: any, orderStatus?: any) => {
    if (value?.driver) {
      try {
        const location: any = await getCurrentLocation()
        if (!location?.latitude || !location?.longitude) {
          showToast(t('ERROR_UPDATING_COORDS', 'Error updating coords'), ToastType.Error)
          return
        }
        await fetch(`${ordering.root}/users/${user.id}/locations`, {
          method: 'POST',
          body: JSON.stringify({
            location: JSON.stringify({
              location: `{
                lat: ${location.latitude},
                lng: ${location.longitude},
                mock: ${location.mocked}
              }`
            })
          }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        })
      } catch { }
      const duration = moment.duration(moment().diff(moment.utc(value?.last_driver_assigned_at)))
      const assignedSecondsDiff = duration.asSeconds()
      if (assignedSecondsDiff < 5 && !isBusinessApp && !value?.logistic_status) {
        setCurrentEvent(() => ({ evt: 2, orderId: value?.id ?? value?.order_id }))
      }
    }
    if ((!orderStatus.includes(value.status) && evtType !== 1 && isBusinessApp && orderStatus?.length > 0) || value?.author_id === user.id) return
    setCurrentEvent(() => ({
      evt: evtType,
      orderId: value?.driver
        ? value?.order_id ?? value?.id
        : evtList(currentEvent)[evtType].event === 'messages'
          ? value?.order?.id
          : value?.order_id ?? value?.id
    }))
  }

  useEffect(() => {
    const handleEventTypeOne = (o: any) => {
      handleEventNotification(1, o, orderStatus)
    }
    const handleEventTypeTwo = (o: any) => {
      handleEventNotification(2, o, orderStatus)
    }
    const handleEventTypeThree = (o: any) => {
      handleEventNotification(3, o, orderStatus)
    }

    events.on('message_added_notification', handleEventTypeOne)
    events.on('order_added_notification', handleEventTypeTwo)
    events.on('order_updated_notification', handleEventTypeThree)
    events.on('request_register_notification', handleEventTypeTwo)
    events.on('request_update_notification', handleEventTypeThree)

    return () => {
      events.off('message_added_notification', handleEventTypeOne)
      events.off('order_added_notification', handleEventTypeTwo)
      events.off('order_updated_notification', handleEventTypeThree)
      events.off('request_register_notification', handleEventTypeTwo)
      events.off('request_update_notification', handleEventTypeThree)
    }
  }, [orderStatus, events])

  useEffect(() => {
    return () => setCurrentEvent(null)
  }, [])

  return (
    <>
      {!!currentEvent && (
        <SoundPlayerComponent
          evtList={evtList}
          currentEvent={currentEvent}
          handleCloseEvents={() => setCurrentEvent(null)}
        />
      )}
    </>
  )
};

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
  const [, t] = useLanguage()

  const newOrderNotificationProps = {
    ...props,
    UIComponent: NewOrderNotificationUI,
    evtList: (currentEvent: any) => ({
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
    })
  };

  return <NewOrderNotificationController {...newOrderNotificationProps} />;
};
