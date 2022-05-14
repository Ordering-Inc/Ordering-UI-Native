import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useUtils, useOrder, useLanguage } from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { OIcon, OText, OModal } from '../shared';
import { BusinessBasicInformationParams } from '../../types';
import { convertHoursToMinutes, shape } from '../../utils';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(timezone);
dayjs.extend(isBetween);

import {
	BusinessContainer,
	BusinessHeader,
	BusinessLogo,
	BusinessInfo,
	BusinessInfoItem,
	WrapReviews,
	WrapBusinessInfo,
	TitleWrapper,
	RibbonBox
} from './styles';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
const types = ['food', 'laundry', 'alcohol', 'groceries'];

let BusinessInformation: null | React.ElementType = null
let BusinessReviews: null | React.ElementType = null

export const BusinessBasicInformation = (
	props: BusinessBasicInformationParams,
) => {
	const { navigation, businessState, isBusinessInfoShow, logo, header, isPreOrder } = props;
	const { business, loading } = businessState;

	const theme = useTheme();
	const [orderState] = useOrder();
	const [, t] = useLanguage();
	const [{ parsePrice, parseDistance, optimizeImage }] = useUtils();
	const [openBusinessInformation, setOpenBusinessInformation] = useState(false);
	const [openBusinessReviews, setOpenBusinessReviews] = useState(false);
	const [businessInformationObtained, setBusinessInformationObtained] = useState(false)
	const [businessReviewsObtained, setBusinessReviewsObtainedbtained] = useState(false)

	const handleClickBusinessInformation = () => {
		if (!businessInformationObtained) {
			BusinessInformation = require('../BusinessInformation').BusinessInformation
			setBusinessInformationObtained(true)
		}
		setOpenBusinessInformation(true)
	}

	const handleClickBusinessReviews = () => {
		if (!businessReviewsObtained) {
			BusinessReviews = require('../BusinessReviews').BusinessReviews
			setBusinessReviewsObtainedbtained(true)
		}
		setOpenBusinessReviews(true)
	}

	const getBusinessType = () => {
		if (Object.keys(business).length <= 0) return t('GENERAL', 'General');
		const _types: any = [];
		types.forEach(
			(type) =>
				business[type] &&
				_types.push(
					t(`BUSINESS_TYPE_${type?.replace(/\s/g, '_')?.toUpperCase()}`, type),
				),
		);
		return _types.join(', ');
	};


	useEffect(() => {
		if (businessState?.loading) return
		let timeout: any = null
		const currentDate = dayjs().tz(businessState?.business?.timezone)
		let lapse = null
		if (businessState?.business?.today?.enabled) {
			lapse = businessState?.business?.today?.lapses?.find((lapse: any) => {
				const from = currentDate.hour(lapse.open.hour).minute(lapse.open.minute)
				const to = currentDate.hour(lapse.close.hour).minute(lapse.close.minute)
				return currentDate.unix() >= from.unix() && currentDate.unix() <= to.unix()
			})
		}
		if (lapse) {
			const to = currentDate.hour(lapse.close.hour).minute(lapse.close.minute)
			const timeToClose = (to.unix() - currentDate.unix()) * 1000
			timeout = setTimeout(() => {
				navigation.navigate('BusinessPreorder', { business: businessState?.business, handleBusinessClick: () => navigation?.goBack() })
			}, timeToClose)
		}
		return () => {
			timeout && clearTimeout(timeout)
		}
	}, [businessState?.business])

	return (
		<BusinessContainer>
			<BusinessHeader
				style={
					isBusinessInfoShow
						? styles.businesInfoheaderStyle
						: { ...styles.headerStyle, backgroundColor: theme.colors.backgroundGray }
				}
				source={{
					uri:
						header ||
						optimizeImage(businessState?.business?.header, 'h_250,c_limit'),
				}}>
				{!isBusinessInfoShow && (
					<WrapBusinessInfo onPress={() => handleClickBusinessInformation()}>
						<OIcon src={theme.images.general.info} width={24} />
					</WrapBusinessInfo>
				)}
			</BusinessHeader>
			<BusinessInfo style={styles.businessInfo}>
				<BusinessLogo>
					{loading ? (
						<View>
							<Placeholder Animation={Fade}>
								<PlaceholderLine height={50} width={20} />
							</Placeholder>
						</View>
					) : (
						!isBusinessInfoShow && (
							<OIcon
								url={
									logo ||
									optimizeImage(businessState?.business?.logo, 'h_70,c_limit')
								}
								style={styles.businessLogo}
							/>
						)
					)}
				</BusinessLogo>
				<BusinessInfoItem>
					{loading ? (
						<Placeholder Animation={Fade}>
							<PlaceholderLine height={30} width={20} />
						</Placeholder>
					) : (
						<TitleWrapper>
							<OText size={24} weight={'600'}>
								{business?.name}
							</OText>
							{business?.ribbon?.enabled && (
								<RibbonBox
									bgColor={business?.ribbon?.color}
									isRoundRect={business?.ribbon?.shape === shape?.rectangleRound}
									isCapsule={business?.ribbon?.shape === shape?.capsuleShape}
								>
									<OText
										size={10}
										weight={'400'}
										color={theme.colors.white}
										numberOfLines={2}
										ellipsizeMode='tail'
										lineHeight={13}
									>
										{business?.ribbon?.text}
									</OText>
								</RibbonBox>
							)}
						</TitleWrapper>
					)}
				</BusinessInfoItem>
				{loading ? (
					<Placeholder Animation={Fade}>
						<PlaceholderLine width={10} />
					</Placeholder>
				) : (
					<View style={{ width: '75%' }}>
						<OText color={theme.colors.textNormal}>{getBusinessType()}</OText>
					</View>
				)}
				<View>
					<BusinessInfoItem>
						{loading && (
							<Placeholder Animation={Fade}>
								<View style={{ flexDirection: 'row' }}>
									<PlaceholderLine width={13} style={{ marginRight: 10 }} />
									<PlaceholderLine width={13} style={{ marginRight: 10 }} />
									<PlaceholderLine width={13} style={{ marginRight: 10 }} />
									<PlaceholderLine width={13} />
								</View>
							</Placeholder>
						)}
						<View style={styles.bullet}>
							<OText color={theme.colors.textSecondary} size={12} style={styles.metadata}>
								{`${t('DELIVERY_FEE', 'Delivery fee')} ${business && parsePrice(business?.delivery_price || 0)} \u2022 `}
							</OText>
							{orderState?.options?.type === 1 ? (
								<OText color={theme.colors.textSecondary} size={12} style={styles.metadata}>
									{convertHoursToMinutes(business?.delivery_time) + `  \u2022 `}
								</OText>
							) : (
								<OText color={theme.colors.textSecondary} size={12} style={styles.metadata}>
									{convertHoursToMinutes(business?.pickup_time) + `  \u2022 `}
								</OText>
							)}
							<OText color={theme.colors.textSecondary} size={12} style={styles.metadata}>
								{parseDistance(business?.distance || 0) + `  \u2022 `}
							</OText>
						</View>

						<View style={styles.reviewStyle}>
							<OIcon
								src={theme.images.general.star}
								width={14}
								color={theme.colors.textSecondary}
								style={{ marginTop: -2, marginEnd: 2 }}
							/>
							<OText size={12} color={theme.colors.textSecondary}>
								{business?.reviews?.total}
							</OText>
						</View>
					</BusinessInfoItem>
				</View>
				<WrapReviews>
					{!isBusinessInfoShow && (
						<>
							{isPreOrder && (
								<>
									<TouchableOpacity onPress={() => navigation.navigate('BusinessPreorder', { business: businessState?.business, handleBusinessClick: () => navigation?.goBack() })}>
										<OText color={theme.colors.textSecondary} style={{ textDecorationLine: 'underline' }}>
											{t('PRE_ORDER', 'Preorder')}
										</OText>
									</TouchableOpacity>
									<OText size={12} color={theme.colors.textSecondary}>{' \u2022 '}</OText>
								</>
							)}
							<TouchableOpacity onPress={() => handleClickBusinessReviews()}>
								<OText color={theme.colors.textSecondary} style={{ textDecorationLine: 'underline' }}>
									{t('REVIEWS', 'Reviews')}
								</OText>
							</TouchableOpacity>
						</>
					)}
				</WrapReviews>
			</BusinessInfo>
			{businessInformationObtained ? (
				<OModal
					titleSectionStyle={styles.modalTitleSectionStyle}
					open={openBusinessInformation}
					onClose={() => setOpenBusinessInformation(false)}
					isNotDecoration>
					{BusinessInformation && (
						<BusinessInformation
							businessState={businessState}
							business={business}
						/>
					)}
				</OModal>
			) : null}
			{businessReviewsObtained ? (
				<OModal
					entireModal
					titleSectionStyle={styles.modalTitleSectionStyle}
					open={openBusinessReviews}
					onClose={() => setOpenBusinessReviews(false)}
					isNotDecoration
				>
					{BusinessReviews && (
						<BusinessReviews
							businessState={businessState}
							businessId={business.id}
							reviews={business.reviews?.reviews}
						/>
					)}
				</OModal>
			) : null}
		</BusinessContainer>
	);
};

const styles = StyleSheet.create({
	businesInfoheaderStyle: {
		height: 150,
	},
	headerStyle: {
		height: 260,
	},
	businessLogo: {
		width: 72,
		height: 72,
		borderRadius: 7.6,
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
	},
	businessInfo: {
		paddingHorizontal: 40,
		paddingTop: 56,
	},
	bullet: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	metadata: {
		marginRight: 2,
	},
	starIcon: {
		marginHorizontal: 5,
	},
	reviewStyle: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center'
	},
	modalTitleSectionStyle: {
		position: 'absolute',
		width: '100%',
		top: 0,
		zIndex: 100,
		left: 40
	},
});
