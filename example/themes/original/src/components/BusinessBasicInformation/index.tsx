import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Linking, Pressable, Image } from 'react-native';
import FastImage from 'react-native-fast-image'
import { useUtils, useOrder, useLanguage } from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { OIcon, OText, OModal } from '../shared';
import { BusinessBasicInformationParams } from '../../types';
import { convertHoursToMinutes, lightenDarkenColor, shape } from '../../utils';
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons'
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
	TitleWrapper,
	RibbonBox,
	SocialListWrapper
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
	const [imageRealSize, setImageRealSize] = useState({ width: 16, height: 9, loading: true })
	const isChewLayout = theme?.header?.components?.layout?.type?.toLowerCase() === 'chew'
	const hideLogo = theme?.business_view?.components?.header?.components?.business?.components?.logo?.hidden
	const hideDeliveryFee = theme?.business_view?.components?.header?.components?.business?.components?.fee?.hidden
	const hideTime = theme?.business_view?.components?.header?.components?.business?.components?.time?.hidden
	const hideReviews = theme?.business_view?.components?.header?.components?.business?.components?.reviews?.hidden
	const hideReviewsPopup = theme?.business_view?.components?.header?.components?.reviews?.hidden
	const hideDistance = theme?.business_view?.components?.header?.components?.business?.components?.distance?.hidden
	const hideInfoIcon = theme?.business_view?.components?.header?.components?.business?.components?.business_info?.hidden
	const hideCity = theme?.business_view?.components?.header?.components?.business?.components?.city?.hidden
	const hideHeader = theme?.business_view?.components?.header?.hidden

	const styles = StyleSheet.create({
		businesInfoheaderStyle: {
			height: 150,
		},
		headerStyle: {
			aspectRatio: imageRealSize?.width / imageRealSize?.height
		},
		logoStyle: {
			width: 72,
			height: 72,
			borderRadius: 7.6,
			justifyContent: 'flex-start',
			alignItems: 'flex-start'
		},
		businessInfo: {
			paddingHorizontal: 20,
			paddingTop: isChewLayout ? 0 : 56,
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
			left: 20
		},
		socialIcon: {
			borderRadius: 3,
			borderColor: theme.colors.border,
			borderWidth: isChewLayout ? 0 : 1,
			width: 30,
			height: 30,
			justifyContent: 'center',
			alignItems: 'center',
			marginRight: 10,
			marginBottom: 7
		},
		tiktokIcon: {
			height: 12,
			width: 12,
			margin: 0,
			padding: 0,
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center'
		},
		headerChewStyle: {
			paddingHorizontal: 30,
			justifyContent: 'center',
			height: '100%'
		},
		socialIconsChewContainer: {
			flexDirection: 'row',
			justifyContent: 'flex-start',
			marginTop: 5
		}
	});

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
		if (Object.keys(business || {}).length <= 0) return t('GENERAL', 'General');
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

	const SocialNetWork = (props: any) => {
		const { socialLink, iconTitle } = props

		return (
			<TouchableOpacity style={styles.socialIcon} onPress={() => Linking.openURL(socialLink)}>
				<MaterialComIcon
					name={iconTitle}
					color={isChewLayout ? theme.colors.black : theme.colors.textNormal}
					size={isChewLayout ? 25 : 22}
				/>
			</TouchableOpacity>
		)
	}

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

	useEffect(() => {
		const bannerImage = header || businessState?.business?.header
		if (!bannerImage) {
			setImageRealSize({ width: 16, height: 9, loading: false })
			return
		}
		Image.getSize(bannerImage, (width: number, height: number) => {
			setImageRealSize({ width: width, height: height, loading: false });
		  }, (error: any) => {
			setImageRealSize({ ...imageRealSize, loading: false });
			console.log(error);
		  });
	}, [header, businessState?.business?.header])

	const SocialIcons = () => {
		return (
			<>
				{loading ? (
					<Placeholder Animation={Fade}>
						<View style={{ flexDirection: 'row' }}>
							{[...Array(5).keys()].map(i => (
								<View style={{ ...styles.socialIcon, borderWidth: 0 }} key={i}>
									<PlaceholderLine width={100} height={20} style={{ marginBottom: 0 }} />
								</View>
							))}
						</View>
					</Placeholder>
				) : (
					<SocialListWrapper
						showsVerticalScrollIndicator={false}
						showsHorizontalScrollIndicator={false}
						horizontal
						contentContainerStyle={{ flex: 1 }}
					>
						{!!business?.facebook_profile && (
							<SocialNetWork
								socialLink={business?.facebook_profile}
								iconTitle='facebook'
							/>
						)}
						{!!business?.instagram_profile && (
							<SocialNetWork
								socialLink={business?.instagram_profile}
								iconTitle='instagram'
							/>
						)}
						{!!business?.tiktok_profile && (
							<Pressable style={styles.socialIcon} onPress={() => Linking.openURL(business?.tiktok_profile)}>
								<View style={styles.tiktokIcon}>
									<OIcon
										src={theme.images.general.tiktok}
										style={{ width: 10, height: 12, bottom: 1 }}
										cover
									/>
								</View>
							</Pressable>
						)}
						{!!business?.pinterest_profile && (
							<SocialNetWork
								socialLink={business?.pinterest_profile}
								iconTitle='pinterest'
							/>
						)}
						{!!business?.whatsapp_number && (
							<SocialNetWork
								socialLink={business?.whatsapp_number}
								iconTitle='whatsapp'
							/>
						)}
						{!!business?.snapchat_profile && (
							<SocialNetWork
								socialLink={business?.snapchat_profile}
								iconTitle='snapchat'
							/>
						)}
						{isChewLayout && !hideInfoIcon && (
							<TouchableOpacity onPress={() => handleClickBusinessInformation()}>
								<OText
									color={theme.colors.primary}
									style={{ textDecorationColor: theme.colors.primary, textDecorationLine: 'underline' }}
									size={12}
								>
									{t('SEE_MORE_DESCRIPTION', 'See more')}
								</OText>
							</TouchableOpacity>
						)}
					</SocialListWrapper>
				)}
			</>
		)
	}

	return (
		<BusinessContainer isChewLayout={isChewLayout && hideLogo}>
			{!hideHeader && (
				<BusinessHeader
					isChewLayout={isChewLayout}
					style={
						isBusinessInfoShow
							? styles.businesInfoheaderStyle
							: { ...styles.headerStyle, backgroundColor: theme.colors.backgroundGray }
					}
					{...(!loading && !imageRealSize?.loading && {
						source: (header || businessState?.business?.header || typeof theme?.images?.dummies?.businessHeader === 'string') ? {
							uri: optimizeImage(businessState?.business?.header, 'h_250,c_limit') || header || theme?.images?.dummies?.businessHeader
						} : theme?.images?.dummies?.businessHeader
					})}
					imageStyle={{ opacity: isChewLayout ? 0.5 : 1 }}
				>
					{isChewLayout && !loading && (
						<View style={styles.headerChewStyle}>
							<OText size={24} weight={'600'} mBottom={-5}>
								{business?.name}
							</OText>
							{business?.city?.name && !hideCity && (
								<OText>
									{business?.city?.name}
								</OText>
							)}
							<View style={styles.socialIconsChewContainer}>
								<SocialIcons />
							</View>
						</View>
					)}
				</BusinessHeader>
			)}
			<BusinessInfo style={styles.businessInfo}>
				{!hideLogo && (
					<BusinessLogo isChewLayout={isChewLayout}>
						{!isBusinessInfoShow && (
							<>
								{loading ? (
									<View style={styles.logoStyle}>
										<Placeholder Animation={Fade}>
											<PlaceholderLine height={72} style={{ borderRadius: 8 }} />
										</Placeholder>
									</View>
								) : (
									logo || businessState?.business?.logo || typeof theme.images.dummies.businessLogo === 'string' ?
										<FastImage
											style={styles.logoStyle}
											source={{
												uri: logo || optimizeImage(businessState?.business?.logo, 'h_70,c_limit') || theme.images.dummies.businessLogo,
												priority: FastImage.priority.high,
												cache: FastImage.cacheControl.web
											}}
											resizeMode={FastImage.resizeMode.contain}
										/>
										:
										<OIcon
											src={theme?.images?.dummies?.businessLogo}
											style={styles.logoStyle}
										/>
								)}
							</>
						)}
					</BusinessLogo>
				)}
				{!isChewLayout && (

					<>
						<BusinessInfoItem>
							{loading ? (
								<Placeholder Animation={Fade}>
									<PlaceholderLine height={30} width={20} />
								</Placeholder>
							) : (
								<TitleWrapper>
									<OText size={24} weight={'600'} numberOfLines={2}>
										{business?.name}
									</OText>
									{business?.ribbon?.enabled && (
										<RibbonBox
											bgColor={business?.ribbon?.color}
											colorText={lightenDarkenColor(business?.ribbon?.color)}
											borderRibbon={lightenDarkenColor(business?.ribbon?.color)}
											isRoundRect={business?.ribbon?.shape === shape?.rectangleRound}
											isCapsule={business?.ribbon?.shape === shape?.capsuleShape}
										>
											<OText
												size={10}
												weight={'400'}
												color={lightenDarkenColor(business?.ribbon?.color) ? theme.colors.black : theme.colors.white}
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
						{!isChewLayout && (
							<SocialIcons />
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
									{!hideDeliveryFee && (
										<OText color={theme.colors.textSecondary} size={12} style={styles.metadata}>
											{`${t('DELIVERY_FEE', 'Delivery fee')} ${business && parsePrice(business?.delivery_price || 0)} \u2022 `}
										</OText>
									)}
									{!hideTime && (
										<>
											{orderState?.options?.type === 1 ? (
												<OText color={theme.colors.textSecondary} size={12} style={styles.metadata}>
													{convertHoursToMinutes(business?.delivery_time) + `  \u2022 `}
												</OText>
											) : (
												<OText color={theme.colors.textSecondary} size={12} style={styles.metadata}>
													{convertHoursToMinutes(business?.pickup_time) + `  \u2022 `}
												</OText>
											)}
										</>
									)}
									{!hideDistance && (
										<OText color={theme.colors.textSecondary} size={12} style={styles.metadata}>
											{parseDistance(business?.distance || 0) + `  \u2022 `}
										</OText>
									)}
								</View>
								{!hideReviews && (
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
								)}
							</BusinessInfoItem>
						</View>
						<WrapReviews>
							{!isBusinessInfoShow && (
								<>
									{isPreOrder && (!business?.professionals || business?.professionals?.length === 0) && (
										<>
											<TouchableOpacity onPress={() => navigation.navigate('BusinessPreorder', { business: businessState?.business, handleBusinessClick: () => navigation?.goBack() })}>
												<OText
													color={theme.colors.primary}
													style={{ textDecorationColor: theme.colors.primary, textDecorationLine: 'underline' }}
													size={12}
												>
													{t('PREORDER', 'Preorder')}
												</OText>
											</TouchableOpacity>
											<OText size={12} color={theme.colors.textSecondary}>{' \u2022 '}</OText>
										</>
									)}
									{!hideReviewsPopup && (
										<>
											<TouchableOpacity onPress={() => handleClickBusinessReviews()}>
												<OText
													color={theme.colors.primary}
													style={{ textDecorationColor: theme.colors.primary, textDecorationLine: 'underline' }}
													size={12}
												>
													{t('REVIEWS', 'Reviews')}
												</OText>
											</TouchableOpacity>
											<OText size={12} color={theme.colors.textSecondary}>{' \u2022 '}</OText>
										</>
									)}

									{!isBusinessInfoShow && !hideInfoIcon && !isChewLayout && (
										<TouchableOpacity onPress={() => handleClickBusinessInformation()}>
											<OText
												color={theme.colors.primary}
												style={{ textDecorationColor: theme.colors.primary, textDecorationLine: 'underline' }}
												size={12}
											>
												{t('INFORMATION', 'Information')}
											</OText>
										</TouchableOpacity>
									)}
								</>
							)}
						</WrapReviews>
					</>
				)}
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
