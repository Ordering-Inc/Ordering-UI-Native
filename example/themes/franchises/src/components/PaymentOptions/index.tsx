import React, { useEffect, useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import {
	Placeholder,
	PlaceholderLine,
	Fade
} from "rn-placeholder";

import {
	PaymentOptions as PaymentOptionsController,
	useLanguage,
} from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
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
	PMDropDownWrapper,
	PMDropDownCont
} from './styles'
import { TouchableOpacity } from 'react-native-gesture-handler';

const stripeOptions: any = ['stripe_direct', 'stripe', 'stripe_connect']
// const stripeRedirectOptions = [
//   { name: 'Bancontact', value: 'bancontact' },
//   { name: 'Alipay', value: 'alipay' },
//   { name: 'Giropay', value: 'giropay' },
//   { name: 'iDEAL', value: 'ideal' }
// ]

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

	const theme = useTheme();


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
			default:
				return theme.images.general.creditCard
		}
	}

	const [, t] = useLanguage();

	const [addCardOpen, setAddCardOpen] = useState({ stripe: false, stripeConnect: false });
	const [isShowMethods, setShowMethods] = useState(false);

	const paymethodSelected = props.paySelected || props.paymethodSelected || isOpenMethod?.paymethod
	// const [{ token }] = useSession()

	// const [card, setCard] = useState(null);

	// const stripeRedirectValues = [
	//   { name: t('SELECT_A_PAYMENT_METHOD', 'Select a payment method'), value: '-1' },
	// ]

	const handlePaymentMethodClick = (paymethod: any) => {
		const isPopupMethod = ['stripe', 'stripe_direct', 'stripe_connect', 'stripe_redirect', 'paypal'].includes(paymethod?.gateway)
		handlePaymethodClick(paymethod, isPopupMethod)
		setShowMethods(false);
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
						width={20}
						height={20}
						color={paymethodSelected?.id === item.id ? theme.colors.white : theme.colors.backgroundDark}
					/>
					<OText
						size={10}
						style={{ marginLeft: 12, marginRight: 12 }}
						color={paymethodSelected?.id === item.id ? theme.colors.white : '#000'}
					>
						{t(item.gateway.toUpperCase(), item.name)}
					</OText>
				</PMItem>
			</TouchableOpacity>
		)
	}

	const excludeIds: any = [3, 32, 66]; //exclude paypal & connect & redirect

	const pmData = paymethodsList.paymethods.sort((a: any, b: any) => a.id - b.id).filter((p: any) => !excludeIds.includes(p.id));
	// useEffect(() => { console.log(JSON.stringify(paymethodSelected)) }, []);
	return (
		<PMContainer>
			{paymethodsList.paymethods.length > 0 && (
				<PMDropDownWrapper onPress={() => setShowMethods(!isShowMethods)}>
        <OText color={theme.colors.textSecondary} style={{marginLeft: 14, marginRight: 14}}>{paymethodSelected?.paymethod?.name || t('SELECT_PAYMENT_METHOD', 'Select Paymethod')}</OText>
					<OIcon color={theme.colors.textSecondary} width={16} src={theme.images.general.chevron_right} style={{transform: [{rotate: '90deg'}], marginEnd: 14}} />
					{isShowMethods && <PMDropDownCont>
						{
							pmData.map((item: any, idx: number) => 
							<React.Fragment key={idx}>
								{renderPaymethods({item})}
							</React.Fragment>	
							)
						}
					</PMDropDownCont>}
				</PMDropDownWrapper>
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
					orderTotal={cart.total}
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
				<View style={{paddingTop: 17}}>
					<StripeCardsList
						paymethod={isOpenMethod?.paymethod}
						businessId={props.businessId}
						publicKey={isOpenMethod?.paymethod?.credentials.publishable}
						payType={paymethodsList?.name}
						onSelectCard={handlePaymethodDataChange}
						onNavigationRedirect={onNavigationRedirect}
						onCancel={() => handlePaymethodClick(null)}
					/>
					<OButton
						text={t('ADD_NEW_CARD', 'Add new card')}
						bgColor={theme.colors.white}
						borderColor={theme.colors.primary}
						style={styles.btnAddStyle}
						textStyle={{ color: theme.colors.primary, fontSize: 12, marginLeft: 0, marginRight: 0 }}
						imgRightSrc={null}
						onClick={() => setAddCardOpen({ ...addCardOpen, stripe: true })}
					/>
				</View>
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
					<StripeCardsList
						paymethod={isOpenMethod?.paymethod}
						businessId={props.businessId}
						publicKey={isOpenMethod?.paymethod?.credentials.publishable}
						payType={paymethodsList?.name}
						onSelectCard={handlePaymethodDataChange}
						onNavigationRedirect={onNavigationRedirect}
						onCancel={() => handlePaymethodClick(null)}
					/>
					<OButton
						text={t('ADD_PAYMENT_CARD', 'Add New Payment Card')}
						bgColor={theme.colors.white}
						borderColor={theme.colors.primary}
						style={styles.btnAddStyle}
						textStyle={{ color: theme.colors.primary, fontSize: 12, marginStart: 0, marginEnd: 0 }}
						imgRightSrc={null}
						onClick={() => setAddCardOpen({ ...addCardOpen, stripeConnect: true })}
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
		marginTop: 7,
		shadowOpacity: 0,
		height: 27,
		borderWidth: 0,
		borderRadius: 0,
		paddingStart: 0,
		paddingEnd: 0,
		alignSelf: 'flex-start'
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
