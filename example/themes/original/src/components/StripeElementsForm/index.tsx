import React, { useState, useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions, Keyboard } from 'react-native';
import { useLanguage, useSession, useConfig } from 'ordering-components/native';
import {
	StripeProvider,
	CardField,
	useConfirmSetupIntent,
	createPaymentMethod
} from '@stripe/stripe-react-native';
import { useTheme } from 'styled-components/native';
import { ErrorMessage } from './styles';

import { StripeElementsForm as StripeFormController } from './naked';
import { OButton, OText } from '../shared';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StripeMethodForm } from '../../../../../src/components/StripeMethodForm';

const StripeElementsFormUI = (props: any) => {
	const {
		publicKey,
		handleSource,
		values,
		businessId,
		requirements,
		stripeTokenHandler,
		methodsPay,
		paymethod,
		onCancel,
		cart,
		merchantId,
		businessIds
	} = props;

	const theme = useTheme();

	const [, t] = useLanguage();
	const [{ user }] = useSession();
	const [{ configs }] = useConfig();
	const [card, setCard] = useState<any>(null);
	const [isCompleted, setIsCompleted] = useState(false);
	const [errors, setErrors] = useState('')
	const { confirmSetupIntent, loading: confirmSetupLoading } = useConfirmSetupIntent();
	const [createPmLoading, setCreatePmLoading] = useState(false);
	const { height } = useWindowDimensions();
	const { top, bottom } = useSafeAreaInsets();
	const [isKeyboardShow, setIsKeyboardShow] = useState(false);

	let billingDetails: any = {}

	if (user?.name || user?.lastname) {
		if (user?.name) {
			billingDetails.name = user?.name
		}
		if (user?.lastname) {
			billingDetails.name = `${billingDetails?.name} ${user?.lastname}`
		}
	}

	if (user?.email) {
		billingDetails.email = user?.email
	}

	if (user?.address) {
		billingDetails.address.line1 = user?.address
	}

	const createPayMethod = async () => {
		const params: any = { paymentMethodType: 'Card', paymentMethodData: {} }
		if (Object.keys(billingDetails).length > 0) {
			params.paymentMethodData.billingDetails = billingDetails
		}
		try {
			setCreatePmLoading(true)
			const { paymentMethod } = await createPaymentMethod(params);

			setCreatePmLoading(false)
			handleSource && handleSource({
				id: paymentMethod.id,
				type: 'card',
				card: {
					brand: paymentMethod.Card.brand,
					last4: paymentMethod.Card.last4
				}
			})

			// if (error) {
			//   setErrors(
			//     error?.code === 'Unknown'
			//       ? t('ERROR_ADD_CARD', 'An error occurred while trying to add a card')
			//       : error.message
			//   );
			// }
		} catch (error: any) {
			setErrors(error?.message || error?.toString());
		}
	}
	
	const handleSaveCard = async () => {
		setErrors('');
		if (!requirements) {
			createPayMethod();
			return
		}
		const params: any = { paymentMethodType: 'Card', paymentMethodData: {} }
		if (Object.keys(billingDetails).length > 0) {
			params.paymentMethodData.billingDetails = {...billingDetails, token: card?.last4}
		}
		try {
			const { setupIntent, error } = await confirmSetupIntent(requirements, params);

			if (setupIntent?.status === 'Succeeded') {
				if (businessIds) {
					businessIds.forEach((_businessId: any, index: any) => {
					  const _isNewCard = index === 0
					  stripeTokenHandler(setupIntent?.paymentMethodId, user, businessId, _isNewCard);
					})
				} else {
					stripeTokenHandler(setupIntent?.paymentMethodId, user, businessId);
				}
			}

			if (error) {
				setErrors(
					error?.code === 'Unknown'
						? t('ERROR_ADD_CARD', 'An error occurred while trying to add a card')
						: error.message
				);
			}
		} catch (error: any) {
			setErrors(error?.message || error?.toString());
		}
	};

	useEffect(() => {
		if (card) {
			setIsCompleted(
				!!card?.last4 &&
				!!card?.expiryMonth &&
				!!card?.expiryYear &&
				!!card?.brand
			)
		}
	}, [card])

	useEffect(() => {
		const keyboardDidShowListener = Keyboard.addListener(
			'keyboardDidShow',
			() => {
				setIsKeyboardShow(true);
				console.log('----- keyboard showing ----')
			},
		);
		const keyboardDidHideListener = Keyboard.addListener(
			'keyboardDidHide',
			() => {
				setIsKeyboardShow(false);
				console.log('----- keyboard hidding ----')
			},
		);
		return () => {
			keyboardDidShowListener.remove();
			keyboardDidHideListener.remove();
		};
	}, []);

	return (
		<View style={{ ...styles.container, height: height - top - bottom - 60 - (isKeyboardShow ? 250 : 0) }}>
			{publicKey ? (
				<View style={{ flex: 1 }}>
					<StripeProvider
						publishableKey={publicKey}
						merchantIdentifier={`merchant.${merchantId}`}
						urlScheme={merchantId}
					>
						{methodsPay?.includes(paymethod) ? (
							<StripeMethodForm
								handleSource={handleSource}
								onCancel={onCancel}
								cart={cart}
								setErrors={setErrors}
								paymethod={paymethod}
								devMode={publicKey?.includes('test')}
							/>
						) : (
							<CardField
								postalCodeEnabled={true}
								cardStyle={{
									backgroundColor: '#FFFFFF',
									textColor: '#000000',
								}}
								style={{
									width: '100%',
									height: 50,
									marginVertical: 30,
									zIndex: 9999,
								}}
								onCardChange={(cardDetails: any) => setCard(cardDetails)}
							/>
						)}
					</StripeProvider>
					{!!errors && (
						<ErrorMessage>
							<OText
								size={20}
								color={theme.colors.error}
								style={{ marginTop: 20, textAlign: 'center' }}
							>
								{errors}
							</OText>
						</ErrorMessage>
					)}
				</View>
			) : (
				<ErrorMessage>
					<OText
						size={20}
						color={theme.colors.error}
						style={{ marginTop: 20 }}
					>
						{t('SOMETHING_WRONG', 'Something is wrong!')}
					</OText>
				</ErrorMessage>
			)}
			{!methodsPay?.includes(paymethod) && (
				<OButton
					text={t('SAVE_CARD', 'Save card')}
					bgColor={isCompleted ? theme.colors.primary : theme.colors.backgroundGray}
					borderColor={isCompleted ? theme.colors.primary : theme.colors.backgroundGray}
					style={styles.btnAddStyle}
					textStyle={{ color: 'white' }}
					imgRightSrc={null}
					onClick={() => handleSaveCard()}
					isDisabled={!isCompleted}
					isLoading={confirmSetupLoading || values.loadingAdd || createPmLoading}
				/>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		paddingHorizontal: 40,
		justifyContent: 'space-between',
		paddingBottom: 12
	},
	btnAddStyle: {
		marginTop: 20,
		borderRadius: 7.6,
		shadowOpacity: 0,
		height: 44
	},
})

export const StripeElementsForm = (props: any) => {
	const stripeProps = {
		...props,
		UIComponent: StripeElementsFormUI,
		onSelectCard: (card: any) => {
			props.onSelectCard(card);
			if (card) {
				props.onCancel && props.onCancel();
			}
		}
	}
	return <StripeFormController {...stripeProps} />
}
