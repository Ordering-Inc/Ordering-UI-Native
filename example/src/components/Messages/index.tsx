import React, { useState, useRef, useEffect } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Messages as MessagesController, useLanguage, useUtils, useSession } from 'ordering-components/native'
import BottomWrapper from '../BottomWrapper'
import { OIcon, OIconButton, OInput, OModal, OText } from '../shared'
import OChatBubble from '../shared/OChatBubble'
import { DIRECTION, USER_TYPE } from '../../config/constants'
import { colors } from '../../theme'
import { launchImageLibrary } from 'react-native-image-picker'
import { ToastType, useToast } from '../../providers/ToastProvider'

import {
  ActionWrapper,
  Inner,
  InputWrapper,
  Wrapper,
  Header,
  TitleHeader,
  UploadImage
} from './styles'

import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import Spinner from 'react-native-loading-spinner-overlay'

import { MessagesParams } from '../../types'

const paperIcon = require('../../assets/images/paper-plane.png')
const ImageDummy = require('../../assets/images/image.png')


const MessagesUI = (props: MessagesParams) => {

  const {
    type,
    order,
    messages,
    image,
    message,
    messagesToShow,
    sendMessage,
    setMessage,
    handleSend,
    setImage,
    readMessages,
  } = props

  const [, t] = useLanguage()

  const [{ parseDate, getTimeAgo }] = useUtils()
  const [{ user }] = useSession()
  const { showToast } = useToast();
  const chatRef = useRef<any>(null)

  const [alertState, setAlertState] = useState<{ open: boolean, content: Array<string> | string }>({ open: false, content: [] })
  const [modalImage, setModalImage] = useState('')

  const onChangeMessage = (val: string) => {
    setMessage && setMessage(val)
  }

  const removeImage = () => {
    setImage && setImage(null)
  }

  const clearInputs = () => {
    setMessage && setMessage('')
    removeImage()
  }

  const handleSetModalImage = (src: string) => {
    setModalImage(src)
  }

  const handleImagePicker = () => {
    launchImageLibrary({ mediaType: 'photo', maxHeight: 300, maxWidth: 300, includeBase64: true }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
        showToast(ToastType.Error, response.errorMessage);
      } else {
        if (response.uri) {
          const url = `data:${response.type};base64,${response.base64}`
          setImage && setImage(url);
        } else {
          showToast(ToastType.Error, t('IMAGE_NOT_FOUND', 'Image not found'));
        }
      }
    });
  };

  const getStatus = (status: number) => {

    switch (status) {
      case 0:
        return 'ORDER_STATUS_PENDING'
      case 1:
        return 'ORDERS_COMPLETED'
      case 2:
        return 'ORDER_REJECTED'
      case 3:
        return 'ORDER_STATUS_IN_BUSINESS'
      case 4:
        return 'ORDER_READY'
      case 5:
        return 'ORDER_REJECTED_RESTAURANT'
      case 6:
        return 'ORDER_STATUS_CANCELLEDBYDRIVER'
      case 7:
        return 'ORDER_STATUS_ACCEPTEDBYRESTAURANT'
      case 8:
        return 'ORDER_CONFIRMED_ACCEPTED_BY_DRIVER'
      case 9:
        return 'ORDER_PICKUP_COMPLETED_BY_DRIVER'
      case 10:
        return 'ORDER_PICKUP_FAILED_BY_DRIVER'
      case 11:
        return 'ORDER_DELIVERY_COMPLETED_BY_DRIVER'
      case 12:
        return 'ORDER_DELIVERY_FAILED_BY_DRIVER'
      default:
        return status
    }
  }

  const onSubmit = (values: any) => {
    handleSend && handleSend()
    clearInputs()
  }

  const messageConsole = (message: any) => {
    return message.change?.attribute !== 'driver_id'
      ?
      `${t('ORDER', 'Order')} ${message.change.attribute} ${t('CHANGED_FROM', 'Changed from')} ${message.change.old !== null && t(getStatus(parseInt(message.change.old, 10)))} ${t('TO', 'to')} ${t(getStatus(parseInt(message.change.new, 10)))}`
      : message.change.new
        ?
        `${message.driver?.name} ${message.driver?.lastname !== null ? message.driver.lastname : ''} ${t('WAS_ASSIGNED_AS_DRIVER', 'Was assigned as driver')} ${message.comment ? message.comment.length : ''}`
        :
        `${t('DRIVER_UNASSIGNED', 'Driver unassigned')}`
  }

  useEffect(() => {
    if (!sendMessage.loading) {
      chatRef.current.scrollToEnd()
    }
    readMessages && readMessages()
  }, [messages.messages.length, sendMessage.loading])

  useEffect(() => {
    if (!sendMessage.loading && sendMessage?.error) {
      setAlertState({
        open: true,
        content: sendMessage.error || [t('ERROR', 'Error')]
      })
    }
    if (sendMessage.loading) {
      clearInputs()
    }
  }, [sendMessage])

  useEffect(() => {
    if (alertState.open) {
      alertState.content && showToast(
        ToastType.Error,
        alertState.content
      )
    }
  }, [alertState.content])

  const MapMessages = ({ messages }: any) => {
    return (
      <>
        {messages?.messages.map((message: any, i: number) => (
          <React.Fragment key={message.id + i}>
            {message.type === 1 && (
              <OChatBubble
                side={DIRECTION.LEFT}
                contents={messageConsole(message)}
                datetime={getTimeAgo(message.created_at)}
              />
            )}
            {(messagesToShow?.messages?.length || (message?.can_see?.includes('2')) || (message?.can_see?.includes('4') && type === USER_TYPE.DRIVER)) && (
              <>
                {message.type === 2 && user?.id === message.author_id && (
                  <OChatBubble
                    side={DIRECTION.RIGHT}
                    contents={message.comment}
                    datetime={getTimeAgo(message.created_at)}
                  />
                )}
                {message.type === 3 && user?.id === message.author_id && (
                  <OChatBubble
                    side={DIRECTION.RIGHT}
                    contents={message?.comment}
                    datetime={getTimeAgo(message.created_at)}
                    image={message?.source}
                    onClick={() => handleSetModalImage(message.source)}
                  />
                )}
                {message.type === 2 && user?.id !== message.author_id && (
                  <OChatBubble
                    side={DIRECTION.LEFT}
                    contents={message?.comment}
                    datetime={getTimeAgo(message.created_at)}
                  />
                )}
                {message.type === 3 && user?.id !== message.author_id && (
                  <OChatBubble
                    side={DIRECTION.LEFT}
                    contents={message?.comment}
                    datetime={getTimeAgo(message.created_at)}
                    image={message?.source}
                    onClick={() => handleSetModalImage(message.source)}
                  />
                )}
              </>
            )}
          </React.Fragment>
        ))}
      </>
    )
  }


  return (
    <Wrapper>
      <Spinner visible={messages.loading || sendMessage.loading} />
      <Header>
        <OIcon
          url={type === USER_TYPE.DRIVER ? order?.driver?.photo : order?.business?.logo}
          width={60}
          height={60}
          style={{ borderRadius: 10, marginRight: 10 }}
        />
        <TitleHeader>
          <OText size={18}>{type === USER_TYPE.DRIVER ? order?.driver?.name : order?.business?.name}</OText>
          <OText>{t('ONLINE', 'Online')}</OText>
        </TitleHeader>
      </Header>
      <Inner
        ref={chatRef}
      >
        <OChatBubble
          contents={
            `${t('ORDER_PLACED_FOR', 'Order placed for')} ${parseDate(order?.created_at)} ${t('VIA', 'Via')} ${order.app_id ? t(order?.app_id.toUpperCase(), order?.app_id) : t('OTHER', 'Other')}`
          }
          datetime={getTimeAgo(order?.created_at)}
        />
        <MapMessages messages={messages} />
      </Inner>
      <BottomWrapper>
        <ActionWrapper>
          <InputWrapper>
            <OInput
              placeholder={t('WRITE_A_MESSAGE', 'Write a message...')}
              style={{ flex: 1, paddingHorizontal: 0 }}
              onChange={onChangeMessage}
              value={message}
            />
          </InputWrapper>
          <UploadImage>
            <OIconButton
              borderColor={colors.lightGray}
              style={{ width: 50, height: 50, borderRadius: 25, marginHorizontal: 10 }}
              icon={image ? { uri: image } : ImageDummy}
              iconStyle={{ borderRadius: image ? 25 : 0, width: image ? 50 : 20, height: image ? 50 : 20 }}
              onClick={handleImagePicker}
              iconCover
              bgColor={colors.inputDisabled}
            />
            {image && (
              <TouchableOpacity style={{ position: 'absolute', top: -5, left: 40, borderColor: colors.backgroundDark, backgroundColor: colors.white, borderRadius: 25 }} onPress={() => removeImage()}>
                <MaterialCommunityIcon name='close-circle-outline' color={colors.backgroundDark} size={24} />
              </TouchableOpacity>
            )}
          </UploadImage>
          <OIconButton
            onClick={onSubmit}
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              opacity: (sendMessage?.loading || (message === '' && !image) || messages?.loading) ? 0.4 : 1,
              borderColor: colors.primary
            }}
            iconStyle={{ marginTop: 3, marginRight: 2 }}
            icon={paperIcon}
            disabled={(sendMessage?.loading || (message === '' && !image) || messages?.loading)}
            disabledColor={colors.white}
          />
        </ActionWrapper>
      </BottomWrapper>
      <OModal
        open={modalImage ? true : false}
        onClose={() => setModalImage('')}
        EntireModal
      >
        <View style={{ height: '100%', alignSelf: 'center', justifyContent: 'center' }}>
          <OIcon
            url={modalImage}
            style={{ width: 300, height: 300 }}
          />
        </View>
      </OModal>
    </Wrapper>
  )
}

export const Messages = (props: MessagesParams) => {
  const messagesProps = {
    ...props,
    UIComponent: MessagesUI
  }
  return <MessagesController {...messagesProps} />
}
