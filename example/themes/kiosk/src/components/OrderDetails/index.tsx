import React, { useEffect, useState } from 'react'
import { View, StyleSheet, BackHandler, Alert, Keyboard  } from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'
import {useForm, Controller} from 'react-hook-form'
import {
  useLanguage,
  OrderDetails as OrderDetailsConTableoller,
  useUtils,
  useApi,
  useSession,
  useToast,
  ToastType,
} from 'ordering-components/native'

import {PhoneInputNumber} from '../PhoneInputNumber'
import {
  OSOrderDetailsWrapper,
  OSTable,
  OSActions,
  OSInputWrapper,
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

const _EMAIL = 'email';
const _SMS = 'sms';

export const OrderDetailsUI = (props: OrderDetailsParams) => {
  const { navigation, isFromCheckout } = props;

  const theme = useTheme();
  const [, t] = useLanguage()
  const [ordering] = useApi()
  const [, {showToast}] = useToast()
  const [{ parsePrice, parseNumber }] = useUtils()
  const [orientationState] = useDeviceOrientation()
  const [{ token }] = useSession()
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
    }
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

  const onSubmit = async (values : any) => {
    Keyboard.dismiss();
    if(countReceipts <= 0){
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
    try{
      const response = await fetch(`${ordering.root}/orders/${order.id}/receipt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
        body: JSON.stringify(body),
      })
      const {error, result} = await response.json()
      if(error){
        showToast(ToastType.Error, result)
      } else {
        showToast(ToastType.Success, t('RECEIPT_SEND_SUCCESSFULLY', 'Receipt send successfully'))
        setCountReceipts(countReceipts - 1)
      }

    }catch (error) {
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
      const {customerName : name} = await _retrieveStoreData('customer_name')
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
        list.unshift({message: phoneInputData.error});
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

          <OText>{t('SEND_RECEIPT', 'Send receipt')}</OText>

          <OptionSwitch
            options={optionsToSendReceipt}
            onChange={setOptionToSendReceipt}
          />
        </OSTable>
        <OText size='14' style={{alignSelf: 'flex-end'}}>
          {countReceipts}/5 {t('RECIPTS_REMAINING', 'Recipts remaining')}
        </OText>
        <OSTable>
          {optionToSendReceipt?.value === _EMAIL && (
            <Controller
            control={control}
            render={({onChange, value} : any) => (
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
        <OText>
          <OText
            size={orientationState?.dimensions?.width * 0.04}
            weight="700"
          >
            {t('ORDER_NUMBER', 'Order No.')} {' '}
          </OText>
          <OText
            size={orientationState?.dimensions?.width * 0.04}
            weight="700"
            color={theme.colors.primary}
          >
            {order?.id}
          </OText>
        </OText>
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

      {((order?.summary?.discount || order?.discount) > 0 && (order?.summary?.total || order?.total) >= 0) && (<OSTable>
        <OText
          weight="bold"
          mBottom={15}
        >
          {t('PROMO_CODE', 'Promo code')}
          {'\n'}
          <OText weight="400">
            {order?.offer_type === 1 ? `${verifyDecimals(order?.offer_rate, parseNumber)}%` : parsePrice(order?.summary?.discount || order?.discount)} {t('OFF', 'off')}
          </OText>
        </OText>

        <OText
          color={theme.colors.primary}
          weight="bold"
        >
          {`-${parsePrice(order?.summary?.discount || order?.discount)}`}
        </OText>
      </OSTable>)}

      <OSTable style={{ justifyContent: 'flex-end' }}>
        <OText
          weight="bold"
          style={{ textAlign: 'right' }}
        >
          {t('TOTAL', 'Total')}
          {'\n'}
          <OText
            color={theme.colors.primary}
            weight="bold"
          >
            {parsePrice(order?.summary?.total || order?.total)}
          </OText>
        </OText>
      </OSTable>
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
