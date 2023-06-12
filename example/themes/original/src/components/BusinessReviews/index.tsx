import React, { useEffect, useState } from 'react';
import {
	BusinessReviews as BusinessReviewController,
	useLanguage,
	useOrder,
	useUtils
} from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import { View, StyleSheet } from 'react-native';
import { OIcon, OInput, OText } from '../shared';
import {
	BusinessReviewsContainer,
	ScoreView,
	BusinessReviewContent,
	WrapCustomerReview,
	WrapCustomerReviewTotal,
	StarPointsView,
	ReviewSearchView,
	ReviewProgressView,
	PrincipalWrapView,
} from './styles';
import { BusinessReviewsParams } from '../../types';
import { ProgressBar, TouchableRipple } from 'react-native-paper';
import moment from 'moment';
import { setLocalMoment } from '../../utils';

const BusinessReviewsUI = (props: BusinessReviewsParams) => {
	const { businessState, reviewsList } = props;
	const [, t] = useLanguage();
	const theme = useTheme();
	const [searchReview, setSearchReview] = useState('')
	const [orderState] = useOrder();
	const [{ parseDate }] = useUtils()

	const styles = StyleSheet.create({
		starIcon: {
			marginRight: 5,
		},
		reviewScoreStyle: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'center',
		},
		wrapTotalScoresStyle: {
			maxHeight: 80,
			height: 80,
			marginBottom: 20,
		},
		progress: {
			borderRadius: 5,
			height: 4,
			backgroundColor: theme.colors.backgroundGray200,
			marginVertical: 9,
		},
		progressLabel: {
			flexDirection: 'row',
			justifyContent: 'space-between',
		},
	});

	const Score = ({ star, text }: any) => (
		<ScoreView>
			<View style={styles.reviewScoreStyle}>
				<IconAntDesign
					name="star"
					color={theme.colors.primary}
					size={16}
					style={styles.starIcon}
				/>
				<OText>{star}</OText>
			</View>
			<OText>{text}</OText>
		</ScoreView>
	);

	const PrincipalComments = ({ comments }: any) => (
		<View style={{ flexWrap: 'wrap', flexDirection: 'row', marginTop: 10 }}>
			{comments.map((txt: string, idx: number) => (
				<TouchableRipple
					key={`princ_id_${idx}`}
					style={{
						backgroundColor: theme.colors.primaryContrast,
						paddingHorizontal: 10,
						paddingVertical: 4,
						borderRadius: 50,
						marginEnd: 7,
						marginBottom: 15,
					}}>
					<OText size={10}>{txt}</OText>
				</TouchableRipple>
			))}
		</View>
	);

	const ReviewItem = ({ comment, created_at, total }: any) => (
		<View style={{ marginBottom: 30 }}>
			<OText size={12} color={theme.colors.textSecondary}>
				{parseDate(created_at, { outputFormat: 'MMMM D, YYYY • hh:mm A' })}
			</OText>
			<OText size={12} color={theme.colors.textNormal}>{comment}</OText>
		</View>
	);

	useEffect(() => {
		setLocalMoment(moment, t)
	}, [])

	return (
		<BusinessReviewsContainer>
			<BusinessReviewContent
				contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 27 }}>
				{reviewsList.error ? (
					<OText size={16}>{t('ERROR_UNKNOWN', 'An error has ocurred')}</OText>
				) : (
					<>
						<StarPointsView>
							<OIcon
								src={theme.images.general.star}
								width={32}
								style={{ marginEnd: 10, marginBottom: 2, marginStart: -2 }}
								color={
									reviewsList?.reviews?.length > 0
										? theme.colors.primary
										: theme.colors.disabled
								}
							/>
							<OText size={20} weight={'600'}>{`${businessState?.business?.reviews?.total || 0
								} (${reviewsList?.reviews?.length || 0} ${t(
									'REVIEWS',
									'reviews',
								)})`}</OText>
						</StarPointsView>

						<ReviewSearchView>
							<OInput
								icon={theme.images.general.search}
								inputStyle={{ fontSize: 14 }}
								placeholder={t('SEARCH_REVIEWS', 'Search reviews')}
								style={{ paddingStart: 0 }}
								onChange={(txt: string) => setSearchReview(txt)}
							/>
						</ReviewSearchView>
						<ReviewProgressView>
							<OText style={{ marginBottom: 6 }}>
								{t('REVIEW_ORDER', 'Review order')}
							</OText>
							<ProgressBar
								progress={(businessState?.business?.reviews?.total || 0) / 5}
								color={theme.colors.textNormal}
								style={styles.progress}
							/>
							<View style={styles.progressLabel}>
								<OText
									size={10}
									color={
										businessState?.business?.reviews?.total < 1.5
											? theme.colors.textNormal
											: theme.colors.backgroundGray400
									}>
									{t('REVIEW_TERRIBLE', 'Terrible')}
								</OText>
								<OText
									size={10}
									color={
										businessState?.business?.reviews?.total < 2.5
											? theme.colors.textNormal
											: theme.colors.backgroundGray400
									}>
									{t('REVIEW_BAD', 'Bad')}
								</OText>
								<OText
									size={10}
									color={
										businessState?.business?.reviews?.total < 3.5
											? theme.colors.textNormal
											: theme.colors.backgroundGray400
									}>
									{t('REVIEW_OKAY', 'Okay')}
								</OText>
								<OText
									size={10}
									color={
										businessState?.business?.reviews?.total < 4.5
											? theme.colors.textNormal
											: theme.colors.backgroundGray400
									}>
									{t('REVIEW_GOOD', 'Good')}
								</OText>
								<OText
									size={10}
									color={
										businessState?.business?.reviews?.total >= 4.5
											? theme.colors.textNormal
											: theme.colors.backgroundGray400
									}>
									{t('REVIEW_GREAT', 'Great')}
								</OText>
							</View>
						</ReviewProgressView>
						<PrincipalWrapView>
							{/* <OText style={{ marginBottom: 6 }}>
								{t('PRINCIPAL_COMMENTS', 'Principal comments')}
							</OText>
							<PrincipalComments
								comments={[
									'It wasn’t tasty',
									'It doesn’t pack well',
									'Too slow',
									'It isn’t worth what it costs',
								]}
							/> */}
						</PrincipalWrapView>

						{reviewsList?.reviews
							.filter((review: any) => searchReview !== '' ? review.comment?.toLowerCase()?.includes(searchReview?.toLowerCase()) : true)
							.map((review: any) => (
								<ReviewItem
									key={`review_key_${review.id}`}
									comment={review?.comment}
									created_at={review?.created_at}
								/>
							))}
					</>
				)}
				{reviewsList?.reviews
					.filter((review: any) => searchReview !== '' ? review.comment?.toLowerCase()?.includes(searchReview?.toLowerCase()) : true).length === 0 && (
						<OText>{t('REVIEWS_NOT_FOUND', 'Reviews Not Found')}</OText>
					)}
			</BusinessReviewContent>
		</BusinessReviewsContainer>
	);
};

export const BusinessReviews = (props: any) => {
	const BusinessReviewProps = {
		...props,
		UIComponent: BusinessReviewsUI,
	};
	return <BusinessReviewController {...BusinessReviewProps} />;
};
