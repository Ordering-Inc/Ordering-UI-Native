import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import {
	PaymentOptionStripe as PaymentOptionStripeController,
	useSession,
	useLanguage,
} from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { PlaceholderLine } from 'rn-placeholder';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { getIconCard } from '../../utils';
import { OAlert, OButton, OModal, OText } from '../shared';

import { NotFoundSource } from '../NotFoundSource';
import { StripeElementsForm } from '../StripeElementsForm';

import {
	OSContainer,
	OSMessage,
	OSItem,
	OSItemContent,
	OSItemActions,
	OSWrapper,
	OSActions
} from './styles';

const PaymentOptionStripeUI = (props: any) => {
	const {
		onSelectCard,
		onCancel,
		deleteCard,
		cardSelected,
		cardsList,
		handleCardClick,
		handleNewCard
	} = props;

	const theme = useTheme();

	const [{ token }] = useSession();
	const [, t] = useLanguage();

	const [addCartOpen, setAddCardOpen] = useState(false)

	const _handleNewCard = (card: any) => {
		setAddCardOpen(false);
		handleNewCard(card);
	}

	const handleDeleteCard = (card: any) => {
		deleteCard(card);
	};

	const renderCards = ({ item }: any) => {
		return (
			<OSItem key={item.id}>
				<OSItemContent onPress={() => handleCardClick(item)}>
					<View style={styles.viewStyle}>
						{item.id === cardSelected?.id ? (
							<MaterialCommunityIcons
								name='radiobox-marked'
								size={24}
								color={theme.colors.primary}
							/>
						) : (
							<MaterialCommunityIcons
								name='radiobox-blank'
								size={24}
								color={theme.colors.primary}
							/>
						)}
					</View>
					<View style={styles.viewStyle}>
						{getIconCard(item.brand, 26)}
					</View>
					<View style={styles.viewStyle}>
						<OText size={20}>
							XXXX-XXXX-XXXX-{item.last4}
						</OText>
					</View>
				</OSItemContent>
				<OSItemActions>
					<OAlert
						title={t('CARD', 'Card')}
						message={t('QUESTION_DELETE_CARD', 'Are you sure that you want to delete the card?')}
						onAccept={() => handleDeleteCard(item)}
					>
						<MaterialCommunityIcons
							name='trash-can-outline'
							size={28}
							color={theme.colors.primary}
						/>
					</OAlert>
				</OSItemActions>
			</OSItem>
		)
	}

	return (
		<OSContainer style={styles.container}>
			{token && !cardsList.loading && cardsList.cards && cardsList.cards.length === 0 && (
				<OSItem>
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

			{token && cardsList.cards && cardsList.cards.length > 0 && (
				<FlatList
					horizontal={false}
					showsHorizontalScrollIndicator={false}
					data={cardsList.cards}
					renderItem={renderCards}
					keyExtractor={card => card.id?.toString()}
					style={{ height: '65%', flexGrow: 0 }}
				/>
			)}

			{token && !cardsList.loading && (
				<OSWrapper style={styles.bottom}>
					<OButton
						text={t('ADD_PAYMENT_CARD', 'Add New Payment Card')}
						bgColor={theme.colors.backgroundGray}
						borderColor={theme.colors.backgroundGray}
						style={styles.btnAddStyle}
						imgRightSrc={null}
						onClick={() => setAddCardOpen(true)}
					/>
					<OSActions>
						<View style={{ width: '48%' }}>
							<OButton
								text={t('CANCEL', 'Cancel')}
								bgColor={theme.colors.backgroundGray}
								borderColor={theme.colors.backgroundGray}
								style={styles.btnAction}
								imgRightSrc={null}
								onClick={() => onCancel()}
							/>
						</View>
						<View style={{ width: '48%' }}>
							<OButton
								text={t('ACCEPT', 'Accept')}
								style={styles.btnAction}
								imgRightSrc={null}
								isDisabled={!cardSelected || cardsList?.cards?.length === 0}
								onClick={() => onSelectCard(cardSelected)}
							/>
						</View>
					</OSActions>
				</OSWrapper>
			)}

			<OModal
				isNotDecoration
				title={t('ADD_CREDIT_OR_DEBIT_CARD', 'Add credit or debit card')}
				open={addCartOpen}
				onClose={() => setAddCardOpen(false)}
			>
				<KeyboardAvoidingView
					behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
					keyboardVerticalOffset={Platform.OS == 'ios' ? 0 : 0}
					enabled={Platform.OS === 'ios' ? true : false}
				>
					<StripeElementsForm
						toSave
						businessId={props.businessId}
						publicKey={props.publicKey}
						requirements={props.clientSecret}
						onNewCard={_handleNewCard}
						onCancel={() => setAddCardOpen(false)}
					/>
				</KeyboardAvoidingView>
			</OModal>

			{token && cardsList.loading && (
				<>
					{[...Array(5)].map((_, i) => (
						<PlaceholderLine
							key={i}
							height={50}
							width={90}
							noMargin
							style={{ marginVertical: 20 }}
						/>
					))}
				</>
			)}
		</OSContainer>
	)
}

const screenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
	container: {
		height: screenHeight - 90
	},
	bottom: {
		position: 'absolute',
		bottom: 0,
		marginBottom: 20
	},
	viewStyle: {
		marginRight: 10
	},
	btnAddStyle: {
		marginTop: 20
	},
	btnAction: {
		paddingHorizontal: 20
	}
})

export const PaymentOptionStripe = (props: any) => {
	const paymentOptionStripeProps = {
		...props,
		UIComponent: PaymentOptionStripeUI
	}
	return (
		<PaymentOptionStripeController {...paymentOptionStripeProps} />
	)
}
