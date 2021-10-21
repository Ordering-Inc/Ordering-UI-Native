import React, { useEffect, useState } from 'react'
import { View, StyleSheet, BackHandler, Alert, Keyboard } from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'
import { useForm, Controller } from 'react-hook-form'
import {
  useLanguage,
  OrderDetails as OrderDetailsConTableoller,
  useUtils,
  useApi,
  useSession,
  useToast,
  ToastType,
  useConfig
} from 'ordering-components/native'

import { PhoneInputNumber } from '../PhoneInputNumber'
import {
  OSOrderDetailsWrapper,
  OSTable,
  OSActions,
  OSInputWrapper,
  SentReceipt,
  Table,
  OrderBill,
  Total,
} from './styles'
import { OrderDetailsParams, Product } from '../../types'
import { Container } from '../../layouts/Container';
import NavBar from '../../components/NavBar';
import { OButton, OImage, OInput, OText } from '../../components/shared';
import GridContainer from '../../layouts/GridContainer';
import OptionSwitch, { Opt } from '../../components/shared/OOptionToggle';
import { verifyDecimals } from '../../../../../src/utils'
import { LANDSCAPE, PORTRAIT, useDeviceOrientation } from '../../../../../src/hooks/DeviceOrientation'
import { useTheme } from 'styled-components/native'
import { _retrieveStoreData } from '../../../../../src/providers/StoreUtil';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
const _EMAIL = 'email';
const _SMS = 'sms';

export const OrderDetailsUI = (props: OrderDetailsParams) => {
  const { navigation, isFromCheckout } = props;

  const theme = useTheme();
  const [, t] = useLanguage()
  const [ordering] = useApi()
  const [, { showToast }] = useToast()
  const [{ parsePrice, parseNumber }] = useUtils()
  const [orientationState] = useDeviceOrientation()
  const [{ token }] = useSession()
  const [{ configs }] = useConfig()
  const { control, handleSubmit, errors } = useForm();
  const [customerName, setCustomerName] = useState(null)
  const [countReceipts, setCountReceipts] = useState(5)
  const [isLoading, setIsLoading] = useState(false)
  const [phoneInputData, setPhoneInputData] = useState({
    error: '',
    phone: {
      country_phone_code: null,
      cellphone: null,
    },
  });
  const { order } = props.order;
  const isTaxIncluded = order?.tax_type === 1
  const styles = StyleSheet.create({
    inputsStyle: {
      borderColor: theme.colors.disabled,
      borderBottomRightRadius: 0,
      borderBottomLeftRadius: 8,
      borderTopRightRadius: 0,
      borderTopLeftRadius: 8,
      flex: 1,
      height: 52
    },
    buttonApplyStyle: {
      borderBottomRightRadius: 8,
      borderBottomLeftRadius: 0,
      borderTopRightRadius: 8,
      borderTopLeftRadius: 0,
    },
    textButtonApplyStyle: {
      color: theme.colors.primary,
      marginLeft: 0,
      marginRight: 0
    },
    disabledTextButtonApplyStyle: {
      color: theme.colors.white,
      marginLeft: 0,
      marginRight: 0
    },
    textBold: {
      fontWeight: 'bold'
    },
  });

  const optionsToSendReceipt: Opt[] = [
    {
      key: _EMAIL,
      label: t('EMAIL', 'Email'),
      value: _EMAIL,
      isDefault: true,
    },
    {
      key: _SMS,
      label: t('SMS', 'SMS'),
      value: _SMS,
    },
  ];

  const [optionToSendReceipt, setOptionToSendReceipt] = useState(
    optionsToSendReceipt?.find(o => o?.isDefault),
  );

  const handleArrowBack: any = () => {
    if (!isFromCheckout) {
      navigation?.canGoBack() && navigation.goBack();
      return
    }
    navigation.navigate('BottomTab');
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleArrowBack);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleArrowBack);
    }
  }, [])

  const handleChangeInputEmail = (value: string, onChange: any) => {
    onChange(value.toLowerCase().replace(/[&,()%";:ç?<>{}\\[\]\s]/g, ''));
  };

  const onSubmit = async (values: any) => {
    Keyboard.dismiss();
    if (countReceipts <= 0) {
      showToast(ToastType.Error, t('MAXIMUM_RECEIPTS_SEND_EXCEEDED', 'The maximum receipts sent has been exceeded'))
      return
    }
    if (phoneInputData.error) {
      showToast(ToastType.Error, phoneInputData.error);
      return;
    }
    setIsLoading(true)
    let body
    if (optionToSendReceipt?.value === _EMAIL) {
      body = {
        channel: 1,
        email: values.email,
        name: customerName
      }
    }
    else if (optionToSendReceipt?.value === _SMS) {
      body = {
        channel: 2,
        cellphone: phoneInputData?.phone?.cellphone,
        country_phone_code: phoneInputData?.phone?.country_phone_code,
        name: customerName
      }
    }
    try {
      const response = await fetch(`${ordering.root}/orders/${order.id}/receipt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      })
      const { error, result } = await response.json()
      if (error) {
        showToast(ToastType.Error, result)
      } else {
        showToast(ToastType.Success, t('RECEIPT_SEND_SUCCESSFULLY', 'Receipt send successfully'))
        setCountReceipts(countReceipts - 1)
      }

    } catch (error: any) {
      showToast(ToastType.Error, error.message)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    const backAction = () => {
      Alert.alert(`${t('HOLD_ON', 'Hold on')}!`, `${t('ARE_YOU_SURE_YOU_WANT_TO_GO_BACK', 'Are you sure you want to go back')}?`, [
        {
          text: t('CANCEL', 'cancel'),
          onPress: () => null,
          style: "cancel"
        },
        {
          text: t('YES', 'yes'), onPress: () => {
            navigation.reset({
              routes: [{ name: 'Intro' }]
            });
          }
        }
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    const getCustomerName = async () => {
      const { customerName: name } = await _retrieveStoreData('customer_name')
      setCustomerName(name)
    }
    getCustomerName()
  }, [])

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      // Convert all errors in one string to show in toast provider
      const list = Object.values(errors);
      let stringError = '';
      if (phoneInputData.error) {
        list.unshift({ message: phoneInputData.error });
      }
      if (
        optionToSendReceipt?.value === _SMS &&
        !phoneInputData.error &&
        !phoneInputData.phone.country_phone_code &&
        !phoneInputData.phone.cellphone
      ) {
        list.unshift({
          message: t(
            'VALIDATION_ERROR_MOBILE_PHONE_REQUIRED',
            'The field Mobile phone is required.',
          ),
        });
      }
      list.map((item: any, i: number) => {
        stringError +=
          i + 1 === list.length ? `- ${item.message}` : `- ${item.message}\n`;
      });
      showToast(ToastType.Error, stringError);
    }
  }, [errors]);

  const actionsContent = (
    <View
      style={{ maxHeight: 300 }}
    >
      <Spinner visible={isLoading} />
      <OSInputWrapper>
        <OSTable
          style={{
            alignItems: 'center',
            marginBottom: 10,
          }}
        >
          <SentReceipt>
            <MaterialIcon name='check-circle' color={theme.colors.primary} size={28} />
            <OText size={20} mLeft={10}>{t('SEND_RECEIPT', 'Send receipt')}</OText>
          </SentReceipt>
          <OText size={20}>
            {countReceipts}/5 {t('RECIPTS_REMAINING', 'Recipts remaining')}
          </OText>

          {/* <OptionSwitch
            options={optionsToSendReceipt}
            onChange={setOptionToSendReceipt}
          /> */}
        </OSTable>
        <OSTable>
          {optionToSendReceipt?.value === _EMAIL && (
            <Controller
              control={control}
              render={({ onChange, value }: any) => (
                <OInput
                  placeholder="yourname@mailhost.com"
                  onChange={(e: any) => handleChangeInputEmail(e, onChange)}
                  style={styles.inputsStyle}
                  value={value}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit(onSubmit)}
                  blurOnSubmit
                  type="email-address"
                />
              )}
              name="email"
              rules={{
                required: t(
                  'VALIDATION_ERROR_EMAIL_REQUIRED',
                  'The field Email is required',
                ).replace('_attribute_', t('EMAIL', 'Email')),
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: t(
                    'INVALID_ERROR_EMAIL',
                    'Invalid email address',
                  ).replace('_attribute_', t('EMAIL', 'Email')),
                },
              }}
              defaultValue=""
            />
          )}

          {optionToSendReceipt?.value === _SMS && (
            <PhoneInputNumber
              data={phoneInputData}
              handleData={(val: any) => setPhoneInputData(val)}
              textInputProps={{
                returnKeyType: 'done',
                onSubmitEditing: handleSubmit(onSubmit),
              }}
            />
          )}

          <OButton
            onClick={handleSubmit(onSubmit)}
            text={t('SEND', 'Send')}
            bgColor={theme.colors.primaryLight}
            borderColor={theme.colors.primaryLight}
            textStyle={styles.textButtonApplyStyle}
            disabledTextStyle={styles.disabledTextButtonApplyStyle}
            style={styles.buttonApplyStyle}
          />

        </OSTable>
      </OSInputWrapper>

      <OButton
        text={`${t('YOU_ARE_DONE', 'You are done')}!`}
        onClick={() => {
          navigation.reset({
            routes: [{ name: 'Intro' }],
          });
        }}
      />
    </View>
  );

  const orderDetailsContent = (
    <OSOrderDetailsWrapper
      style={{
        minHeight: orientationState?.orientation === PORTRAIT
          ? orientationState?.dimensions?.height * 0.32
          : orientationState?.dimensions?.height * 0.75,
      }}
    >
      <OSTable>
        <View style={{ flexDirection: 'row', bottom: 10 }}>
          <OText
            size={orientationState?.dimensions?.width * 0.039}
            weight="700"
          >
            {t('ORDER_NUMBER', 'Order No.')} {' '}
          </OText>
          <OText
            size={orientationState?.dimensions?.width * 0.039}
            weight="700"
            color={theme.colors.primary}
          >
            {order?.id}
          </OText>
        </View>
      </OSTable>

      {order?.products?.length && (
        <OSTable>
          <View>
            <OText
              weight="bold"
              mBottom={15}
            >
              {`${order?.products?.length} ${t('ITEMS', 'items')}`}
            </OText>

            <GridContainer style={{ maxWidth: orientationState?.dimensions?.width * 0.6 }}>
              {order?.products.map((product: Product, i: number) => (
                <OImage
                  key={product?.id || i}
                  source={{ uri: product?.images || '' }}
                  resizeMode="cover"
                  height={80}
                  width={80}
                  borderRadius={8}
                  style={{ marginEnd: 10, marginBottom: 10 }}
                />
              ))}
            </GridContainer>
          </View>

          <OText
            color={theme.colors.primary}
            weight="bold"
          >
            {parsePrice((order?.summary?.total || order?.total) - (order?.summary?.discount || order?.discount))}
          </OText>
        </OSTable>
      )}

      <OrderBill>
        <Table>
          <OText>{t('SUBTOTAL', 'Subtotal')}</OText>
          <OText>
            {parsePrice(isTaxIncluded
              ? (order?.summary?.subtotal + order?.summary?.tax) ?? 0
              : order?.summary?.subtotal ?? 0
            )}
          </OText>
        </Table>
        {order?.summary?.discount > 0 && (
          <Table>
            {order?.offer_type === 1 ? (
              <OText>
                {t('DISCOUNT', 'Discount')}
                <OText>{`(${verifyDecimals(order?.offer_rate, parsePrice)}%)`}</OText>
              </OText>
            ) : (
              <OText>{t('DISCOUNT', 'Discount')}</OText>
            )}
            <OText>- {parsePrice(order?.summary?.discount)}</OText>
          </Table>
        )}
        {order?.summary?.subtotal_with_discount > 0 && order?.summary?.discount > 0 && order?.summary?.total >= 0 && (
          <Table>
            <OText>{t('SUBTOTAL_WITH_DISCOUNT', 'Subtotal with discount')}</OText>
            <OText>{parsePrice(order?.summary?.subtotal_with_discount ?? 0)}</OText>
          </Table>
        )}
        {order?.tax_type !== 1 && (
          <Table>
            <OText>
              {t('TAX', 'Tax')}
              {`(${verifyDecimals(order?.summary?.tax_rate, parseNumber)}%)`}
            </OText>
            <OText>{parsePrice(order?.summary?.tax)}</OText>
          </Table>
        )}
        {order?.summary?.delivery_price > 0 && (
          <Table>
            <OText>{t('DELIVERY_FEE', 'Delivery Fee')}</OText>
            <OText>{parsePrice(order?.summary?.delivery_price)}</OText>
          </Table>
        )}
        {order?.summary?.driver_tip > 0 && (
          <Table>
            <OText>
              {t('DRIVER_TIP', 'Driver tip')}
              {order?.summary?.driver_tip > 0 &&
                parseInt(configs?.driver_tip_type?.value, 10) === 2 &&
                !parseInt(configs?.driver_tip_use_custom?.value, 10) &&
                (
                  `(${verifyDecimals(order?.summary?.driver_tip, parseNumber)}%)`
                )}
            </OText>
            <OText>{parsePrice(order?.summary?.driver_tip ?? 0)}</OText>
          </Table>
        )}
        {order?.summary?.service_fee > 0 && (
          <Table>
            <OText>
              {t('SERVICE_FEE', 'Service Fee')}
              {`(${verifyDecimals(order?.summary?.service_fee, parseNumber)}%)`}
            </OText>
            <OText>{parsePrice(order?.summary?.service_fee)}</OText>
          </Table>
        )}
        <Total>
          <Table>
            <OText style={styles.textBold}>{t('TOTAL', 'Total')}</OText>
            <OText style={styles.textBold} color={theme.colors.primary}>
              {parsePrice(order?.summary?.total ?? 0)}
            </OText>
          </Table>
        </Total>
      </OrderBill>
    </OSOrderDetailsWrapper>
  );

  return (
    <>
      <Spinner visible={!order || Object.keys(order).length === 0} />

      {order && Object.keys(order).length > 0 && (
        <>
          <Container>
            <NavBar
              title={t('TAKE_YOUR_RECEIPT', 'Take your receipt')}
              style={{ right: 10 }}
            />

            <View style={{
              marginVertical: orientationState?.dimensions?.height * 0.03,
              flexDirection: orientationState?.orientation === PORTRAIT ? 'column' : 'row',
            }}>
              <View style={{
                flex: 1,
                marginRight: orientationState?.orientation === PORTRAIT ? 0 : 20,
                justifyContent: 'space-between'
              }}>
                <View>
                  <OText
                    size={orientationState?.dimensions?.width * 0.045}
                    mBottom={15}
                  >
                    {t('WE_KNOW_YOU_ARE', 'We know you are')} {'\n'}
                    <OText
                      size={orientationState?.dimensions?.width * 0.048}
                      weight="700"
                    >
                      {`${t('HUNGRY', 'hungry')}, ${customerName}`}
                    </OText>
                  </OText>

                  <OText
                    size={orientationState?.dimensions?.width * (orientationState?.orientation === PORTRAIT ? 0.04 : 0.025)}
                  >
                    {t('TO_FINISH_TAKE_YOUR_RECEIPT_AND_GO_TO_THE_FRONT_COUNTER', 'To finish take your receipt and go to the front counter.')}
                  </OText>

                </View>

                {orientationState?.orientation === LANDSCAPE && actionsContent}
              </View>

              <View
                style={{
                  flex: 1.4,
                  marginVertical: orientationState?.orientation === PORTRAIT ? 40 : 0,
                }}
              >
                {orderDetailsContent}
              </View>
            </View>
          </Container>

          {orientationState?.orientation === PORTRAIT && (
            <OSActions>
              {actionsContent}
            </OSActions>
          )}
        </>
      )}
    </>
  )
}

export const OrderDetails = (props: OrderDetailsParams) => {
  const orderDetailsProps = {
    ...props,
    UIComponent: OrderDetailsUI
  }

  return (
    <OrderDetailsConTableoller {...orderDetailsProps} />
  )
}
