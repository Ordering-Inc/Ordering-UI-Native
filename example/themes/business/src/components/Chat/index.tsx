import React, { useEffect, useState } from 'react';
import {
  ToastType,
  useToast,
  Messages as MessagesController,
  useSession,
  useUtils,
  useLanguage,
} from 'ordering-components/native';
import { launchImageLibrary } from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import {
  GiftedChat,
  Actions,
  ActionsProps,
  InputToolbar,
  Composer,
  Avatar,
  Send,
  Bubble,
  Message,
  MessageImage,
  InputToolbarProps,
  ComposerProps,
} from 'react-native-gifted-chat';
import { USER_TYPE } from '../../config/constants';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useTheme } from 'styled-components/native';
import { OIcon, OIconButton, OText } from '../shared';
import {
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  View,
  Platform,
  Keyboard,
  Dimensions,
  Pressable,
} from 'react-native';
import { Header, TitleHeader, Wrapper } from './styles';
import { MessagesParams } from '../../types';

const ChatUI = (props: MessagesParams) => {
  const {
    type,
    order,
    messages,
    image,
    message,
    messagesToShow,
    sendMessage,
    setMessage,
    canRead,
    setCanRead,
    handleSend,
    setImage,
    readMessages,
  } = props;

  const [{ user }] = useSession();
  const [{ parseDate }] = useUtils();
  const [, t] = useLanguage();
  const [, { showToast }] = useToast();
  const theme = useTheme();

  const { bottom } = useSafeAreaInsets();

  const [formattedMessages, setFormattedMessages] = useState<Array<any>>([]);
  const [isKeyboardShow, setIsKeyboardShow] = useState(false);
  const windowWidth =
    Dimensions.get('window').width < Dimensions.get('window').height
      ? parseInt(parseFloat(String(Dimensions.get('window').width)).toFixed(0))
      : parseInt(
          parseFloat(String(Dimensions.get('window').height)).toFixed(0),
        );

  const styles = StyleSheet.create({
    containerActions: {
      width: 44,
      height: 44,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 0,
    },
    containerSend: {
      width: 44,
      height: 44,
      borderRadius: 7.6,
      backgroundColor: theme.colors.transparent,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 0,
    },
    bubbleText: {
      color: theme.colors.black,
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: 12,
    },
    accessoryIcon: {
      height: 32,
      width: 32,
      borderRadius: 7.6,
    },
    shadow: {
      height: 33,
      width: 33,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 7.6,
      elevation: 1,
      shadowColor: theme.colors.shadow,
    },
    firstMessage: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.inputChat,
      padding: 10,
      borderRadius: 7.6,
    },
    firstMessageText: {
      color: theme.colors.textGray,
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: 14,
    },
  });
  const [file, setFile] = useState({
    uri: '',
    type: '',
    name: '',
    size: 0,
  });

  const onChangeMessage = (val: string) => {
    setMessage && setMessage(val);
  };

  const removeImage = () => {
    setImage && setImage(null);
    setFile && setFile({ ...file, uri: '', type: '', name: '', size: 0 });
  };

  const attachIcons: any = {
    jpeg: theme.images.general.imageFile,
    png: theme.images.general.imageFile,
    pdf: theme.images.general.pdfFile,
    doc: theme.images.general.docFile,
  };

  const handleDocumentPicker = async () => {
    try {
      const res: any = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      const { uri, type, name, size } = res;
      const [, typeFile] = type.split('/');
      setFile({ ...file, uri, type: typeFile, name, size });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  const handleImagePicker = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxHeight: 300,
        maxWidth: 300,
        includeBase64: true,
      },
      (response: any) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorMessage) {
          console.log('ImagePicker Error: ', response.errorMessage);
          showToast(ToastType.Error, response.errorMessage);
        } else {
          if (response.uri) {
            const url = `data:${response.type};base64,${response.base64}`;
            setImage && setImage(url);
          } else {
            showToast(ToastType.Error, t('IMAGE_NOT_FOUND', 'Image not found'));
          }
        }
      },
    );
  };

  const handleFilter = (value: any, level: number) => {
    if (user?.level === 0) {
      setCanRead({ ...canRead, ...value });
      return;
    }

    if (level === 3 && canRead?.driver) {
      setCanRead({ ...canRead, customer: !canRead?.customer });
    } else if (level === 4 && canRead?.customer) {
      setCanRead({ ...canRead, driver: !canRead?.driver });
    } else {
      setCanRead({
        ...canRead,
        customer: canRead?.driver,
        driver: canRead?.customer,
      });
    }
  };

  const getStatus = (status: number) => {
    switch (status) {
      case 0:
        return 'ORDER_STATUS_PENDING';
      case 1:
        return 'ORDERS_COMPLETED';
      case 2:
        return 'ORDER_REJECTED';
      case 3:
        return 'ORDER_STATUS_IN_BUSINESS';
      case 4:
        return 'ORDER_READY';
      case 5:
        return 'ORDER_REJECTED_RESTAURANT';
      case 6:
        return 'ORDER_STATUS_CANCELLEDBYDRIVER';
      case 7:
        return 'ORDER_STATUS_ACCEPTEDBYRESTAURANT';
      case 8:
        return 'ORDER_CONFIRMED_ACCEPTED_BY_DRIVER';
      case 9:
        return 'ORDER_PICKUP_COMPLETED_BY_DRIVER';
      case 10:
        return 'ORDER_PICKUP_FAILED_BY_DRIVER';
      case 11:
        return 'ORDER_DELIVERY_COMPLETED_BY_DRIVER';
      case 12:
        return 'ORDER_DELIVERY_FAILED_BY_DRIVER';
      case 13:
        return 'PREORDER';
      case 14:
        return 'ORDER_NOT_READY';
      case 15:
        return 'ORDER_PICKEDUP_COMPLETED_BY_CUSTOMER';
      case 16:
        return 'ORDER_STATUS_CANCELLED_BY_CUSTOMER';
      case 17:
        return 'ORDER_NOT_PICKEDUP_BY_CUSTOMER';
      case 18:
        return 'ORDER_DRIVER_ALMOST_ARRIVED_BUSINESS';
      case 19:
        return 'ORDER_DRIVER_ALMOST_ARRIVED_CUSTOMER';
      case 20:
        return 'ORDER_CUSTOMER_ALMOST_ARRIVED_BUSINESS';
      case 21:
        return 'ORDER_CUSTOMER_ARRIVED_BUSINESS';
      default:
        return status;
    }
  };

  const onSubmit = (values: any) => {
    handleSend && handleSend();
    setImage && setImage(null);
    setFile && setFile({ ...file, uri: '', type: '', name: '', size: 0 });
    setMessage && setMessage('');
  };

  const messageConsole = (message: any) => {
    return (
      <View
        style={{
          ...styles.firstMessage,
          marginLeft: 10,
          marginRight: 10,
          width: windowWidth - 40,
        }}>
        <OText style={{ ...styles.firstMessageText, textAlign: 'center' }}>
          {message.change?.attribute !== 'driver_id'
            ? `${t('ORDER', 'Order')} ${t(
                message.change.attribute.toUpperCase(),
                message.change.attribute,
              )} ${t('CHANGED_FROM', 'Changed from')} ${
                message.change.old !== null
                  ? t(getStatus(parseInt(message.change.old, 10)))
                  : '0'
              } ${t('TO', 'to')} ${t(
                getStatus(parseInt(message.change.new, 10)),
              )}`
            : message.change.new
            ? `${message.driver?.name} ${
                message.driver?.lastname !== null ? message.driver.lastname : ''
              } ${t('WAS_ASSIGNED_AS_DRIVER', 'Was assigned as driver')} ${
                message.comment ? message.comment.length : ''
              }`
            : `${t('DRIVER_UNASSIGNED', 'Driver unassigned')}`}
        </OText>
      </View>
    );
  };

  const AvatarsConsole = () => {
    return (
      <View style={{ flexDirection: 'row' }}>
        <OIcon
          url={order?.business?.logo || theme?.images?.dummies?.businessLogo}
          width={16}
          height={16}
          style={{ marginHorizontal: 2 }}
        />
        <OIcon
          url={order?.customer?.photo || theme?.images?.dummies?.customerPhoto}
          width={16}
          height={16}
          style={{ marginHorizontal: 2 }}
        />
        <OIcon
          url={order?.driver?.photo || theme?.images?.dummies?.driverPhoto}
          width={16}
          height={16}
          style={{ marginHorizontal: 2 }}
        />
      </View>
    );
  };

  const AvatarMessageFromAdmin = () => {
    return (
      <View style={{ flexDirection: 'row' }}>
        <OIcon
          url={order?.business?.logo || theme?.images?.dummies?.businessLogo}
          width={16}
          height={16}
          style={{ marginHorizontal: 2 }}
        />
        <OIcon
          url={order?.driver?.photo || theme?.images?.dummies?.driverPhoto}
          width={16}
          height={16}
          style={{ marginHorizontal: 2 }}
        />
      </View>
    );
  };

  const AvatarMessageFromDriver = () => {
    return (
      <View style={{ flexDirection: 'row' }}>
        <OIcon
          url={order?.business?.logo || theme?.images?.dummies?.businessLogo}
          width={16}
          height={16}
          style={{ marginHorizontal: 2 }}
        />
        <OIcon
          url={user?.photo || theme?.images?.dummies?.driverPhoto}
          width={16}
          height={16}
          style={{ marginHorizontal: 2 }}
        />
      </View>
    );
  };

  const AvatarMessageFromCustomer = () => {
    return (
      <View style={{ flexDirection: 'row' }}>
        <OIcon
          url={order?.business?.logo || theme?.images?.dummies?.businessLogo}
          width={16}
          height={16}
          style={{ marginHorizontal: 2 }}
        />
        {order?.driver && (
          <OIcon
            url={order?.driver?.photo || theme?.images?.dummies?.driverPhoto}
            width={16}
            height={16}
            style={{ marginHorizontal: 2 }}
          />
        )}
      </View>
    );
  };

  useEffect(() => {
    let newMessages: Array<any> = [];
    const console = (
      <View style={{ flexDirection: 'column' }}>
        <View style={styles.firstMessage}>
          <OText style={styles.firstMessageText}>
            {t('ORDER_PLACED_FOR', 'Order placed for')}{' '}
            <OText style={{ ...styles.firstMessageText, fontWeight: 'bold' }}>
              {parseDate(order?.created_at)}
            </OText>
          </OText>

          <OText style={{ ...styles.firstMessageText, textAlign: 'center' }}>
            {t('VIA', 'Via')}{' '}
            {order?.app_id
              ? t(order?.app_id.toUpperCase(), order?.app_id)
              : t('OTHER', 'Other')}
          </OText>
        </View>
        <OText size={9} color={theme.colors.textGray}>
          {`${t('SENT_TO', 'Sent to')}:`}
        </OText>
        <AvatarsConsole />
      </View>
    );

    const firstMessage = {
      _id: 0,
      text: console,
      createdAt: order?.created_at,
      system: true,
    };
    messages?.messages.map((message: any) => {
      let newMessage;
      if (
        message.type !== 0 &&
        (messagesToShow?.messages?.length ||
          message?.can_see?.includes('2') ||
          message?.can_see?.includes('0') ||
          (message?.can_see?.includes('4') && type === USER_TYPE.DRIVER))
      ) {
        newMessage = {
          _id: message.id,
          text: message.type === 1 ? messageConsole(message) : message.comment,
          createdAt: message.type !== 0 && message.created_at,
          image: message.source,
          system: message.type === 1,
          user: {
            _id: message.author.id,
            name: message.author.name,
            level: message.author.level,
            avatar:
              message.author.id !== user?.id && type === USER_TYPE.DRIVER
                ? order?.driver?.photo
                : order?.business?.logo,
          },
        };
      }
      if (message.type === 0) {
        newMessage = firstMessage;
      }
      if (newMessage) {
        newMessages = [...newMessages, newMessage];
      }
    });
    setFormattedMessages([...newMessages.reverse()]);
  }, [messages?.messages?.length]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setIsKeyboardShow(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsKeyboardShow(false);
      },
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const RenderActions = (props: any) => {
    return (
      <Actions
        {...props}
        containerStyle={styles.containerActions}
        optionTintColor="#222845"
        icon={() => (
          <>
            {!file?.type && (
              <>
                <OIconButton
                  borderColor={theme.colors.transparent}
                  style={{ width: image ? 32 : 28, height: image ? 32 : 28 }}
                  icon={image ? { uri: image } : theme.images.general.imageChat}
                  iconStyle={{
                    borderRadius: image ? 10 : 0,
                    width: image ? 32 : 28,
                    height: image ? 32 : 28,
                  }}
                  onClick={handleImagePicker}
                  iconCover
                />

                {image && (
                  <TouchableOpacity
                    style={{
                      position: 'absolute',
                      top: -5,
                      right: -5,
                      borderColor: theme.colors.backgroundDark,
                      backgroundColor: theme.colors.white,
                      borderRadius: 25,
                    }}
                    onPress={() => removeImage()}>
                    <MaterialCommunityIcon
                      name="close-circle-outline"
                      color={theme.colors.backgroundDark}
                      size={24}
                    />
                  </TouchableOpacity>
                )}
              </>
            )}
          </>
        )}
      />
    );
  };

  const RenderActionsAttach = (props: any) => {
    return (
      <Actions
        {...props}
        containerStyle={styles.containerActions}
        optionTintColor={theme.colors.actionsIcon}
        icon={() => (
          <>
            <OIconButton
              borderColor={theme.colors.transparent}
              style={{ width: 28, height: 28 }}
              icon={attachIcons[file?.type] || theme.images.general.attach}
              iconStyle={{
                width: 28,
                height: 28,
                tintColor: theme.colors.textGray,
              }}
              onClick={handleDocumentPicker}
              iconCover
            />

            {file?.type.length > 0 && (
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  top: -5,
                  right: -5,
                  borderColor: theme.colors.backgroundDark,
                  backgroundColor: theme.colors.white,
                  borderRadius: 25,
                }}
                onPress={() => removeImage()}>
                <MaterialCommunityIcon
                  name="close-circle-outline"
                  color={theme.colors.backgroundDark}
                  size={24}
                />
              </TouchableOpacity>
            )}
          </>
        )}
      />
    );
  };

  const renderAccessory = (props: any) => (
    <Header
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      horizontal>
      {user?.level !== 2 && (
        <Pressable
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: 25,
            opacity: canRead?.business ? 1 : 0.25,
          }}
          onPress={() => handleFilter({ business: !canRead?.business }, 2)}>
          <View
            style={{
              ...styles.shadow,
              shadowColor: canRead?.business
                ? theme.colors.shadow
                : theme.colors.brightness,
            }}>
            <OIcon url={order?.business?.logo} style={styles.accessoryIcon} />
          </View>

          <TitleHeader>
            <OText adjustsFontSizeToFit size={16} weight="bold">
              {order?.business?.name}
            </OText>

            <OText adjustsFontSizeToFit size={14}>
              {t('BUSINESS', 'Business')}
            </OText>
          </TitleHeader>
        </Pressable>
      )}

      <Pressable
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginRight: 25,
          opacity: canRead?.customer ? 1 : 0.25,
        }}
        onPress={() => handleFilter({ customer: !canRead?.customer }, 3)}>
        <View
          style={{
            ...styles.shadow,
            shadowColor: canRead?.customer
              ? theme.colors.shadow
              : theme.colors.brightness,
          }}>
          <OIcon url={order?.customer?.logo} style={styles.accessoryIcon} />
        </View>

        <TitleHeader>
          <OText adjustsFontSizeToFit size={16} weight="bold">
            {order?.customer?.name}
          </OText>

          <OText adjustsFontSizeToFit size={14}>
            {t('CUSTOMER', 'Customer')}
          </OText>
        </TitleHeader>
      </Pressable>

      {order?.driver && (
        <Pressable
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: 25,
            opacity: canRead?.driver ? 1 : 0.25,
          }}
          onPress={() => handleFilter({ driver: !canRead?.driver }, 4)}>
          <View
            style={{
              ...styles.shadow,
              shadowColor: canRead?.driver
                ? theme.colors.shadow
                : theme.colors.brightness,
            }}>
            <OIcon url={order?.driver?.logo} style={styles.accessoryIcon} />
          </View>

          <TitleHeader>
            <OText adjustsFontSizeToFit size={16} weight="bold">
              {order?.driver?.name}
            </OText>

            <OText adjustsFontSizeToFit size={14}>
              {t('DRIVER', 'Driver')}
            </OText>
          </TitleHeader>
        </Pressable>
      )}
    </Header>
  );

  const renderInputToolbar = (props: InputToolbarProps) => (
    <InputToolbar
      {...props}
      containerStyle={{
        padding: Platform.OS === 'ios' && isKeyboardShow ? 0 : 10,
        flexDirection: 'column-reverse',
      }}
      primaryStyle={{ alignItems: 'center', justifyContent: 'space-between' }}
      accessoryStyle={{ position: 'relative', marginBottom: 10 }}
      renderAccessory={order ? renderAccessory : undefined}
    />
  );

  const renderComposer = (props: ComposerProps) => (
    <View
      style={{
        flexDirection: 'row',
        height: 44,
        width: '85%',
        backgroundColor: theme.colors.composerView,
        borderRadius: 7.6,
        alignItems: 'center',
        justifyContent: 'center',  
        paddingRight: 10,
      }}>
      <Composer
        {...props}
        textInputStyle={{
          borderRadius: 7.6,
          paddingHorizontal: 10,
          borderColor: theme.colors.transparent,
          borderWidth: 0,
          color: '#010300',
          marginLeft: 1,
          marginRight: 0,
          marginBottom: 0,
          paddingVertical: 0,
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
          enablesReturnKeyAutomatically: false,
          selectionColor: theme.colors.primary,
        }}
        placeholder={t('WRITE_MESSAGE', 'Write message')}
        placeholderTextColor={theme.colors.composerPlaceHolder}
      />

      {/* {!image && <RenderActionsAttach {...props} />} */}
      {!file.type && <RenderActions {...props} />}
    </View>
  );

  const renderSend = (props: any) => (
    <Send
      {...props}
      disabled={
        sendMessage?.loading || (message === '' && !image) || messages?.loading
      }
      alwaysShowSend
      containerStyle={styles.containerSend}>
      <OIconButton
        onClick={onSubmit}
        style={{
          height: 44,
          width: 44,
          borderRadius: 7.6,
          borderWidth: 0,
          opacity:
            sendMessage?.loading ||
            (message === '' && !image) ||
            messages?.loading
              ? 0.6
              : 1,
          borderColor: theme.colors.transparent,
          backgroundColor: theme.colors.primary,
        }}
        icon={theme.images.general.arrowReturnLeft}
        disabled={
          sendMessage?.loading ||
          (message === '' && !image) ||
          messages?.loading
        }
        disabledColor={theme.colors.white}
      />
    </Send>
  );

  const renderBubble = (props: any) => (
    <Bubble
      {...props}
      textStyle={{
        left: {},
        right: { color: theme.colors.white },
      }}
      containerStyle={{
        left: { marginVertical: 5, borderTopLeftRadius: 7.6 },
        right: { marginVertical: 5, borderTopRightRadius: 7.6 },
      }}
      wrapperStyle={{
        left: {
          backgroundColor: theme.colors.inputDisabled,
          padding: 5,
          borderTopLeftRadius: 7.6,
          borderTopRightRadius: 7.6,
          borderBottomRightRadius: 7.6,
          borderBottomLeftRadius: 0,
        },
        right: {
          backgroundColor: theme.colors.primary,
          padding: 5,
          borderTopLeftRadius: 7.6,
          borderTopRightRadius: 7.6,
          borderBottomLeftRadius: 7.6,
          borderBottomRightRadius: 0,
        },
      }}
    />
  );

  const renderMessageImage = (props: any) => <MessageImage {...props} />;

  const renderScrollToBottomComponent = () => (
    <MaterialCommunityIcon name="chevron-double-down" size={32} />
  );

  const customMessage = (props: any) => {
    return (
      <Message
        {...props}
        containerStyle={{
          right: {
            flexDirection: 'column',
          },
          left: {
            flexDirection: 'column-reverse',
            alignItems: 'flex-start',
          },
        }}
      />
    );
  };

  const renderAvatar = (props: any) => (
    <>
      <OText size={9} color={theme.colors.textGray}>
        {`${t('SENT_TO', 'Sent to')}:`}
      </OText>
      <View style={{ flexDirection: 'row' }}>
        {(props?.currentMessage?.user?.level === 2 ||
          props?.currentMessage?.user?.level === 0) && (
          <AvatarMessageFromAdmin />
        )}

        {props?.currentMessage?.user.level === 4 && <AvatarMessageFromDriver />}

        {props?.currentMessage?.user.level === 3 && (
          <AvatarMessageFromCustomer />
        )}
      </View>
    </>
  );

  return (
    <>
      <Wrapper>
        <GiftedChat
          messages={formattedMessages}
          user={{
            _id: user?.id,
            name: user?.name,
            avatar: user?.photo,
          }}
          onSend={onSubmit}
          onInputTextChanged={onChangeMessage}
          alignTop={false}
          listViewProps={{contentContainerStyle: {flexGrow: 1, justifyContent: 'flex-end' }}}
          scrollToBottom
          renderAvatar={renderAvatar}
          renderInputToolbar={renderInputToolbar}
          renderComposer={renderComposer}
          renderSend={renderSend}
          renderMessage={(props: any) => customMessage(props)}
          renderBubble={renderBubble}
          renderMessageImage={renderMessageImage}
          scrollToBottomComponent={() => renderScrollToBottomComponent()}
          messagesContainerStyle={{ paddingBottom: 12 }}
          showUserAvatar={true}
          bottomOffset={bottom}
          minInputToolbarHeight={100}
          isLoadingEarlier={messages?.loading}
          renderLoading={() => (
            <ActivityIndicator size="small" color={theme.colors.black} />
          )}
          keyboardShouldPersistTaps="handled"
        />
      </Wrapper>
    </>
  );
};

export const Chat = (props: MessagesParams) => {
  const MessagesProps = {
    ...props,
    UIComponent: ChatUI,
  };
  return <MessagesController {...MessagesProps} />;
};
