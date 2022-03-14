import React, { useState, useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions, Keyboard } from 'react-native';
import { useLanguage, useSession } from 'ordering-components/native';
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

const StripeElementsFormUI = (props: any) => {
	const {
		publicKey,
		handleSource,
		values,
		businessId,
		requirements,
		stripeTokenHandler,
	} = props;

	const theme = useTheme();

	const [, t] = useLanguage();
	const [{ user }] = useSession();
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
    billingDetails.addressLine1 = user?.address
  }

	const createPayMethod = async () => {
    const params: any = { type: 'Card' }
    if (Object.keys(billingDetails).length > 0) {
      params.billingDetails = billingDetails
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
    const params: any = { type: 'Card' }
    if (Object.keys(billingDetails).length > 0) {
      params.billingDetails = billingDetails
    }
		try {
			const { setupIntent, error } = await confirmSetupIntent(requirements, params);

			if (setupIntent?.status === 'Succeeded') {
				stripeTokenHandler(setupIntent?.paymentMethodId, user, businessId);
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
					<StripeProvider publishableKey={publicKey}>
						<CardField
							postalCodeEnabled={false}
							cardStyle={{
								backgroundColor: '#FFFFFF',
								textColor: '#000000',
								fontSize: 17,
								styles: {
									
								}
							}}
							style={{
								width: '100%',
								height: 50,
								marginVertical: 50,
								borderWidth: 1,
								borderColor: theme.colors.border,
								borderRadius: 7.6,
							}}
							onCardChange={(cardDetails: any) => setCard(cardDetails)}
						/>
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
			<OButton
				text={t('SAVE_CARD', 'Save card')}
				bgColor={isCompleted ? theme.colors.primary : theme.colors.backgroundGray}
				borderColor={isCompleted ? theme.colors.primary : theme.colors.backgroundGray}
				style={styles.btnAddStyle}
				textStyle={{ color: 'white', fontSize: 14 }}
				imgRightSrc={null}
				onClick={isCompleted ? () => handleSaveCard() : () => { }}
				isLoading={confirmSetupLoading || values.loadingAdd || createPmLoading}
			/>
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
