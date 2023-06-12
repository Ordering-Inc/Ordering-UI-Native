import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
import { IOScrollView } from 'react-native-intersection-observer'
import Geolocation from '@react-native-community/geolocation'
import { getTrackingStatus, requestTrackingPermission } from 'react-native-tracking-transparency'
import {
	View,
	StyleSheet,
	ScrollView,
	Platform,
	TouchableOpacity,
	RefreshControl,
	AppState
} from 'react-native';
import {
	BusinessList as BusinessesListingController,
	useLanguage,
	useSession,
	useOrder,
	useConfig,
	useUtils,
} from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons'
import IconAntDesign from 'react-native-vector-icons/AntDesign';

import {
	Search,
	OrderControlContainer,
	AddressInput,
	WrapMomentOption,
	HeaderWrapper,
	ListWrapper,
	FeaturedWrapper,
	OrderProgressWrapper,
	FarAwayMessage,
	SearchBarWrapper,
	MomentWrapper,
	FilterWrapper,
	ServiceWrapper,
	PriceWrapper
} from './styles';

import { SearchBar } from '../../../SearchBar';
import { OIcon, OText, OButton } from '../../../shared';
import { BusinessesListingParams } from '../../../../types';
import { NotFoundSource } from '../../../NotFoundSource';
import { BusinessTypeFilter } from '../../../BusinessTypeFilter';
import { BusinessController } from '../../../BusinessController';
import { OrderTypeSelector } from '../../../OrderTypeSelector';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BusinessFeaturedController } from '../../../BusinessFeaturedController';
import { HighestRatedBusinesses } from '../../../HighestRatedBusinesses';
import { getTypesText, convertToRadian, priceList } from '../../../../utils';
import { OrderProgress } from '../../../OrderProgress';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { MomentSelector } from '../../../MomentSelector'

const PIXELS_TO_SCROLL = 2000;

const BusinessesListingUI = (props: BusinessesListingParams) => {
	const {
		navigation,
		businessesList,
		searchValue,
		getBusinesses,
		handleChangeBusinessType,
		handleBusinessClick,
		paginationProps,
		handleChangeSearch,
		businessId,
		isGuestUser,
		handleUpdateBusinessList,
		priceLevelSelected,
		handleChangePriceLevel,
		businessTypeSelected
	} = props;
	const theme = useTheme();
	const isFocused = useIsFocused();
	const appState = useRef(AppState.currentState)
	const [appStateVisible, setAppStateVisible] = useState(appState.current);
	const [refreshing] = useState(false);
	const styles = StyleSheet.create({
		container: {
			marginBottom: 0,
		},
		welcome: {
			flex: 1,
			flexDirection: 'row',
		},
		inputStyle: {
			backgroundColor: theme.colors.inputDisabled,
			flex: 1,
		},
		wrapperOrderOptions: {
			width: '100%',
			flexDirection: 'row',
			justifyContent: 'space-between',
			marginBottom: 10,
			zIndex: 100
		},
		borderStyle: {
			borderColor: theme.colors.backgroundGray,
			borderWidth: 1,
			borderRadius: 10,
		},
		searchInput: {
			fontSize: 12,
			paddingLeft: 0,
			paddingRight: 17,
			paddingTop: 7
		},
		iconStyle: {
			fontSize: 18,
			color: theme.colors.warning5,
			marginRight: 8
		},
		farAwayMsg: {
			paddingVertical: 6,
			paddingHorizontal: 20
		},
		inputContainerStyles: {
			backgroundColor: theme.colors.white,
			borderColor: theme.colors.backgroundGray,
			borderWidth: 1,
		},
		priceLevel: {
			marginRight: 10,
			borderRadius: 50,
			paddingVertical: 4,
			paddingLeft: 5,
			paddingRight: 5,
			height: 27,
			borderWidth: 0
		}
	});


	const [, t] = useLanguage();
	const [{ user, auth }] = useSession();
	const [orderState] = useOrder();
	const [{ configs }] = useConfig();
	const [{ parseDate }] = useUtils();

	const { top } = useSafeAreaInsets();

	const [featuredBusiness, setFeaturedBusinesses] = useState(Array);
	const [isFarAway, setIsFarAway] = useState(false)
	const [businessTypes, setBusinessTypes] = useState(null)
	const [orderTypeValue, setOrderTypeValue] = useState(orderState?.options.value)
	const isPreorderEnabled = (configs?.preorder_status_enabled?.value === '1' || configs?.preorder_status_enabled?.value === 'true') &&
		Number(configs?.max_days_preorder?.value) > 0
	const isPreOrderSetting = configs?.preorder_status_enabled?.value === '1'
	const timerId = useRef<any>(false)
	const [favoriteIds, setFavoriteIds] = useState<any>([])

	// const panResponder = useRef(
	// 	PanResponder.create({
	// 		onMoveShouldSetPanResponder: (e, gestureState) => {
	// 			const { dx, dy } = gestureState;
	// 			resetInactivityTimeout()
	// 			return (Math.abs(dx) > 20) || (Math.abs(dy) > 20);
	// 		},
	// 	})
	// ).current

	const handleMomentClick = () => {
		if (isPreorderEnabled) {
			navigation.navigate('MomentOption')
		}
	}

	const configTypes =
		configs?.order_types_allowed?.value
			.split('|')
			.map((value: any) => Number(value)) || [];

	const handleScroll = ({ nativeEvent }: any) => {
		const y = nativeEvent.contentOffset.y;
		const height = nativeEvent.contentSize.height;
		const hasMore = !(
			paginationProps.totalPages === paginationProps.currentPage
		);

		if (y + PIXELS_TO_SCROLL > height && !businessesList.loading && hasMore) {
			getBusinesses();
		}
	};

	const getDistance = (lat1: any, lon1: any, lat2: any, lon2: any) => {
		const R = 6371 // km
		const dLat = convertToRadian(lat2 - lat1)
		const dLon = convertToRadian(lon2 - lon1)
		const curLat1 = convertToRadian(lat1)
		const curLat2 = convertToRadian(lat2)
		const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(curLat1) * Math.cos(curLat2)
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
		return R * c
	}

	const resetInactivityTimeout = () => {
		clearTimeout(timerId.current)
		timerId.current = setInterval(() => {
			getBusinesses(true)
		}, 120000)
	}

	useEffect(() => {
		if (!businessesList?.loading) {
			const fb = businessesList.businesses.filter((b) => b.featured === true && b?.open);
			const ary = [];
			while (fb.length > 0) {
				ary.push(fb.splice(0, 2));
			}
			setFeaturedBusinesses(ary);
		}
		resetInactivityTimeout()
	}, [businessesList.loading])

	const handleOnRefresh = () => {
		if (!businessesList.loading) {
			getBusinesses(true);
		}
	}

	const checkUserLocation = async () => {
		let trackingStatus = await getTrackingStatus()
		if (trackingStatus === 'not-determined') {
			trackingStatus = await requestTrackingPermission()
		}
		if (trackingStatus === 'authorized' || trackingStatus === 'unavailable') {
			Geolocation.getCurrentPosition((pos) => {
				const crd = pos.coords
				const distance = getDistance(crd.latitude, crd.longitude, orderState?.options?.address?.location?.lat, orderState?.options?.address?.location?.lng)
				if (distance > 20) setIsFarAway(true)
				else setIsFarAway(false)
			}, (err) => {
				console.log(`ERROR(${err.code}): ${err.message}`)
			}, {
				enableHighAccuracy: true, timeout: 15000, maximumAge: 10000
			})
		}
	}

	useEffect(() => {
		checkUserLocation()
	}, [orderState?.options?.address?.location])

	useEffect(() => {
		if (!orderState?.loading) {
			setOrderTypeValue(orderState?.options?.type)
		}
	}, [orderState?.options?.type])

	useFocusEffect(
		useCallback(() => {
			resetInactivityTimeout()
			return () => clearTimeout(timerId.current)
		}, [navigation])
	)

	useEffect(() => {
		if (!businessesList?.businesses?.length) return
		const ids = [...favoriteIds]
		businessesList.businesses.forEach((business: any) => {
			if (business?.favorite) {
				ids.push(business?.id)
			}
		})
		setFavoriteIds([...new Set(ids)])
	}, [businessesList?.businesses?.length])

	return (
		<IOScrollView style={styles.container} onScroll={(e) => handleScroll(e)} showsVerticalScrollIndicator={false}
			refreshControl={
				<RefreshControl
					refreshing={refreshing}
					onRefresh={() => handleOnRefresh()}
				/>
			}
		>
			<HeaderWrapper
				source={theme.images.general.appointment}
				style={{ paddingTop: top + 20 }}>
				{!auth && (
					<TouchableOpacity onPress={() => navigation?.canGoBack() && navigation.goBack()} style={{ position: 'absolute', marginStart: 40, paddingVertical: 20 }}>
						<OIcon src={theme.images.general.arrow_left} color={theme.colors.textNormal} />
					</TouchableOpacity>
				)}
				<Search>
					<AddressInput
						onPress={() =>
							auth
								? navigation.navigate('AddressList', { isFromBusinesses: true })
								: navigation.navigate('AddressForm', {
									address: orderState.options?.address,
									isFromBusinesses: true,
									isGuestUser: isGuestUser
								})
						}>
						<OIcon
							src={theme.images.general.pin}
							color={theme.colors.disabled}
							width={16}
							style={{ marginRight: 10 }}
						/>
						<OText size={12} numberOfLines={1} style={{ width: '90%' }}>
							{orderState?.options?.address?.address}
						</OText>
					</AddressInput>
				</Search>
				{isFarAway && (
					<FarAwayMessage style={styles.farAwayMsg}>
						<Ionicons name='md-warning-outline' style={styles.iconStyle} />
						<OText size={12} numberOfLines={1} ellipsizeMode={'tail'} color={theme.colors.textNormal}>{t('YOU_ARE_FAR_FROM_ADDRESS', 'You are far from this address')}</OText>
					</FarAwayMessage>
				)}
				<OrderControlContainer>
					<MomentWrapper>
						<MomentSelector />
					</MomentWrapper>
					<View style={styles.wrapperOrderOptions}>
						<WrapMomentOption onPress={() => navigation.navigate('OrderTypes', { configTypes: configTypes, setOrderTypeValue })}>
							<OText
								size={12}
								numberOfLines={1}
								ellipsizeMode={'tail'}
								color={theme.colors.textSecondary}
								style={{ textAlign: 'left' }}
							>
								{t(getTypesText(orderTypeValue || orderState?.options?.type || 1), 'Delivery')}
							</OText>
							<OIcon
								src={theme.images.general.arrow_down}
								width={10}
								style={{ marginStart: 8 }}
							/>
						</WrapMomentOption>
						{!businessId && (
							<SearchBarWrapper>
								<SearchBar
									onSearch={handleChangeSearch}
									searchValue={searchValue}
									lazyLoad
									isCancelXButtonShow={!!searchValue}
									borderStyle={styles.borderStyle}
									onCancel={() => handleChangeSearch('')}
									placeholder={t('SEARCH', 'Search')}
									height={80}
									isAppointment
									isDisabled={!businessTypes || configs?.advanced_business_search_enabled?.value === '1'}
									inputStyle={{ ...styles.searchInput, ...Platform.OS === 'ios' ? {} : { paddingBottom: 4 } }}
									onPress={() => { configs?.advanced_business_search_enabled?.value === '1' && navigation.navigate('BusinessSearch', { businessTypes }) }}
									onSubmitEditing={() => { configs?.advanced_business_search_enabled?.value === '1' && navigation.navigate('BusinessSearch', { businessTypes, defaultTerm: searchValue }) }}
								/>
							</SearchBarWrapper>
						)}
					</View>
				</OrderControlContainer>
			</HeaderWrapper>
			<FilterWrapper>
				<ServiceWrapper>
					<OText
						size={16}
						style={{ marginBottom: 16 }}
						weight={Platform.OS === 'ios' ? '600' : 'bold'}
					>
						{t('POPULAR_SERVICES', 'Popular services')}
					</OText>
					<BusinessTypeFilter
						businessTypes={props.businessTypes}
						defaultBusinessType={props.defaultBusinessType}
						handleChangeBusinessType={handleChangeBusinessType}
						setBusinessTypes={setBusinessTypes}
						isAppoint
					/>
				</ServiceWrapper>
				<PriceWrapper>
					<OText
						size={16}
						style={{ marginBottom: 16 }}
						weight={Platform.OS === 'ios' ? '600' : 'bold'}
					>
						{t('PRICE', 'Price')}
					</OText>
					<ScrollView
						horizontal
						showsVerticalScrollIndicator={false}
						showsHorizontalScrollIndicator={false}
					>
						{priceList?.length > 0 && priceList.map((price, i) => (
							<OButton
								key={i}
								bgColor={(priceLevelSelected === price?.level) ? theme.colors.primary : theme.colors.backgroundGray200}
								onClick={() => handleChangePriceLevel(price?.level)}
								text={`${price.content} ${(priceLevelSelected === price?.level) ? ' X' : ''}`}
								style={styles.priceLevel}
								textStyle={{ fontSize: 10, color: (priceLevelSelected === price?.level) ? theme.colors.backgroundLight : theme.colors.textNormal }}
							/>
						))}
					</ScrollView>
				</PriceWrapper>
			</FilterWrapper>
			<OrderProgressWrapper>
				<OrderProgress
					{...props}
					isFocused={isFocused}
				/>
			</OrderProgressWrapper>

			{
				!businessId && !props.franchiseId && featuredBusiness && featuredBusiness.length > 0 && (
					<FeaturedWrapper>
						<OText size={16} style={{ marginLeft: 40 }} weight={Platform.OS === 'ios' ? '600' : 'bold'}>{t('BUSINESS_FEATURE', 'Featured business')}</OText>
						<ScrollView
							showsHorizontalScrollIndicator={false}
							nestedScrollEnabled
							horizontal contentContainerStyle={{ paddingHorizontal: 20 }}>
							{featuredBusiness.map((bAry: any, idx) => (
								<View key={'f-listing_' + idx}>
									<BusinessFeaturedController
										business={bAry[0]}
										isBusinessOpen={bAry[0]?.open}
										handleCustomClick={handleBusinessClick}
										orderType={orderState?.options?.type}
									/>
									{bAry.length > 1 && (
										<BusinessFeaturedController
											business={bAry[1]}
											isBusinessOpen={bAry[1]?.open}
											handleCustomClick={handleBusinessClick}
											orderType={orderState?.options?.type}
										/>
									)}
								</View>
							))}
						</ScrollView>
					</FeaturedWrapper>
				)
			}
			<View style={{ height: 8, backgroundColor: theme.colors.backgroundGray100 }} />
			{
				!businessId && !props.franchiseId && (
					<HighestRatedBusinesses
						onBusinessClick={handleBusinessClick}
						navigation={navigation}
						initialBuisnessType={businessTypeSelected}
						initialPricelevel={priceLevelSelected}
						favoriteIds={favoriteIds}
						setFavoriteIds={setFavoriteIds}
					/>
				)
			}
			<View style={{ height: 8, backgroundColor: theme.colors.backgroundGray100 }} />
			<ListWrapper>
				{!businessId && (
					<BusinessTypeFilter
						images={props.images}
						businessTypes={props.businessTypes}
						defaultBusinessType={props.defaultBusinessType}
						handleChangeBusinessType={handleChangeBusinessType}
						setBusinessTypes={setBusinessTypes}
					/>
				)}
				{!businessesList.loading && businessesList.businesses.length === 0 && (
					<NotFoundSource
						content={t(
							'NOT_FOUND_BUSINESSES',
							'No businesses to delivery / pick up at this address, please change filters or change address.',
						)}
					/>
				)}
				{businessesList.businesses?.map(
					(business: any, i: number) => (
						<BusinessController
							key={`${business.id}_` + i}
							enableIntersection
							business={business}
							isBusinessOpen={business.open}
							handleCustomClick={handleBusinessClick}
							orderType={orderState?.options?.type}
							navigation={navigation}
							businessHeader={business?.header}
							businessFeatured={business?.featured}
							businessLogo={business?.logo}
							businessReviews={business?.reviews}
							businessDeliveryPrice={business?.delivery_price}
							businessDeliveryTime={business?.delivery_time}
							businessPickupTime={business?.pickup_time}
							businessDistance={business?.distance}
							handleUpdateBusinessList={handleUpdateBusinessList}
							favoriteIds={favoriteIds}
							setFavoriteIds={setFavoriteIds}
						/>
					)
				)}
				{businessesList.loading && (
					<>
						{[
							...Array(
								paginationProps.nextPageItems
									? paginationProps.nextPageItems
									: 8,
							).keys(),
						].map((item, i) => (
							<Placeholder
								Animation={Fade}
								key={i}
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
						))}
					</>
				)}
			</ListWrapper>
		</IOScrollView>
	);
};

export const BusinessesListing = (props: BusinessesListingParams) => {
	const BusinessesListingProps = {
		...props,
		isForceSearch: Platform.OS === 'ios',
		UIComponent: BusinessesListingUI,
	};

	return <BusinessesListingController {...BusinessesListingProps} />;
};
