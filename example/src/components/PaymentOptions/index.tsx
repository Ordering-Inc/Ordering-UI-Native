import React, { useEffect, useState, useRef } from 'react';
import { FlatList, TouchableOpacity, View, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Placeholder,
  PlaceholderLine,
  Fade
} from "rn-placeholder";

import {
  PaymentOptions as PaymentOptionsController,
  useLanguage,
  useSession,
  useApi,
  useOrder,
  ToastType,
  useToast
} from 'ordering-components/native';

import { PaymentOptionCash } from '../PaymentOptionCash';
import { StripeElementsForm } from '../StripeElementsForm';
import { StripeCardsList } from '../StripeCardsList';
// import { PaymentOptionStripe } from '../PaymentOptionStripe';
// import { StripeRedirectForm } from '../StripeRedirectForm';
// import { PaymentOptionPaypal } from '../PaymentOptionPaypal'
// import { NotFoundSource } from '../NotFoundSource'

import { OText, OIcon, OModal, OButton } from '../shared';

import {
  PMContainer,
  PMItem,
  PMCardSelected,
  PMCardItemContent
} from './styles'
import { getIconCard } from '../../utils';
import { WebView } from 'react-native-webview';
import { useTheme } from 'styled-components/native';

const stripeOptions: any = ['stripe_direct', 'stripe', 'stripe_connect']
// const stripeRedirectOptions = [
//   { name: 'Bancontact', value: 'bancontact' },
//   { name: 'Alipay', value: 'alipay' },
//   { name: 'Giropay', value: 'giropay' },
//   { name: 'iDEAL', value: 'ideal' }
// ]

const webViewPaymentGateway: any = ['paypal', 'square']

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
    handlePaymentMethodClickCustom,
    isOpenMethod,
    setCardData,
    handlePlaceOrder,
    merchantId
  } = props

  const theme = useTheme();
  const [, t] = useLanguage();
  const methodsPay = ['google_pay']
  const stripeDirectMethods = ['stripe_direct', ...methodsPay]

  const [addCardOpen, setAddCardOpen] = useState({ stripe: false, stripeConnect: false });
  let paymethodSelected = props.paySelected || props.paymethodSelected || isOpenMethod?.paymethod

  const getPayIcon = (method: string) => {
    switch (method) {
      case 'cash':
        return theme.images.general.cash
      case 'card_delivery':
        return theme.images.general.carddelivery
      case 'paypal':
        return theme.images.general.paypal
      case 'stripe':
        return theme.images.general.stripe
      case 'stripe_direct':
        return theme.images.general.stripecc
      case 'stripe_connect':
        return theme.images.general.stripes
      case 'stripe_redirect':
        return theme.images.general.stripesb
      case 'apple_pay':
        return theme.images.general.applePayMark
      default:
        return theme.images.general.creditCard
    }
  }

  const handlePaymentMethodClick = (paymethod: any) => {
    const isPopupMethod = ['stripe', 'stripe_direct', 'stripe_connect', 'stripe_redirect', 'paypal', 'square'].includes(paymethod?.gateway)
    handlePaymethodClick(paymethod, isPopupMethod)
    if (webViewPaymentGateway.includes(paymethod?.gateway)) {
      handlePaymentMethodClickCustom(paymethod)
    }
    setCardData(paymethodData)
  }

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
  }, [props.paySelected])

  useEffect(() => {
    setCardData && setCardData(paymethodData)
    if (methodsPay.includes(paymethodSelected?.gateway) && paymethodData?.id && paymethodSelected?.data?.card) {
      handlePlaceOrder()
    }
  }, [paymethodData, paymethodSelected])

  const renderPaymethods = ({ item }: any) => {
    return (
      <>
        {item?.gateway === 'apple_pay' ? (
          <TouchableOpacity
            onPress={() => handlePaymentMethodClick(item)}
          >
            <OIcon
              src={getPayIcon(item.gateway)}
              width={120}
              height={100}
              style={{ marginRight: 10 }}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => handlePaymentMethodClick(item)}
          >
            <PMItem
              key={item.id}
              isDisabled={isDisabled}
              isActive={paymethodSelected?.id === item.id}
            >
              <OIcon
                src={getPayIcon(item.gateway)}
                width={40}
                height={40}
                color={paymethodSelected?.id === item.id ? theme.colors.white : theme.colors.backgroundDark}
              />
              <OText
                size={12}
                style={{ margin: 0 }}
                color={paymethodSelected?.id === item.id ? theme.colors.white : '#000'}
              >
                {t(item.gateway.toUpperCase(), item.name)}
              </OText>
            </PMItem>
          </TouchableOpacity>
        )}
      </>
    )
  }

  const excludeGateway: any = ['stripe_connect', 'stripe_redirect', 'apple_pay']; //exclude connect & redirect & apple pay

  return (
    <PMContainer>
      {paymethodsList.paymethods.length > 0 && (
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          // data={paymethodsList.paymethods.sort((a: any, b: any) => a.id - b.id)}
          data={paymethodsList.paymethods.sort((a: any, b: any) => a.id - b.id).filter((p: any) => !excludeGateway.includes(p.gateway))}
          renderItem={renderPaymethods}
          keyExtractor={(paymethod: any) => paymethod?.id?.toString?.()}
        />
      )}
      {(paymethodsList.loading || isLoading) && (
        <Placeholder style={{ marginTop: 10 }} Animation={Fade}>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            {[...Array(3)].map((_, i) => (
              <PlaceholderLine
                key={i}
                width={37}
                height={80}
                noMargin
                style={{ borderRadius: 10, marginRight: 10 }}
              />
            ))}
          </View>
        </Placeholder>
      )}

      {paymethodsList.error && paymethodsList.error.length > 0 && (
        <OText size={12} style={{ margin: 0 }}>
          {paymethodsList?.error[0]?.message || paymethodsList?.error[0]}
        </OText>
      )}

      {!(paymethodsList.loading || isLoading) &&
        !paymethodsList.error &&
        (!paymethodsList?.paymethods || paymethodsList.paymethods.length === 0) &&
        (
          <OText size={12} style={{ margin: 0 }}>
            {t('NO_PAYMENT_METHODS', 'No payment methods!')}
          </OText>
        )}

      {paymethodSelected?.gateway === 'cash' && (
        <PaymentOptionCash
          orderTotal={cart.balance ?? cart.total}
          defaultValue={paymethodSelected?.data?.cash}
          onChangeData={handlePaymethodDataChange}
          setErrorCash={props.setErrorCash}
        />
      )}

      {stripeOptions.includes(paymethodSelected?.gateway) &&
        (paymethodData?.brand || paymethodData?.card?.brand) &&
        (paymethodData?.last4 || paymethodData?.card?.last4) &&
        (
          <PMCardSelected>
            <PMCardItemContent>
              <View style={styles.viewStyle}>
                <MaterialCommunityIcons
                  name='radiobox-marked'
                  size={24}
                  color={theme.colors.primary}
                />
              </View>
              <View style={styles.viewStyle}>
                <OText>
                  {getIconCard((paymethodData?.brand || paymethodData?.card?.brand), 26)}
                </OText>
              </View>
              <View style={styles.viewStyle}>
                <OText
                  size={20}
                >
                  XXXX-XXXX-XXXX-{(paymethodData?.last4 || paymethodData?.card?.last4)}
                </OText>
              </View>
            </PMCardItemContent>
          </PMCardSelected>
        )}

      {/* Stripe */}
      {isOpenMethod?.paymethod?.gateway === 'stripe' && !paymethodData?.id && (
        <View style={{ width: '100%' }}>
          <OButton
            text={t('ADD_PAYMENT_CARD', 'Add New Payment Card')}
            bgColor={theme.colors.primary}
            borderColor={theme.colors.primary}
            style={styles.btnAddStyle}
            textStyle={{ color: 'white' }}
            imgRightSrc={null}
            onClick={() => setAddCardOpen({ ...addCardOpen, stripe: true })}
          />
          <StripeCardsList
            paymethod={isOpenMethod?.paymethod}
            businessId={props.businessId}
            publicKey={isOpenMethod?.paymethod?.credentials.publishable}
            payType={paymethodsList?.name}
            onSelectCard={handlePaymethodDataChange}
            onNavigationRedirect={onNavigationRedirect}
            onCancel={() => handlePaymethodClick(null)}
          />
        </View>
      )}

      <OModal
        entireModal
        title={t('ADD_CREDIT_OR_DEBIT_CARD', 'Add credit or debit card')}
        open={addCardOpen.stripe}
        onClose={() => setAddCardOpen({ ...addCardOpen, stripe: false })}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS == 'ios' ? 0 : 0}
          enabled={Platform.OS === 'ios' ? true : false}
        >
          <StripeElementsForm
            toSave
            businessId={props.businessId}
            publicKey={isOpenMethod?.paymethod?.credentials?.publishable}
            requirements={props.clientSecret}
            onSelectCard={handlePaymethodDataChange}
            onCancel={() => setAddCardOpen({ ...addCardOpen, stripe: false })}
          />
        </KeyboardAvoidingView>
      </OModal>

      {/* Stripe direct, Google pay, Apple pay */}
      <OModal
        entireModal
        title={t('ADD_CREDIT_OR_DEBIT_CARD', 'Add credit or debit card')}
        open={stripeDirectMethods?.includes(isOpenMethod?.paymethod?.gateway) && !paymethodData.id}
        onClose={() => handlePaymethodClick(null)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS == 'ios' ? 0 : 0}
          enabled={Platform.OS === 'ios' ? true : false}
        >
          <StripeElementsForm
            cart={cart}
            paymethod={isOpenMethod?.paymethod?.gateway}
            methodsPay={methodsPay}
            businessId={props.businessId}
            publicKey={isOpenMethod?.paymethod?.credentials?.publishable || isOpenMethod?.paymethod?.credentials?.publishable_key}
            handleSource={handlePaymethodDataChange}
            onCancel={() => handlePaymethodClick(null)}
            merchantId={merchantId}
          />
        </KeyboardAvoidingView>
      </OModal>

      {/* Stripe Connect */}
      {isOpenMethod?.paymethod?.gateway === 'stripe_connect' && !paymethodData?.id && (
        <View>
          <OButton
            text={t('ADD_PAYMENT_CARD', 'Add New Payment Card')}
            bgColor={theme.colors.primary}
            borderColor={theme.colors.primary}
            style={styles.btnAddStyle}
            textStyle={{ color: 'white' }}
            imgRightSrc={null}
            onClick={() => setAddCardOpen({ ...addCardOpen, stripeConnect: true })}
          />
          <StripeCardsList
            paymethod={isOpenMethod?.paymethod}
            businessId={props.businessId}
            publicKey={isOpenMethod?.paymethod?.credentials.publishable}
            payType={paymethodsList?.name}
            onSelectCard={handlePaymethodDataChange}
            onNavigationRedirect={onNavigationRedirect}
            onCancel={() => handlePaymethodClick(null)}
          />
        </View>
      )}

      <OModal
        entireModal
        title={t('ADD_CREDIT_OR_DEBIT_CARD', 'Add credit or debit card')}
        open={addCardOpen.stripeConnect}
        onClose={() => setAddCardOpen({ ...addCardOpen, stripeConnect: false })}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS == 'ios' ? 0 : 0}
          enabled={Platform.OS === 'ios' ? true : false}
        >
          <StripeElementsForm
            toSave
            businessId={props.businessId}
            publicKey={isOpenMethod?.paymethod?.credentials?.stripe?.publishable}
            requirements={isOpenMethod?.paymethod?.credentials?.publishable}
            accountId={isOpenMethod?.paymethod?.credentials?.user}
            onSelectCard={handlePaymethodDataChange}
            onCancel={() => setAddCardOpen({ ...addCardOpen, stripeConnect: false })}
          />
        </KeyboardAvoidingView>
      </OModal>

      {/* Stripe Redirect */}
      {/* <OModal
        isNotDecoration
        open={['stripe_redirect'].includes(paymethodSelected?.gateway) && !paymethodData.type}
        title={t('STRIPE_REDIRECT', 'Stripe Redirect')}
        onClose={() => handlePaymethodClick(null)}
      >
        <StripeRedirectForm
          businessId={props.businessId}
          currency={props.currency}
          // paymethods={flatArray([stripeRedirectValues, stripeRedirectOptions])}
          publicKey={paymethodSelected?.credentials?.publishable}
          paymethods={stripeRedirectOptions}
          handleStripeRedirect={handlePaymethodDataChange}
        />
      </OModal> */}

      {/* Paypal */}
      {/* <Modal
        className='modal-info'
        open={paymethodSelected?.gateway === 'paypal' && !paymethodData?.id}
        onClose={() => handlePaymethodClick(null)}
        title={t('PAY_WITH_PAYPAL', 'Pay with PayPal')}
      >
        {paymethodSelected?.gateway === 'paypal' && (
          <PaymentOptionPaypal
            clientId={paymethodSelected?.credentials?.client_id}
            body={{
              paymethod_id: paymethodSelected.id,
              amount: cart.total,
              delivery_zone_id: cart.delivery_zone_id,
              cartUuid: cart.uuid
            }}
            btnStyle={paypalBtnStyle}
            noAuthMessage={
              !token
                ? t('NEED_LOGIN_TO_USE', 'Sorry, you need to login to use this method')
                : null
            }
            handlerChangePaypal={(uuid) => onNavigationRedirect && onNavigationRedirect('OrderDetails', { orderId: uuid })}
          />
        )}
      </Modal> */}
    </PMContainer>
  )
}

const styles = StyleSheet.create({
  viewStyle: {
    marginRight: 10
  },
  cardsList: {
    borderWidth: 1,
    borderColor: 'red',
    flex: 1,
    height: 120
  },
  btnAddStyle: {
    marginVertical: 20,
  },
  btnCon: {
    height: 45,
    width: '70%',
    elevation: 1,
    backgroundColor: '#00457C',
    borderRadius: 3,
  },
  btn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnTxt: {
    color: '#fff',
    fontSize: 18,
  },
})

export const PaymentOptions = (props: any) => {
  const paymentOptions = {
    ...props,
    UIComponent: PaymentOptionsUI
  }
  return (
    <PaymentOptionsController {...paymentOptions} />
  )
}
