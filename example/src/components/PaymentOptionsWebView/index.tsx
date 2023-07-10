import React, { useRef, useState } from 'react'
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import WebView from 'react-native-webview';
import { ActivityIndicator } from 'react-native-paper';

import {
  ToastType,
  useToast,
  useApi,
  useLanguage,
  useConfig,
  useOrder
} from 'ordering-components/native';

import { OText } from '../shared';

interface PaymentOptionsWebViewParams {
  onNavigationRedirect?: Function,
  uri?: any,
  user?: any,
  token?: any,
  cart?: any,
  currency?: any,
  webviewPaymethod?: any,
  setShowGateway?: any,
  setOpenOrderCreating?: any,
  locationId?: any,
  additionalParams?: any
  title?: string
}
export const PaymentOptionsWebView = (props: PaymentOptionsWebViewParams) => {
  const {
    onNavigationRedirect,
    uri,
    user,
    token,
    cart,
    currency,
    webviewPaymethod,
    setShowGateway,
    setOpenOrderCreating,
    locationId,
    title,
    additionalParams = {}
  } = props

  const webviewRef = useRef<any>(null)
  const [, { showToast }] = useToast();
  const [ordering] = useApi()
  const [{ configs }] = useConfig();
  const [, t] = useLanguage();
  const [, { confirmCart }] = useOrder()

  const [progClr, setProgClr] = useState('#424242');
  const [prog, setProg] = useState(true);

  const handleCloseWebview = () => {
    setProg(true);
    setShowGateway({ open: false, closedByUser: true })
  }

  const onMessage = async (e: any) => {
    if (e?.nativeEvent?.data && e?.nativeEvent?.data !== 'undefined') {
      let payment = JSON.parse(e.nativeEvent.data);
      if (payment?.response && payment?.responsetext && payment.orderid) {
        const credomaticData = {
          credomatic: {
            ...payment
          }
        }
        const confirmCartRes = await confirmCart(payment.orderid, credomaticData)
        if (confirmCartRes.error) {
          showToast(ToastType.Error, confirmCartRes.error.message)
        }
        if (confirmCartRes.result.order?.uuid) {
          onNavigationRedirect?.('OrderDetails', { orderId: confirmCartRes.result.order.uuid, isFromCheckout: true })
        }
      }

      if (payment === 'api error' || payment === 'Cancelled by user') {
        setShowGateway({ closedByUser: true, open: false })
        setProg(true);
      }

      if (payment) {
        if (payment.error) {
          showToast(ToastType.Error, payment.result)
          setOpenOrderCreating && setOpenOrderCreating(false)
        } else if (payment?.result?.order?.uuid) {
          showToast(ToastType.Success, t('ORDER_PLACED_SUCCESSfULLY', 'The order was placed successfully'))
          onNavigationRedirect && onNavigationRedirect('OrderDetails', { orderId: payment?.result?.order?.uuid, isFromCheckout: true })
        }
        setProg(true);
        setShowGateway({ closedByUser: false, open: false })
      }
    }
  }

  return (
    <View style={{ zIndex: 9999, height: '100%', width: '100%', position: 'absolute', backgroundColor: 'white' }}>
      <Icon
        name="x"
        size={35}
        style={{ backgroundColor: 'white', paddingTop: 30, paddingLeft: 10 }}
        onPress={handleCloseWebview}
      />
      <OText
        style={{
          textAlign: 'center',
          fontSize: 16,
          fontWeight: 'bold',
          color: '#00457C',
          marginBottom: 5,
          marginTop: 10
        }}>
        {title || (webviewPaymethod?.gateway === 'paypal' ? (t('PAYPAL_GATEWAY', 'PayPal GateWay')) : (t('SQUARE_PAYMENT', 'Square payment')))}
      </OText>
      <View style={{ padding: 20, opacity: prog ? 1 : 0, backgroundColor: 'white' }}>
        <ActivityIndicator size={24} color={progClr} />
      </View>
      <WebView
        source={{ uri: uri }}
        onMessage={onMessage}
        ref={webviewRef}
        javaScriptEnabled={true}
        javaScriptEnabledAndroid={true}
        cacheEnabled={false}
        cacheMode='LOAD_NO_CACHE'
        style={{ flex: 1 }}
        onShouldStartLoadWithRequest={() => true}
        originWhitelist={["*"]}
        onLoadStart={() => {
          setProg(true);
          setProgClr('#424242');
        }}
        onLoadProgress={() => {
          setProg(true);
          setProgClr('#00457C');
        }}
        onLoad={() => {
          setProg(true);
          setProgClr('#00457C');
        }}
        onLoadEnd={(e) => {
          const messageParams = locationId ? { locationId, clientId: webviewPaymethod?.credentials?.application_id } : {}
          const message = {
            action: 'init',
            data: {
              urlPlace: `${ordering.root}/carts/${cart?.uuid}/place`,
              urlConfirm: `${ordering.root}/carts/${cart?.uuid}/confirm`,
              payData: {
                paymethod_id: webviewPaymethod?.id,
                amount: cart?.balance ?? cart?.total,
                delivery_zone_id: cart?.delivery_zone_id,
                user_id: user?.id,
                user_name: user?.name
              },
              xappx: ordering?.appId,
              currency: configs?.stripe_currency?.value || currency,
              userToken: token,
              clientId: webviewPaymethod?.credentials?.client_id,
              ...messageParams,
              ...additionalParams
            }
          }
          setProg(false);
          webviewRef?.current?.postMessage?.(JSON.stringify(message))
        }}
      />
    </View>
  )
}
