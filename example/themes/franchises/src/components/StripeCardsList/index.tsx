import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
	PaymentOptionStripe,
	useSession,
	useLanguage,
} from 'ordering-components/native';
import { PlaceholderLine } from 'rn-placeholder';
import { useTheme } from 'styled-components/native';
import { getIconCard } from '../../utils';
import { OAlert, OIcon, OText } from '../shared';

import { NotFoundSource } from '../NotFoundSource';

import {
	OSItem,
	OSItemContent,
	OSItemActions,
} from '../PaymentOptionStripe/styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather';

const StripeCardsListUI = (props: any) => {
	const {
		onSelectCard,
		deleteCard,
		cardSelected,
		cardsList,
		handleCardClick,
	} = props;

	const theme = useTheme();

	const [{ token }] = useSession();
	const [, t] = useLanguage();
	const [showOption, setShowOption] = useState({id: 0, status: false});

	const handleCardSelected = (card: any) => {
		handleCardClick(card);
		onSelectCard(card);
		setShowOption({id: showOption.id, status: false});
	}

	const handleShowOption = (idx: number) => {
		if (idx == showOption.id) {
			setShowOption({id: idx, status: !showOption.status});
		} else {
			setShowOption({id: idx, status: true});
		}
	}

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
					{cardsList.cards.map((card: any, idx: number) => (
						<OSItem key={card.id} style={{zIndex: 99 - idx}}>
							<OSItemContent onPress={() => {}} style={{justifyContent: 'space-between'}} activeOpacity={0.8}>
								{/* <View style={styles.viewStyle}>
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
								</View> */}
								<View style={styles.viewStyle}>
									{getIconCard(card.brand, 20)}
									<OText size={12} style={{textTransform: 'capitalize'}} color={theme.colors.textNormal} mLeft={10} mRight={10}>
										{`${card.brand} ${card.last4}`}
									</OText>
								</View>
								{card.id === cardSelected?.id &&
									<OText size={10} weight={'bold'}>{t('DEFAULT', 'Default')}</OText>
								}
							</OSItemContent>
							<OSItemActions>
								<TouchableOpacity onPress={() => handleShowOption(idx)}>
									<Icon
										name='more-vertical'
										color={theme.colors.textPrimary}
										size={16}
									/>
								</TouchableOpacity>
								{showOption.status && showOption.id === idx && 
									<View style={styles.optWrap}>
										<TouchableOpacity onPress={() => handleCardSelected(card)} style={{paddingBottom: 4}}>
											<OText size={10} lineHeight={15}>{t('USE_AS_DEFAULT', 'Use as default')}</OText>
										</TouchableOpacity>
										<OAlert
											title={t('CARD', 'Card')}
											message={t('QUESTION_DELETE_CARD', 'Are you sure that you want to delete the card?')}
											onAccept={() =>{ deleteCard(card); setShowOption({id: idx, status: false}) }}
										>
											<OText size={10} lineHeight={15} color={theme.colors.red}>{t('DELETE', 'Delete')}</OText>
										</OAlert>
									</View>
								}
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
		marginRight: 7,
		flexDirection: 'row',
		alignItems: 'center'
	},
	cardsList: {
		width: '100%',
		maxHeight: 130
	},
	optWrap: {
		position: 'absolute',
		end: 4,
		top: 20,
		minWidth: 100,
		backgroundColor: 'white',
		paddingHorizontal: 12,
		paddingVertical: 7,
		borderRadius: 7.6,
		shadowColor: '#000000',
		shadowOffset: {width: 0, height: 1},
		shadowRadius: 2,
		shadowOpacity: 0.2,
	}
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
