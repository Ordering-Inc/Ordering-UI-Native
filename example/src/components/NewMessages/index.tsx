import React, { useEffect, useState } from 'react'
import { Messages as MessagesController, useSession, useUtils, useLanguage } from 'ordering-components/native'
import { launchImageLibrary } from 'react-native-image-picker'
import { GiftedChat, Actions, ActionsProps, InputToolbar, Composer, Send, Bubble, MessageImage } from 'react-native-gifted-chat'
import { USER_TYPE } from '../../config/constants'
import { ToastType, useToast } from '../../providers/ToastProvider'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { colors } from '../../theme'
import { OIcon, OIconButton, OText } from '../shared'
import { TouchableOpacity } from 'react-native'
import { Header, TitleHeader, Wrapper } from './styles'

const ImageDummy = require('../../assets/images/image.png')
const paperIcon = require('../../assets/images/paper-plane.png')

const MessagesUI = (props) => {

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

  const [{ user }] = useSession()
  const [{ parseDate }] = useUtils()
  const [, t] = useLanguage()
  const { showToast } = useToast();

  const [formattedMessages, setFormattedMessages] = useState<Array<any>>([])

  const onChangeMessage = (val: string) => {
    setMessage && setMessage(val)
  }

  const removeImage = () => {
    setImage && setImage(null)
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
    setImage(null)
    setMessage('')
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
    let newMessages: Array<any> = []
    const console = `${t('ORDER_PLACED_FOR', 'Order placed for')} ${parseDate(order?.created_at)} ${t('VIA', 'Via')} ${order?.app_id ? t(order?.app_id.toUpperCase(), order?.app_id) : t('OTHER', 'Other')}`
    const firstMessage = {
      _id: 0,
      text: console,
      createdAt: order?.created_at,
      system: true
    }
    messages.messages.map((message: any) => {
      let newMessage
      if (message.type !== 0 && (messagesToShow?.messages?.length || (message?.can_see?.includes('2')) || (message?.can_see?.includes('4') && type === USER_TYPE.DRIVER))) {
        newMessage = {
          _id: message.id,
          text: message.type === 1 ? messageConsole(message) : message.comment,
          createdAt: message.type !== 0 && message.created_at,
          image: message.source,
          system: message.type === 1,
          user: {
            _id: message.author.id,
            name: message.author.name,
            avatar: message.author.id !== user.id && type === USER_TYPE.DRIVER ? order?.driver?.photo : order?.business?.logo
          }
        }
      }
      if (message.type === 0) {
        newMessage = firstMessage
      }
      newMessages = [...newMessages, newMessage]
    })
    setFormattedMessages([...newMessages.reverse()])
  }, [messages.messages.length])

  const renderActions = (props: Readonly<ActionsProps>) => {
    return (
      <Actions
        {...props}
        options={{
          'Send Image': () => handleImagePicker(),
        }}
        containerStyle={{
          width: 44,
          height: 44,
          alignItems: 'center',
          justifyContent: 'center',
          marginHorizontal: 4,
          marginBottom: 0
        }}
        optionTintColor='#222845'
        icon={() => (
          <>
            <OIconButton
              borderColor={image ? colors.white : colors.lightGray}
              style={{ width: 32, height: 32, borderRadius: 10 }}
              icon={image ? { uri: image } : ImageDummy}
              iconStyle={{ borderRadius: image ? 10 : 0, width: image ? 32 : 24, height: image ? 32 : 24 }}
              onClick={handleImagePicker}
              iconCover
              bgColor={colors.inputDisabled}
            />
            {image && (
              <TouchableOpacity style={{ position: 'absolute', top: -5, right: -5, borderColor: colors.backgroundDark, backgroundColor: colors.white, borderRadius: 25 }} onPress={() => removeImage()}>
                <MaterialCommunityIcon name='close-circle-outline' color={colors.backgroundDark} size={24} />
              </TouchableOpacity>
            )}
          </>
        )}
      />
    )
  }

  const renderInputToolbar = (props) => (
    <InputToolbar
      {...props}
      containerStyle={{
        border: `1px solid ${colors.lightGray}`,
        padding: 10,
      }}
      primaryStyle={{ alignItems: 'center', justifyContent: 'center' }}
    />
  )

  const renderComposer = (props) => (
    <Composer
      {...props}
      textInputStyle={{
        backgroundColor: colors.lightGray,
        borderRadius: 25,
        paddingHorizontal: 10,
      }}
      textInputProps={{
        value: message
      }}
    />
  )

  const renderSend = (props) => (
    <Send
      {...props}
      disabled={(sendMessage?.loading || (message === '' && !image) || messages?.loading)}
      alwaysShowSend
      containerStyle={{
        width: 64,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 4
      }}
    >
      <OIconButton
        onClick={onSubmit}
        style={{
          width: 54,
          height: 32,
          borderRadius: 25,
          opacity: (sendMessage?.loading || (message === '' && !image) || messages?.loading) ? 0.4 : 1,
          borderColor: colors.primary
        }}
        iconStyle={{ marginTop: 3, marginRight: 2 }}
        icon={paperIcon}
        disabled={(sendMessage?.loading || (message === '' && !image) || messages?.loading)}
        disabledColor={colors.white}
      />
    </Send>
  )

  const renderBubble = (props) => (
    <Bubble
      {...props}
      textStyle={{
        left: {},
        right: { color: colors.white }
      }}
      containerStyle={{
        left: { marginVertical: 5 },
        right: { marginVertical: 5 }
      }}
      wrapperStyle={{
        left: { backgroundColor: '#f7f7f7', padding: 5 },
        right: { backgroundColor: colors.primary, padding: 5 }
      }}
    />
  )

  const renderMessageImage = (props) => (
    <MessageImage
      {...props}
    />
  )

  const renderScrollToBottomComponent = () => (
      <MaterialCommunityIcon name='chevron-double-down' size={32} />
  )

  return (
    <>
      <Wrapper>
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
        <GiftedChat
          messages={formattedMessages}
          user={{
            _id: user.id,
            name: user.name,
            avatar: user.photo
          }}
          onSend={onSubmit}
          onInputTextChanged={onChangeMessage}
          alignTop
          scrollToBottom
          renderAvatarOnTop
          renderUsernameOnMessage
          renderInputToolbar={renderInputToolbar}
          renderComposer={renderComposer}
          renderSend={renderSend}
          renderActions={renderActions}
          renderBubble={renderBubble}
          renderMessageImage={renderMessageImage}
          scrollToBottomComponent={() => renderScrollToBottomComponent()}
          messagesContainerStyle={{
            paddingBottom: 20
          }}
          showAvatarForEveryMessage
        />
      </Wrapper>
    </>
  )
}

export const Messages = (props) => {
  const MessagesProps = {
    ...props,
    UIComponent: MessagesUI
  }
  return <MessagesController {...MessagesProps} />
}
