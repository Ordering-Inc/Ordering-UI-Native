import React, { useEffect, useState } from 'react';
import { View, Dimensions } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Placeholder,
  PlaceholderLine,
  Fade
} from "rn-placeholder";

import {
  PaymentOptions as PaymentOptionsController,
  useLanguage,
  useSession
} from 'ordering-components/native';

import { PaymentOptionCash } from '../PaymentOptionCash';
// import { PaymentOptionStripe } from '../PaymentOptionStripe';
// import { StripeRedirectForm } from '../StripeRedirectForm';
// import { PaymentOptionPaypal } from '../PaymentOptionPaypal'
// import { NotFoundSource } from '../NotFoundSource'

import { OText } from '../shared';

import NavBar from '../NavBar';
import { Container } from '../../layouts/Container';
import OptionCard from '../OptionCard';
import { DELIVERY_TYPE_IMAGES, IMAGES, PAYMENT_IMAGES } from '../../config/constants';

const _dim = Dimensions.get('window');

const PaymentOptionsUI = (props: any) => {
  const {
    cart,
    errorCash,
    isLoading,
    isDisabled,
    paymethodData,
    paymethodsList,
    setPaymethodData,
    onNavigationRedirect,
    handlePaymethodClick,
    handlePaymethodDataChange,
    isOpenMethod,
    navigation,
  } = props

  const [, t] = useLanguage();
  const paymethodSelected = props.paySelected || props.paymethodSelected || isOpenMethod.paymethod

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
      setPaymethodData(props.paySelected?.data)
    }
  }, [props.paySelected])

  const CASH_ID: number = 1;
  const CARD_ON_DELIVERY_ID: number = 2;

  const includeIds = [CASH_ID, CARD_ON_DELIVERY_ID]; // cash & card on delivery
  
  const supportedMethods = paymethodsList.paymethods
    .sort((a: any, b: any) => a.id - b.id).filter((p: any) => includeIds.includes(p.id));
  
  const cashIndex: number = supportedMethods?.findIndex((item: any) => item?.id === CASH_ID);
  const cardOnDeliveryIndex = supportedMethods?.findIndex((item: any) => item?.id === CARD_ON_DELIVERY_ID);
  
  const onSelectPaymethod = (paymethod: any, isPopupMethod: boolean) => {
    handlePaymethodClick(paymethod, isPopupMethod);
    navigation?.navigate('Confirmation');
  }

  const propsOfItems = {
    CASH_ID:  cashIndex !== -1 ? {
      title: t('CASH', supportedMethods[cashIndex]?.name),
      description: t('GO_FOR_YOR_RECEIPT_AND_GO_TO_THE_FRONT_COUNTER', 'Go for yor receipt and go to the front counter'),
      bgImage: PAYMENT_IMAGES.cash,
      icon: IMAGES.shoppingCart,
      callToActionText: t('TAKE_MY_RECEIPT', 'Take my receipt'),
      onClick: () => onSelectPaymethod(supportedMethods[cashIndex], false),
      ...supportedMethods[cashIndex],
    } : null,

    CARD_ON_DELIVERY_ID: cardOnDeliveryIndex !== -1 ? {
      title: t('CARD', supportedMethods[cardOnDeliveryIndex]?.name),
      description: t('WE_ACCEPT_EVERY_DEBIT_OR_CREDIT_CARD', 'We accept every debit or credit card'),
      bgImage: PAYMENT_IMAGES.carddelivery,
      icon: IMAGES.pushPin,
      callToActionText: t('LET\'S GO', 'Let\'s go'),
      onClick: () => onSelectPaymethod(supportedMethods[cardOnDeliveryIndex], false),
      ...supportedMethods[cardOnDeliveryIndex],
    } : null,
  };

  const goToBack = () => navigation?.goBack();

  return (
    <Container nestedScrollEnabled>
      <NavBar
        title={t('PAYMENT_METHODS', 'Payment methods')}
        onActionLeft={goToBack}
      />

      <View style={{ marginVertical: _dim.height * 0.03 }}>
        <OText
          size={_dim.width * 0.05}
        >
          {t('HOW_WOULD_YOU', 'How would you')} {'\n'}
          <OText
            size={_dim.width * 0.05}
            weight={'700'}
          >
            {`${t('LIKE_TO_PAY', 'like to pay')}?`}
          </OText>
        </OText>
      </View>


      {supportedMethods?.length > 0 && (
        <>
          {propsOfItems.CARD_ON_DELIVERY_ID && (
            <OptionCard
              {...propsOfItems?.CARD_ON_DELIVERY_ID}
            />
          )}

          <View style={{ height: _dim.height * 0.02 }} />

          {propsOfItems?.CASH_ID && (
            <OptionCard
              {...propsOfItems?.CASH_ID}
            />
          )}
        </>
      )}
      
      <View style={{ height: _dim.height * 0.05 }} />
    </Container>
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
