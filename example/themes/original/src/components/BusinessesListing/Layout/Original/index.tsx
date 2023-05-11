import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
import Geolocation from '@react-native-community/geolocation'
import { IOScrollView } from 'react-native-intersection-observer'
import { getTrackingStatus, requestTrackingPermission } from 'react-native-tracking-transparency'
import {
	View,
	StyleSheet,
	ScrollView,
	Platform,
	TouchableOpacity,
	RefreshControl,
	AppState,
	FlatList
} from 'react-native';
import {
	BusinessList as BusinessesListingController,
	useLanguage,
	useSession,
	useOrder,
	useConfig,
	useUtils
} from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons'

import {
	Search,
	OrderControlContainer,
	AddressInput,
	WrapMomentOption,
	HeaderWrapper,
	ListWrapper,
	FeaturedWrapper,
	FarAwayMessage,
	AddressInputContainer,
	PreorderInput,
	OrderTypesContainer,
	BusinessLogosContainer
} from './styles';

import { OIcon, OText, OModal } from '../../../shared';
import { BusinessesListingParams } from '../../../../types';
import { NotFoundSource } from '../../../NotFoundSource';
import { BusinessTypeFilter } from '../../../BusinessTypeFilter';
import { BusinessController } from '../../../BusinessController';
import { OrderTypeSelector } from '../../../OrderTypeSelector';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BusinessFeaturedController } from '../../../BusinessFeaturedController';
import { HighestRatedBusinesses } from '../../../HighestRatedBusinesses';
import { getTypesText } from '../../../../utils';
import { OrderProgress } from '../../../OrderProgress';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import { PageBanner } from '../../../PageBanner'
import { CitiesControl } from '../../../CitiesControl'

const PIXELS_TO_SCROLL = 2000;

const BusinessesListingUI = (props: BusinessesListingParams) => {
	const {
		navigation,
		businessesList,
		getBusinesses,
		handleChangeBusinessType,
		handleBusinessClick,
		paginationProps,
		businessId,
		isGuestUser,
		handleUpdateBusinessList,
		citiesState,
		actualSlug,
		logosLayout
	} = props;
	const theme = useTheme();
	const isFocused = useIsFocused();

	const [, t] = useLanguage();
	const [{ user, auth }] = useSession();
	const [orderState, { changeCityFilter }] = useOrder();
	const [{ configs }] = useConfig();
	const [{ parseDate }] = useUtils();

	const appState = useRef(AppState.currentState)
	const isChewLayout = theme?.header?.components?.layout?.type?.toLowerCase() === 'chew'
	const [refreshing] = useState(false);
	const allCitiesDisabled = citiesState?.cities?.every((city: any) => !city.enabled)
	const hideCities = (theme?.business_listing_view?.components?.cities?.hidden || orderState?.options?.type !== 2 || allCitiesDisabled) ?? true
	const hideHero = theme?.business_listing_view?.components?.business_hero?.hidden
	const hidePreviousOrders = theme?.business_listing_view?.components?.previous_orders_block?.hidden
	const hideHighestBusiness = theme?.business_listing_view?.components?.highest_rated_business_block?.hidden
	const isAllCategoriesHidden = theme?.business_listing_view?.components?.categories?.hidden
	const bgHeader = theme?.business_listing_view?.components?.business_hero?.components?.image
	const bgHeaderHeight = theme?.business_listing_view?.components?.business_hero?.components?.style?.height

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
			justifyContent: 'center',
			marginBottom: 10,
			zIndex: 100,
		},
		borderStyle: {
			borderColor: theme.colors.backgroundGray,
			borderWidth: 1,
			borderRadius: 10,
		},
		searchInput: {
			fontSize: 16,
			backgroundColor: theme.colors.white,
			paddingLeft: 10,
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
		buttonCityStyle: {
			backgroundColor: theme.colors.white,
			borderColor: theme.colors.backgroundGray,
			borderRadius: 8,
			marginHorizontal: 40,
			minHeight: 45,
			paddingVertical: 5,
			paddingHorizontal: 20,
			borderWidth: 1,
			justifyContent: 'center'
		},
		businessSkeleton: {
			borderRadius: 8,
			marginRight: 20,
			width: 56,
			height: 56
		},
	});

	const { top } = useSafeAreaInsets();

	const [featuredBusiness, setFeaturedBusinesses] = useState(Array);
	const [isFarAway, setIsFarAway] = useState(false)
	const [businessTypes, setBusinessTypes] = useState(null)
	const [orderTypeValue, setOrderTypeValue] = useState(orderState?.options?.value)
	const [isOpenCities, setIsOpenCities] = useState(false)
	const isPreorderEnabled = (configs?.preorder_status_enabled?.value === '1' || configs?.preorder_status_enabled?.value === 'true') &&
		Number(configs?.max_days_preorder?.value) > 0
	const isPreOrderSetting = configs?.preorder_status_enabled?.value === '1'
	const timerId = useRef<any>(false)
	const [favoriteIds, setFavoriteIds] = useState<any>([])
	const chewOrderTypes = [{ name: t('DELIVERY', 'Delivery').toUpperCase(), value: 1 }, { name: t('PICKUP', 'Pickup').toUpperCase(), value: 2 }]
	const enabledPoweredByOrdering = configs?.powered_by_ordering_module?.value

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

		if (y + PIXELS_TO_SCROLL > height && !businessesList.loading && hasMore && businessesList?.businesses?.length > 0) {
			getBusinesses();
		}
	};

	const convertToRadian = (value: number) => {
		return value * Math.PI / 180
	}

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
		if (!logosLayout) {
			clearTimeout(timerId.current)
			timerId.current = setInterval(() => {
				getBusinesses(true)
			}, 120000)
		}
	}

	const handleChangeCity = (cityId: number | null) => {
		changeCityFilter(orderState?.options?.city_id === cityId ? null : cityId)
		setIsOpenCities(false)
	}

	useEffect(() => {
		if (!businessesList?.loading) {
			const fb = businessesList.businesses.filter((b) => b?.featured && b?.open);
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
		if (!logosLayout) {
			checkUserLocation()
		}
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

	useEffect(() => {
		setIsOpenCities(false)
	}, [orderState?.options?.city_id])

	useEffect(() => {
		if (!citiesState?.cities?.length || !orderState?.options?.city_id) return
		const selectedCity = citiesState?.cities?.find((city: any) => city?.id === orderState?.options?.city_id)
		if (!selectedCity || !selectedCity?.enabled) changeCityFilter(null)
	}, [citiesState, orderState?.options?.city_id])

	if (logosLayout) {
		return (
			<BusinessLogosContainer
				horizontal
				showsHorizontalScrollIndicator={false}
			>
				{businessesList?.loading ? (
					<Placeholder Animation={Fade}>
						<View style={{ flexDirection: 'row' }}>
							{[...Array(10).keys()].map(i => (
								<View style={styles.businessSkeleton} key={i}>
									<PlaceholderLine style={{ width: '100%', height: '100%' }} />
								</View>
							))}
						</View>
					</Placeholder>
				) : (
					<>
						{businessesList.businesses
							?.filter(business => business?.open)
							?.map(business => (
								<TouchableOpacity
									key={business?.id}
									onPress={() => handleBusinessClick && handleBusinessClick(business)}
									style={{
										width: 60,
										height: 60,
										borderRadius: 8,
										marginRight: 5
									}}
								>
									<FastImage
										style={{
											width: 56,
											height: 56,
											marginRight: 20,
											borderRadius: 8,
											borderColor: theme.colors.primary,
											borderWidth: business?.slug === actualSlug ? 2 : 0
										}}
										source={{
											uri: business?.logo,
											priority: FastImage.priority.normal,
										}}
										resizeMode={FastImage.resizeMode.cover}
									/>
								</TouchableOpacity>
							))}
					</>
				)}
			</BusinessLogosContainer>
		)
	}

	return (
		<IOScrollView
			style={styles.container}
			onScroll={(e) => handleScroll(e)}
			showsVerticalScrollIndicator={false}
			refreshControl={
				<RefreshControl
					refreshing={refreshing}
					onRefresh={() => handleOnRefresh()}
				/>
			}
		>
			{enabledPoweredByOrdering && auth && (
				<View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', top: 20 }}>
					<OText>
						Powered By Ordering.co
					</OText>
				</View>
			)}
			<View style={{
				height: !isPreOrderSetting && isChewLayout ? 150 : isChewLayout ? 200 : isFarAway ? 150 : 100,
				marginTop: isChewLayout ? 0 : Platform.OS == 'ios' ? 0 : 50,
				backgroundColor: isChewLayout ? theme?.colors?.chew : theme.colors?.white
			}}
			>
				{isChewLayout && (
					<View style={{ marginTop: 30, paddingHorizontal: 30, flexDirection: 'row', justifyContent: 'space-between' }}>
						<OText size={24} weight={700} color={theme.colors?.white}>
							{t('WELCOME', 'Welcome')} {user?.name}
						</OText>
					</View>
				)}
				<Search isChewLayout={isChewLayout}>
					<AddressInput
						isChewLayout={isChewLayout}
						onPress={() =>
							auth
								? navigation.navigate('AddressList', { isFromBusinesses: true })
								: navigation.navigate('AddressForm', {
									address: orderState.options?.address,
									isFromBusinesses: true,
									isGuestUser: isGuestUser
								})
						}>
						<AddressInputContainer isChewLayout={isChewLayout}>
							<OIcon
								src={theme.images.general.pin}
								color={theme.colors.disabled}
								width={16}
								style={{ marginRight: isChewLayout ? 0 : 10 }}
							/>
							<OText size={12} numberOfLines={1} style={{ flex: 1 }}>
								{orderState?.options?.address?.address || t('WHAT_IS_YOUR_ADDRESS', 'What\'s your address?')}
							</OText>
							{!isChewLayout && (
								<OIcon
									src={theme.images.general.arrow_down}
									width={10}
									style={{ marginStart: 8 }}
								/>
							)}
						</AddressInputContainer>
					</AddressInput>
				</Search>
				{isFarAway && !isChewLayout && (
					<FarAwayMessage style={styles.farAwayMsg}>
						<Ionicons name='md-warning-outline' style={styles.iconStyle} />
						<OText size={12} numberOfLines={1} ellipsizeMode={'tail'} color={theme.colors.textNormal}>{t('YOU_ARE_FAR_FROM_ADDRESS', 'You are far from this address')}</OText>
					</FarAwayMessage>
				)}
				{!isChewLayout ? (
					<OrderControlContainer>
						<View style={styles.wrapperOrderOptions}>
							{isPreOrderSetting && (
								<WrapMomentOption
									onPress={() => handleMomentClick()}>
									<OText
										size={12}
										numberOfLines={1}
										ellipsizeMode="tail"
										color={theme.colors.textSecondary}>
										{orderState.options?.moment
											? parseDate(orderState.options?.moment, { outputFormat: configs?.dates_moment_format?.value })
											: t('ASAP_ABBREVIATION', 'ASAP')}
									</OText>
									{isPreorderEnabled && (
										<OIcon
											src={theme.images.general.arrow_down}
											width={10}
											style={{ marginStart: 8 }}
										/>
									)}
								</WrapMomentOption>
							)}
							<WrapMomentOption onPress={() => navigation.navigate('OrderTypes', { configTypes: configTypes, setOrderTypeValue })}>
								<OText size={12} numberOfLines={1} ellipsizeMode={'tail'} color={theme.colors.textSecondary}>{t(getTypesText(orderTypeValue || orderState?.options?.type || 1), 'Delivery')}</OText>
								<OIcon
									src={theme.images.general.arrow_down}
									width={10}
									style={{ marginStart: 8 }}
								/>
							</WrapMomentOption>
						</View>
					</OrderControlContainer>
				) : (
					<>
						{isPreOrderSetting && (
							<View style={{ paddingHorizontal: 30 }}>
								<PreorderInput
									isChewLayout={isChewLayout}
									onPress={() => handleMomentClick()}
								>
									<OText color={theme.colors.textSecondary}>
										{orderState.options?.moment
											? parseDate(orderState.options?.moment, { outputFormat: configs?.dates_moment_format?.value })
											: t('ASAP_ABBREVIATION', 'ASAP')}</OText>
								</PreorderInput>
							</View>
						)}
					</>
				)}
			</View>
			{!isChewLayout ? (
				<>
					{!hideHero ? (
						<HeaderWrapper
							source={bgHeader ? { uri: bgHeader } : theme.images.backgrounds.business_list_header}
							style={{ paddingTop: top + 20 }}
							resizeMode='cover'
							bgHeaderHeight={bgHeaderHeight}
						>
							{!auth && (
								<TouchableOpacity onPress={() => navigation?.canGoBack() && navigation.goBack()} style={{ position: 'absolute', marginStart: 40, paddingVertical: 20 }}>
									<OIcon src={theme.images.general.arrow_left} color={theme.colors.textNormal} />
								</TouchableOpacity>
							)}
						</HeaderWrapper>
					) : (
						<>
							{!auth && (
								<TouchableOpacity onPress={() => navigation?.canGoBack() && navigation.goBack()} style={{ position: 'absolute', marginStart: 40, paddingVertical: 20 }}>
									<OIcon src={theme.images.general.arrow_left} color={theme.colors.textNormal} />
								</TouchableOpacity>
							)}
						</>
					)}
				</>
			) : (
				<OrderTypesContainer>
					<OrderTypeSelector
						handleChangeBusinessType={handleChangeBusinessType}
						isChewLayout
						chewOrderTypes={chewOrderTypes}
						handleChangeType={setOrderTypeValue}
					/>
				</OrderTypesContainer>
			)}

			{!hideCities && orderTypeValue === 2 && (
				<View style={{ marginTop: 20 }}>
					<TouchableOpacity
						style={styles.buttonCityStyle}
						onPress={() => setIsOpenCities(true)}
						disabled={orderState?.loading}
					>
						<OText size={18} color={theme.colors.backgroundGray} weight='bold' style={{ textAlign: 'center' }}>
							{citiesState?.cities?.find((city: any) => city?.id === orderState?.options?.city_id)?.name || t('FILTER_BY_CITY', 'Filter by city')}
						</OText>
					</TouchableOpacity>
				</View>
			)}
			{!hidePreviousOrders && (
				<OrderProgress
					{...props}
					isFocused={isFocused}
				/>
			)}
			{
				!businessId && !props.franchiseId && featuredBusiness && featuredBusiness.length > 0 && (
					<FeaturedWrapper>
						<OText size={16} style={{ marginLeft: 40 }} weight={Platform.OS === 'ios' ? '600' : 'bold'}>{t('BUSINESS_FEATURE', 'Featured business')}</OText>
						<ScrollView
							showsHorizontalScrollIndicator={false}
							nestedScrollEnabled
							horizontal
							contentContainerStyle={{ paddingHorizontal: 40 }}
						>
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
			{!isChewLayout && !hideHighestBusiness && (
				<>
					<View style={{ height: 8, backgroundColor: theme.colors.backgroundGray100 }} />
					{
						!businessId && !props.franchiseId && (
							<HighestRatedBusinesses
								propsToFetch={props.propsToFetch}
								onBusinessClick={handleBusinessClick}
								navigation={navigation}
								favoriteIds={favoriteIds}
								setFavoriteIds={setFavoriteIds}
							/>
						)
					}
				</>
			)}

			<PageBanner position='app_business_listing' navigation={navigation} />

			<View style={{ height: 8, backgroundColor: theme.colors.backgroundGray100 }} />
			<ListWrapper style={{ paddingHorizontal: isChewLayout ? 20 : 40 }}>
				{!businessId && !isAllCategoriesHidden && (
					<BusinessTypeFilter
						images={props.images}
						businessTypes={props.businessTypes}
						defaultBusinessType={props.defaultBusinessType}
						handleChangeBusinessType={handleChangeBusinessType}
						setBusinessTypes={setBusinessTypes}
					/>
				)}
				{!businessesList.loading && businessesList.businesses.length === 0 && businessesList?.fetched && (
					<NotFoundSource
						content={t(
							'NOT_FOUND_BUSINESSES',
							'No businesses to delivery / pick up at this address, please change filters or change address.',
						)}
					/>
				)}
				{!!businessesList.businesses?.length && (
					<FlatList
						data={businessesList.businesses}
						showsVerticalScrollIndicator={false}
						keyExtractor={(business, index) => (`${business.id}_` + index)}
						renderItem={({ item }: any) => (
							<>
								<BusinessController
									enableIntersection
									business={item}
									isBusinessOpen={item?.open}
									handleCustomClick={handleBusinessClick}
									orderType={orderState?.options?.type}
									navigation={navigation}
									businessHeader={item?.header}
									businessFeatured={item?.featured}
									businessLogo={item?.logo}
									businessReviews={item?.reviews}
									businessDeliveryPrice={item?.delivery_price}
									businessDeliveryTime={item?.delivery_time}
									businessPickupTime={item?.pickup_time}
									businessDistance={item?.distance}
									handleUpdateBusinessList={handleUpdateBusinessList}
									favoriteIds={favoriteIds}
									setFavoriteIds={setFavoriteIds}
								/>
							</>
						)}
					/>
				)}
				{(businessesList.loading || !businessesList?.fetched) && (
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
			<OModal
				open={isOpenCities}
				onClose={() => setIsOpenCities(false)}
				title={t('SELECT_A_CITY', 'Select a city')}
			>
				<CitiesControl
					cities={citiesState?.cities}
					onClose={() => setIsOpenCities(false)}
					handleChangeCity={handleChangeCity}
				/>
			</OModal>
		</IOScrollView>
	);
};

export const BusinessesListing = (props: BusinessesListingParams) => {

	const BusinessesListingProps = {
		...props,
		isForceSearch: Platform.OS === 'ios',
		UIComponent: BusinessesListingUI,
		paginationSettings: {
			initialPage: 1,
			pageSize: 50,
			controlType: 'infinity'
		}
	};

	return <BusinessesListingController {...BusinessesListingProps} />;
};
