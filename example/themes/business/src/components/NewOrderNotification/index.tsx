import React, { useState, useEffect, useCallback } from 'react'
import { useEvent, useLanguage, useUtils, useSession, useApi } from 'ordering-components/native'
import { View, Modal, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import { OText, OIcon } from '../shared'
import { useTheme } from 'styled-components/native'
import Icon from 'react-native-vector-icons/Feather'
import { NotificationContainer } from './styles'
import Sound from 'react-native-sound'
import moment from 'moment'
import { useLocation } from '../../hooks/useLocation'
import { useFocusEffect } from '@react-navigation/core'
import { NewOrderNotification as NewOrderNotificationController } from './naked'
Sound.setCategory('Playback')

const windowWidth = Dimensions.get('screen').width

const NewOrderNotificationUI = (props: any) => {
  const [events] = useEvent()
  const theme = useTheme()
  const [, t] = useLanguage()
  const [{ user, token }] = useSession()
  const [ordering] = useApi()
  const [{ getTimeAgo }] = useUtils()
  const { getCurrentLocation } = useLocation();
  const [modalOpen, setModalOpen] = useState(false)
  const [newOrderId, setNewOrderId] = useState(null)
  const [messageOrderId, setMessageOrderId] = useState(null)
  const [soundTimeout, setSoundTimeout] = useState<any>(null)
  const [isFocused, setIsFocused] = useState(false)

  const notificationSound = new Sound(theme.sounds.notification, error => {
    if (error) {
      console.log('failed to load the sound', error);
      return
    }
    console.log('loaded successfully');
  });

  const handlePlayNotificationSound = () => {
    let times = 0
    const _timeout = setInterval(function () {
      notificationSound.play(success => {
        if (success) {
          console.log('successfully finished playing');
          times = times + 1
        } else {
          console.log('playback failed due to audio decoding errors');
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
    setModalOpen(false)
    setNewOrderId(null)
    setMessageOrderId(null)
  }

  const handleNotification = (order: any) => {
    setModalOpen(true)
    clearInterval(soundTimeout)
    handlePlayNotificationSound()
    setNewOrderId(order.id)
  }

  const handleMessageNotification = (message: any) => {
    const { order_id: orderId } = message;
    if (!modalOpen) setModalOpen(true)
    clearInterval(soundTimeout)
    handlePlayNotificationSound()
    setMessageOrderId(orderId)
  }

  useEffect(() => {
    events.on('order_added_noification', handleNotification)
    events.on('message_added_noification', handleMessageNotification)
    return () => {
      events.off('order_added_noification', handleNotification)
      events.off('message_added_noification', handleMessageNotification)
    }
  }, [])

  const handleUpdateOrder = useCallback(async (order: any) => {
    if (order?.driver) {
      const location = await getCurrentLocation()
      await fetch(`${ordering.root}/users/${user.id}/locations`, {
        method: 'POST',
        body: JSON.stringify({
          location: JSON.stringify({location: `{lat: ${location.latitude}, lng: ${location.longitude}}`})
        }),
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
      })
      const assignedTimeDiff = moment.utc(order?.driver?.last_order_assigned_at).local().fromNow()
      if (assignedTimeDiff === 'a few seconds ago') {
        clearInterval(soundTimeout)
        handlePlayNotificationSound()
        setNewOrderId(order.id)
        if(isFocused){
          setModalOpen(true)
        }
      }
    }
  }, [newOrderId, notificationSound, soundTimeout])

  useEffect(() => {
    if (user?.level !== 4) return
    events.on('order_updated', handleUpdateOrder)
    return () => {
      events.off('order_updated', handleUpdateOrder)
    }
  }, [handleUpdateOrder, user])

  useEffect(() => {
    notificationSound.setVolume(1);
    return () => {
      notificationSound.release();
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      setIsFocused(true)
      return () => {
        setIsFocused(false)
      }
    }, [])
  )

  return (
    <>
      <Modal
        animationType='slide'
        transparent={true}
        visible={modalOpen}
      >
        <NotificationContainer>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.wrapperIcon}
              onPress={() => handleCloseModal()}
            >
              <Icon
                name="x"
                size={30}
              />
            </TouchableOpacity>
            <OText
              size={18}
              color={theme.colors.textGray}
              weight={600}
            >
              {t('NEW_ORDRES_RECEIVED', 'New orders have been received!')}
            </OText>
            <OIcon
              src={theme.images.general.newOrder}
              width={250}
              height={200}
            />
            {newOrderId && (
              <OText
                color={theme.colors.textGray}
                mBottom={15}
              >
                {t('ORDER_N_ORDERED', 'Order #_order_id_ has been ordered.').replace('_order_id_', newOrderId)}
              </OText>
            )}

            {messageOrderId && (
              <OText
                color={theme.colors.textGray}
                mBottom={15}
              >
                {t('ORDER_N_UNREAD_MESSAGES', 'Order #_order_id_ has unread messages.').replace('_order_id_', messageOrderId)}
              </OText>
            )}
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
