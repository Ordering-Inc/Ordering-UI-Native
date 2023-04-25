import React, { useEffect, useState } from 'react'
import {
  useLanguage,
  useConfig,
  useUtils,
  useToast,
  ToastType,
  MultiCartsPaymethodsAndWallets as MultiCartsPaymethodsAndWalletsController
} from 'ordering-components/native'
import { useTheme } from 'styled-components/native'
import { View, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder'
import { OText, OIcon, OModal, OButton } from '../shared'
import { getIconCard, flatArray } from '../../utils'
import { StripeElementsForm } from '../StripeElementsForm'
import { StripeCardsList } from '../StripeCardsList'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useApplePay } from '@stripe/stripe-react-native';

import {
  PMContainer,
  PMItem,
  WalletItem
} from './styles'

const MultiCartsPaymethodsAndWalletsUI = (props: any) => {
  const {
    businessIds,
    paymethodsAndWallets,
    walletsState,
    walletsPaymethod,
    paymethodSelected,
    handleSelectPaymethod,
    handleSelectWallet,
    handlePaymethodDataChange,
    setMethodPaySupported,
    placeByMethodPay,
    methodPaySupported,
    setPlaceByMethodPay,
    openCarts,
    cartTotal,
    handlePlaceOrder,
    merchantId
  } = props

  const theme = useTheme()
  const [, t] = useLanguage()
  const [{ configs }] = useConfig()
  const [{ parsePrice }] = useUtils()
	const [, { showToast }] = useToast();
  const { confirmApplePayPayment } = useApplePay()

  const [addCardOpen, setAddCardOpen] = useState({ stripe: false, stripeConnect: false });

  const isWalletCashEnabled = configs?.wallet_cash_enabled?.value === '1'
  const isWalletPointsEnabled = configs?.wallet_credit_point_enabled?.value === '1'

  const walletName: any = {
    cash: {
      name: t('PAY_WITH_CASH_WALLET', 'Pay with Cash Wallet'),
      isActive: isWalletCashEnabled
    },
    credit_point: {
      name: t('PAY_WITH_CREDITS_POINTS_WALLET', 'Pay with Credit Points Wallet'),
      isActive: isWalletPointsEnabled
    }
  }

  const creditBalance: any = (wallet: any) => ` = ${parsePrice(wallet.balance / wallet.redemption_rate, { isTruncable: true })}`
  const filterMethodsPay = (gateway: string) => Platform.OS === 'ios' ? gateway !== 'global_google_pay' : gateway !== 'global_apple_pay'
  const methodsPay = ['global_google_pay', 'global_apple_pay']

  const getPayIcon = (method: string) => {
    switch (method) {
      case 'cash':
        return theme.images.general.cash
      case 'card_delivery':
        return theme.images.general.carddelivery
      case 'paypal':
        return theme.images.general.paypal
      case 'stripe':
        return theme.images.general.creditCard
      case 'stripe_direct':
        return theme.images.general.stripecc
      case 'stripe_connect':
        return theme.images.general.stripes
      case 'stripe_redirect':
        return theme.images.general.stripesb
      case 'global_apple_pay':
        return theme.images.general.applePayMark
      case 'global_google_pay':
        return theme.images.general.googlePayMark
      default:
        return theme.images.general.creditCard
    }
  }

  useEffect(() => {
    if (methodsPay.includes(paymethodSelected?.gateway)) {
      if (typeof paymethodSelected?.paymethod_data === 'string') {
        const sourceId = JSON.parse(paymethodSelected?.paymethod_data)?.source_id
        sourceId && handlePlaceOrder(confirmApplePayPayment)
      }
    }
  }, [JSON.stringify(paymethodSelected)])

  useEffect(() => {
    if (cartTotal === 0) {
      handlePaymethodDataChange(null)
      handleSelectPaymethod(null)
    }
  }, [cartTotal])

  const handleChangePaymethod = (paymethod: any) => {
    if (cartTotal > 0) {
      handleSelectPaymethod(paymethod)
      return
    }
    showToast(
      ToastType.Error,
      t('CART_BALANCE_ZERO', 'Sorry, the amount to pay is equal to zero and it is not necessary to select a payment method'))
      ;
  }

  const renderPaymethods = ({ item }: any) => {
    return (
      <>
        {methodsPay.includes(item?.gateway) ? (
          <TouchableOpacity
            onPress={() => handleChangePaymethod({ ...item, paymethod: { gateway: item.gateway }, paymethod_id: item?.id })}
          >
            <OIcon
              src={getPayIcon(item.gateway)}
              width={70}
              height={70}
              style={{ marginRight: 10 }}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => handleChangePaymethod({ ...item, paymethod: { gateway: item.gateway }, paymethod_id: item?.id })}
          >
            <PMItem
              key={item.id}
              isActive={paymethodSelected?.id === item.id}
            >
              <OIcon
                src={getPayIcon(item?.gateway ?? item.paymethod?.gateway)}
                width={20}
                height={20}
                color={item?.gateway === 'global_apple_pay' ? '' : paymethodSelected?.id === item.id ? theme.colors.white : theme.colors.backgroundDark}
              />
              <OText
                size={10}
                style={{ margin: 0, marginTop: 4 }}
                color={paymethodSelected?.id === item.id ? theme.colors.white : '#000'}
              >
                {t(item?.gateway.toUpperCase(), item?.name)}
              </OText>
            </PMItem>
          </TouchableOpacity>
        )}
      </>
    )
  }

  return (
    <PMContainer>
      <OText size={16} lineHeight={24} color={theme.colors.textNormal} weight={'500'}>
        {t('PAYMENT_METHODS', 'Payment Methods')}
      </OText>
      {paymethodsAndWallets.loading ? (
        <Placeholder style={{ marginTop: 10, marginBottom: 10 }} Animation={Fade}>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            {[...Array(3)].map((_, i) => (
              <PlaceholderLine
                key={i}
                width={37}
                height={80}
                noMargin
                style={{ borderRadius: 10, marginRight: 10, }}
              />
            ))}
          </View>
        </Placeholder>
      ) : (
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={paymethodsAndWallets.paymethods.filter((p: any) => filterMethodsPay(p.gateway))}
          renderItem={renderPaymethods}
          keyExtractor={(paymethod: any) => paymethod?.id?.toString?.()}
        />
      )}
      {!paymethodsAndWallets.loading && !paymethodsAndWallets.error && paymethodsAndWallets.paymethods.length === 0 && (
        <OText size={12} style={{ margin: 0 }}>
          {t('NO_PAYMENT_METHODS', 'No payment methods!')}
        </OText>
      )}

      {paymethodSelected?.paymethod?.gateway === 'stripe' && (
        <View>
          <OButton
            text={t('ADD_PAYMENT_CARD', 'Add New Payment Card')}
            bgColor={theme.colors.white}
            borderColor={theme.colors.primary}
            style={styles.btnAddStyle}
            textStyle={{ color: theme.colors.primary, fontSize: 12 }}
            imgRightSrc={null}
            onClick={() => setAddCardOpen({ ...addCardOpen, stripe: true })}
          />
          <StripeCardsList
            paymethod={paymethodSelected?.paymethod}
            businessId={businessIds[0]}
            businessIds={businessIds}
            publicKey={paymethodSelected?.data?.publishable}
            payType={paymethodSelected?.paymethod?.name}
            onSelectCard={handlePaymethodDataChange}
          />
        </View>
      )}

      {/* Google pay, Apple pay */}
      {methodsPay.includes(paymethodSelected?.paymethod?.gateway) && (
        <StripeElementsForm
          toSave
          businessId={businessIds[0]}
          businessIds={businessIds}
          publicKey={paymethodSelected?.data?.publishable}
          requirements={props.clientSecret}
          handleSource={handlePaymethodDataChange}
          onCancel={() => setAddCardOpen({ ...addCardOpen, stripe: false })}
          setMethodPaySupported={setMethodPaySupported}
          methodPaySupported={methodPaySupported}
          placeByMethodPay={placeByMethodPay}
          setPlaceByMethodPay={setPlaceByMethodPay}
          methodsPay={methodsPay}
          paymethod={paymethodSelected?.paymethod?.gateway}
          cartTotal={cartTotal}
          merchantId={merchantId}
        />
      )}

      {(paymethodsAndWallets.loading || walletsState.loading) ? (
        <>
          {[...Array(2).keys()].map(i => (
            <PlaceholderLine
              key={i}
              height={40}
              noMargin
              style={{ marginBottom: 10 }}
            />
          ))}
        </>
      ) : (
        <>
          {walletsState?.result?.filter((wallet: any) =>
            paymethodsAndWallets.wallets.find((item: any) => item.type === wallet.type))
            .map((wallet: any, idx: any) => walletName[wallet.type]?.isActive &&
              (
                <WalletItem
                  key={wallet.type}
                  isBottomBorder={idx === paymethodsAndWallets.wallets?.length - 1}
                  onPress={() => handleSelectWallet(!!!walletsPaymethod?.find((walletPay: any) => walletPay.wallet_id === wallet.id)?.id, wallet)}
                >
                  {!!walletsPaymethod?.find((walletPay: any) => walletPay.wallet_id === wallet.id)?.id ? (
                    <MaterialCommunityIcons
                      name="checkbox-marked"
                      size={25}
                      color={theme.colors.primary}
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="checkbox-blank-outline"
                      size={25}
                      color={theme.colors.disabled}
                    />
                  )}
                  <OText size={12} style={{ flex: 1, marginLeft: 15 }}>{walletName[wallet.type]?.name}</OText>
                  {wallet.type === 'cash' && (
                    <OText>
                      {parsePrice(wallet?.balance, { isTruncable: true })}
                    </OText>
                  )}
                  {wallet.type === 'credit_point' && (
                    <OText>
                      <OText color={theme.colors.primary} weight='bold'>
                        {`${wallet?.balance} ${t('POINTS', 'Points')}`}
                      </OText>
                      <OText>
                        {wallet?.balance > 0
                          ? creditBalance(wallet)
                          : null}
                      </OText>
                    </OText>
                  )}
                </WalletItem>
              ))}
        </>
      )}

      <OModal
        entireModal
        title={t('ADD_CREDIT_OR_DEBIT_CARD', 'Add credit or debit card')}
        open={addCardOpen.stripe}
        onClose={() => setAddCardOpen({ ...addCardOpen, stripe: false })}
        style={{ backgroundColor: 'red' }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS == 'ios' ? 0 : 0}
          enabled={Platform.OS === 'ios' ? true : false}
        >
          <StripeElementsForm
            openCarts={openCarts}
            toSave
            businessId={businessIds[0]}
            businessIds={businessIds}
            publicKey={paymethodSelected?.data?.publishable}
            requirements={props.clientSecret}
            onSelectCard={handlePaymethodDataChange}
            onCancel={() => setAddCardOpen({ ...addCardOpen, stripe: false })}
          />
        </KeyboardAvoidingView>
      </OModal>
    </PMContainer>
  )
}

const styles = StyleSheet.create({
  btnAddStyle: {
    marginVertical: 20,
    borderRadius: 7.6,
    shadowOpacity: 0,
    height: 44,
    borderWidth: 1
  },
})


export const MultiCartsPaymethodsAndWallets = (props: any) => {
  const multiCartsPaymethodsAndWalletsProps = {
    ...props,
    UIComponent: MultiCartsPaymethodsAndWalletsUI
  }
  return <MultiCartsPaymethodsAndWalletsController {...multiCartsPaymethodsAndWalletsProps} />
}
