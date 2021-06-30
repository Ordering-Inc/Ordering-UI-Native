import React, { useEffect } from 'react'
import { View, StyleSheet, BackHandler, Alert } from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'
import {
  useLanguage,
  OrderDetails as OrderDetailsConTableoller,
  useUtils,
} from 'ordering-components/native'

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
import { colors } from '../../theme.json'
import GridContainer from '../../layouts/GridContainer';
import OptionSwitch, { Opt } from '../../components/shared/OOptionToggle';
import { verifyDecimals } from '../../utils'
import { LANDSCAPE, PORTRAIT, useDeviceOrientation } from '../../hooks/device_orientation_hook'

export const OrderDetailsUI = (props: OrderDetailsParams) => {

  const {
    navigation,
    isFromCheckout,
  } = props

  const [, t] = useLanguage()
  const [{ parsePrice, parseNumber }] = useUtils()
  const [orientationState] = useDeviceOrientation();

  const { order } = props.order

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

  const optionsToSendReceipt: Opt[] = [
		{
			key: 'email',
			label: t('EMAIL', 'Email'),
			value: 'email',
			isDefault: true,
		},
		{
			key: 'sms',
			label: t('SMS', 'SMS'),
			value: 'sms',
		}
  ]
  
  useEffect(() => {
    const backAction = () => {
      Alert.alert(`${t('HOLD_ON', 'Hold on')}!`, `${t('ARE_YOU_SURE_YOU_WANT_TO_GO_BACK', 'Are you sure you want to go back')}?`, [
        {
          text: t('CANCEL', 'cancel'),
          onPress: () => null,
          style: "cancel"
        },
        { text: t('YES', 'yes'), onPress: () => {
          navigation.reset({
            routes: [{ name: 'Intro' }]
          });
        }}
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const actionsContent = (
    <View
      style={{ maxHeight: 300 }}
    >
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
            onChange={(opt) => {
              console.log(opt.value)
            }}
          />
          
        </OSTable>

        <OSTable>
          <OInput
            placeholder="yourname@mailhost.com"
            onChange={(e: any) => {}}
            style={styles.inputsStyle}
          />
          <OButton
            onClick={() => {}}
            text={t('SEND', 'Send')}
          />
        </OSTable>
      </OSInputWrapper>

      <OButton
        text={`${t('YOU ARE DONE', 'You are done')}!`}
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
            color={colors.primary}
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
                  source={{uri: product?.images || ''}}
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
            color={colors.primary}
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
            { order?.offer_type  === 1 ? `${verifyDecimals(order?.offer_rate, parseNumber)}%` : parsePrice(order?.summary?.discount || order?.discount) } {t('OFF', 'off')}
          </OText>
        </OText>

        <OText
          color={colors.primary}
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
            color={colors.primary}
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
                    size={orientationState?.dimensions?.width * 0.05}
                    mBottom={15}
                  >
                    {t('WE_KNOW_YOU_ARE', 'We know you are')} {'\n'}
                    <OText
                      size={orientationState?.dimensions?.width * 0.05}
                      weight="700"
                    >
                      {`${t('HUNGRY', 'hungry')}, Cuco!`}
                    </OText>
                  </OText>

                  <OText
                    size={orientationState?.dimensions?.width * (orientationState?.orientation === PORTRAIT ? 0.04 : 0.03)}
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
                { orderDetailsContent }
              </View>
            </View>
          </Container>

          <OSActions>
            {orientationState?.orientation === PORTRAIT && actionsContent}
          </OSActions>
        </>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  inputsStyle: {
    borderColor: colors.secundaryContrast,
		marginRight: 30,
  },
});

export const OrderDetails = (props: OrderDetailsParams) => {
  const orderDetailsProps = {
    ...props,
    UIComponent: OrderDetailsUI
  }

  return (
    <OrderDetailsConTableoller {...orderDetailsProps} />
  )
}
