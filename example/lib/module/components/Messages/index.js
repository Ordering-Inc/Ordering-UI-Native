function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React, { useEffect, useState } from 'react';
import { Messages as MessagesController, useSession, useUtils, useLanguage } from 'ordering-components/native';
import { launchImageLibrary } from 'react-native-image-picker';
import { GiftedChat, Actions, InputToolbar, Composer, Send, Bubble, MessageImage } from 'react-native-gifted-chat';
import { USER_TYPE } from '../../config/constants';
import { ToastType, useToast } from '../../providers/ToastProvider';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../theme';
import { OIcon, OIconButton, OText } from '../shared';
import { TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Header, TitleHeader, Wrapper } from './styles';

const ImageDummy = require('../../assets/images/image.png');

const paperIcon = require('../../assets/images/paper-plane.png');

const MessagesUI = props => {
  var _order$driver2, _order$business2, _order$driver3, _order$business3;

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
    readMessages
  } = props;
  const [{
    user
  }] = useSession();
  const [{
    parseDate
  }] = useUtils();
  const [, t] = useLanguage();
  const {
    showToast
  } = useToast();
  const [formattedMessages, setFormattedMessages] = useState([]);

  const onChangeMessage = val => {
    setMessage && setMessage(val);
  };

  const removeImage = () => {
    setImage && setImage(null);
  };

  const handleImagePicker = () => {
    launchImageLibrary({
      mediaType: 'photo',
      maxHeight: 300,
      maxWidth: 300,
      includeBase64: true
    }, response => {
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
    });
  };

  const getStatus = status => {
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

      default:
        return status;
    }
  };

  const onSubmit = values => {
    handleSend && handleSend();
    setImage && setImage(null);
    setMessage && setMessage('');
  };

  const messageConsole = message => {
    var _message$change, _message$driver, _message$driver2;

    return ((_message$change = message.change) === null || _message$change === void 0 ? void 0 : _message$change.attribute) !== 'driver_id' ? `${t('ORDER', 'Order')} ${message.change.attribute} ${t('CHANGED_FROM', 'Changed from')} ${message.change.old !== null && t(getStatus(parseInt(message.change.old, 10)))} ${t('TO', 'to')} ${t(getStatus(parseInt(message.change.new, 10)))}` : message.change.new ? `${(_message$driver = message.driver) === null || _message$driver === void 0 ? void 0 : _message$driver.name} ${((_message$driver2 = message.driver) === null || _message$driver2 === void 0 ? void 0 : _message$driver2.lastname) !== null ? message.driver.lastname : ''} ${t('WAS_ASSIGNED_AS_DRIVER', 'Was assigned as driver')} ${message.comment ? message.comment.length : ''}` : `${t('DRIVER_UNASSIGNED', 'Driver unassigned')}`;
  };

  useEffect(() => {
    let newMessages = [];
    const console = `${t('ORDER_PLACED_FOR', 'Order placed for')} ${parseDate(order === null || order === void 0 ? void 0 : order.created_at)} ${t('VIA', 'Via')} ${order !== null && order !== void 0 && order.app_id ? t(order === null || order === void 0 ? void 0 : order.app_id.toUpperCase(), order === null || order === void 0 ? void 0 : order.app_id) : t('OTHER', 'Other')}`;
    const firstMessage = {
      _id: 0,
      text: console,
      createdAt: order === null || order === void 0 ? void 0 : order.created_at,
      system: true
    };
    messages.messages.map(message => {
      var _messagesToShow$messa, _message$can_see, _message$can_see2;

      let newMessage;

      if (message.type !== 0 && (messagesToShow !== null && messagesToShow !== void 0 && (_messagesToShow$messa = messagesToShow.messages) !== null && _messagesToShow$messa !== void 0 && _messagesToShow$messa.length || message !== null && message !== void 0 && (_message$can_see = message.can_see) !== null && _message$can_see !== void 0 && _message$can_see.includes('2') || message !== null && message !== void 0 && (_message$can_see2 = message.can_see) !== null && _message$can_see2 !== void 0 && _message$can_see2.includes('4') && type === USER_TYPE.DRIVER)) {
        var _order$driver, _order$business;

        newMessage = {
          _id: message.id,
          text: message.type === 1 ? messageConsole(message) : message.comment,
          createdAt: message.type !== 0 && message.created_at,
          image: message.source,
          system: message.type === 1,
          user: {
            _id: message.author.id,
            name: message.author.name,
            avatar: message.author.id !== user.id && type === USER_TYPE.DRIVER ? order === null || order === void 0 ? void 0 : (_order$driver = order.driver) === null || _order$driver === void 0 ? void 0 : _order$driver.photo : order === null || order === void 0 ? void 0 : (_order$business = order.business) === null || _order$business === void 0 ? void 0 : _order$business.logo
          }
        };
      }

      if (message.type === 0) {
        newMessage = firstMessage;
      }

      newMessages = [...newMessages, newMessage];
    });
    setFormattedMessages([...newMessages.reverse()]);
  }, [messages.messages.length]);

  const renderActions = props => {
    return /*#__PURE__*/React.createElement(Actions, _extends({}, props, {
      options: {
        'Send Image': () => handleImagePicker()
      },
      containerStyle: styles.containerActions,
      optionTintColor: "#222845",
      icon: () => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(OIconButton, {
        borderColor: image ? colors.white : colors.lightGray,
        style: {
          width: 32,
          height: 32,
          borderRadius: 10
        },
        icon: image ? {
          uri: image
        } : ImageDummy,
        iconStyle: {
          borderRadius: image ? 10 : 0,
          width: image ? 32 : 24,
          height: image ? 32 : 24
        },
        onClick: handleImagePicker,
        iconCover: true,
        bgColor: colors.inputDisabled
      }), image && /*#__PURE__*/React.createElement(TouchableOpacity, {
        style: {
          position: 'absolute',
          top: -5,
          right: -5,
          borderColor: colors.backgroundDark,
          backgroundColor: colors.white,
          borderRadius: 25
        },
        onPress: () => removeImage()
      }, /*#__PURE__*/React.createElement(MaterialCommunityIcon, {
        name: "close-circle-outline",
        color: colors.backgroundDark,
        size: 24
      })))
    }));
  };

  const renderInputToolbar = props => /*#__PURE__*/React.createElement(InputToolbar, _extends({}, props, {
    containerStyle: {
      padding: 10
    },
    primaryStyle: {
      alignItems: 'center',
      justifyContent: 'center'
    }
  }));

  const renderComposer = props => /*#__PURE__*/React.createElement(Composer, _extends({}, props, {
    textInputStyle: {
      backgroundColor: colors.lightGray,
      borderRadius: 25,
      paddingHorizontal: 10
    },
    textInputProps: {
      value: message
    },
    placeholder: t('WRITE_MESSAGE', 'Write message...')
  }));

  const renderSend = props => /*#__PURE__*/React.createElement(Send, _extends({}, props, {
    disabled: (sendMessage === null || sendMessage === void 0 ? void 0 : sendMessage.loading) || message === '' && !image || (messages === null || messages === void 0 ? void 0 : messages.loading),
    alwaysShowSend: true,
    containerStyle: styles.containerSend
  }), /*#__PURE__*/React.createElement(OIconButton, {
    onClick: onSubmit,
    style: {
      width: 54,
      height: 32,
      borderRadius: 25,
      opacity: sendMessage !== null && sendMessage !== void 0 && sendMessage.loading || message === '' && !image || messages !== null && messages !== void 0 && messages.loading ? 0.4 : 1,
      borderColor: colors.primary
    },
    iconStyle: {
      marginTop: 3,
      marginRight: 2
    },
    icon: paperIcon,
    disabled: (sendMessage === null || sendMessage === void 0 ? void 0 : sendMessage.loading) || message === '' && !image || (messages === null || messages === void 0 ? void 0 : messages.loading),
    disabledColor: colors.white
  }));

  const renderBubble = props => /*#__PURE__*/React.createElement(Bubble, _extends({}, props, {
    textStyle: {
      left: {},
      right: {
        color: colors.white
      }
    },
    containerStyle: {
      left: {
        marginVertical: 5
      },
      right: {
        marginVertical: 5
      }
    },
    wrapperStyle: {
      left: {
        backgroundColor: '#f7f7f7',
        padding: 5
      },
      right: {
        backgroundColor: colors.primary,
        padding: 5
      }
    }
  }));

  const renderMessageImage = props => /*#__PURE__*/React.createElement(MessageImage, props);

  const renderScrollToBottomComponent = () => /*#__PURE__*/React.createElement(MaterialCommunityIcon, {
    name: "chevron-double-down",
    size: 32
  });

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Wrapper, null, /*#__PURE__*/React.createElement(Header, null, /*#__PURE__*/React.createElement(OIcon, {
    url: type === USER_TYPE.DRIVER ? order === null || order === void 0 ? void 0 : (_order$driver2 = order.driver) === null || _order$driver2 === void 0 ? void 0 : _order$driver2.photo : order === null || order === void 0 ? void 0 : (_order$business2 = order.business) === null || _order$business2 === void 0 ? void 0 : _order$business2.logo,
    width: 60,
    height: 60,
    style: {
      borderRadius: 10,
      marginRight: 10
    }
  }), /*#__PURE__*/React.createElement(TitleHeader, null, /*#__PURE__*/React.createElement(OText, {
    size: 18
  }, type === USER_TYPE.DRIVER ? order === null || order === void 0 ? void 0 : (_order$driver3 = order.driver) === null || _order$driver3 === void 0 ? void 0 : _order$driver3.name : order === null || order === void 0 ? void 0 : (_order$business3 = order.business) === null || _order$business3 === void 0 ? void 0 : _order$business3.name), /*#__PURE__*/React.createElement(OText, null, t('ONLINE', 'Online')))), /*#__PURE__*/React.createElement(GiftedChat, {
    messages: formattedMessages,
    user: {
      _id: user.id,
      name: user.name,
      avatar: user.photo
    },
    onSend: onSubmit,
    onInputTextChanged: onChangeMessage,
    alignTop: true,
    scrollToBottom: true,
    renderAvatarOnTop: true,
    renderUsernameOnMessage: true,
    renderInputToolbar: renderInputToolbar,
    renderComposer: renderComposer,
    renderSend: renderSend,
    renderActions: renderActions,
    renderBubble: renderBubble,
    renderMessageImage: renderMessageImage,
    scrollToBottomComponent: () => renderScrollToBottomComponent(),
    messagesContainerStyle: {
      paddingBottom: 20
    },
    showAvatarForEveryMessage: true,
    isLoadingEarlier: messages.loading,
    renderLoading: () => /*#__PURE__*/React.createElement(ActivityIndicator, {
      size: "small",
      color: "#000"
    })
  })));
};

const styles = StyleSheet.create({
  containerActions: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    marginBottom: 0
  },
  containerSend: {
    width: 64,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4
  }
});
export const Messages = props => {
  const MessagesProps = { ...props,
    UIComponent: MessagesUI
  };
  return /*#__PURE__*/React.createElement(MessagesController, MessagesProps);
};
//# sourceMappingURL=index.js.map