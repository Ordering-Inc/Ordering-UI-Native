import React, { useState, useEffect, useRef } from 'react';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {
  Linking,
  Keyboard,
  Platform,
  View,
  KeyboardAvoidingView,
  TextInput,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { useTheme } from 'styled-components/native';
import SelectDropdown from 'react-native-select-dropdown'
import { useLanguage } from 'ordering-components/native';
import { Content, Timer, TimeField, Header, Comments, CommentsButtonGroup, TopActions } from './styles';
import { OText, OButton, OTextarea, OIcon } from '../shared';
import { AcceptOrRejectOrderParams } from '../../types';

import { orderCommentList } from '../../../../../src/utils'

export const AcceptOrRejectOrder = (props: AcceptOrRejectOrderParams) => {
  const {
    isPage,
    customerCellphone,
    action,
    handleUpdateOrder,
    actions,
    closeModal,
    orderId,
    notShowCustomerPhone,
    orderTitle,
    appTitle,
    isLoadingOrder
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
  const [rejectReason, setRejectReason] = useState(null);
  const [keyboardState, setKeyboardState] = useState({ show: false, height: 0 });

  const isDriverApp = appTitle?.key === 'DELIVERY_APP'
  const orderCommentsList = orderCommentList(action)

  let codeNumberPhone, numberPhone, numberToShow;
  const phoneNumber = customerCellphone;
  const titleOrder = t(orderTitle[action]?.key, orderTitle[action]?.text)
  const buttonText = t(orderTitle[action]?.btnKey, orderTitle[action]?.btnText)
  const showTextArea = ['reject', 'deliveryFailed', 'pickupFailed', 'notReady', 'forcePickUp', 'forceDelivery'].includes(action)

  const styles = StyleSheet.create({
    selectOption: {
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: 40,
      width: '100%',
      paddingHorizontal: 15,
      backgroundColor: theme.colors.inputChat,
      borderRadius: 7.6,
    },
    buttonTextStyle: {
      textAlign: 'left',
      marginHorizontal: 0,
      fontSize: 16,
      lineHeight: 24,
      color: '#748194',
      textTransform: 'capitalize'
    },
    dropdownStyle: {
      borderWidth: 1,
      borderRadius: 8,
      paddingTop: 5,
      backgroundColor: '#fff',
      borderColor: theme.colors.lightGray,
      overflow: 'hidden',
      minHeight: 120
    },
    rowStyle: {
      display: 'flex',
      borderBottomWidth: 0,
      height: 36,
      alignItems: 'center',
      paddingHorizontal: 10
    },
    parent: {
      flex: 1,
      backgroundColor: theme.colors.backgroundPage,
    },
    upper: {
      flex: 1,
      zIndex: 1001,
      paddingTop: isPage ? 30 : 40,
      marginBottom: 10,
      backgroundColor: theme.colors.backgroundPage
    },
    bottomParent: {
      justifyContent: "center",
      paddingHorizontal: 30,
      alignItems: "center",
      width: '100%',
      height: 45,
    },
    bottom: {
      textAlignVertical: "center",
      textAlign: "center",
    },
    btnBackArrow: {
      borderWidth: 0,
      width: 32,
      height: 32,
      tintColor: theme.colors.textGray,
      backgroundColor: theme.colors.clear,
      borderColor: theme.colors.clear,
      shadowColor: theme.colors.clear,
      paddingLeft: 0,
      paddingRight: 0
    },
  })

  const handleFocus = () => {
    viewRef?.current?.measure((x: any, y: any) => {
      scrollViewRef?.current?.scrollTo({ x: 0, y });
    });
  };

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
    const isFocus = timerRef.current?.isFocused();
    if (isFocus) {
      timerRef.current?.blur();
    }

  };

  const openTextTareaOInput = () => {
    const isFocus = textTareaRef.current?.isFocused();
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
        reasons: comments,
        status: 5,
      },
      acceptByDriver: {
        delivered_in: time,
        status: 8,
      },
      rejectByDriver: {
        reasons: comments,
        status: 6,
        reject_reason: rejectReason
      },
      pickupFailedByDriver: {
        reasons: comments,
        status: 10,
        reject_reason: rejectReason
      },
      deliveryFailedByDriver: {
        reasons: comments,
        status: 12,
        reject_reason: rejectReason
      },
      orderNotReady: {
        reasons: comments,
        status: 14,
        reject_reason: rejectReason
      },
      forcePickUp: {
        reasons: comments,
        status: 9,
        reject_reason: rejectReason
      },
      forceDelivery: {
        reasons: comments,
        status: 11,
        reject_reason: rejectReason
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
    if (actions && action === 'forcePickUp') {
      bodyToSend = orderStatus[actions.forcePickUp]
    }
    if (actions && action === 'forceDelivery') {
      bodyToSend = orderStatus[actions.forceDelivery]
    }

    bodyToSend.id = orderId;
    handleUpdateOrder?.(bodyToSend.status, bodyToSend);
  };

  useEffect(() => {
    if (actions && action === 'accept') {
      const interval = setTimeout(() => {
        timerRef?.current?.focus?.()
      }, 200)
      return () => {
        clearTimeout(interval)
      }
    }
  }, [timerRef?.current])

  useEffect(() => {
    const keyboardDidShowListener =
      Keyboard.addListener('keyboardDidShow', (e) => setKeyboardState({
        show: true,
        height: e.endCoordinates.height > 100
          ? Platform.OS == 'ios' ? e.endCoordinates.height : 0 : 0
      }))
    const keyboardDidHideListener =
      Keyboard.addListener('keyboardDidHide', () => setKeyboardState({ show: false, height: 0 }))
    return () => {
      keyboardDidShowListener.remove()
      keyboardDidHideListener.remove()
    }
  }, [])

  return (
    <KeyboardAvoidingView
      enabled
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View style={styles.parent}>
        <View style={styles.upper}>
          <TopActions>
            <TouchableOpacity onPress={() => handleArrowBack()} style={styles.btnBackArrow}>
              <OIcon src={theme.images.general.arrow_left} color={theme.colors.textGray} />
            </TouchableOpacity>
            <OText
              size={20}
              color={theme.colors.textGray}
              style={{
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                marginBottom: 10,
              }}
              weight="600">
              {titleOrder}
            </OText>
          </TopActions>
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

                      {!!numberToShow ? (
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
              <View style={{ height: 300, justifyContent: 'center' }}>
                <Timer onPress={() => openTimerIOnput()}>
                  <View>
                    <OText weight="600" size={55}>
                      {hour}
                    </OText>
                    <OText style={{ marginLeft: 10 }}>{t('HOURS', 'Hours')}</OText>
                  </View>
                  {hour.length > 0 && <OText size={55} style={{ marginBottom: 30 }}>:</OText>}
                  <View>
                    <OText weight="600" size={55}>
                      {min}
                    </OText>
                    <OText style={{ marginLeft: 10 }}>{t('MINUTES', 'Minutes')}</OText>
                  </View>
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
              onSubmitEditing={() => handleAcceptOrReject()}
              onBlur={() => actions && action === 'accept' && timerRef?.current?.focus?.()}
            />

            {orderCommentsList && isDriverApp && (
              <CommentsButtonGroup>
                <SelectDropdown
                  defaultButtonText={t('REJECT_REASONS_OPTIONS', 'Reject reasons')}
                  data={orderCommentsList?.list}
                  onSelect={(selectedItem) => {
                    setRejectReason(selectedItem?.value)
                  }}
                  buttonTextAfterSelection={(selectedItem) => selectedItem.content}
                  rowTextForSelection={(item) => item.key}
                  buttonStyle={styles.selectOption}
                  buttonTextStyle={styles.buttonTextStyle}
                  renderDropdownIcon={isOpened => {
                    return <FeatherIcon name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#444'} size={18} />;
                  }}
                  dropdownStyle={styles.dropdownStyle}
                  dropdownOverlayColor='transparent'
                  rowStyle={styles.rowStyle}
                  renderCustomizedRowChild={(item) => {
                    return (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center'
                        }}
                      >
                        <View>
                          <OText
                            size={14}
                            color={'#748194'}
                            style={{ textTransform: 'capitalize' }}
                          >
                            {item?.content}
                          </OText>
                        </View>
                      </View>
                    );
                  }}
                />
              </CommentsButtonGroup>
            )}

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
              </Comments>
            )}
          </Content>
        </View>
        <View
          style={{
            ...styles.bottomParent,
            marginBottom: Platform.OS === 'ios'
              ? 30 : (keyboardState.height === 0)
                ? isPage ? 0 : 40
                : keyboardState.height - (isPage ? 20 : -10)
          }}
        >
          <OButton
            text={buttonText}
            bgColor={action === 'accept' ? theme.colors.green : theme.colors.red}
            borderColor={action === 'accept' ? theme.colors.green : theme.colors.red}
            imgRightSrc={null}
            style={{ borderRadius: 7, height: 45 }}
            parentStyle={{ width: '100%' }}
            textStyle={{ color: '#FFF', fontSize: 18 }}
            isDisabled={(showTextArea && !comments) || isLoadingOrder}
            onClick={() => handleAcceptOrReject()}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
