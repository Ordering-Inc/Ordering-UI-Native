import React, { useEffect, useState, useRef } from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  View,
  Platform,
  Keyboard,
  Dimensions,
  Pressable,
  SafeAreaView,
} from 'react-native';
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
import { launchImageLibrary } from 'react-native-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import DocumentPicker from 'react-native-document-picker';
import { useTheme } from 'styled-components/native';
import {
  ToastType,
  useToast,
  Messages as MessagesController,
  useSession,
  useUtils,
  useLanguage,
} from 'ordering-components/native';
import { Header, TitleHeader, Wrapper, QuickMessageContainer } from './styles';
import { OIcon, OIconButton, OText, OButton } from '../shared';
import { MessagesParams } from '../../types';
import { USER_TYPE } from '../../config/constants';

import SignatureScreen from 'react-native-signature-canvas';

const filterSpecialStatus = ['prepared_in', 'delivered_in', 'delivery_datetime']

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
  const [{ parseDate, parseTime, optimizeImage, getTimeAgo }] = useUtils();
  const [, t] = useLanguage();
  const [, { showToast }] = useToast();
  const theme = useTheme();
  const [messageList, setMessageList] = useState<any>([])
  const previousStatus = [1, 2, 5, 6, 10, 11, 12, 16, 17]
  const chatDisabled = previousStatus.includes(order?.status)

  const ORDER_STATUS: any = {
    0: t('ORDER_STATUS_PENDING', 'Order status pending'),
    1: t('ORDERS_COMPLETED', 'Order completed'),
    2: t('ORDER_REJECTED', 'Order rejected'),
    3: t('ORDER_STATUS_IN_BUSINESS', 'Order status in business'),
    4: t('ORDER_READY', 'Order ready'),
    5: t('ORDER_REJECTED_RESTAURANT', 'Order rejected by restaurant'),
    6: t('ORDER_STATUS_CANCELLEDBYDRIVER', 'Order status cancelled by driver'),
    7: t('ORDER_STATUS_ACCEPTEDBYRESTAURANT', 'Order status accepted by restaurant'),
    8: t('ORDER_CONFIRMED_ACCEPTED_BY_DRIVER', 'Order confirmed accepted by driver'),
    9: t('ORDER_PICKUP_COMPLETED_BY_DRIVER', 'Order pickup completed by driver'),
    10: t('ORDER_PICKUP_FAILED_BY_DRIVER', 'Order pickup failed by driver'),
    11: t('ORDER_DELIVERY_COMPLETED_BY_DRIVER', 'Order delivery completed by driver'),
    12: t('ORDER_DELIVERY_FAILED_BY_DRIVER', 'Order delivery failed by driver'),
    13: t('PREORDER', 'Preorder'),
    14: t('ORDER_NOT_READY', 'Order not ready'),
    15: t('ORDER_PICKEDUP_COMPLETED_BY_CUSTOMER', 'Order picked up completed by customer'),
    16: t('ORDER_STATUS_CANCELLED_BY_CUSTOMER', 'Order status cancelled by customer'),
    17: t('ORDER_NOT_PICKEDUP_BY_CUSTOMER', 'Order not picked up by customer'),
    18: t('ORDER_DRIVER_ALMOST_ARRIVED_BUSINESS', 'Order driver almost arrived to business'),
    19: t('ORDER_DRIVER_ALMOST_ARRIVED_CUSTOMER', 'Order driver almost arrived to customer'),
    20: t('ORDER_CUSTOMER_ALMOST_ARRIVED_BUSINESS', 'Order customer almost arrived to business'),
    21: t('ORDER_CUSTOMER_ARRIVED_BUSINESS', 'Order customer arrived to business'),
    22: t('ORDER_LOOKING_FOR_DRIVER', 'Order looking for driver'),
    23: t('ORDER_DRIVER_ON_WAY', 'Driver on way')
  }

  const storeMessageList: any = [
    { key: 'store_message_1', text: t('STORE_MESSAGE_1', 'store_message_1') },
    { key: 'store_message_2', text: t('STORE_MESSAGE_2', 'store_message_2') },
    { key: 'store_message_3', text: t('STORE_MESSAGE_3', 'store_message_3') },
    { key: 'store_message_4', text: t('STORE_MESSAGE_4', 'store_message_4') }
  ]

  const driverMessageList: any = [
    { key: 'driver_message_1', text: t('DRIVER_MESSAGE_1', 'driver_message_1') },
    { key: 'driver_message_2', text: t('DRIVER_MESSAGE_2', 'driver_message_2') },
    { key: 'driver_message_3', text: t('DRIVER_MESSAGE_3', 'driver_message_3') },
    { key: 'driver_message_4', text: t('DRIVER_MESSAGE_4', 'driver_message_4') }
  ]

  const adminMessageList: any = [
    { key: 'message_1', text: t('ADMIN_MESSAGE_1', 'admin_message_1') },
    { key: 'message_2', text: t('ADMIN_MESSAGE_2', 'admin_message_2') },
    { key: 'message_3', text: t('ADMIN_MESSAGE_3', 'admin_message_3') },
    { key: 'message_4', text: t('ADMIN_MESSAGE_4', 'admin_message_4') }
  ]

  const handleClickQuickMessage = (text: string) => {
    setMessage && setMessage(`${message}${text}`)
  }

  const { bottom } = useSafeAreaInsets();

  const [formattedMessages, setFormattedMessages] = useState<Array<any>>([]);
  const [isKeyboardShow, setIsKeyboardShow] = useState(false);
  const windowWidth =
    Dimensions.get('window').width < Dimensions.get('window').height
      ? parseInt(parseFloat(String(Dimensions.get('window').width)).toFixed(0))
      : parseInt(
        parseFloat(String(Dimensions.get('window').height)).toFixed(0),
      );

  const [orientation, setOrientation] = useState<string>(
    Dimensions.get('window').width < Dimensions.get('window').height
      ? 'Portrait'
      : 'Landscape',
  );

  const [isShowSignaturePad, setIsShowSignaturePad] = useState(false)

  // Events
  Dimensions.addEventListener('change', ({ window: { width, height } }) => {
    if (width < height) {
      setOrientation('Portrait');
    } else {
      setOrientation('Landscape');
    }
  });

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
    toolbarStyle: {
      padding: Platform.OS === 'ios' && isKeyboardShow ? 0 : 10,
      flexDirection: 'column-reverse'
    },
    accessoryIcon: {
      height: 32,
      width: 32,
      minWidth: 32,
      borderRadius: 7.6,
      resizeMode: 'stretch',
    },
    shadow: {
      height: 33,
      width: 33,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 3,
      borderRadius: 7.6,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 2,
      backgroundColor: theme.colors.clear,
    },
    avatar: {
      height: 17,
      width: 17,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 3,
      borderRadius: 7.6,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 2,
      backgroundColor: theme.colors.white,
      marginLeft: 4,
    },
    avatarIcon: {
      height: 16,
      width: 16,
      borderRadius: 50,
      resizeMode: 'stretch',
    },
    firstMessage: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.inputChat,
      paddingVertical: 10,
      borderRadius: 7.6,
    },
    firstMessageText: {
      color: theme.colors.textGray,
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: 13,
    },
    timeText: {
      color: theme.colors.white,
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: 10,
      paddingLeft: 12,
      paddingRight: 5,
    },
    editButton: {
      borderRadius: 50,
      backgroundColor: '#E9ECEF',
      marginRight: 10,
      height: 24,
      borderWidth: 1,
      paddingLeft: 0,
      paddingRight: 0
    }
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
    } catch (err: any) {
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
        maxHeight: 2048,
        maxWidth: 2048,
        includeBase64: true,
        quality: 1
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

  const handleFilter = (value: any, reader: string) => {
    const isAdmin = user?.level === 0;
    const readersCount = [
      ...new Map<string, boolean>(Object.entries(canRead)).values(),
    ].filter((read: boolean) => read).length;
    const minReaders = isAdmin ? 2 : order?.driver ? 3 : 4;

    if (minReaders === 4) {
      return;
    }

    if (readersCount > minReaders || value[reader]) {
      setCanRead({ ...canRead, ...value });
    } else if (reader !== 'business' && (isAdmin || user?.level === 4)) {
      setCanRead({ ...canRead, ...value, business: true });
    } else if (reader !== 'customer') {
      setCanRead({ ...canRead, ...value, customer: true });
    } else {
      setCanRead({ ...canRead, ...value, driver: true });
    }
  };

  const onSubmit = (values: any) => {
    handleSend && handleSend();
    setImage && setImage(null);
    setFile && setFile({ ...file, uri: '', type: '', name: '', size: 0 });
    setMessage && setMessage('');
    setIsShowSignaturePad(false)
  };

  const messageConsole = (message: any) => {
    return (
      <View
        style={{
          ...styles.firstMessage,
          marginHorizontal: 0,
          paddingHorizontal: 32,
          width: 320,
        }}>
        <OText
          numberOfLines={3}
          style={{ ...styles.firstMessageText, textAlign: 'center' }}>
          {message.change?.attribute !== 'driver_id'
            ?
            `${t('ORDER', 'Order')} ${t(message.change.attribute.toUpperCase(), message.change.attribute.replace('_', ' '))} ${t('CHANGED_FROM', 'Changed from')} ${filterSpecialStatus.includes(message.change.attribute) ?
              `${message.change.old === null ? '0' : message.change.old} ${t('TO', 'to')} ${message.change.new} ${t('MINUTES', 'Minutes')}` :
              `${message.change.old !== null && ORDER_STATUS[parseInt(message.change.old, 10)]} ${t('TO', 'to')} ${ORDER_STATUS[parseInt(message.change.new, 10)]}`
            }`
            : message.change.new
              ?
              `${message.driver?.name} ${message.driver?.lastname !== null ? message.driver.lastname : ''} ${t('WAS_ASSIGNED_AS_DRIVER', 'Was assigned as driver')} ${message.comment ? message.comment.length : ''}`
              :
              `${t('DRIVER_UNASSIGNED', 'Driver unassigned')}`}
        </OText>
        <OText size={10} color={'#aaa'} style={{ alignSelf: 'flex-start' }}>
          {parseTime(message?.created_at, { outputFormat: 'hh:mma' })}
        </OText>
      </View>
    );
  };

  const AvatarsConsole = () => {
    return (
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.avatar}>
          <OIcon
            url={optimizeImage(order?.business?.logo, 'h_300,c_limit')}
            src={!order?.business?.logo && theme.images.dummies.businessLogo}
            width={16}
            height={16}
            style={styles.avatarIcon}
          />
        </View>

        <View style={styles.avatar}>
          <OIcon
            url={optimizeImage(
              order?.customer?.photo || theme?.images?.dummies?.customerPhoto,
              'h_300,c_limit',
            )}
            style={styles.avatarIcon}
          />
        </View>

        {order?.driver && (
          <View style={styles.avatar}>
            <OIcon
              url={
                optimizeImage(order?.driver?.photo, 'h_300,c_limit') ||
                theme?.images?.dummies?.driverPhoto
              }
              width={16}
              height={16}
              style={styles.avatarIcon}
            />
          </View>
        )}
      </View>
    );
  };

  useEffect(() => {
    if (user.level === 0) setMessageList(adminMessageList)
    else if (user.level === 2) setMessageList(storeMessageList)
    else if (user.level === 4) setMessageList(driverMessageList)
    else setMessageList([])
  }, [user])

  useEffect(() => {
    let newMessages: Array<any> = [];
    const console = (
      <View style={{ flexDirection: 'column', width: windowWidth - 100 }}>
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

        <View>
          <OText size={9} color={theme.colors.textGray}>
            {`${t('SENT_TO', 'Sent to')}:`}
          </OText>

          <AvatarsConsole />
        </View>
      </View>
    );

    const firstMessage = {
      _id: 0,
      text: console,
      createdAt: parseDate(order?.created_at, { outputFormat: 'YYYY-MM-DD HH:mm:ss' }),
      system: true,
    };
    messages?.messages.map((message: any) => {
      let newMessage;
      if (
        parseInt(message.order_id) === order?.id &&
        message.type !== 0 &&
        (messagesToShow?.messages?.length ||
          message?.can_see?.includes('2') ||
          message?.can_see?.includes('0') ||
          (message?.can_see?.includes('4') && type === USER_TYPE.DRIVER))
      ) {
        newMessage = {
          _id: message.id,
          text: message.type === 1 ? messageConsole(message) : message.comment,
          createdAt: message.type !== 0 && parseDate(message?.created_at, { outputFormat: 'YYYY-MM-DD HH:mm:ss' }),
          image: message.source,
          system: message.type === 1,
          user: {
            _id: message.author?.id,
            name: message.author?.name,
            can_see: message?.can_see,
            level: message.author?.level,
            avatar:
              message.author?.id !== user?.id && type === USER_TYPE.DRIVER
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

  useEffect(() => {
    if (!order?.driver) {
      setCanRead({ ...canRead, driver: false });
    } else {
      setCanRead({ ...canRead, driver: true });
    }
  }, [order?.driver]);

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

  const renderAccessory = () => (
    !chatDisabled &&
    <View>
      <Header
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        horizontal
        nestedScrollEnabled={true}
      >
        {user?.level !== 2 && (
          <Pressable
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              opacity: canRead?.business ? 1 : 0.25,
              marginRight: 25,
            }}
            onPress={() =>
              handleFilter({ business: !canRead?.business }, 'business')
            }>
            <View
              style={{
                ...styles.shadow,
                shadowColor: canRead?.business
                  ? theme.colors.shadow
                  : theme.colors.brightness,
              }}>
              <OIcon
                url={optimizeImage(order?.business?.logo, 'h_300,c_limit')}
                src={
                  !order?.business?.logo && theme.images.dummies.businessLogo
                }
                style={styles.accessoryIcon}
              />
            </View>

            <TitleHeader>
              <OText adjustsFontSizeToFit size={16} weight="600">
                {order?.business?.name}
              </OText>

              <OText
                adjustsFontSizeToFit
                color={theme.colors.unselectText}
                size={13}>
                {t('BUSINESS', 'Business')}
              </OText>
            </TitleHeader>
          </Pressable>
        )}

        <Pressable
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            opacity: canRead?.customer ? 1 : 0.25,
            marginRight: 25,
          }}
          onPress={() =>
            handleFilter({ customer: !canRead?.customer }, 'customer')
          }>
          <View
            style={{
              ...styles.shadow,
              shadowColor: canRead?.customer
                ? theme.colors.shadow
                : theme.colors.brightness,
            }}>
            <OIcon
              url={optimizeImage(
                order?.customer?.photo || theme?.images?.dummies?.customerPhoto,
                'h_300,c_limit',
              )}
              style={styles.accessoryIcon}
            />
          </View>

          <TitleHeader>
            <OText adjustsFontSizeToFit size={16} weight="600">
              {order?.customer?.name}
            </OText>

            <OText
              adjustsFontSizeToFit
              color={theme.colors.unselectText}
              size={13}>
              {t('CUSTOMER', 'Customer')}
            </OText>
          </TitleHeader>
        </Pressable>

        {order?.driver && user?.level !== 4 && (
          <Pressable
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              opacity: canRead?.driver ? 1 : 0.25,
              marginRight: 25,
            }}
            onPress={() =>
              handleFilter({ driver: !canRead?.driver }, 'driver')
            }>
            <View
              style={{
                ...styles.shadow,
                shadowColor: canRead?.driver
                  ? theme.colors.shadow
                  : theme.colors.brightness,
              }}>
              <OIcon
                url={
                  optimizeImage(order?.driver?.photo, 'h_300,c_limit') ||
                  theme?.images?.dummies?.driverPhoto
                }
                style={styles.accessoryIcon}
              />
            </View>

            <TitleHeader>
              <OText adjustsFontSizeToFit size={16} weight="600">
                {order?.driver?.name}
              </OText>

              <OText
                adjustsFontSizeToFit
                color={theme.colors.unselectText}
                size={13}>
                {t('DRIVER', 'Driver')}
              </OText>
            </TitleHeader>
          </Pressable>
        )}
      </Header>
      <QuickMessageContainer
        contentContainerStyle={{
          alignItems: 'center'
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {messageList.map((quickMessage: any, i: number) => (
          <React.Fragment key={i}>
            <OButton
              text={quickMessage.text}
              bgColor='#E9ECEF'
              borderColor='#E9ECEF'
              imgRightSrc={null}
              textStyle={{
                fontSize: 11,
                lineHeight: 16,
                color: '#414954'
              }}
              style={{ ...styles.editButton }}
              onClick={() => handleClickQuickMessage(message?.length > 0 ? ' ' + quickMessage.text : quickMessage.text)}
            />
          </React.Fragment>
        ))}
      </QuickMessageContainer>
    </View>

  );

  const userRoles: any = {
    0: t('ADMINISTRATOR', 'Administrator'),
    1: t('CITY_MANAGER', 'City manager'),
    2: t('BUSINESS_OWNER', 'Business owner'),
    3: t('CUSTOMER', 'Customer'),
    4: t('DRIVER', 'Driver'),
    5: t('DRIVER_MANAGER', 'Driver manager'),
  };

  const renderInputToolbar = (props: any) => (
    <InputToolbar
      {...props}
      containerStyle={styles.toolbarStyle}
      primaryStyle={{ alignItems: 'center', justifyContent: 'space-between' }}
      accessoryStyle={{ position: 'relative', marginBottom: 45 }}
      renderAccessory={() => renderAccessory()}
    />
  );

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
            borderColor: theme.colors.transparent,
            borderWidth: 0,
            color: '#010300',
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

        <TouchableOpacity
          onPress={() => {
            setImage && setImage(null);
            setIsShowSignaturePad(!isShowSignaturePad);
          }}>
          <MaterialCommunityIcon
            name="pen"
            color={
              isShowSignaturePad ? theme.colors.primary : theme.colors.arrowColor
            }
            size={24}
          />
        </TouchableOpacity>

        {!file.type && (
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
                      icon={
                        !isShowSignaturePad && image
                          ? { uri: image }
                          : theme.images.general.imageChat
                      }
                      iconStyle={{
                        borderRadius: image ? 10 : 0,
                        width: image ? 32 : 28,
                        height: image ? 32 : 28,
                      }}
                      onClick={handleImagePicker}
                      iconCover
                    />

                    {image && !isShowSignaturePad && (
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
        )}
      </View>
    )
  );

  const renderSend = (props: any) => (
    !chatDisabled &&
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
        left: { marginVertical: 5, borderTopLeftRadius: 7.6, marginLeft: 3 },
        right: { marginVertical: 5, borderTopRightRadius: 7.6, marginRight: 3 },
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

  const renderAvatar = (props: any) => {
    const isMine = user?.id === props?.currentMessage?.user?._id;

    return (
      <View
        style={{
          marginBottom: 10,
          alignItems: isMine ? 'flex-end' : 'flex-start',
        }}>
        <OText size={9} color={theme.colors.textGray}>
          {`${t('SENT_TO', 'Sent to')}:`}
        </OText>

        <View style={{ flexDirection: 'row' }}>
          {props?.currentMessage?.user?.can_see?.includes('2') &&
            user?.level !== 2 && (
              <View style={styles.avatar}>
                <OIcon
                  url={optimizeImage(order?.business?.logo, 'h_300,c_limit')}
                  src={
                    !order?.business?.logo &&
                    theme?.images?.dummies?.businessLogo
                  }
                  style={styles.avatarIcon}
                />
              </View>
            )}

          {props?.currentMessage?.user?.can_see?.includes('3') && (
            <View style={styles.avatar}>
              <OIcon
                url={optimizeImage(
                  order?.customer?.photo ||
                  theme?.images?.dummies?.customerPhoto,
                  'h_300,c_limit',
                )}
                style={styles.avatarIcon}
              />
            </View>
          )}

          {props?.currentMessage?.user?.can_see?.includes('4') &&
            user?.level !== 4 && (
              <View style={{ ...styles.avatar, marginRight: 0 }}>
                <OIcon
                  url={
                    optimizeImage(order?.driver?.photo, 'h_300,c_limit') ||
                    theme?.images?.dummies?.driverPhoto
                  }
                  style={styles.avatarIcon}
                />
              </View>
            )}
        </View>
      </View>
    );
  };
  const renderTime = (props: any) => (
    <>
      <OText style={styles.timeText}>
        {getTimeAgo(props.currentMessage.createdAt)}
      </OText>
    </>
  );

  const renderNameMessage = (props: any) => {
    const isMine = user?.id === props?.currentMessage?.user?._id;
    return (
      <View
        style={{
          alignItems: isMine ? 'flex-end' : 'flex-start',
          paddingHorizontal: 10,
        }}>
        <OText
          weight="600"
          color={isMine ? theme.colors.white : theme.colors.black}>
          {props?.currentMessage?.user?.name} (
          {userRoles[props?.currentMessage?.user?.level]})
        </OText>
      </View>
    );
  };

  const imgHeight = 120;
  const signatureStyle = `
    .m-signature-pad {
      box-shadow: none;
      border: none;
    } 
    .m-signature-pad--body {
      border: none;
    }
    .m-signature-pad--footer {
      display: none;
      margin: 0px;
    }
    body,html {
      height: ${imgHeight}px;
      border-radius: 7.6px;
    }
    .m-signature-pad--footer
    .button {
      background-color: red;
      color: #FFF;
    }
  `;

  const signatureRef = useRef<any>();

  const handleClear = () => {
    setImage && setImage(null);
    signatureRef.current.clearSignature();
  };

  const handleEnd = () => {
    signatureRef.current.readSignature();
  };

  const handleOK = (signature: any) => {
    setImage && setImage(signature);
  };

  const renderChatFooter = () => {
    return (
      <View
        style={{
          height: imgHeight,
          paddingHorizontal: 30,
          paddingVertical: 10,
          borderTopColor: theme.colors.tabBar,
          borderTopWidth: 1
        }}
      >
        <SignatureScreen
          ref={signatureRef}
          onOK={handleOK}
          webStyle={signatureStyle}
          backgroundColor={theme.colors.composerView}
          onEnd={handleEnd}
        />
        <TouchableOpacity
          style={{
            position: 'absolute',
            right: 35,
            top: 15
          }}
          onPress={handleClear}>
          <MaterialCommunityIcon
            name="close"
            color={theme.colors.textGray}
            size={24}
          />
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
          listViewProps={{
            contentContainerStyle: {
              flexGrow: 1,
              justifyContent: 'flex-end',
              paddingHorizontal: 22,
              paddingBottom: 30,
            },
          }}
          renderCustomView={renderNameMessage}
          scrollToBottom
          renderAvatar={renderAvatar}
          showAvatarForEveryMessage={true}
          renderChatFooter={isShowSignaturePad ? renderChatFooter : undefined}
          renderInputToolbar={renderInputToolbar}
          renderComposer={renderComposer}
          renderSend={renderSend}
          renderMessage={(props: any) => customMessage(props)}
          renderBubble={renderBubble}
          renderMessageImage={renderMessageImage}
          scrollToBottomComponent={() => renderScrollToBottomComponent()}
          messagesContainerStyle={{ paddingBottom: 25 }}
          showUserAvatar={true}
          bottomOffset={bottom}
          minInputToolbarHeight={145}
          isLoadingEarlier={messages?.loading}
          renderLoading={() => (
            <ActivityIndicator size="small" color={theme.colors.black} />
          )}
          keyboardShouldPersistTaps="handled"
        />
      </Wrapper>
    </SafeAreaView>
  );
};

export const Chat = (props: MessagesParams) => {
  const MessagesProps = {
    ...props,
    UIComponent: ChatUI,
  };
  return <MessagesController {...MessagesProps} />;
};
