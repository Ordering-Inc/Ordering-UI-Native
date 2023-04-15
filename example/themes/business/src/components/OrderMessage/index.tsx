import React, { useState, useEffect } from 'react';
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder';
import { Chat } from '../Chat';
import { StyleSheet, View, BackHandler, TouchableOpacity } from 'react-native';
import {
  useLanguage,
  OrderDetails as OrderDetailsController,
  useSession,
} from 'ordering-components/native';
import { useUtils } from 'ordering-components/native';

import { OIcon, OText } from '../shared';
import { OrderDetailsParams } from '../../types';
import { USER_TYPE } from '../../config/constants';
import { useTheme } from 'styled-components/native';
import Alert from '../../providers/AlertProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const OrderMessageUI = (props: OrderDetailsParams) => {
  const {
    navigation,
    messages,
    setMessages,
    readMessages,
    messagesReadList,
    setOrders,
  } = props;

  const [{ optimizeImage }] = useUtils();
  const theme = useTheme();
  const [, t] = useLanguage();
  const [openModalForBusiness, setOpenModalForBusiness] = useState(true);
  const [unreadAlert, setUnreadAlert] = useState({
    business: false,
    driver: false,
  });
  const { top } = useSafeAreaInsets();
  const [{ user }] = useSession();
  const { order, loading } = props.order;
  const [alertState, setAlertState] = useState<{
    open: boolean;
    content: Array<string>;
    key?: string | null;
  }>({ open: false, content: [], key: null });

  useEffect(() => {
    if (order?.driver === null && user.level === 4) {
      setAlertState({
        open: true,
        content: [
          t(
            'YOU_HAVE_BEEN_REMOVED_FROM_THE_ORDER',
            'You have been removed from the order',
          ),
        ],
        key: null,
      });
    }
  }, [order?.driver]);

  const handleArrowBack = (): boolean => {
    if (order?.unread_count !== undefined) {
      setOrders?.((prevOrders: any) => {
        const { data } = prevOrders;

        const updateOrder = data?.find((_order: any, index: number) => {
          if (_order.id === order?.id) {
            _order.unread_count = 0;
            data.splice(index, 1, _order);
            return true;
          }

          return false;
        });

        if (updateOrder) {
          return { ...prevOrders, data };
        }

        return prevOrders;
      });

      readMessages?.();
    }

    navigation?.canGoBack() && navigation.goBack();

    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleArrowBack);

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', handleArrowBack);
  }, [order?.unread_count, messages?.messages]);

  const backIfDriverDoesntExist = () => {
    navigation?.canGoBack() && navigation.goBack();
  };

  useEffect(() => {
    if (messagesReadList?.length) {
      openModalForBusiness
        ? setUnreadAlert({ ...unreadAlert, business: false })
        : setUnreadAlert({ ...unreadAlert, driver: false });
    }
  }, [messagesReadList]);

  const styles = StyleSheet.create({
    titleSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 30,
      paddingTop: 30,
      paddingBottom: 25,
      borderBottomWidth: 2,
      borderBottomColor: '#e6e6e6',
    },
    titleGroups: {
      alignItems: 'center',
      flexDirection: 'row',
    },
    titleIcons: {
      height: 33,
      width: 33,
      borderRadius: 7.6,
      resizeMode: 'stretch',
    },
    shadow: {
      height: 34,
      width: 34,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 15,
      backgroundColor: theme.colors.clear,
      paddingHorizontal: 3,
      borderRadius: 7.6,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 3,
    },
    modalText: {
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: '600',
      color: theme.colors.textGray,
      textAlign: 'center',
      zIndex: 10,
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
      paddingRight: 0,
      marginTop: 10
    },
  });

  return (
    <>
      {(!order || Object.keys(order).length === 0 || loading) && (
        <View
          style={{
            padding: 40,
            flex: 1,
            backgroundColor: theme.colors.backgroundLight,
            justifyContent: 'space-between',
          }}>
          <Placeholder>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <PlaceholderLine width={40} />
              <PlaceholderLine
                width={20}
                style={{
                  marginLeft: 20,
                  borderRadius: 50,
                  width: 40,
                  height: 40,
                }}
              />
              <PlaceholderLine
                width={20}
                style={{
                  marginLeft: 10,
                  borderRadius: 50,
                  width: 40,
                  height: 40,
                }}
              />
              <PlaceholderLine
                width={20}
                style={{
                  marginLeft: 10,
                  borderRadius: 50,
                  width: 40,
                  height: 40,
                }}
              />
            </View>
          </Placeholder>

          <Placeholder>
            <View style={{ flexDirection: 'column' }}>
              <PlaceholderLine width={60} />
              <PlaceholderLine width={40} />
              <PlaceholderLine width={20} />
              <PlaceholderLine width={20} />
            </View>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
              }}>
              <PlaceholderLine width={60} />
              <PlaceholderLine width={40} />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <PlaceholderLine
                width={20}
                style={{
                  marginLeft: 20,
                  borderRadius: 50,
                  width: 50,
                  height: 50,
                }}
              />
              <PlaceholderLine
                width={20}
                style={{
                  marginLeft: 20,
                  borderRadius: 50,
                  width: 50,
                  height: 50,
                }}
              />
            </View>
            <PlaceholderLine width={100} />
            <PlaceholderLine
              width={100}
              style={{ borderRadius: 50, width: '100%', height: 30 }}
            />
          </Placeholder>
        </View>
      )}

      {order && Object.keys(order).length > 0 && !loading && (
        <>
          <View style={styles.titleSection}>
            <View style={styles.titleGroups}>
              <TouchableOpacity onPress={() => handleArrowBack()} style={styles.btnBackArrow}>
                <OIcon src={theme.images.general.arrow_left} color={theme.colors.textGray} />
              </TouchableOpacity>

              <OText size={16} style={styles.modalText} adjustsFontSizeToFit>
                {`${t('INVOICE_ORDER_NO', 'Order No.')} ${order?.id}`}
              </OText>
            </View>

            <View style={styles.titleGroups}>
              <View style={styles.shadow}>
                {!!order?.business?.logo ? (
                  <OIcon
                    url={optimizeImage(order?.business?.logo, 'h_300,c_limit')}
                    style={styles.titleIcons}
                  />
                ) : (
                  <OIcon
                    src={theme.images.dummies.businessLogo}
                    style={styles.titleIcons}
                  />
                )}
              </View>

              <View style={styles.shadow}>
                <OIcon
                  url={optimizeImage(
                    order?.customer?.photo ||
                    theme?.images?.dummies?.customerPhoto,
                    'h_300,c_limit',
                  )}
                  style={styles.titleIcons}
                />
              </View>

              {order?.driver && (
                <View style={styles.shadow}>
                  <OIcon
                    url={
                      optimizeImage(order?.driver?.photo, 'h_300,c_limit') ||
                      theme?.images?.dummies?.driverPhoto
                    }
                    style={styles.titleIcons}
                  />
                </View>
              )}
            </View>
          </View>

          <Chat
            type={openModalForBusiness ? USER_TYPE.BUSINESS : USER_TYPE.DRIVER}
            orderId={order?.id}
            messages={messages}
            order={order}
            setMessages={setMessages}
          />

          <Alert
            open={alertState.open}
            onAccept={backIfDriverDoesntExist}
            onClose={backIfDriverDoesntExist}
            content={alertState.content}
            title={t('ERROR', 'Error')}
          />
        </>
      )}
    </>
  );
};

export const OrderMessage = (props: OrderDetailsParams) => {
  const orderDetailsProps = {
    ...props,
    driverAndBusinessId: true,
    UIComponent: OrderMessageUI,
  };
  return <OrderDetailsController {...orderDetailsProps} />;
};
