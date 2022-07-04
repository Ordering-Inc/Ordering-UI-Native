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
import { OModal, PaymentOptionStripe } from '../../../../../src';
import AntIconDesign from 'react-native-vector-icons/AntDesign'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'

const PaymentOptionsUI = (props: any) => {
  const {
    cart,
    onNavigationRedirect,
    isDisabled,
    paymethodData,
    handlePaymethodDataChange,
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
  } = props;

  const theme = useTheme();
  const [, { showToast }] = useToast();
  const [, t] = useLanguage();
  const [orientationState] = useDeviceOrientation();
  const [userErrors, setUserErrors] = useState<any>([]);
  const [isOpenModal, setIsOpenModal] = useState(false)
  const paymethodSelected =
    paySelected || props.paymethodSelected || isOpenMethod.paymethod;

  useEffect(() => {
    if (paymethodsList.paymethods.length === 1) {
      handlePaymethodClick &&
        handlePaymethodClick(paymethodsList.paymethods[0]);
    }
  }, [paymethodsList.paymethods]);

  useEffect(() => {
    if (paymethodSelected?.gateway !== 'cash' && errorCash) {
      props.setErrorCash(false);
    }
  }, [paymethodSelected]);

  useEffect(() => {
    if (props.paySelected && props.paySelected?.data) {
      setPaymethodData && setPaymethodData(props.paySelected?.data);
    }
  }, [paySelected]);

  useEffect(() => {
    if (
      !errors &&
      !errorCash &&
      isOpenMethod?.paymethod &&
      !placing &&
      !isLoading &&
      paySelected &&
      paySelected?.gateway !== 'stripe'
    ) {
      handlePlaceOrder();
      return;
    }
  }, [isOpenMethod.paymethod, placing, isLoading, paySelected]);

  // const includePaymethods = ['cash', 'card_delivery', 'stripe'];
  const includePaymethods = ['cash', 'card_delivery'];

  const supportedMethods = paymethodsList.paymethods.filter((p: any) =>
    includePaymethods.includes(p.gateway),
  );

  const cashIndex: number = supportedMethods?.findIndex(
    (item: any) => item?.gateway === 'cash',
  );
  const cardOnDeliveryIndex = supportedMethods?.findIndex(
    (item: any) => item?.gateway === 'card_delivery',
  );
  const stripeIndex = supportedMethods?.findIndex(
    (item: any) => item?.gateway === 'stripe',
  );
  const onSelectPaymethod = (paymethod: any, isPopupMethod: boolean) => {
    handlePaymethodClick(paymethod);
  };

  const handlePlaceOrder = () => {
    if (!userErrors.length) {
      handlerClickPlaceOrder && handlerClickPlaceOrder(null, { on_behalf_of: props.customerName });
      return;
    }
    let stringError = '';
    Object.values(userErrors).map((item: any, i: number) => {
      stringError +=
        i + 1 === userErrors.length
          ? `- ${item?.message || item}`
          : `- ${item?.message || item}\n`;
    });

    showToast(ToastType.Error, stringError);
  };

  const cardStyle = {
    width:
      orientationState?.orientation === PORTRAIT
        ? orientationState?.dimensions?.width - 40
        : orientationState?.dimensions?.width * 0.47,
    height:
      orientationState?.orientation === PORTRAIT
        ? orientationState?.dimensions?.height * 0.34
        : orientationState?.dimensions?.height * 0.55,
  };

  const propsOfItems = {
    CASH_ID:
      cashIndex !== -1
        ? {
          style: cardStyle,
          title: t('CASH', 'Cash'),
          description: t(
            'GO_FOR_YOR_RECEIPT_AND_GO_TO_THE_FRONT_COUNTER',
            'Pay with cash in the front counter',
          ),
          bgImage: theme.images.general.cash,
          callToActionText: t('LETS_GO', 'LETS_GO'),
          VectorIcon: () => <AntIconDesign name='shoppingcart' size={28} color='white' style={{ marginBottom: 10 }} />,
          onClick: () =>
            onSelectPaymethod(supportedMethods[cashIndex], false),
          ...supportedMethods[cashIndex],
        }
        : null,

    CARD_ON_DELIVERY_ID:
      cardOnDeliveryIndex !== -1
        ? {
          style: cardStyle,
          title: t('CARD', supportedMethods[cardOnDeliveryIndex]?.name),
          description: t(
            'WE_ACCEPT_EVERY_DEBIT_OR_CREDIT_CARD',
            'We accept every debit or credit card',
          ),
          bgImage: theme.images.general.carddelivery,
          callToActionText: t("LETS_GO", "Let's go"),
          VectorIcon: () => <MaterialIcon name='pin-outline' size={28} color='white' style={{ marginBottom: 10 }} />,
          onClick: () => onSelectPaymethod(supportedMethods[cardOnDeliveryIndex], false),
          ...supportedMethods[cardOnDeliveryIndex],
        }
        : null,
    STRIPE:
      stripeIndex !== -1
        ? {
          style: cardStyle,
          title: t('STRIPE', supportedMethods[stripeIndex]?.name),
          description: t('STRIPE', 'Stripe'),
          bgImage: theme.images.general.carddelivery,
          callToActionText: t('INSERT_INFO', 'Test info'),
          VectorIcon: () => <MaterialIcon name='pin-outline' size={28} color='white' style={{ marginBottom: 10 }} />,
          onClick: () => {
            onSelectPaymethod(supportedMethods[stripeIndex], false);
            setIsOpenModal(true)
          },
          ...supportedMethods[stripeIndex],
        }
        : null,
  };

  const goToBack = () => navigation?.goBack();

  return (
    <>
      <Spinner visible={isLoading || placing} />

      <Container nestedScrollEnabled>
        <NavBar
          title={t('PAYMENT_METHODS', 'Payment methods')}
          onActionLeft={goToBack}
          btnStyle={{ paddingLeft: 0 }}
        />

        <View
          style={{ marginVertical: orientationState?.dimensions?.height * 0.03 }}>
          <OText size={orientationState?.dimensions?.width * 0.048}>
            {t('HOW_WOULD_YOU', 'How would you')} {'\n'}
            <OText
              size={orientationState?.dimensions?.width * 0.048}
              weight={'700'}>
              {`${t('LIKE_TO_PAY', 'like to pay')}?`}
            </OText>
          </OText>
        </View>

        {supportedMethods?.length > 0 && (
          <GridContainer style={{ justifyContent: 'space-between' }}>
            {propsOfItems.CARD_ON_DELIVERY_ID && (
              <View style={{ marginBottom: orientationState?.orientation === LANDSCAPE ? 20 : 0 }}>
                <OptionCard {...propsOfItems?.CARD_ON_DELIVERY_ID} styke />
              </View>
            )}

            <View
              style={{
                width:
                  orientationState?.orientation === LANDSCAPE
                    ? orientationState?.dimensions?.width * 0.0016
                    : 1,
                height:
                  orientationState?.orientation === PORTRAIT
                    ? orientationState?.dimensions?.height * 0.018
                    : 1,
              }}
            />

            {propsOfItems?.CASH_ID && <OptionCard {...propsOfItems?.CASH_ID} />}

            <View
              style={{
                width:
                  orientationState?.orientation === LANDSCAPE
                    ? orientationState?.dimensions?.width * 0.0016
                    : 1,
                height:
                  orientationState?.orientation === PORTRAIT
                    ? orientationState?.dimensions?.height * 0.018
                    : 1,
              }}
            />

            {propsOfItems.STRIPE && (
              <OptionCard {...propsOfItems?.STRIPE} />
            )}
          </GridContainer>
        )}
        <View style={{ height: orientationState?.dimensions?.height * 0.05 }} />
        <OModal
          open={isOpenModal}
          onClose={() => setIsOpenModal(false)}
          onCancel={() => setIsOpenModal(false)}
          entireModal
          customClose
        >
          <PaymentOptionStripe
            {...props}
            onClose={() => setIsOpenModal(false)}
          />
        </OModal>
      </Container>
    </>
  );
};

export const PaymentOptions = (props: any) => {
  const paymentOptions = {
    ...props,
    UIComponent: PaymentOptionsUI,
  };
  return <PaymentOptionsController {...paymentOptions} />;
};

