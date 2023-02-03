import React, { useState } from 'react';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
import {
	BusinessController as BusinessSingleCard,
	useUtils,
	useOrder,
	useLanguage,
	useConfig,
	useToast,
	useSession,
	ToastType
} from 'ordering-components/native';
import { OIcon, OText } from '../shared';
import { Dimensions, StyleSheet, Vibration, View } from 'react-native';
import { InView } from 'react-native-intersection-observer'
import { BusinessControllerParams } from '../../types';
import { convertHoursToMinutes, shape } from '../../utils';

import {
	BusinessHero,
	BusinessContent,
	BusinessInfo,
	Metadata,
	BusinessState,
	BusinessLogo,
	Reviews,
	RibbonBox,
	ReviewAndFavorite,
	OfferBox
} from './styles';
import { useTheme } from 'styled-components/native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import FastImage from 'react-native-fast-image'
import { LottieAnimation } from '../LottieAnimation';
import { CardAnimation } from '../shared/CardAnimation';

export const BusinessControllerUI = (props: BusinessControllerParams) => {
	const {
		business,
		handleClick,
		navigation,
		isBusinessOpen,
		style,
		isCustomLayout,
		businessHeader,
		businessFeatured,
		businessLogo,
		businessReviews,
		businessDeliveryPrice,
		businessDeliveryTime,
		businessPickupTime,
		businessDistance,
		handleFavoriteBusiness,
		enableIntersection,
		getBusinessOffer
	} = props;

	const [{ parsePrice, parseDistance, parseNumber, optimizeImage }] = useUtils();
	const [, { showToast }] = useToast()
	const [orderState] = useOrder();
	const [{ auth }] = useSession()
	const [configState] = useConfig();
	const [, t] = useLanguage();
	const theme = useTheme()
	const windowHeight = Dimensions.get('window').height
	const [isIntersectionObserver, setIsIntersectionObserver] = useState(!enableIntersection)

	const hideBusinessLogo = theme?.business_listing_view?.components?.business?.components?.logo?.hidden
	const hideBusinessFee = theme?.business_listing_view?.components?.business?.components?.fee?.hidden
	const hideBusinessTime = theme?.business_listing_view?.components?.business?.components?.time?.hidden
	const hideBusinessDistance = theme?.business_listing_view?.components?.business?.components?.distance?.hidden
	const hideBusinessReviews = theme?.business_listing_view?.components?.business?.components?.reviews?.hidden
	const hideBusinessFavorite = theme?.business_listing_view?.components?.business?.components?.favorite?.hidden
	const hideBusinessOffer = theme?.business_listing_view?.components?.business?.components?.offer?.hidden
	const hideBusinessHeader = theme?.business_listing_view?.components?.business?.components?.header?.hidden
	const hideBusinessFavoriteBadge = theme?.business_listing_view?.components?.business?.components?.featured_badge?.hidden

	const textSize = isCustomLayout ? 12 : 10
	const cardHeight = windowHeight * 0.3

	const styles = StyleSheet.create({
		container: {
			marginVertical: 20,
			borderRadius: 7.6,
			width: '100%',
			position: 'relative',
			height: cardHeight
		},
		headerStyle: {
			borderTopLeftRadius: 7.6,
			borderTopRightRadius: 7.6,
		},
		businessLogo: {
			backgroundColor: 'white',
			width: 62,
			height: 62,
			borderRadius: 7.6,
			justifyContent: 'center',
			alignItems: 'center',
			marginTop: -32,
			shadowColor: '#000000',
			shadowOffset: { width: 0, height: 1 },
			shadowOpacity: 0.1,
			shadowRadius: 1,
			elevation: 2
		},
		businessStateView: {
			backgroundColor: '#DEE2E6',
			borderRadius: 50,
			height: 20,
			alignItems: 'center',
			justifyContent: 'center',
			paddingHorizontal: 8,
		},
		businessStateText: {
			textAlign: 'center',
		},

		starIcon: {
			marginHorizontal: 2,
			marginTop: -2,
		},
		featured: {
			position: 'absolute',
			padding: 8,
			backgroundColor: theme.colors.backgroundDark,
			opacity: 0.8,
			borderRadius: 10,
			left: 20,
			top: 10,
		},
		closed: {
		},
		bullet: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'flex-start',
		}
	});

	const types = ['food', 'laundry', 'alcohol', 'groceries'];

	const getBusinessType = () => {
		if (Object.keys(business).length <= 0) return t('GENERAL', 'General');
		const _types: any = [];
		types.forEach((type) => {
			if (business[type]) {
				_types.push(t(type.toUpperCase(), type));
			}
		});
		return _types.join(', ');
	};

	const handleBusinessClick = (selectedBusiness: any) => {
		Vibration.vibrate()
		if (business?.open) handleClick && handleClick(selectedBusiness)
		else {
			if (configState?.configs?.preorder_status_enabled?.value === '1') {
				navigation.navigate('BusinessPreorder', { business: selectedBusiness, handleBusinessClick: handleClick })
				return
			}
			showToast(ToastType.Info, t('ERROR_ADD_PRODUCT_BUSINESS_CLOSED', 'The business is closed at the moment'));
		}
	}

	const handleChangeFavorite = () => {
		if (auth) {
			handleFavoriteBusiness && handleFavoriteBusiness(!business?.favorite)
		} else {
			navigation && navigation.navigate('Login');
		}
	}

	const handleChangeInterSection = (inView: boolean) => {
		setIsIntersectionObserver(inView)
	}

	return (
		<InView style={{ minHeight: 200 }} triggerOnce={true} onChange={(inView: boolean) => handleChangeInterSection(inView)}>
			{isIntersectionObserver ? (
				<CardAnimation
					style={[style, styles.container]}
					onClick={() => handleBusinessClick(business)}
				>
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
					<BusinessHero>
						{!hideBusinessHeader && (
							<FastImage
								style={{ height: isCustomLayout ? cardHeight * 0.66 : 120 }}
								source={(businessHeader || business?.header || typeof theme.images.dummies.businessHeader === 'string') ? {
									uri: optimizeImage(businessHeader || business?.header || theme.images.dummies.businessHeader, 'h_500,c_limit'),
									priority: FastImage.priority.normal,
								} : theme.images.dummies.businessHeader}								
								resizeMode={FastImage.resizeMode.cover}
							/>
						)}
						{(businessFeatured ?? business?.featured) && !hideBusinessFavoriteBadge && (
							<View style={styles.featured}>
								<FontAwesomeIcon name="crown" size={26} color="gold" />
							</View>
						)}
						{(!isCustomLayout) && !hideBusinessOffer && (
							getBusinessOffer((business?.offers)) &&
							<OfferBox>
								<OText
									size={10}
									weight={'400'}
									numberOfLines={2}
									ellipsizeMode='tail'
									lineHeight={13}
								>{getBusinessOffer((business?.offers)) || parsePrice(0)}</OText>
							</OfferBox>
						)}
						<BusinessState>
							{!isBusinessOpen && (configState?.configs?.preorder_status_enabled?.value === '1') && (
								<View style={styles.businessStateView}>
									<OText
										color={theme.colors.textThird}
										size={10}
										style={styles.businessStateText}>
										{t('PREORDER', 'PREORDER')}
									</OText>
								</View>
							)}
						</BusinessState>
					</BusinessHero>
					<BusinessContent>
						<BusinessInfo style={isCustomLayout && { position: 'absolute', bottom: 85, left: 15 }}>
							{!hideBusinessLogo && (
								<BusinessLogo style={styles.businessLogo}>
									<FastImage
										style={{ width: 56, height: 56 }}
										source={(businessLogo || business?.logo || typeof theme.images.dummies.businessLogo === 'string') ? {
											uri: optimizeImage(businessLogo || business?.logo || theme.images.dummies.businessLogo, 'h_150,c_limit'),
											priority: FastImage.priority.normal,
										} : theme.images.dummies.businessLogo}
										resizeMode={FastImage.resizeMode.cover}
									/>
								</BusinessLogo>
							)}
							{!isCustomLayout && (!hideBusinessFavorite || !hideBusinessReviews) && (
								<ReviewAndFavorite>
									{(businessReviews?.reviews?.total > 0 ?? business?.reviews?.total > 0) && !hideBusinessReviews && (
										<Reviews>
											<OIcon src={theme.images.general.star} width={12} style={styles.starIcon} />
											<OText size={10} style={{ lineHeight: 15 }}>
												{parseNumber(businessReviews?.reviews?.total ?? business?.reviews?.total, { separator: '.' })}
											</OText>
										</Reviews>
									)}
									{!hideBusinessFavorite && (
										<LottieAnimation
											type='favorite'
											onClick={handleChangeFavorite}
											initialValue={business?.favorite ? 0.75 : 0}
											toValue={business?.favorite ? 0 : 0.75}
											disableAnimation={!auth}
											iconProps={{ color: theme.colors.danger5, size: 18 }}
											isActive={business?.favorite}
										/>
									)}
								</ReviewAndFavorite>
							)}
						</BusinessInfo>
						<View style={isCustomLayout && { width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
							<OText
								size={textSize + 2}
								style={{ lineHeight: 18, marginBottom: 6 }}
								weight={'500'}>
								{business?.name}
							</OText>
							{isCustomLayout && (!hideBusinessFavorite || !hideBusinessReviews) && (
								<ReviewAndFavorite>
									{(businessReviews?.reviews?.total > 0 ?? business?.reviews?.total > 0) && !hideBusinessReviews && (
										<Reviews>
											<OIcon src={theme.images.general.star} width={12} style={styles.starIcon} />
											<OText size={10} style={{ lineHeight: 15 }}>
												{parseNumber(businessReviews?.reviews?.total ?? business?.reviews?.total, { separator: '.' })}
											</OText>
										</Reviews>
									)}
									{!hideBusinessFavorite && (
										<LottieAnimation
											type='favorite'
											onClick={handleChangeFavorite}
											initialValue={business?.favorite ? 0.75 : 0}
											toValue={business?.favorite ? 0 : 0.75}
											disableAnimation={!auth}
											iconProps={{ color: theme.colors.danger5, size: 18 }}
											isActive={business?.favorite}
										/>
									)}
								</ReviewAndFavorite>
							)}
						</View>
						<OText size={textSize} style={{ lineHeight: 15, marginBottom: 3 }} numberOfLines={isCustomLayout ? 1 : 2}>
							{business?.address}
						</OText>
						<Metadata>
							{!isBusinessOpen ? (
								<View style={styles.closed}>
									<OText size={10} color={theme.colors.red}>
										{t('CLOSED', 'Closed')}
									</OText>
								</View>
							) : (
								<View style={styles.bullet}>
									{orderState?.options?.type === 1 && !hideBusinessFee && (
										<OText size={textSize} color={theme.colors.textSecondary}>
											{`${t('DELIVERY_FEE', 'Delivery fee')} ${parsePrice(businessDeliveryPrice ?? business?.delivery_price) + ' \u2022 '}`}
										</OText>
									)}
									{!hideBusinessTime && (
										<OText size={textSize} color={theme.colors.textSecondary}>{`${convertHoursToMinutes(
											orderState?.options?.type === 1
												? (businessDeliveryTime ?? business?.delivery_time)
												: (businessPickupTime ?? business?.pickup_time),
										)} \u2022 `}</OText>
									)}
									{!hideBusinessDistance && (
										<OText size={textSize} color={theme.colors.textSecondary}>{parseDistance(businessDistance ?? business?.distance)}</OText>
									)}
								</View>
							)}
						</Metadata>
					</BusinessContent>
				</CardAnimation>
			) : (
				<Placeholder
					Animation={Fade}
					style={{ marginBottom: 20 }}>
					<View style={{ width: '100%' }}>
						<PlaceholderLine
							height={200}
							style={{ marginBottom: 20, borderRadius: 25 }}
						/>
						<View style={{ paddingHorizontal: 10 }}>
							<View
								style={{
									flexDirection: 'row',
									justifyContent: 'space-between',
								}}>
								<PlaceholderLine
									height={25}
									width={40}
									style={{ marginBottom: 10 }}
								/>
								<PlaceholderLine
									height={25}
									width={20}
									style={{ marginBottom: 10 }}
								/>
							</View>
							<PlaceholderLine
								height={20}
								width={30}
								style={{ marginBottom: 10 }}
							/>
							<PlaceholderLine
								height={20}
								width={80}
								style={{ marginBottom: 10 }}
							/>
						</View>
					</View>
				</Placeholder>
			)}
		</InView>
	);
};

export const BusinessController = (props: BusinessControllerParams) => {
	const BusinessControllerProps = {
		...props,
		UIComponent: BusinessControllerUI,
	};

	return <BusinessSingleCard {...BusinessControllerProps} />;
};
