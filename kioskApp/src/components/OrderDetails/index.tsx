import React, { useEffect } from 'react'
import { View, StyleSheet, BackHandler, Dimensions } from 'react-native'
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

export const OrderDetailsUI = (props: OrderDetailsParams) => {

  const {
    navigation,
    isFromCheckout,
  } = props

  const [, t] = useLanguage()
  const [{ parsePrice, parseNumber }] = useUtils()

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

  return (
    <>
      
      <Spinner visible={!order || Object.keys(order).length === 0} />
      
      {order && Object.keys(order).length > 0 && (
        <>
          <Container>
            <NavBar
              title={t('TAKE_YOUR_RECEIPT', 'Take your receipt')}
            />

            <View style={{ marginVertical: _dim.height * 0.03 }}>
              <OText
                size={_dim.width * 0.05}
                mBottom={15}
              >
                {t('WE_KNOW_YOU_ARE', 'We know you are')} {'\n'}
                <OText
                  size={_dim.width * 0.05}
                  weight="700"
                >
                  {`${t('HUNGRY', 'hungry')}, Cuco!`}
                </OText>
              </OText>

              <OText
                size={_dim.width * 0.04}
              >
                {t('TO_FINISH_TAKE_YOUR_RECEIPT_AND_GO_TO_THE_FRONT_COUNTER', 'To finish take your receipt and go to the front counter.')}
              </OText>
            </View>

            <OSOrderDetailsWrapper>
              <OSTable>
                <OText>
                  <OText
                    size={_dim.width * 0.04}
                    weight="700"
                  >
                    {t('ORDER_NUMBER', 'Order No.')} {' '}
                  </OText>
                  <OText
                    size={_dim.width * 0.04}
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

                    <GridContainer style={{ maxWidth: _dim.width * 0.6 }}>
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
          </Container>

          <OSActions>
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
          </OSActions>
        </>
      )}
    </>
  )
}

const _dim = Dimensions.get('window');

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
