import React, { useEffect, useState } from 'react';
import { FlatList, TouchableOpacity, View, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ToastType, useToast } from '../../providers/ToastProvider';
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
import { colors, images } from '../../theme.json';
import { getIconCard, flatArray } from '../../utils';
import { WebView } from 'react-native-webview';
import { useRef } from 'react';

const stripeOptions: any = ['stripe_direct', 'stripe', 'stripe_connect']
// const stripeRedirectOptions = [
//   { name: 'Bancontact', value: 'bancontact' },
//   { name: 'Alipay', value: 'alipay' },
//   { name: 'Giropay', value: 'giropay' },
//   { name: 'iDEAL', value: 'ideal' }
// ]

const getPayIcon = (method: string) => {
  switch (method) {
    case 'cash':
      return images.general.cash
    case 'card_delivery':
      return images.general.carddelivery
    case 'paypal':
      return images.general.paypal
    case 'stripe':
      return images.general.stripe
    case 'stripe_direct':
      return images.general.stripecc
    case 'stripe_connect':
      return images.general.stripes
    case 'stripe_redirect':
      return images.general.stripesb
    default:
      return images.general.creditCard
  }
}

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
    isOpenMethod
  } = props
  const [, t] = useLanguage();

  const [addCardOpen, setAddCardOpen] = useState({ stripe: false, stripeConnect: false });
  const [showGateway, setShowGateway] = useState(false);
  const [prog, setProg] = useState(false);
  const [progClr, setProgClr] = useState('#000');
  const { showToast } = useToast();
  const webviewRef = useRef<any>(null)

  const [{ token, user }] = useSession()
  const paymethodSelected = props.paySelected || props.paymethodSelected || isOpenMethod?.paymethod
  // const [{ token }] = useSession()

  // const [card, setCard] = useState(null);

  // const stripeRedirectValues = [
  //   { name: t('SELECT_A_PAYMENT_METHOD', 'Select a payment method'), value: '-1' },
  // ]

  const onMessage = (e : any) => {
    let data = e.nativeEvent.data;
    let payment = data;
    console.log(data)
  }



  const handlePaymentMethodClick = (paymethod: any) => {
    const isPopupMethod = ['stripe', 'stripe_direct', 'stripe_connect', 'stripe_redirect', 'paypal'].includes(paymethod?.gateway)
    handlePaymethodClick(paymethod, isPopupMethod)
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

  const renderPaymethods = ({ item }: any) => {
    return (
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
            color={paymethodSelected?.id === item.id ? colors.white : colors.backgroundDark}
          />
          <OText
            size={12}
            style={{ margin: 0 }}
            color={paymethodSelected?.id === item.id ? colors.white : '#000'}
          >
            {t(item.gateway.toUpperCase(), item.name)}
          </OText>
        </PMItem>
      </TouchableOpacity>
    )
  }

  const excludeIds: any = [3, 32, 66]; //exclude paypal & connect & redirect

  return (
    <PMContainer>
      {paymethodsList.paymethods.length > 0 && (
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          // data={paymethodsList.paymethods.sort((a: any, b: any) => a.id - b.id)}
          data={paymethodsList.paymethods.sort((a: any, b: any) => a.id - b.id).filter((p: any) => !excludeIds.includes(p.id))}
          renderItem={renderPaymethods}
          keyExtractor={(paymethod: any) => paymethod.id.toString()}
        />
      )}

      <View style={styles.btnCon}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => setShowGateway(true)}>
          <OText style={styles.btnTxt}>Pay Using PayPal</OText>
        </TouchableOpacity>
      </View>

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
          orderTotal={cart.total}
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
                color={colors.primary}
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
      {isOpenMethod?.paymethod?.gateway === 'stripe' && !paymethodData.id && (
        <View>
          <OButton
            text={t('ADD_PAYMENT_CARD', 'Add New Payment Card')}
            bgColor={colors.primary}
            borderColor={colors.primary}
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

      {/* Stripe direct */}
      <OModal
        entireModal
        title={t('ADD_CREDIT_OR_DEBIT_CARD', 'Add credit or debit card')}
        open={isOpenMethod?.paymethod?.gateway === 'stripe_direct' && !paymethodData.id}
        onClose={() => handlePaymethodClick(null)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS == 'ios' ? 0 : 0}
          enabled={Platform.OS === 'ios' ? true : false}
        >
          <StripeElementsForm
            businessId={props.businessId}
            publicKey={isOpenMethod?.paymethod?.credentials?.publishable}
            handleSource={handlePaymethodDataChange}
            onCancel={() => handlePaymethodClick(false)}
          />
        </KeyboardAvoidingView>
      </OModal>

      {/* Stripe Connect */}
      {isOpenMethod?.paymethod?.gateway === 'stripe_connect' && !paymethodData.id && (
        <View>
          <OButton
            text={t('ADD_PAYMENT_CARD', 'Add New Payment Card')}
            bgColor={colors.primary}
            borderColor={colors.primary}
            style={styles.btnAddStyle}
            textStyle={{color: 'white'}}
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
        open={paymethodSelected?.gateway === 'paypal' && !paymethodData.id}
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
      <OModal
        open={showGateway}
        onCancel={() => setShowGateway(false)}
        onAccept={() => setShowGateway(false)}
        onClose={() => setShowGateway(false)}
        entireModal
      >
        <OText
          style={{
            textAlign: 'center',
            fontSize: 16,
            fontWeight: 'bold',
            color: '#00457C',
            marginBottom: 5
          }}>
          PayPal GateWay
        </OText>
        <View style={{padding: 13, opacity: prog ? 1 : 0}}>
          <ActivityIndicator size={24} color={progClr} />
        </View>
        <WebView
          source={{ uri: 'https://test-90135.web.app' }}
          onMessage={onMessage}
          ref={webviewRef}
          javaScriptEnabled={true}
          javaScriptEnabledAndroid={true}
          cacheEnabled={false}
          cacheMode='LOAD_NO_CACHE'
          style={{ flex: 1 }}
          onLoadStart={() => {
            setProg(true);
            setProgClr('#000');
          }}
          onLoadProgress={() => {
            setProg(true);
            setProgClr('#00457C');
          }}
          onLoadEnd={(e) => {
            const message = {
              action: 'init',
              data: {
                urlPlace: `https://apiv4.ordering.co/v400/en/luisv4/carts/${cart?.uuid}/place`,
                urlConfirm: `https://apiv4.ordering.co/v400/en/luisv4/carts/${cart?.uuid}/confirm`,
                payData: {
                  paymethod_id: 3,
                  amount: cart?.total,
                  delivery_zone_id: cart?.delivery_zone_id,
                  user_id: user?.id
                },
                userToken: token,
              }
            }
            setProg(false);
            webviewRef.current.postMessage(JSON.stringify(message))
          }}
          onLoad={() => {
            setProg(false);
          }}
        />
      </OModal>
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
