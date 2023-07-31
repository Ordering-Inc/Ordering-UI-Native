import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
import Geolocation from '@react-native-community/geolocation'
import { getTrackingStatus, requestTrackingPermission } from 'react-native-tracking-transparency'
import {
	View,
	StyleSheet,
	Platform,
	TouchableOpacity,
} from 'react-native';

import {
	BusinessList as BusinessesListingController,
	useOrder,
	useConfig,
} from 'ordering-components/native';
import { useTheme } from 'styled-components/native';

import {
	BusinessLogosContainer
} from './styles';

import { BusinessesListingParams } from '../../../../types';
import { useFocusEffect } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import { FlatListBusinessListing } from './FlatListBusinessListing'

const PIXELS_TO_SCROLL = 2000;

const BusinessesListingUI = (props: BusinessesListingParams) => {
	const {
		navigation,
		businessesList,
		getBusinesses,
		handleBusinessClick,
		paginationProps,
		citiesState,
		actualSlug,
		logosLayout
	} = props;
	const theme = useTheme();

	const [orderState, { changeCityFilter }] = useOrder();
	const [{ configs }] = useConfig();

	const isChewLayout = theme?.header?.components?.layout?.type?.toLowerCase() === 'chew'
	const allCitiesDisabled = citiesState?.cities?.every((city: any) => !city.enabled)

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
			marginHorizontal: 20,
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

	const [featuredBusiness, setFeaturedBusinesses] = useState(Array);
	const [isFarAway, setIsFarAway] = useState(false)
	const [orderTypeValue, setOrderTypeValue] = useState(orderState?.options?.value)
	const [isOpenCities, setIsOpenCities] = useState(false)
	const timerId = useRef<any>(false)
	const [favoriteIds, setFavoriteIds] = useState<any>([])
	const enabledPoweredByOrdering = configs?.powered_by_ordering_module?.value

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
	}, [businessesList.loading, businessesList?.businesses])

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
		<FlatListBusinessListing
			{...props}
			navigation={navigation}
			businessesList={businessesList}
			enabledPoweredByOrdering={enabledPoweredByOrdering}
			orderTypeValue={orderTypeValue}
			allCitiesDisabled={allCitiesDisabled}
			featuredBusiness={featuredBusiness}
			favoriteIds={favoriteIds}
			isFarAway={isFarAway}
			isOpenCities={isOpenCities}
			isChewLayout={isChewLayout}
			handleScroll={handleScroll}
			setIsOpenCities={setIsOpenCities}
			setFavoriteIds={setFavoriteIds}
			handleOnRefresh={handleOnRefresh}
			setOrderTypeValue={setOrderTypeValue}
			handleChangeCity={handleChangeCity}
		/>
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
