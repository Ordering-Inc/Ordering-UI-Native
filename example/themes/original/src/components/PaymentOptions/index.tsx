import React, { useEffect, useState } from 'react';
import { FlatList, TouchableOpacity, View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import {
	Placeholder,
	PlaceholderLine,
	Fade
} from "rn-placeholder";

import {
	PaymentOptions as PaymentOptionsController,
	useLanguage,
	ToastType,
	useToast,
} from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { PaymentOptionCash } from '../PaymentOptionCash';
import { StripeElementsForm } from '../StripeElementsForm';
import { StripeCardsList } from '../StripeCardsList';
import { PaymentOptionCard } from '../PaymentOptionCard'

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
import { getIconCard, flatArray } from '../../utils';
import { useApplePay } from '@stripe/stripe-react-native';

const stripeOptions: any = ['stripe_direct', 'stripe', 'stripe_connect']
const methodsPay = ['google_pay', 'apple_pay']
const stripeDirectMethods = ['stripe_direct']
// const stripeRedirectOptions = [
//   { name: 'Bancontact', value: 'bancontact' },
//   { name: 'Alipay', value: 'alipay' },
//   { name: 'Giropay', value: 'giropay' },
//   { name: 'iDEAL', value: 'ideal' }
// ]

const webViewPaymentGateway: any = ['paypal', 'square']
const multiCheckoutMethods = ['global_google_pay', 'global_apple_pay']
const cardsPaymethods = ['credomatic']

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
		handlePaymentMethodClickCustom,
		handlePlaceOrder,
		merchantId,
		setMethodPaySupported,
		placeByMethodPay,
		methodPaySupported,
		setPlaceByMethodPay,
		setCardList,
		onPaymentChange,
		requiredFields,
		openUserModal,
		paymethodClicked,
		setPaymethodClicked
	} = props

	const theme = useTheme();
	const [, { showToast }] = useToast();
	const { confirmApplePayPayment } = useApplePay()

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
			case 'apple_pay':
				return theme.images.general.applePayMark
			case 'google_pay':
				return theme.images.general.googlePayMark
			default:
				return theme.images.general.creditCard
		}
	}

	const [, t] = useLanguage();

	const [addCardOpen, setAddCardOpen] = useState({ stripe: false, stripeConnect: false, card: false });
	const paymethodSelected = props.paySelected || props.paymethodSelected || isOpenMethod?.paymethod
	// const [{ token }] = useSession()

	// const [card, setCard] = useState(null);

	// const stripeRedirectValues = [
	//   { name: t('SELECT_A_PAYMENT_METHOD', 'Select a payment method'), value: '-1' },
	// ]

	const paymethodsFieldRequired = ['paypal', 'apple_pay', 'global_apple_pay']

	const handlePaymentMethodClick = (paymethod: any) => {
		if (cart?.balance > 0) {
			if (paymethodsFieldRequired.includes(paymethod?.gateway) && requiredFields.length > 0) {
				openUserModal && openUserModal(true)
				setPaymethodClicked({
					confirmed: false,
					paymethod
				})
				return
			}
			const isPopupMethod = ['stripe', 'stripe_direct', 'stripe_connect', 'stripe_redirect', 'paypal'].includes(paymethod?.gateway)
			if (webViewPaymentGateway.includes(paymethod?.gateway)) {
				handlePaymentMethodClickCustom(paymethod)
			}
			handlePaymethodClick(paymethod, isPopupMethod)
			return
		}
		showToast(
			ToastType.Error,
			t('CART_BALANCE_ZERO', 'Sorry, the amount to pay is equal to zero and it is not necessary to select a payment method'))
			;
	}

	useEffect(() => {
		if (cart?.balance === 0) {
			handlePaymethodClick(null)
		}
	}, [cart?.balance])

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
			requestAnimationFrame(() => {
				setPaymethodData && setPaymethodData(props.paySelected?.data)
			})
		}
	}, [props.paySelected])

	useEffect(() => {
		if (methodsPay.includes(paymethodSelected?.gateway) && paymethodData?.id && paymethodSelected?.data?.card) {
			handlePlaceOrder(confirmApplePayPayment)
		}
	}, [paymethodData, paymethodSelected])

	useEffect(() => {
		if (paymethodClicked?.confirmed) {
			handlePaymentMethodClickCustom(paymethodClicked?.paymethod)
		}
	}, [paymethodClicked?.confirmed])


	const renderPaymethods = ({ item }: any) => {
		return (
			<>
				{methodsPay.includes(item?.gateway) ? (
					<TouchableOpacity
						onPress={() => handlePaymentMethodClick(item)}
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
						onPress={() => handlePaymentMethodClick(item)}
					>
						<PMItem
							key={item.id}
							isDisabled={isDisabled}
							isActive={paymethodSelected?.id === item.id}
						>
							<OIcon
								src={getPayIcon(item.gateway)}
								width={20}
								height={20}
								color={item?.gateway === 'apple_pay' ? '' : paymethodSelected?.id === item.id ? theme.colors.white : theme.colors.backgroundDark}
							/>
							<OText
								size={10}
								style={{ margin: 0, marginTop: 4 }}
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

	const excludeIds: any = [32]; //exclude paypal & connect & redirect
	const filterMethodsPay = (gateway: string) => Platform.OS === 'ios' ? gateway !== 'google_pay' : gateway !== 'apple_pay'

	return (
		<PMContainer>
			{paymethodsList.paymethods.length > 0 && (
				<FlatList
					horizontal
					showsHorizontalScrollIndicator={false}
					// data={paymethodsList.paymethods.sort((a: any, b: any) => a.id - b.id)}
					data={paymethodsList.paymethods.sort((a: any, b: any) => a.id - b.id)
						.filter((p: any) =>
							!multiCheckoutMethods.includes(p.gateway) &&
							filterMethodsPay(p.gateway) &&
							!excludeIds.includes(p.id))}
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

			{/* {stripeOptions.includes(paymethodSelected?.gateway) &&
				(paymethodData?.brand || paymethodData?.card?.brand) &&
				(paymethodData?.last4 || paymethodData?.card?.last4) &&
				(
					<PMCardSelected>
						<PMCardItemContent>
							<View style={styles.viewStyle}>
								<OIcon
									src={theme.images.general.radio_act}
									width={16}
									color={theme.colors.primary}
								/>
							</View>
							<View style={styles.viewStyle}>
								<OText>
									{getIconCard((paymethodData?.brand || paymethodData?.card?.brand), 20)}
								</OText>
							</View>
							<View style={styles.viewStyle}>
								<OText
									size={12}
									lineHeight={18}
									color={theme.colors.textNormal}
								>
									XXXX-XXXX-XXXX-{(paymethodData?.last4 || paymethodData?.card?.last4)}
								</OText>
							</View>
						</PMCardItemContent>
					</PMCardSelected>
				)} */}

			{/* Stripe */}
			{isOpenMethod?.paymethod?.gateway === 'stripe' && (
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
						paymethod={isOpenMethod?.paymethod}
						businessId={props.businessId}
						publicKey={isOpenMethod?.paymethod?.credentials?.publishable}
						payType={paymethodsList?.name}
						onSelectCard={handlePaymethodDataChange}
						onNavigationRedirect={onNavigationRedirect}
						paymethodCardId={paymethodData?.id}
						onCancel={() => handlePaymethodClick(null)}
						setAddCardOpen={setAddCardOpen}
						addCardOpen={addCardOpen}
						isOpenMethod={isOpenMethod}
						handlePaymethodDataChange={handlePaymethodDataChange}
						clientSecret={props.clientSecret}
						businessId={props.businessId}
						onPaymentChange={onPaymentChange}
					/>
				</View>
			)}
			{/* Google pay, Apple pay */}
			{methodsPay.includes(isOpenMethod?.paymethod?.gateway) && (
				<StripeElementsForm
					cart={cart}
					paymethod={isOpenMethod?.paymethod?.gateway}
					methodsPay={methodsPay}
					businessId={props.businessId}
					publicKey={isOpenMethod?.paymethod?.credentials?.publishable || isOpenMethod?.paymethod?.credentials?.publishable_key}
					handleSource={handlePaymethodDataChange}
					onCancel={() => handlePaymethodClick(null)}
					merchantId={merchantId}
					setMethodPaySupported={setMethodPaySupported}
					methodPaySupported={methodPaySupported}
					placeByMethodPay={placeByMethodPay}
					setPlaceByMethodPay={setPlaceByMethodPay}
				/>
			)}

			{(cardsPaymethods.includes(isOpenMethod?.paymethod?.gateway) || cardsPaymethods.includes(paymethodSelected?.gateway)) && (
				<PaymentOptionCard
					setCardList={setCardList}
					paymethod={isOpenMethod?.paymethod}
					businessId={props.businessId}
					publicKey={isOpenMethod?.paymethod?.credentials?.publishable}
					gateway={isOpenMethod?.paymethod?.gateway || paymethodSelected?.gateway}
					onPaymentChange={onPaymentChange}
					payType={isOpenMethod?.paymethod?.name}
					onSelectCard={handlePaymethodDataChange}
					addCardOpen={addCardOpen}
					setAddCardOpen={setAddCardOpen}
					onCancel={() => handlePaymethodClick(null)}
					paymethodSelected={paymethodSelected?.data?.id}
					handlePaymentMethodClick={handlePaymentMethodClick}
				/>
			)}

			{/* Stripe direct */}
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
						bgColor={theme.colors.white}
						borderColor={theme.colors.primary}
						style={styles.btnAddStyle}
						textStyle={{ color: theme.colors.primary, fontSize: 12 }}
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
			{/** Stripe connect add cards */}
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
		borderRadius: 7.6,
		shadowOpacity: 0,
		height: 44,
		borderWidth: 1
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
