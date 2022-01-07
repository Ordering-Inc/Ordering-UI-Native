import React, { useState, useEffect, useRef } from 'react';
import {
  Linking,
  Keyboard,
  Platform,
  View,
  KeyboardAvoidingView,
  TextInput
} from 'react-native';
import { useTheme } from 'styled-components/native';
import { useLanguage } from 'ordering-components/native';
import { Content, Timer, TimeField, Header, Action, Comments } from './styles';
import { FloatingButton } from '../FloatingButton';
import { OText, OButton, OTextarea, OIconButton } from '../shared';
import { AcceptOrRejectOrderParams } from '../../types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const AcceptOrRejectOrder = (props: AcceptOrRejectOrderParams) => {
  const {
    customerCellphone,
    loading,
    action,
    handleUpdateOrder,
    actions,
    closeModal,
    orderId,
    notShowCustomerPhone,
    orderTitle,
    appTitle,
  } = props;

  const [, t] = useLanguage();
  const theme = useTheme();
  const scrollViewRef = useRef<any>(null);
  const viewRef = useRef<any>(null);
  const timerRef = useRef() as React.MutableRefObject<TextInput>;
  const textTareaRef = useRef<any>();
  const [hour, setHour] = useState('00');
  const [min, setMin] = useState('00');
  const [time, setTime] = useState('');
  const [comments, setComments] = useState('');
  const [isKeyboardShow, setIsKeyboardShow] = useState(false);
  const { top, bottom } = useSafeAreaInsets()

  let codeNumberPhone, numberPhone, numberToShow;
  const phoneNumber = customerCellphone;
  const titleOrder = t(orderTitle[action]?.key, orderTitle[action]?.text)
  const buttonText = t(orderTitle[action]?.btnKey, orderTitle[action]?.btnText)
  const showTextArea = ['reject', 'deliveryFailed', 'pickupFailed', 'notReady'].includes(action)

  const handleFocus = () => {
    viewRef?.current?.measure((x: any, y: any) => {
      scrollViewRef?.current?.scrollTo({ x: 0, y });
    });
  };

  const handleFocusTimer = () => {
    timerRef?.current?.measure((x: any, y: any) => {
      scrollViewRef?.current?.scrollTo({ x: 0, y });
    });
  };

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

  if (!notShowCustomerPhone) {
    if (phoneNumber) {
      codeNumberPhone = phoneNumber.slice(0, 3);
      numberPhone = phoneNumber.slice(3, phoneNumber?.length);
      numberToShow = `(${codeNumberPhone}) ${numberPhone}`;
    }
  }

  const handleArrowBack: any = () => {
    closeModal(false);
  };

  const handleTime = (e: any) => {
    if (
      e.includes(',') ||
      e.includes('.') ||
      e.includes('-') ||
      e.includes(' ')
    )
      return;

    setTime(e.slice(-4));
    const mins = e.slice(-2);
    const hours = e.slice(-4, -2);

    setMin(mins);
    setHour(hours);
    setTime(`${hours}${mins}`);
  };

  useEffect(() => {
    if (actions && action === 'accept') {
      openTimerIOnput();
    }

    if (actions && showTextArea) {
      openTextTareaOInput();
    }
  }, []);

  const handleFixTime = () => {
    if (min >= '60') {
      setMin('59');
    }

    if (min.length < 2) setMin(`0${min}`);
    if (hour.length < 2) setHour(`0${hour}`);

    if (!hour) setHour('00');
  };

  const openTimerIOnput = () => {
    const isFocus = timerRef.current.isFocused();
    if (isFocus) {
      timerRef.current.blur();
    }

  };

  const openTextTareaOInput = () => {
    const isFocus = textTareaRef.current.isFocused();
    if (isFocus && textTareaRef?.current) {
      textTareaRef.current.blur();
    }

    if (!isFocus && textTareaRef?.current) {
      textTareaRef?.current?.focus?.();
    }
  };

  const handleAcceptOrReject = () => {
    handleFixTime();

    let minsToSend = min;

    if (min > '60') minsToSend = '59';

    const time = parseInt(hour || '0') * 60 + (parseInt(minsToSend) || 0);

    let bodyToSend: any = {};
    const orderStatus: any = {
      acceptByBusiness: {
        prepared_in: time,
        status: 7,
      },
      rejectByBusiness: {
        comment: comments,
        status: 5,
      },
      acceptByDriver: {
        delivered_in: time,
        status: 8,
      },
      rejectByDriver: {
        comment: comments,
        status: 6,
      },
      pickupFailedByDriver: {
        comment: comments,
        status: 10
      },
      deliveryFailedByDriver: {
        comment: comments,
        status: 12
      },
      orderNotReady: {
        comment: comments,
        status: 14
      }
    };

    if (actions && action === 'accept') {
      bodyToSend = orderStatus[actions.accept];
    }
    if (actions && action === 'reject') {
      bodyToSend = orderStatus[actions.reject];
    }
    if (actions && action === 'pickupFailed') {
      bodyToSend = orderStatus[actions.pickupFailed]
    }
    if (actions && action === 'deliveryFailed') {
      bodyToSend = orderStatus[actions.deliveryFailed]
    }
    if (actions && action === 'notReady') {
      bodyToSend = orderStatus[actions.notReady]
    }

    bodyToSend.id = orderId;
    handleUpdateOrder && handleUpdateOrder(bodyToSend.status, bodyToSend);
  };

  useEffect(() => {
    if (actions && action === 'accept') {
      const interval = setTimeout(() => {
        timerRef?.current?.focus?.()
      }, 250)
      return () => {
        clearTimeout(interval)
      }
    }
  }, [timerRef?.current])

  return (
    <KeyboardAvoidingView
      enabled
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, paddingHorizontal: 30, paddingTop: 30, marginTop: top, marginBottom: bottom, justifyContent: 'space-between' }}>
      <View>
        <OIconButton
          icon={theme.images.general.arrow_left}
          borderColor={theme.colors.clear}
          iconStyle={{ width: 20, height: 20 }}
          style={{
            maxWidth: 40,
            height: 35,
            justifyContent: 'flex-end',
            marginBottom: 30,
          }}
          onClick={() => handleArrowBack()}
        />
        <OText
          size={20}
          color={theme.colors.textGray}
          style={{
            fontFamily: 'Poppins',
            fontStyle: 'normal',
          }}
          weight="600">
          {titleOrder}
        </OText>
      </View>
      <Content showsVerticalScrollIndicator={false} ref={scrollViewRef}>
        <Header>
          {action === 'reject' && (
            <>
              {!notShowCustomerPhone && (
                <>
                  <OText
                    size={15}
                    color={theme.colors.textGray}
                    style={{ marginTop: 10 }}>
                    {t(
                      'CALL_YOUR_CUSTOMER_TO_RESOLVE_THE_ISSUE_AS_POLITELY_AS_POSSIBLE',
                      'Call your customer to resolve the issue as politely as possible',
                    )}
                  </OText>

                  {numberToShow ? (
                    <OButton
                      bgColor="transparent"
                      borderColor={theme.colors.primary}
                      textStyle={{
                        color: theme.colors.primary,
                        fontSize: 20,
                      }}
                      style={{
                        borderRadius: 10,
                        marginVertical: 20,
                      }}
                      imgLeftStyle={{
                        resizeMode: 'contain',
                        left: 20,
                        position: 'absolute',
                      }}
                      imgLeftSrc={theme.images.general.cellphone}
                      text={numberToShow}
                      onClick={() =>
                        Linking.openURL(`tel:${customerCellphone}`)
                      }
                    />
                  ) : (
                    <OButton
                      bgColor="transparent"
                      borderColor={theme.colors.primary}
                      textStyle={{
                        color: theme.colors.primary,
                        fontSize: 15,
                      }}
                      style={{
                        borderRadius: 10,
                        marginVertical: 20,
                      }}
                      imgLeftStyle={{
                        resizeMode: 'contain',
                        left: 20,
                        position: 'absolute',
                      }}
                      isDisabled={true}
                      imgLeftSrc={theme.images.general.cellphone}
                      text={t('NOT_NUMBER', "There's not phonenumber.")}
                      onClick={() =>
                        Linking.openURL(`tel:${customerCellphone}`)
                      }
                    />
                  )}
                </>
              )}

              <OText
                size={15}
                color={theme.colors.textGray}
                style={{ marginBottom: 10 }}>
                {t(
                  'MARK_THE_ORDER_AS_REJECTED',
                  'Mark the order as rejected',
                )}
              </OText>

              <OText>
                <OText style={{ fontWeight: '600' }}>
                  {t('NOTE', 'Note')}
                  {': '}
                </OText>

                <OText size={15} color={theme.colors.textGray}>
                  {t(
                    'YOUR_CUSTOMER_WILL_RECEIVE_A_NOTIFICATION_ABOUT_THIS_ACTIONS',
                    'Your customer will receive a notification about this actions',
                  )}
                </OText>
              </OText>
            </>
          )}
        </Header>

        {action === 'accept' && (
          <View style={{ height: 400, justifyContent: 'center' }}>
            <Timer onPress={() => openTimerIOnput()}>
              <OText weight="600" style={{ textAlign: 'center' }} size={55}>
                {hour}
              </OText>
              {hour.length > 0 && <OText size={55}>:</OText>}
              <OText weight="600" style={{ textAlign: 'center' }} size={55}>
                {min}
              </OText>
            </Timer>
          </View>
        )}
        <TimeField
          ref={timerRef}
          keyboardType="numeric"
          value={time}
          placeholder={'00:00'}
          onChangeText={handleTime}
          onPressOut={() => handleFixTime()}
          editable={true}
          selectionColor={theme.colors.primary}
          placeholderTextColor={theme.colors.textGray}
          color={theme.colors.textGray}
          onEndEditing={handleFixTime}
        />

        {showTextArea && (
          <Comments ref={viewRef}>
            <OTextarea
              textTareaRef={textTareaRef}
              autoFocus
              onFocus={handleFocus}
              placeholder={t(
                'PLEASE_TYPE_YOUR_COMMENTS_IN_HERE',
                'Please type your comments in here',
              )}
              value={comments}
              onChange={setComments}
            />
            <View style={{ height: 20 }} />
          </Comments>
        )}
      </Content>

      <Action>
        <FloatingButton
          firstButtonClick={() => {
            handleAcceptOrReject();
          }}
          btnText={buttonText}
          color={action === 'accept' ? theme.colors.green : theme.colors.red}
          widthButton={'100%'}
        />
      </Action>
    </KeyboardAvoidingView>
  );
};
