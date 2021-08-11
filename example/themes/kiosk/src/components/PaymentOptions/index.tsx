import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useTheme } from 'styled-components/native';

import {
  PaymentOptions as PaymentOptionsController,
  useLanguage,
  ToastType,
  useToast
} from 'ordering-components/native';


import { OText } from '../shared';

import NavBar from '../NavBar';
import { Container } from '../../layouts/Container';
import OptionCard from '../OptionCard';
import Spinner from 'react-native-loading-spinner-overlay';
import { LANDSCAPE, PORTRAIT, useDeviceOrientation } from '../../../../../src/hooks/DeviceOrientation';
import GridContainer from '../../layouts/GridContainer';

const PaymentOptionsUI = (props: any) => {
  const {
    errorCash,
    isLoading,
    paymethodsList,
    setPaymethodData,
    handlePaymethodClick,
    isOpenMethod,
    navigation,
    handlerClickPlaceOrder,
    placing,
    errors,
    paySelected,
  } = props

  const theme = useTheme();
  const [, { showToast }] = useToast();
  const [, t] = useLanguage();
  const [orientationState] = useDeviceOrientation();
  const [userErrors, setUserErrors] = useState<any>([]);

  const paymethodSelected = paySelected || props.paymethodSelected || isOpenMethod.paymethod

  useEffect(() => {
    if (paymethodsList.paymethods.length === 1) {
      handlePaymethodClick && handlePaymethodClick(paymethodsList.paymethods[0])
    }
  }, [paymethodsList.paymethods])

  useEffect(() => {
    if (paymethodSelected?.gateway !== 'cash' && errorCash) {
      props.setErrorCash(false)
    }
  }, [paymethodSelected])

  useEffect(() => {
    if (props.paySelected && props.paySelected?.data) {
      setPaymethodData && setPaymethodData(props.paySelected?.data)
    }
  }, [paySelected])

  useEffect(() => {
    if (!errors && !errorCash && isOpenMethod?.paymethod && !placing && !isLoading && paySelected) {
      handlePlaceOrder();
    }
  }, [isOpenMethod.paymethod, placing, isLoading, paySelected])

  const includePaymethods = ['cash', 'card_delivery'];

  const supportedMethods = paymethodsList.paymethods
    .filter((p: any) => includePaymethods.includes(p.gateway));

  const cashIndex: number = supportedMethods?.findIndex((item: any) => item?.gateway === 'cash');
  const cardOnDeliveryIndex = supportedMethods?.findIndex((item: any) => item?.gateway === 'card_delivery');

  const handlePlaceOrder = () => {
    if (!userErrors.length) {
      handlerClickPlaceOrder && handlerClickPlaceOrder()
      return
    }
    let stringError = ''
    Object.values(userErrors).map((item: any, i: number) => {
      stringError += (i + 1) === userErrors.length ? `- ${item?.message || item}` : `- ${item?.message || item}\n`
    })

    showToast(ToastType.Error, stringError)
  }

  const cardStyle = {
    width: orientationState?.orientation === PORTRAIT ? orientationState?.dimensions?.width - 40 : orientationState?.dimensions?.width * 0.47,
    height: orientationState?.orientation === PORTRAIT ? orientationState?.dimensions?.height * 0.34 : orientationState?.dimensions?.height * 0.55,
  }

  const propsOfItems = {
    CASH_ID:  cashIndex !== -1 ? {
      style: cardStyle,
      title: t('CASH', supportedMethods[cashIndex]?.name),
      description: t('GO_FOR_YOR_RECEIPT_AND_GO_TO_THE_FRONT_COUNTER', 'Go for yor receipt and go to the front counter'),
      bgImage: theme.images.general.cash,
      icon: theme.images.general.shoppingCart,
      callToActionText: t('TAKE_MY_RECEIPT', 'Take my receipt'),
      onClick: () => handlePaymethodClick(supportedMethods[cashIndex]),
      ...supportedMethods[cashIndex],
    } : null,

    CARD_ON_DELIVERY_ID: cardOnDeliveryIndex !== -1 ? {
      style: cardStyle,
      title: t('CARD', supportedMethods[cardOnDeliveryIndex]?.name),
      description: t('WE_ACCEPT_EVERY_DEBIT_OR_CREDIT_CARD', 'We accept every debit or credit card'),
      bgImage: theme.images.general.carddelivery,
      icon: theme.images.general.pushPin,
      callToActionText: t('LET\'S GO', 'Let\'s go'),
      onClick: () => handlePaymethodClick(supportedMethods[cardOnDeliveryIndex]),
      ...supportedMethods[cardOnDeliveryIndex],
    } : null,
  };

  const goToBack = () => navigation?.goBack();

  return (
    <>
      <Spinner visible={isLoading || placing} />

      <Container nestedScrollEnabled>
        <NavBar
          title={t('PAYMENT_METHODS', 'Payment methods')}
          onActionLeft={goToBack}
        />

        <View style={{ marginVertical: orientationState?.dimensions?.height * 0.03 }}>
          <OText
            size={orientationState?.dimensions?.width * 0.048}
          >
            {t('HOW_WOULD_YOU', 'How would you')} {'\n'}
            <OText
              size={orientationState?.dimensions?.width * 0.048}
              weight={'700'}
            >
              {`${t('LIKE_TO_PAY', 'like to pay')}?`}
            </OText>
          </OText>
        </View>


        {supportedMethods?.length > 0 && (
          <GridContainer
            style={{ justifyContent: 'space-between' }}
          >
            {propsOfItems.CARD_ON_DELIVERY_ID && (
              <OptionCard
                {...propsOfItems?.CARD_ON_DELIVERY_ID}
              />
            )}

            <View style={{
              width: orientationState?.orientation === LANDSCAPE ? orientationState?.dimensions?.width * 0.0016 : 1,
              height: orientationState?.orientation === PORTRAIT ? orientationState?.dimensions?.height * 0.018 : 1,
            }} />

            {propsOfItems?.CASH_ID && (
              <OptionCard
                {...propsOfItems?.CASH_ID}
              />
            )}
          </GridContainer>
        )}
        
        <View style={{ height: orientationState?.dimensions?.height * 0.05 }} />
      </Container>
    </>
  )
}

export const PaymentOptions = (props: any) => {
  const paymentOptions = {
    ...props,
    UIComponent: PaymentOptionsUI
  }
  return (
    <PaymentOptionsController {...paymentOptions} />
  )
}
