import React, { useState, useEffect, useCallback } from 'react'
import { useEvent, useLanguage, useUtils, useSession } from 'ordering-components/native'
import { View, Modal, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import { OText, OIcon } from '../shared'
import { useTheme } from 'styled-components/native'
import Icon from 'react-native-vector-icons/Feather'
import { NotificationContainer } from './styles'
import Sound from 'react-native-sound'
import moment from 'moment'

Sound.setCategory('Playback')

const windowWidth = Dimensions.get('screen').width

export const NewOrderNotification = (props: any) => {
  const [events] = useEvent()
  const theme = useTheme()
  const [, t] = useLanguage()
  const [{ user }] = useSession()
  const [{ getTimeAgo }] = useUtils()

  const [modalOpen, setModalOpen] = useState(false)
  const [newOrderId, setNewOrderId] = useState(null)
  const [soundTimeout, setSoundTimeout] = useState<any>(null)

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
      if(times === 3){
        console.log('cleared')
        clearInterval(soundTimeout)
      }
    }, 2500)
  }

  const handleCloseModal = () => {
    clearInterval(soundTimeout)
    setModalOpen(false)
  }

  const handleNotification = useCallback((order: any) => {
    clearInterval(soundTimeout)
    handlePlayNotificationSound()
    setNewOrderId(order.id)
    setModalOpen(true)
  }, [newOrderId, notificationSound, soundTimeout])

  useEffect(() => {
    events.on('order_added', handleNotification)
    return () => {
      events.off('order_added', handleNotification)
    }
  }, [handleNotification])

  
  const handleUpdateOrder = useCallback((order: any) => {
    if (order?.driver) {
      const assignedTimeDiff = moment.utc(order?.driver?.last_order_assigned_at).local().fromNow()
      if (assignedTimeDiff === 'a few seconds ago') {
        clearInterval(soundTimeout)
        handlePlayNotificationSound()
        setNewOrderId(order.id)
        setModalOpen(true)
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
            <OText
              color={theme.colors.textGray}
              mBottom={15}
            >
              {t('ORDER_N_ORDERED', 'Order #_order_id_ has been ordered.').replace('_order_id_', newOrderId)}
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
