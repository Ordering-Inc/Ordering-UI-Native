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
import { StyleSheet, TouchableOpacity, View, Animated } from 'react-native';
import { InView } from 'react-native-intersection-observer'
import { BusinessControllerParams } from '../../types';
import { convertHoursToMinutes, shape } from '../../utils';
import {
	Card,
	BusinessHero,
	BusinessContent,
	BusinessCategory,
	BusinessInfo,
	Metadata,
	BusinessState,
	BusinessLogo,
	Reviews,
	RibbonBox,
	ReviewAndFavorite
} from './styles';
import { useTheme } from 'styled-components/native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import IconAntDesign from 'react-native-vector-icons/AntDesign'
import FastImage from 'react-native-fast-image'

export const BusinessControllerUI = (props: BusinessControllerParams) => {
	const {
		business,
		handleClick,
		navigation,
		isBusinessOpen,
		style,
		businessHeader,
		businessFeatured,
		businessLogo,
		businessReviews,
		businessDeliveryPrice,
		businessDeliveryTime,
		businessPickupTime,
		businessDistance,
		handleFavoriteBusiness,
		enableIntersection
	} = props;
	const [{ parsePrice, parseDistance, parseNumber, optimizeImage }] = useUtils();
	const [, { showToast }] = useToast()
	const [orderState] = useOrder();
	const [ { auth }] = useSession()
	const [configState] = useConfig();
	const [, t] = useLanguage();
	const theme = useTheme()
	const [isIntersectionObserver, setIsIntersectionObserver] = useState(!enableIntersection)

	const styles = StyleSheet.create({
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
		},
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
				<Card activeOpacity={1} onPress={() => handleBusinessClick(business)} style={style}>
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
						<FastImage
							style={{ height: 120 }}
							source={(businessHeader || business?.header) ? {
								uri: optimizeImage(businessHeader || business?.header, 'h_500,c_limit'),
								priority: FastImage.priority.normal,
							} : theme.images.dummies.businessHeader}
							resizeMode={FastImage.resizeMode.cover}
						/>
						{(businessFeatured ?? business?.featured) && (
							<View style={styles.featured}>
								<FontAwesomeIcon name="crown" size={26} color="gold" />
							</View>
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
						<BusinessInfo>
							<BusinessLogo style={styles.businessLogo}>
								<FastImage
									style={{ width: 56, height: 56 }}
									source={(businessLogo || business?.logo) ? {
										uri: optimizeImage(businessLogo || business?.logo, 'h_150,c_limit'),
										priority: FastImage.priority.normal,
									} : theme.images.dummies.businessLogo}
									resizeMode={FastImage.resizeMode.cover}
								/>
							</BusinessLogo>
							<ReviewAndFavorite>
								{(businessReviews?.reviews?.total > 0 ?? business?.reviews?.total > 0) && (
									<Reviews>
										<OIcon src={theme.images.general.star} width={12} style={styles.starIcon} />
										<OText size={10} style={{ lineHeight: 15 }}>
											{parseNumber(businessReviews?.reviews?.total ?? business?.reviews?.total, { separator: '.' })}
										</OText>
									</Reviews>
								)}
								<TouchableOpacity
									onPress={handleChangeFavorite}
								>
									<IconAntDesign
										name={business?.favorite ? 'heart' : 'hearto'}
										color={theme.colors.danger5}
										size={18}
									/>
								</TouchableOpacity>
							</ReviewAndFavorite>
						</BusinessInfo>
						<OText
							size={12}
							style={{ lineHeight: 18, marginBottom: 6 }}
							weight={'500'}>
							{business?.name}
						</OText>
						<OText size={10} style={{ lineHeight: 15, marginBottom: 3 }}>
							{business?.address}
						</OText>
						{/* <BusinessCategory>
          <OText>{getBusinessType()}</OText>
        </BusinessCategory> */}
						<Metadata>
							{!isBusinessOpen ? (
								<View style={styles.closed}>
									<OText size={10} color={theme.colors.red}>
										{t('CLOSED', 'Closed')}
									</OText>
								</View>
							) : (
								<View style={styles.bullet}>
									{orderState?.options?.type === 1 && (
										<OText size={10} color={theme.colors.textSecondary}>
											{`${t('DELIVERY_FEE', 'Delivery fee')} ${parsePrice(businessDeliveryPrice ?? business?.delivery_price) + ' \u2022 '}`}
										</OText>
									)}
									<OText size={10} color={theme.colors.textSecondary}>{`${convertHoursToMinutes(
										orderState?.options?.type === 1
											? (businessDeliveryTime ?? business?.delivery_time)
											: (businessPickupTime ?? business?.pickup_time),
									)} \u2022 `}</OText>
									<OText size={10} color={theme.colors.textSecondary}>{parseDistance(businessDistance ?? business?.distance)}</OText>
								</View>
							)}
						</Metadata>
					</BusinessContent>
				</Card>
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
