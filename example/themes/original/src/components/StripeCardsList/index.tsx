import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import {
	PaymentOptionStripe,
	useSession,
	useLanguage,
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
		cardSelected,
		cardsList,
		handleCardClick,
		setAddCardOpen,
		gateway,
		setCardsList,
		addCardOpen,
		isOpenMethod,
		handlePaymethodDataChange
	} = props;

	const theme = useTheme();

	const [{ token }] = useSession();
	const [, t] = useLanguage();

	const paymethodsWithoutSaveCards = ['credomatic']

	const handleCardSelected = (card: any) => {
		handleCardClick(card);
		onSelectCard(card);
	}

	useEffect(() => {
		if (!cardsList?.loading && cardsList?.cards?.length === 0 && !paymethodsWithoutSaveCards.includes(gateway)) {
			setAddCardOpen({ ...addCardOpen, stripe: true })
		}
	}, [cardsList?.loading])

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
						<OSItem key={card.id} isUnique={cardsList.cards.length}>
							<OSItemContent onPress={() => handleCardSelected(card)}>
								<View style={styles.viewStyle}>
									{card.id === cardSelected?.id ? (
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
						openCarts={props.openCarts}
						toSave
						businessId={props.businessId}
						businessIds={props.businessIds}
						publicKey={props.publicKey || isOpenMethod?.paymethod?.credentials?.publishable}
						setCardsList={setCardsList}
						cardsList={cardsList}
						requirements={props.clientSecret}
						handleCardClick={handleCardClick}
						onSelectCard={handlePaymethodDataChange}
						onCancel={() => setAddCardOpen({ ...addCardOpen, stripe: false })}
					/>
				</KeyboardAvoidingView>
			</OModal>
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
