import React, { useEffect, useState } from 'react'
import { Messages as MessagesController, useSession, useUtils, useLanguage, ToastType, useToast } from 'ordering-components/native'
import { launchImageLibrary } from 'react-native-image-picker'
import { GiftedChat, Actions, InputToolbar, Composer, Send, Bubble, MessageImage } from 'react-native-gifted-chat'
import { USER_TYPE } from '../../config/constants'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useTheme } from 'styled-components/native'
import { OIcon, OIconButton, OText } from '../shared'
import { TouchableOpacity, ActivityIndicator, StyleSheet, View, Platform, Keyboard, I18nManager } from 'react-native'
import { Header, TitleHeader, Wrapper } from './styles'
import { MessagesParams } from '../../types'

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

  const theme = useTheme();

  const [{ user }] = useSession()
  const [{ parseDate }] = useUtils()
  const [, t] = useLanguage()
  const [, { showToast }] = useToast();

  const [formattedMessages, setFormattedMessages] = useState<Array<any>>([])
  const [isKeyboardShow, setIsKeyboardShow] = useState(false)

  const previousStatus = [1, 2, 5, 6, 10, 11, 12, 16, 17]
  const chatDisabled = previousStatus.includes(order?.status)

  const onChangeMessage = (val: string) => {
    setMessage && setMessage(val)
  }

  const removeImage = () => {
    setImage && setImage(null)
  }

  const handleImagePicker = () => {
    launchImageLibrary({ mediaType: 'photo', maxHeight: 300, maxWidth: 300, includeBase64: true }, (response: any) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
        showToast(ToastType.Error, response.errorMessage);
      } else {
        if (response?.assets) {
          if (response?.assets?.length > 0) {
            const image = response?.assets[0]
            const url = `data:${image.type};base64,${image.base64}`
            setImage && setImage(url);
          } else {
            showToast(ToastType.Error, t('IMAGE_NOT_FOUND', 'Image not found'));
          }
        } else {
          if (response.uri) {
            const url = `data:${response.type};base64,${response.base64}`
            setImage && setImage(url);
          } else {
            showToast(ToastType.Error, t('IMAGE_NOT_FOUND', 'Image not found'));
          }
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
      case 13:
        return 'PREORDER'
      case 14:
        return 'ORDER_NOT_READY'
      case 15:
        return 'ORDER_PICKEDUP_COMPLETED_BY_CUSTOMER'
      case 16:
        return 'ORDER_STATUS_CANCELLED_BY_CUSTOMER'
      case 17:
        return 'ORDER_NOT_PICKEDUP_BY_CUSTOMER'
      case 18:
        return 'ORDER_DRIVER_ALMOST_ARRIVED_BUSINESS'
      case 19:
        return 'ORDER_DRIVER_ALMOST_ARRIVED_CUSTOMER'
      case 20:
        return 'ORDER_CUSTOMER_ALMOST_ARRIVED_BUSINESS'
      case 21:
        return 'ORDER_CUSTOMER_ARRIVED_BUSINESS'
      default:
        return status
    }
  }

  const onSubmit = (values: any) => {
    handleSend && handleSend()
    setImage && setImage(null)
    setMessage && setMessage('')
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

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardShow(true)
    })
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardShow(false)
    })
    return () => {
      keyboardDidShowListener.remove()
      keyboardDidHideListener.remove()
    }
  }, [])

  const RenderActions = (props: any) => {
    return (
      <Actions
        {...props}
        options={{
          'Send Image': () => handleImagePicker(),
        }}
        containerStyle={styles.containerActions}
        optionTintColor='#222845'
        icon={() => (
          <>
            <OIconButton
              borderColor={theme.colors.white}
              style={{ width: 32, height: 32, borderRadius: 10 }}
              icon={image ? { uri: image } : theme.images.dummies.image}
              iconStyle={{ borderRadius: image ? 10 : 0, width: image ? 32 : 28, height: image ? 32 : 24 }}
              onClick={handleImagePicker}
              iconCover
            />
            {image && (
              <TouchableOpacity
                style={{ position: 'absolute', top: -5, right: -5, borderColor: theme.colors.backgroundDark, backgroundColor: theme.colors.white, borderRadius: 25 }}
                onPress={() => removeImage()}
              >
                <MaterialCommunityIcon name='close-circle-outline' color={theme.colors.backgroundDark} size={24} />
              </TouchableOpacity>
            )}
          </>
        )}
      />
    )
  }

  const renderInputToolbar = (props: any) => (
    <InputToolbar
      {...props}
      containerStyle={{
        padding: Platform.OS === 'ios' && isKeyboardShow ? 0 : 10
      }}
      primaryStyle={{ alignItems: 'center', justifyContent: 'flex-start' }}
    />
  )

  const renderComposer = (props: any) => (
    chatDisabled ? (
      <View
        style={{
          width: '100%',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <MaterialCommunityIcon
          name='close-octagon-outline'
          size={24}
        />
        <OText size={14}>{t('NOT_SEND_MESSAGES', 'You can\'t send messages because the order has ended')}</OText>
      </View>
    ) : (
      <View style={{ flexDirection: 'row', width: '80%' }}>
        <Composer
          {...props}
          textInputStyle={{
            backgroundColor: theme.colors.white,
            borderRadius: 25,
            paddingHorizontal: 10,
            borderColor: '#DBDCDB',
            borderWidth: 1,
            color: '#010300',
            textAlign: I18nManager.isRTL ? 'right' : 'left'
          }}
          textInputProps={{
            value: message,
            onSubmitEditing: onSubmit,
            returnKeyType: message ? 'send' : 'done',
            blurOnSubmit: true,
            multiline: false,
            numberOfLines: 1,
            autoCorrect: false,
            autoCompleteType: 'off',
            enablesReturnKeyAutomatically: false
          }}
          placeholder={t('WRITE_MESSAGE', 'Write message...')}
        />
        <RenderActions {...props} />
      </View>
    )
  )

  const renderSend = (props: any) => (
    <Send
      {...props}
      disabled={(sendMessage?.loading || (message === '' && !image) || messages?.loading)}
      alwaysShowSend
      containerStyle={styles.containerSend}
    >
      <OIconButton
        onClick={onSubmit}
        style={{
          height: 32,
          borderRadius: 25,
          opacity: (sendMessage?.loading || (message === '' && !image) || messages?.loading) ? 0.4 : 1,
          borderColor: theme.colors.primary,
        }}
        iconStyle={{ marginTop: 3, marginRight: 2 }}
        icon={!sendMessage?.loading ? theme.images.general.send : undefined}
        RenderIcon={sendMessage?.loading ? () => <ActivityIndicator size='small' color={theme.colors.primary} /> : undefined}
        disabled={(sendMessage?.loading || (message === '' && !image) || messages?.loading)}
        disabledColor={theme.colors.white}
      />
    </Send>
  )

  const renderBubble = (props: any) => (
    <Bubble
      {...props}
      textStyle={{
        left: {},
        right: { color: theme.colors.white }
      }}
      containerStyle={{
        left: { marginVertical: 5, borderBottomRightRadius: 12 },
        right: { marginVertical: 5, borderBottomRightRadius: 12 }
      }}
      wrapperStyle={{
        left: { backgroundColor: '#f7f7f7', padding: 5, borderBottomLeftRadius: 0 },
        right: { backgroundColor: theme.colors.primary, padding: 5, borderBottomRightRadius: 0 }
      }}
    />
  )

  const renderMessageImage = (props: any) => (
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
          renderBubble={renderBubble}
          renderMessageImage={renderMessageImage}
          scrollToBottomComponent={() => renderScrollToBottomComponent()}
          messagesContainerStyle={{
            paddingBottom: 20
          }}
          isLoadingEarlier={messages.loading}
          renderLoading={() => <ActivityIndicator size="small" color="#000" />}
          keyboardShouldPersistTaps='handled'
        />
      </Wrapper>
    </>
  )
}

const styles = StyleSheet.create({
  containerActions: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    marginBottom: 0,
  },
  containerSend: {
    width: 64,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4
  }
})

export const Messages = (props: MessagesParams) => {
  const MessagesProps = {
    ...props,
    UIComponent: MessagesUI
  }
  return <MessagesController {...MessagesProps} />
}
