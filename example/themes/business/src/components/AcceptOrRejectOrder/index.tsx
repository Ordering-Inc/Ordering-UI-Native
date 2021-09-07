import React, { useState, useEffect, useRef } from 'react';
import {
  Linking,
  Keyboard,
  Platform,
  View,
  KeyboardAvoidingView,
} from 'react-native';
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder';
import { useTheme } from 'styled-components/native';
import { useLanguage } from 'ordering-components/native';
import { Content, Timer, TimeField, Header, Action, Comments } from './styles';
import { FloatingButton } from '../FloatingButton';
import { OText, OButton, OTextarea, OIconButton } from '../shared';
import { AcceptOrRejectOrderParams } from '../../types';
import AwesomeAlert from 'react-native-awesome-alerts';

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
    titleAccept,
    titleReject,
    appTitle,
  } = props;

  const [, t] = useLanguage();
  const theme = useTheme();
  const scrollViewRef = useRef<any>(null);
  const viewRef = useRef<any>(null);
  const timerRef = useRef<any>();
  const [hour, setHour] = useState('00');
  const [min, setMin] = useState('00');
  const [time, setTime] = useState('');
  const [comments, setComments] = useState('');
  const [isKeyboardShow, setIsKeyboardShow] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isColorAwesomeAlert, setIsColorAwesomeAlert] = useState(false);
  const phoneNumber = customerCellphone;
  let codeNumberPhone, numberPhone, numberToShow;

  const handleFocus = () => {
    viewRef?.current?.measure((x: any, y: any) => {
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

    if (!isFocus) {
      if (time.length > 1) timerRef.current.clear();
      timerRef.current.focus();
    }
  };

  const handleAcceptOrReject = () => {
    handleFixTime();

    let minsToSend = min;

    if (min > '60') minsToSend = '59';
    setIsColorAwesomeAlert(false);
    setShowAlert(false);

    const time = parseInt(hour) * 60 + parseInt(min);
    let bodyToSend;
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
    };

    if (actions && action === 'accept') {
      bodyToSend = orderStatus[actions.accept];
    }
    if (actions && action === 'reject') {
      bodyToSend = orderStatus[actions.reject];
    }

    bodyToSend.id = orderId;

    handleUpdateOrder && handleUpdateOrder(bodyToSend.status, bodyToSend);
  };

  const cancelRequest = () => {
    handleFixTime();
    setIsColorAwesomeAlert(false);
    setShowAlert(false);
  };

  return (
    <>
      {loading && (
        <View
          style={{
            padding: 40,
            flex: 1,
            backgroundColor: theme.colors.backgroundLight,
            justifyContent: 'space-between',
          }}>
          {action === 'accept' ? (
            <>
              <Placeholder Animation={Fade}>
                <PlaceholderLine width={70} />
              </Placeholder>

              <Placeholder Animation={Fade}>
                <PlaceholderLine
                  style={{
                    width: 245,
                    height: 245,
                    borderRadius: 123,
                    alignSelf: 'center',
                  }}
                />
              </Placeholder>

              <Placeholder Animation={Fade}>
                <PlaceholderLine
                  width={90}
                  style={{ borderRadius: 7.8, alignSelf: 'center', height: 40 }}
                />
              </Placeholder>
            </>
          ) : (
            <>
              <Placeholder Animation={Fade}>
                <PlaceholderLine width={90} />
                <PlaceholderLine width={60} />
              </Placeholder>

              <Placeholder Animation={Fade}>
                <PlaceholderLine
                  width={100}
                  style={{ borderRadius: 7.8, height: 40 }}
                />
                <PlaceholderLine width={40} />
                <PlaceholderLine width={50} />
                <PlaceholderLine width={50} />
                <PlaceholderLine
                  width={100}
                  style={{ borderRadius: 7.8, height: 140 }}
                />
              </Placeholder>

              <Placeholder Animation={Fade}>
                <PlaceholderLine
                  width={90}
                  style={{ borderRadius: 7.8, alignSelf: 'center', height: 40 }}
                />
              </Placeholder>
            </>
          )}
        </View>
      )}

      {!loading && (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}>
          <Content ref={scrollViewRef}>
            <Header>
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

              <OText size={20} color={theme.colors.textGray} weight="bold">
                {action === 'accept'
                  ? `${t(titleAccept?.key, titleAccept?.text)}:`
                  : t(titleReject?.key, titleReject?.text)}
              </OText>

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
                    <OText style={{ fontWeight: 'bold' }}>
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
              <Timer onPress={() => openTimerIOnput()}>
                <OText weight="bold" style={{ textAlign: 'center' }} size={55}>
                  {hour}
                </OText>
                {hour.length > 0 && <OText size={55}>:</OText>}
                <OText weight="bold" style={{ textAlign: 'center' }} size={55}>
                  {min}
                </OText>
              </Timer>
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

            {action === 'reject' && (
              <Comments ref={viewRef}>
                <OTextarea
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

          <Action
            style={{
              marginBottom: isKeyboardShow
                ? Platform.OS === 'ios'
                  ? 0
                  : 10
                : 0,
            }}>
            <FloatingButton
              firstButtonClick={() => {
                setIsColorAwesomeAlert(true);
                setShowAlert(true);
              }}
              btnText={
                action === 'accept'
                  ? t('ACCEPT', 'Accept')
                  : t('REJECT', 'Reject')
              }
              color={
                action === 'accept' ? theme.colors.green : theme.colors.red
              }
            />
          </Action>
          <AwesomeAlert
            show={showAlert}
            showProgress={false}
            title={t(appTitle?.key, appTitle?.text)}
            message={t(
              `ARE_YOU_SURE_THAT_YOU_WANT_TO_${
                action === 'accept' ? 'ACCEPT' : 'REJECT'
              }_THIS_ORDER`,
              `Are you sure that you want to ${
                action === 'accept' ? 'accept' : 'reject'
              } this order?`,
            )}
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
            showConfirmButton
            showCancelButton
            cancelText={t('CANCEL', 'Cancel')}
            confirmText={t('ACCEPT', 'Accept')}
            confirmButtonColor={theme.colors.primary}
            cancelButtonColor={theme.colors.inputhat}
            onCancelPressed={() => cancelRequest()}
            onConfirmPressed={() => handleAcceptOrReject()}
          />
        </KeyboardAvoidingView>
      )}
    </>
  );
};
