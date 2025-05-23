import React, { useEffect } from 'react'
import { useLanguage, useUtils, useToast, ToastType, useConfig, MultiOrdersDetails as MultiOrdersDetailsController } from 'ordering-components/native'
import { View, StyleSheet, BackHandler, TouchableOpacity } from 'react-native'
import { useTheme } from 'styled-components/native'
import { OText, OButton } from '../shared'
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder'
import { SingleOrderCard } from './SingleOrderCard'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import { getOrderStatus } from '../../utils'

import {
  OrdersDetailsContainer,
  Header,
  Divider,
  Section,
  Customer,
  InfoBlock,
  Row,
  OrdersSummary,
  BorderLine,
  StaturBar
} from './styles'
import { NotFoundSource } from '../NotFoundSource'
import LinearGradient from 'react-native-linear-gradient'

export const MultiOrdersDetailsUI = (props: any) => {
  const {
    navigation,
    customer,
    paymentEvents,
    ordersSummary,
    isFromMultiCheckout
  } = props

  const theme = useTheme()
  const styles = StyleSheet.create({
    btnBackArrow: {
      borderWidth: 0,
      backgroundColor: theme.colors.clear,
      shadowColor: theme.colors.clear,
      padding: 0,
      marginLeft: -20
    },
    statusBar: {
      height: 12,
    }
  })

  const { loading, orders, error } = props.ordersList
  const [, t] = useLanguage()
  const [{ parsePrice, parseNumber, parseDate }] = useUtils();
  const [, { showToast }] = useToast();
  const [{ configs }] = useConfig()

  const isTaxIncludedOnPrice = orders.every((_order: any) => _order.taxes?.length ? _order.taxes?.every((_tax: any) => _tax.type === 1) : true)
  const deliveryType = orders.find((order: any) => order.delivery_type)?.delivery_type
  const progressBarStyle = configs.multi_business_checkout_progress_bar_style?.value
  const showBarInOrder = ['group', 'both']
  const showBarInIndividual = ['individual', 'both']

  const walletName: any = {
    cash: {
      name: t('PAY_WITH_CASH_WALLET', 'Pay with Cash Wallet')
    },
    credit_point: {
      name: t('PAY_WITH_CREDITS_POINTS_WALLET', 'Pay with Credit Points Wallet')
    }
  }

  const handleArrowBack: any = () => {
    if (!isFromMultiCheckout) {
      navigation?.canGoBack() && navigation.goBack();
      return;
    }
    navigation.navigate('BottomTab');
    return true
  }

  const handleGoToOrderDetails = (uuid: any) => {
    navigation.navigate('OrderDetails', { orderId: uuid })
  }

  useEffect(() => {
    if (error) {
      showToast(ToastType.Error, error)
    }
  }, [error])

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleArrowBack)
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleArrowBack)
    }
  }, [])

  return (
    <OrdersDetailsContainer keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: 20 }}>
      <View style={{ flexDirection: 'row' }}>
        <OButton
          imgRightSrc={null}
          style={styles.btnBackArrow}
          onClick={() => handleArrowBack()}
          icon={AntDesignIcon}
          useArrow
          iconProps={{
            name: 'arrowleft',
            size: 26
          }}
        />
      </View>
      <Header>
        {loading ? (
          <Placeholder Animation={Fade}>
            <PlaceholderLine
              width={20}
              height={30}
              noMargin
              style={{ borderRadius: 10, marginBottom: 8 }}
            />
            <PlaceholderLine
              height={18}
              noMargin
              style={{ borderRadius: 10 }}
            />
          </Placeholder>
        ) : (
          <>
            <OText size={20} lineHeight={30} mBottom={8} color={theme.colors.textNormal}>
              {t('HEY', 'Hey')} <OText size={20} lineHeight={30} weight={700} mLeft={10} color={theme.colors.textNormal}>{customer?.name} {customer?.lastname}</OText>
            </OText>
            <OText size={12} lineHeight={18} color={theme.colors.textNormal}>{t('ORDER_MESSAGE_HEADER_TEXT', 'Once business accepts your order, we will send you an email, thank you!')}</OText>
          </>
        )}
      </Header>
      <Divider />
      <Section>
        <OText size={16} lineHeight={24} weight={'500'} color={theme.colors.textNormal} mBottom={16}>
          {t('CUSTOMER_DETAILS', 'Customer Details')}
        </OText>
        {loading ? (
          <Customer>
            <PlaceholderLine height={18} noMargin style={{ borderRadius: 2 }} />
            <PlaceholderLine height={18} noMargin style={{ borderRadius: 2 }} />
            <PlaceholderLine height={18} noMargin style={{ borderRadius: 2 }} />
          </Customer>
        ) : (
          <Customer>
            <InfoBlock>
              <OText size={12} lineHeight={18} color={theme.colors.textNormal} mBottom={2}>
                {customer?.name} {customer?.lastname}
              </OText>
              <OText size={12} lineHeight={18} color={theme.colors.textNormal} mBottom={2}>
                {customer?.address}
              </OText>
              <OText size={12} lineHeight={18} color={theme.colors.textNormal} mBottom={2}>
                {customer?.cellphone}
              </OText>
            </InfoBlock>
          </Customer>
        )}
      </Section>
      <Divider />
      <Section>
        <OText size={16} lineHeight={24} weight={'500'} color={theme.colors.textNormal} mBottom={16}>
          {t('PAYMETHOD', 'Payment method')}
        </OText>
        {paymentEvents.map((event: any) => (
          <OText key={event.id} size={12} lineHeight={18} color={theme.colors.textNormal}>
            {event?.wallet_event
              ? walletName[event?.wallet_event?.wallet?.type]?.name
              : t(event?.paymethod?.name.toUpperCase()?.replace(/ /g, '_'), event?.paymethod?.name)}
          </OText>
        ))}
      </Section>
      <Divider />
      {deliveryType === 1 && (
        <>
          <Section>
            <OText size={16} lineHeight={24} weight={'500'} color={theme.colors.textNormal} mBottom={20}>
              {t('DELIVERYA_V21', 'Delivery address')}
            </OText>
            {loading ? (
              <PlaceholderLine height={18} noMargin style={{ borderRadius: 2 }} />
            ) : (
              <OText size={12} lineHeight={18} color={theme.colors.textNormal} mBottom={2}>
                {customer?.address}
              </OText>
            )}
          </Section>
          <Divider />
        </>
      )}
      {loading ? (
        <Placeholder Animation={Fade}>
          <PlaceholderLine
            height={300}
            noMargin
            style={{ borderRadius: 10, marginBottom: 8 }}
          />
        </Placeholder>
      ) : (
        <OrdersSummary>
          <OText size={16} lineHeight={24} weight={'500'} color={theme.colors.textNormal} mBottom={20}>
            {t('ORDER_SUMMARY', 'Order summary')}
          </OText>
          {(showBarInOrder.includes(progressBarStyle)) && (
            <StaturBar isOrderDetails>
              <LinearGradient
                start={{ x: 0.0, y: 0.0 }}
                end={{
                  x: getOrderStatus(orders[0]?.status, t)?.percentage || 0,
                  y: 0,
                }}
                locations={[0.9999, 0.9999]}
                colors={[theme.colors.primary, theme.colors.backgroundGray100]}
                style={styles.statusBar}
              />
            </StaturBar>
          )}
          <OText size={14} lineHeight={18} weight={'400'} color={theme.colors.textNormal} mBottom={10}>
            {getOrderStatus(orders[0]?.status, t)?.value}
          </OText>
          {orders.map((order: any) => (
            <Row key={order.id}>
              <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>
                {t('ORDER', 'Order')} #{order.id}
              </OText>
              <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>
                {parsePrice(order?.summary?.total ?? order?.total)}
              </OText>
            </Row>
          ))}
          <BorderLine />
          {!isTaxIncludedOnPrice && (
            <>
              <Row>
                <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>
                  {t('TOTAL_BEFORE_TAX', 'Total before tax')}:
                </OText>
                <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>
                  {parsePrice(ordersSummary?.subtotal)}
                </OText>
              </Row>
              <Row>
                <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>
                  {t('ESTIMATED_TAX_TO_BE_COLLECTED', 'Estimated tax to be collected')}:
                </OText>
                <OText size={12} lineHeight={18} weight={'400'} color={theme.colors.textNormal}>
                  {parsePrice(ordersSummary?.tax)}
                </OText>
              </Row>
              <BorderLine />
            </>
          )}
          <Row style={{ marginTop: 10 }}>
            <OText size={14} lineHeight={18} weight={'500'} color={theme.colors.textNormal}>
              {t('PAYMENT_TOTAL', 'Payment total')}:
            </OText>
            <OText size={14} lineHeight={18} weight={'500'} color={theme.colors.textNormal}>
              {parsePrice(ordersSummary?.total)}
            </OText>
          </Row>
        </OrdersSummary>
      )}

      {loading ? (
        [...Array(3).keys()].map(i => (
          <Placeholder Animation={Fade} key={i}>
            <PlaceholderLine
              height={300}
              noMargin
              style={{ borderRadius: 10, marginBottom: 8 }}
            />
          </Placeholder>
        ))
      ) : (
        <>
          {orders.map((order: any) => (
            <React.Fragment key={order.id}>
              <SingleOrderCard
                navigation={navigation}
                order={order}
                handleGoToOrderDetails={handleGoToOrderDetails}
                showProgressBar={showBarInIndividual.includes(progressBarStyle)}
              />
              <Divider />
            </React.Fragment>
          ))}
        </>
      )}
      {!loading && (error || orders?.length === 0) && (
        error?.includes('ERROR_ACCESS_EXPIRED') ? (
          <NotFoundSource
            content={t(error[0], 'Sorry, the order has expired.')}
          />
        ) : (
          <NotFoundSource
            content={t('NOT_FOUND_ORDER', theme?.defaultLanguages?.NOT_FOUND_ORDER || 'Sorry, we couldn\'t find the requested order.')}
            btnTitle={t('ORDERS_REDIRECT', theme?.defaultLanguages?.ORDERS_REDIRECT || 'Go to Orders')}
            onClickButton={navigation.navigate('BusinessList')}
          />
        )
      )}
      <Divider />
    </OrdersDetailsContainer>
  )
}

export const MultiOrdersDetails = (props: any) => {
  const MultiOrdersDetails = {
    ...props,
    UIComponent: MultiOrdersDetailsUI
  }
  return <MultiOrdersDetailsController {...MultiOrdersDetails} />
}
