import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { StarPRNT } from 'react-native-star-prnt';
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder';
import { useTheme } from 'styled-components/native';
import {
  ToastType,
  useToast,
  useLanguage,
  OrderDetails as OrderDetailsController,
  useUtils,
  useConfig,
  useSession,
} from 'ordering-components/native';
import {
  OrderDetailsContainer,
  Pickup,
  AssignDriver,
  DriverItem,
} from './styles';
import { AcceptOrRejectOrder } from '../AcceptOrRejectOrder';
import { Chat } from '../Chat';
import { FloatingButton } from '../FloatingButton';
import { GoogleMap } from '../GoogleMap';
import { OButton, OModal, OText, OIcon } from '../shared';
import { OrderDetailsParams } from '../../types';
import { verifyDecimals, getProductPrice, getOrderStatus } from '../../utils';
import { USER_TYPE } from '../../config/constants';
import CountryPicker from 'react-native-country-picker-modal';
import { NotFoundSource } from '../NotFoundSource';
import { OrderHeaderComponent } from './OrderHeaderComponent';
import { OrderContentComponent } from './OrderContentComponent';
import { _retrieveStoreData } from '../../providers/StoreUtil'
import { usePrinterCommands } from './usePrinterCommands'

export const OrderDetailsUI = (props: OrderDetailsParams) => {
  const {
    navigation,
    messages,
    setMessages,
    readMessages,
    messagesReadList,
    handleAssignDriver,
    handleChangeOrderStatus,
    isFromCheckout,
    driverLocation,
    actions,
    orderTitle,
    appTitle,
  } = props;

  const theme = useTheme();
  const [, t] = useLanguage();
  const [{ parsePrice, parseNumber, parseDate }] = useUtils();
  const [{ user, token }] = useSession();
  const [{ configs }] = useConfig();
  const { generateCommands } = usePrinterCommands()
  const [, { showToast }] = useToast();
  const [unreadAlert, setUnreadAlert] = useState({
    business: false,
    driver: false,
  });
  const { order, businessData, loading, error } = props.order;
  const { drivers, loadingDriver } = props.drivers;
  const itemsDrivers: any = [];
  const [actionOrder, setActionOrder] = useState('');
  const [openModalForBusiness, setOpenModalForBusiness] = useState(false);
  const [openModalForAccept, setOpenModalForAccept] = useState(false);
  const [openModalForMapView, setOpenModalForMapView] = useState(false);
  const [isDriverModalVisible, setIsDriverModalVisible] = useState(false);
  const [printerSettings, setPrinterSettings] = useState('')

  if (order?.status === 7 || order?.status === 4) {
    if (drivers?.length > 0 && drivers) {
      drivers.forEach((driver: any) => {
        itemsDrivers.push({
          available: driver?.available,
          key: driver?.id,
          value: driver?.id,
          label: driver?.name,
        });
      });

      if (
        !drivers?.some((driver: any) => driver?.id === order?.driver?.id) &&
        order?.driver?.id
      ) {
        itemsDrivers.push({
          available: order?.driver?.available,
          key: order?.driver?.id,
          value: order?.driver?.id,
          label: order?.driver?.name,
        });
      }
    }

    if (order?.driver && (!drivers?.length || drivers?.length === 0)) {
      itemsDrivers.push({
        available: order?.driver?.available,
        key: order?.driver?.id,
        value: order?.driver?.id,
        label: order?.driver?.name,
      });
    }

    if (order?.driver) {
      itemsDrivers.push({
        available: true,
        key: null,
        value: null,
        label: t('UNASSIGN_DRIVER', 'Unassign Driver'),
      });
    }

    if (itemsDrivers.length > 0) {
      itemsDrivers.sort((a: any, b: any) => {
        if (a.available > b.available) return -1;
      });
    }
  }

  const getFormattedSubOptionName = ({ quantity, name, position, price }: any) => {
    if (name !== 'No') {
      const pos = position && position !== 'whole' ? `(${t(position.toUpperCase(), position)})` : '';
      return pos
        ? `${quantity} x ${name} ${pos} +${parsePrice(price)}\n`
        : `${quantity} x ${name} +${parsePrice(price)}\n`;
    } else {
      return 'No\n';
    }
  };

  const handleCopyClipboard = () => {
    const businessName = !!order?.business?.name
      ? `${order?.business?.name} \n`
      : '';

    const businessEmail = !!order?.business?.email
      ? `${order?.business?.email} \n`
      : '';

    const businessCellphone = !!order?.business?.cellphone
      ? `${order?.business?.cellphone} \n`
      : '';

    const businessPhone = !!order?.business?.phone
      ? `${order?.business?.phone} \n`
      : '';

    const businessAddress = !!order?.business?.address
      ? `${order?.business?.address} \n`
      : '';

    const businessSpecialAddress = !!order?.business?.address_notes
      ? `${order?.business?.address_notes} \n \n`
      : '';

    const customerName = !!order?.customer?.name
      ? `${order?.customer?.name} ${order?.customer?.middle_name || ''} ${order?.customer?.lastname || ''
      } ${order?.customer?.second_lastname || ''} \n`
      : '';

    const customerEmail = !!order?.customer.email
      ? `${order?.customer.email} \n`
      : '';

    const customerCellPhone = !!order?.customer?.cellphone
      ? `${order?.customer?.cellphone} \n`
      : '';

    const customerPhone = !!order?.customer?.phone
      ? `${order?.customer?.phone} \n`
      : '';

    const customerAddress = !!order?.customer?.address
      ? `${order?.customer?.address} \n`
      : '';

    const customerSpecialAddress = !!order?.customer?.address_notes
      ? `${order?.customer?.address_notes} \n`
      : '';

    const payment = order?.paymethod?.name
      ? `${order?.paymethod?.name} - ${order.delivery_type === 1
        ? t('DELIVERY', 'Delivery')
        : order.delivery_type === 2
          ? t('PICKUP', 'Pickup')
          : order.delivery_type === 3
            ? t('EAT_IN', 'Eat in')
            : order.delivery_type === 4
              ? t('CURBSIDE', 'Curbside')
              : t('DRIVER_THRU', 'Driver thru')
      }\n`
      : '';

    const getSuboptions = (suboptions: any) => {
      const array: any = []
      suboptions?.length > 0 &&
        suboptions?.map((suboption: any) => {
          const string = `${getFormattedSubOptionName(suboption)}`
          array.push(string)
        })

      return array.join('')
    }

    const getOptions = (options: any, productComment: string = '') => {
      const array: any = [];

      options?.length &&
        options?.map((option: any) => {
          const string =
            `  ${option.name}\n    ${getSuboptions(option.suboptions)}`;

          array.push(string)
        })

      if (productComment) {
        array.push(`  ${t('COMMENT', 'Comment')}\n    ${productComment}\n`)
      }

      return array.join('')
    }

    const productsInArray =
      order?.products.length &&
      order?.products.map((product: any, i: number) => {
        const string =
          `${product?.quantity} X ${product?.name} ${parsePrice(product.total ?? getProductPrice(product))}\n${getOptions(product.options, product.comment)}`;

        return i === 0 ? ` ${string}` : string
      });

    const productsInString = productsInArray.join(' ');
    const orderDetails = `${t(
      'ORDER_DETAILS',
      'Order Details',
    )}:\n${productsInString}\n`;

    const subtotal = `${t('SUBTOTAL', 'Subtotal')}: ${parsePrice(
      order?.subtotal,
    )}\n`;

    const drivertip = `${t('DRIVER_TIP', 'Driver tip')} ${parsePrice(
      order?.summary?.driver_tip || order?.totalDriverTip,
    )}\n`;

    const deliveryFee = `${t('DELIVERY_FEE', 'Delivery fee')} ${verifyDecimals(
      order?.service_fee,
      parseNumber,
    )}% ${parsePrice(order?.summary?.service_fee || order?.serviceFee || 0)}\n`;

    const total = `${t('TOTAL', 'Total')} ${parsePrice(
      order?.summary?.total || order?.total,
    )}\n`;

    const orderStatus = `${t('INVOICE_ORDER_NO', 'Order No.')} ${order.id} ${t(
      'IS',
      'is',
    )} ${getOrderStatus(order?.status, t)?.value}\n`;

    Clipboard.setString(
      `${orderStatus} ${payment} ${t(
        'BUSINESS_DETAILS',
        'Business Details',
      )}\n ${businessName} ${businessEmail} ${businessCellphone} ${businessPhone} ${businessAddress} ${businessSpecialAddress}${t(
        'CUSTOMER_DETAILS',
        'Customer Details',
      )}\n ${customerName} ${customerEmail} ${customerCellPhone} ${customerPhone} ${customerAddress} ${customerSpecialAddress}\n${orderDetails} ${subtotal} ${drivertip} ${deliveryFee} ${total}`,
    );

    showToast(
      ToastType.Info,
      t('COPY_TO_CLIPBOARD', 'Copy to clipboard.'),
      1000,
    );
  };

  const handleOpenMessagesForBusiness = () => {
    setOpenModalForBusiness(true);
    readMessages && readMessages();
    setUnreadAlert({ ...unreadAlert, business: false });
  };

  const handleViewActionOrder = (action: string) => {
    if (openModalForMapView) {
      setOpenModalForMapView(false);
    }
    setActionOrder(action);
    setOpenModalForAccept(true);
  };

  const printAction = async (printerSettings: any, commands: any) => {
    try {
      var printResult = await StarPRNT.print(printerSettings?.emulation, commands, printerSettings?.portName);
      Alert.alert(
        t('PRINT_SUCCESS_TITLE', 'Print Success'),
        t('PRINT_SUCCESS_SUBTITLE', `Go check your _printer_ printer!`).replace('_printer_', printerSettings?.model),
        [
          {text: 'OK', onPress: () => null},
        ],
        { cancelable: false }
      )
    } catch (e) {
      Alert.alert(
        t('PRINT_FAIL_TITLE', 'Connection Failed'),
        t('PRINT_FAIL_SUBTITLE', 'Make sure your Star Printer is turned on and have thermal paper in it.'),
        [
          {text: 'OK', onPress: () => null},
        ],
        { cancelable: false }
      )
    }
  }

  const handleViewSummaryOrder = () => {
    if (printerSettings) {
      const commands: any = generateCommands({
        ...order,
        orderStatus: getOrderStatus(order?.status, t)?.value
      })
      commands.push({ appendCutPaper: StarPRNT.CutPaperAction.PartialCutWithFeed })

      printAction(printerSettings, commands)
      return
    }
    navigation?.navigate &&
      navigation.navigate('OrderSummary', {
        order,
        orderStatus: getOrderStatus(order?.status, t)?.value,
      });
  };

  const handleCloseModal = () => {
    setOpenModalForBusiness(false);
  };

  const handleOpenMapView = () => {
    setOpenModalForMapView(!openModalForMapView);
  };

  const handleArrowBack: any = () => {
    navigation?.canGoBack() && navigation.goBack();
  };

  useEffect(() => {
    if (messagesReadList?.length) {
      openModalForBusiness
        ? setUnreadAlert({ ...unreadAlert, business: false })
        : setUnreadAlert({ ...unreadAlert, driver: false });
    }
  }, [messagesReadList]);

  let locations = [
    {
      ...order?.driver?.location,
      title: order?.driver?.name ?? t('DRIVER', 'Driver'),
      icon:
        order?.driver?.photo ||
        'https://res.cloudinary.com/demo/image/fetch/c_thumb,g_face,r_max/https://www.freeiconspng.com/thumbs/driver-icon/driver-icon-14.png',
      level: 4,
    },
    {
      ...order?.business?.location,
      title: order?.business?.name,
      address: {
        addressName: order?.business?.address,
        zipcode: order?.business?.zipcode
      },
      icon: order?.business?.logo || 'https://res.cloudinary.com/demo/image/fetch/c_thumb,g_face,r_max/https://res.cloudinary.com/ordering2/image/upload/v1654619525/hzegwosnplvrbtjkpfi6.png',
      level: 2,
    },
    {
      ...order?.customer?.location,
      title: order?.customer?.name ??  t('CUSTOMER', 'Customer'),
      address: {
        addressName: order?.customer?.address,
        zipcode: order?.customer?.zipcode
      },
      icon:
        order?.customer?.photo ||
        'https://res.cloudinary.com/demo/image/upload/c_thumb,g_face,r_max/d_avatar.png/non_existing_id.png',
      level: 3,
    },
  ];

  useEffect(() => {
    if (openModalForAccept) {
      setOpenModalForAccept(false);
    }

    if (openModalForMapView) {
      setOpenModalForMapView(false);
    }
  }, [loading]);

  const showFloatButtonsAcceptOrReject: any = {
    0: true,
  };

  useEffect(() => {
    if (driverLocation) {
      locations[0] = { ...locations[0], driverLocation };
    }
  }, [driverLocation]);

  useEffect(() => {
    const getPrinterDefault = async () => {
      const printer = await _retrieveStoreData('printer')
      setPrinterSettings(printer)
    }

    getPrinterDefault()
  }, [])

  const styles = StyleSheet.create({
    driverOff: {
      backgroundColor: theme.colors.notAvailable,
    },
    btnPickUp: {
      borderWidth: 0,
      backgroundColor: theme.colors.btnBGWhite,
      borderRadius: 8,
    },
  });

  const locationsToSend = locations.filter(
    (location: any) => location?.lat && location?.lng,
  );

  return (
    <>
      {(!order || Object.keys(order).length === 0) &&
        (error?.length < 1 || !error) && (
          <View
            style={{
              backgroundColor: theme.colors.backgroundLight,
            }}>
            {[...Array(6)].map((item, i) => (
              <Placeholder key={i} Animation={Fade}>
                <View style={{ flexDirection: 'row', marginBottom: 30 }}>
                  <Placeholder>
                    <PlaceholderLine width={90} />
                    <PlaceholderLine width={50} />
                    <PlaceholderLine width={20} />
                    <PlaceholderLine width={10} />
                  </Placeholder>
                </View>
              </Placeholder>
            ))}
          </View>
        )}

      {(!!error || error?.length > 0) && (
        <NotFoundSource
          btnTitle={t('GO_TO_MY_ORDERS', 'Go to my orders')}
          content={
            props.order.error[0] ||
            props.order.error ||
            t('NETWORK_ERROR', 'Network Error')
          }
          onClickButton={() => navigation.navigate('Orders')}
        />
      )}
      {order && Object.keys(order).length > 0 && (error?.length < 1 || !error) && (
        <View style={{ flex: 1 }}>
          <OrderHeaderComponent
            order={order}
            handleOpenMapView={handleOpenMapView}
            handleOpenMessagesForBusiness={handleOpenMessagesForBusiness}
            getOrderStatus={getOrderStatus}
            handleViewSummaryOrder={handleViewSummaryOrder}
            handleCopyClipboard={handleCopyClipboard}
            handleArrowBack={handleArrowBack}
            isCustomView={props.isCustomView}
          />
          <OrderDetailsContainer
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <>
              <OrderContentComponent order={order} />
              {(order?.status === 7 || order?.status === 4) &&
                order?.delivery_type === 1 && configs?.assign_driver_enabled?.value === '1' && (
                  <AssignDriver>
                    <OText style={{ marginBottom: 5 }} size={16} weight="600">
                      {t('ASSIGN_DRIVER', 'Assign driver')}
                    </OText>

                    <View
                      style={{
                        backgroundColor: theme.colors.inputChat,
                        borderRadius: 7.5,
                        marginBottom: 20
                      }}>
                      <CountryPicker
                        // @ts-ignore
                        countryCode={undefined}
                        visible={isDriverModalVisible}
                        onClose={() => setIsDriverModalVisible(false)}
                        withCountryNameButton
                        renderFlagButton={() => (
                          <>
                            <TouchableOpacity
                              onPress={() => setIsDriverModalVisible(true)}
                              disabled={
                                itemsDrivers.length === 0 || loadingDriver
                              }>
                              {loadingDriver ? (
                                <DriverItem justifyContent="center">
                                  <ActivityIndicator
                                    size="small"
                                    color={theme.colors.primary}
                                  />
                                </DriverItem>
                              ) : (
                                <DriverItem justifyContent="space-between">
                                  <OText>
                                    {itemsDrivers.length > 0
                                      ? order?.driver?.name ||
                                      t('SELECT_DRIVER', 'Select Driver')
                                      : t('WITHOUT_DRIVERS', 'Without drivers')}
                                  </OText>
                                  <OIcon
                                    src={theme?.images?.general?.chevronDown}
                                    color={theme.colors.backArrow}
                                    width={20}
                                    height={20}
                                  />
                                </DriverItem>
                              )}
                            </TouchableOpacity>
                          </>
                        )}
                        flatListProps={{
                          keyExtractor: (item: any) => item.value,
                          data: itemsDrivers || [],
                          renderItem: ({ item }: any) => (
                            <TouchableOpacity
                              style={!item.available && styles.driverOff}
                              disabled={
                                !item.available ||
                                order?.driver?.id === item.value
                              }
                              onPress={() => {
                                handleAssignDriver &&
                                  handleAssignDriver(item.value);
                                setIsDriverModalVisible(false);
                              }}>
                              <DriverItem>
                                <OText
                                  color={!item.available && theme.colors.grey}>
                                  {item.label}
                                  {!item.available &&
                                    ` (${t('NOT_AVAILABLE', 'Not available')})`}
                                  {item.value === order?.driver?.id &&
                                    ` (${t('SELECTED', 'Selected')})`}
                                </OText>
                              </DriverItem>
                            </TouchableOpacity>
                          ),
                        }}
                      />
                    </View>
                  </AssignDriver>
                )}

              <OModal
                open={openModalForBusiness}
                order={order}
                title={`${t('INVOICE_ORDER_NO', 'Order No.')} ${order?.id}`}
                entireModal
                onClose={() => handleCloseModal()}>
                <Chat
                  type={
                    openModalForBusiness ? USER_TYPE.BUSINESS : USER_TYPE.DRIVER
                  }
                  orderId={order?.id}
                  messages={messages}
                  order={order}
                  setMessages={setMessages}
                />
              </OModal>

              <OModal
                open={openModalForAccept}
                onClose={() => setOpenModalForAccept(false)}
                entireModal
                customClose>
                <AcceptOrRejectOrder
                  handleUpdateOrder={handleChangeOrderStatus}
                  closeModal={setOpenModalForAccept}
                  customerCellphone={order?.customer?.cellphone}
                  loading={loading}
                  action={actionOrder}
                  orderId={order?.id}
                  notShowCustomerPhone={false}
                  actions={actions}
                  orderTitle={orderTitle}
                  appTitle={appTitle}
                />
              </OModal>

              <OModal
                open={openModalForMapView}
                onClose={() => handleOpenMapView()}
                entireModal
                customClose>
                <GoogleMap
                  location={order?.customer?.location}
                  locations={locationsToSend}
                  driverLocation={driverLocation}
                  navigation={navigation}
                  handleViewActionOrder={handleViewActionOrder}
                  handleOpenMapView={handleOpenMapView}
                  readOnly
                  showAcceptOrReject={
                    showFloatButtonsAcceptOrReject[order?.status]
                  }
                />
              </OModal>
            </>
            <View style={{ height: 30 }} />
          </OrderDetailsContainer>

          {order &&
            Object.keys(order).length > 0 &&
            getOrderStatus(order?.status, t)?.value ===
            t('PENDING', 'Pending') && (
              <FloatingButton
                btnText={t('REJECT', 'Reject')}
                isSecondaryBtn={false}
                secondButtonClick={() => handleViewActionOrder('accept')}
                firstButtonClick={() => handleViewActionOrder('reject')}
                secondBtnText={t('ACCEPT', 'Accept')}
                secondButton={true}
                firstColorCustom={theme.colors.red}
                secondColorCustom={theme.colors.green}
                widthButton={'45%'}
              />
            )}
          {order?.status === 7 && (
            <FloatingButton
              btnText={t('READY_FOR_PICKUP', 'Ready for pickup')}
              colorTxt1={theme.colors.primary}
              color={theme.colors.btnBGWhite}
              firstButtonClick={() => handleChangeOrderStatus?.(4)}
              widthButton={'100%'}
              disabled={loading}
            />
          )}
          {order?.status === 4 && ![1].includes(order?.delivery_type) && (
            <FloatingButton
              btnText={t(
                'ORDER_NOT_PICKEDUP_BY_CUSTOMER',
                'Order not picked up by customer',
              )}
              isSecondaryBtn={false}
              colorTxt1={theme.colors.white}
              secondButtonClick={() => handleChangeOrderStatus?.(15)}
              firstButtonClick={() => handleChangeOrderStatus?.(17)}
              secondBtnText={t(
                'PICKUP_COMPLETED_BY_CUSTOMER',
                'Pickup completed by customer',
              )}
              secondButton={true}
              firstColorCustom={theme.colors.red}
              secondColorCustom={theme.colors.green}
              widthButton={'45%'}
              disabled={loading}
            />
          )}
        </View>
      )}
    </>
  );
};

export const OrderDetailsBusiness = (props: OrderDetailsParams) => {
  const orderDetailsProps = {
    ...props,
    UIComponent: OrderDetailsUI,
  };
  return <OrderDetailsController {...orderDetailsProps} />;
};
