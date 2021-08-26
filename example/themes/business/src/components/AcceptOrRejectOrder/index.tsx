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
import {
  ToastType,
  useToast,
  useLanguage,
  OrderChange as OrderChangeConTableoller,
} from 'ordering-components/native';
import { Content, Timer, TimeField, Header, Action, Comments } from './styles';
import { FloatingButton } from '../FloatingButton';
import { OText, OButton, OTextarea, OIconButton } from '../shared';
import { AcceptOrRejectOrderParams } from '../../types';
import AwesomeAlert from 'react-native-awesome-alerts';

export const AcceptOrRejectOrderUI = (props: AcceptOrRejectOrderParams) => {
  const { navigation, route, orderState, updateStateOrder } = props;

  const [, { showToast }] = useToast();
  const [, t] = useLanguage();
  const theme = useTheme();
  const timerRef = useRef<any>();
  const [hour, setHour] = useState('00');
  const [min, setMin] = useState('00');
  const [time, setTime] = useState('');
  const [comments, setComments] = useState('');
  const [isKeyboardShow, setIsKeyboardShow] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

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

  const phoneNumber = route?.order?.customer?.cellphone;
  let codeNumberPhone, numberPhone, numberToShow;

  if (phoneNumber) {
    codeNumberPhone = phoneNumber.slice(0, 3);
    numberPhone = phoneNumber.slice(3, phoneNumber?.length);
    numberToShow = `(${codeNumberPhone}) ${numberPhone}`;
  }

  useEffect(() => {
    if (orderState?.order !== null) {
      if (!orderState?.error) {
        showToast(
          ToastType.Success,
          route.action === 'accept'
            ? t('ORDER_ACCEPTED', 'Order Accepted')
            : t('ORDER_REJECTED', 'Order Rejected'),
        );
        handleArrowBack();
      }

      if (orderState?.error) {
        showToast(ToastType.Error, orderState.order[0]);
      }
    }
  }, [orderState?.order]);

  const handleArrowBack: any = () => {
    navigation?.canGoBack() && navigation.goBack();
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
    setShowAlert(false);

    updateStateOrder &&
      updateStateOrder({
        hour,
        min: minsToSend,
        comments,
        action:
          route?.action === 'accept' ? 'acceptByBusiness' : 'rejectByBusiness',
        orderId: route?.order?.id,
      });
  };

  const cancelRequest = () => {
    handleFixTime();
    setShowAlert(false);
  };

  return (
    <>
      {orderState?.loading && (
        <View
          style={{
            padding: 40,
            flex: 1,
            backgroundColor: theme.colors.backgroundLight,
            justifyContent: 'space-between',
          }}>
          {route.action === 'accept' ? (
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

      {!orderState?.loading && (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}>
          <Content>
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
                {route.action === 'accept'
                  ? `${t('PREPARATION_TIME', 'Preparation time')}:`
                  : t('REJECT_ORDER', 'Reject Order')}
              </OText>

              {route.action === 'reject' && (
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
                      textStyle={{ color: theme.colors.primary, fontSize: 20 }}
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
                        Linking.openURL(`tel:${route.order.customer.cellphone}`)
                      }
                    />
                  ) : (
                    <OButton
                      bgColor="transparent"
                      borderColor={theme.colors.primary}
                      textStyle={{ color: theme.colors.primary, fontSize: 15 }}
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
                        Linking.openURL(`tel:${route.order.customer.cellphone}`)
                      }
                    />
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

            {route.action === 'accept' && (
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

            {route.action === 'reject' && (
              <Comments>
                <OTextarea
                  placeholder={t(
                    'PLEASE_TYPE_YOUR_COMMENTS_IN_HERE',
                    'Please type your comments in here',
                  )}
                  value={comments}
                  onChange={setComments}
                />
              </Comments>
            )}
          </Content>

          <Action
            style={{
              marginBottom: Platform.OS === 'ios' && isKeyboardShow ? 30 : 0,
            }}>
            <FloatingButton
              firstButtonClick={() => setShowAlert(true)}
              btnText={
                route.action === 'accept'
                  ? t('ACCEPT', 'Accept')
                  : t('REJECT', 'Reject')
              }
              color={
                route.action === 'accept'
                  ? theme.colors.green
                  : theme.colors.red
              }
            />
          </Action>
          <AwesomeAlert
            show={showAlert}
            showProgress={false}
            title={t('BUSINESS_APP', 'Business app')}
            message={t(
              `ARE_YOU_SURE_THAT_YOU_WANT_TO_${
                route.action === 'accept' ? 'ACCEPT' : 'REJECT'
              }_THIS_ORDER`,
              `Are you sure that you want to ${
                route.action === 'accept' ? 'accept' : 'reject'
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

export const AcceptOrRejectOrder = (props: AcceptOrRejectOrderParams) => {
  const acceptOrRejectOrderProps = {
    ...props,
    UIComponent: AcceptOrRejectOrderUI,
  };

  return <OrderChangeConTableoller {...acceptOrRejectOrderProps} />;
};
