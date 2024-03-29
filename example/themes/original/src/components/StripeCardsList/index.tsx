import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import {
	PaymentOptionStripe,
	useSession,
	useLanguage,
	useValidationFields
} from 'ordering-components/native';
import { PlaceholderLine } from 'rn-placeholder';
import { useTheme } from 'styled-components/native';
import { getIconCard } from '../../utils';
import { OAlert, OIcon, OText, OModal } from '../shared';

import { NotFoundSource } from '../NotFoundSource';

import {
	OSItem,
	OSItemContent,
	OSItemActions,
} from '../PaymentOptionStripe/styles';
import { StripeElementsForm } from '../StripeElementsForm';

import { KeyboardAvoidingView } from 'react-native';

export const StripeCardsListUI = (props: any) => {
	const {
		onSelectCard,
		deleteCard,
		cardsList,
		handleCardClick,
		onOpen,
		gateway,
		paySelected,
		newCardAdded,
		addNewCardAsDefault,
		setUserHasCards
	} = props;

	const theme = useTheme();

	const [{ token }] = useSession();
	const [, t] = useLanguage();
	const [validationFields] = useValidationFields()
	const validateZipcodeCard =
		validationFields?.fields?.card?.zipcode?.enabled && validationFields?.fields?.card?.zipcode?.required
	const paymethodsWithoutSaveCards = ['credomatic']

	const handleCardSelected = (card: any) => {
		if (!card?.zipcode && validateZipcodeCard) return
		handleCardClick(card);
		onSelectCard(card);
	}

	useEffect(() => {
		if (!cardsList?.loading && cardsList?.cards?.length === 0 && !paymethodsWithoutSaveCards.includes(gateway)) {
			onOpen && onOpen();
		}
	}, [cardsList?.loading])

	useEffect(() => {
		if (newCardAdded && addNewCardAsDefault) {
			handleCardSelected(newCardAdded)
		}
	}, [JSON.stringify(newCardAdded)])

	useEffect(() => {
		const hasCardSelected = cardsList?.cards?.some?.((card : any) => card?.id === paySelected?.data?.id)
		setUserHasCards && setUserHasCards(cardsList?.cards?.length > 0 && hasCardSelected)
	}, [cardsList?.cards?.length, paySelected])

	return (
		<>
			{token && !cardsList.loading && cardsList.cards && cardsList.cards.length === 0 && (
				<OSItem style={{ justifyContent: 'center', paddingTop: 0 }}>
					<OText size={22}>
						{t('YOU_DONT_HAVE_CARDS', 'You don\'t have cards')}
					</OText>
				</OSItem>
			)}

			{token && cardsList.error && cardsList.error.length > 0 && (
				<NotFoundSource
					content={cardsList?.error[0]?.message || cardsList?.error[0]}
				/>
			)}

			{token && cardsList.loading && (
				<View style={{ width: '100%' }}>
					{[...Array(2)].map((_, i) => (
						<PlaceholderLine
							key={i}
							height={50}
							noMargin
							style={{ marginBottom: 20 }}
						/>
					))}
				</View>
			)}

			{token && cardsList.cards && cardsList.cards.length > 0 && (
				<ScrollView
					horizontal={false}
					showsVerticalScrollIndicator={false}
					showsHorizontalScrollIndicator={false}
					nestedScrollEnabled={true}
					style={styles.cardsList}
				>
					{cardsList.cards.map((card: any) => (
						<OSItem key={card.id} isUnique={cardsList.cards.length} isInvalid={!card?.zipcode && validateZipcodeCard}>
							<OSItemContent onPress={() => handleCardSelected(card)}>
								<View style={styles.viewStyle}>
									{(card.id === paySelected?.data?.id) ? (
										<OIcon
											src={theme.images.general.radio_act}
											width={16}
											color={theme.colors.primary}
										/>
									) : (
										<OIcon
											src={theme.images.general.radio_nor}
											width={16}
											color={theme.colors.disabled}
										/>
									)}
								</View>
								<View style={styles.viewStyle}>
									{getIconCard(card.brand, 20)}
								</View>
								<View style={styles.viewStyle}>
									<OText size={12} color={theme.colors.textNormal}>
										XXXX-XXXX-XXXX-{card.last4}
									</OText>
								</View>
								{!card?.zipcode && validateZipcodeCard && (
									<View style={styles.viewStyle}>
										<OText size={10} color={theme?.colors?.danger5}>
											({t('MISSING_ZIPCODE', 'Missing zipcode')})
										</OText>
									</View>
								)}
							</OSItemContent>
							<OSItemActions>
								<OAlert
									title={t('CARD', 'Card')}
									message={t('QUESTION_DELETE_CARD', 'Are you sure that you want to delete the card?')}
									onAccept={() => deleteCard(card)}
								>
									<OIcon
										src={theme.images.general.trash}
										width={16}
										color={theme.colors.disabled}
									/>
								</OAlert>
							</OSItemActions>
						</OSItem>
					))}
				</ScrollView>
			)}
		</>
	)
}

const styles = StyleSheet.create({
	viewStyle: {
		marginRight: 7
	},
	cardsList: {
		width: '100%',
		maxHeight: 150
	},
})

export const StripeCardsList = (props: any) => {
	const stripeCardsListProps = {
		...props,
		UIComponent: StripeCardsListUI
	}
	return (
		<PaymentOptionStripe {...stripeCardsListProps} />
	)
}
