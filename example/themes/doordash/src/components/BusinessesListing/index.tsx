import React, { useEffect, useState } from 'react'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder'
import Geolocation from '@react-native-community/geolocation'
import { View, StyleSheet, ScrollView, Platform, PanResponder, I18nManager, TouchableOpacity } from 'react-native'
import {
	BusinessList as BusinessesListingController,
	useLanguage,
	useSession,
	useOrder,
	useConfig,
	useUtils,
	ToastType, useToast
} from 'ordering-components/native'

import { Search, AddressInput, HeaderCont, FeaturedBussiCont, FarAwayMessage } from './styles'

import { useTheme } from 'styled-components/native'
import { SearchBar } from '../SearchBar'
import { OIcon, OText } from '../shared'
import { BusinessesListingParams } from '../../types'
import { NotFoundSource } from '../NotFoundSource'
import { BusinessTypeFilter } from '../BusinessTypeFilter'
import { BusinessController } from '../BusinessController'
import BusinessesSortBy from '../BusinessesSortBy'
import { getDistance } from '../../utils'
import Ionicons from 'react-native-vector-icons/Ionicons'

const PIXELS_TO_SCROLL = 1200

const BusinessesListingUI = (props: BusinessesListingParams) => {
	const {
		navigation,
		businessesList,
		searchValue,
		getBusinesses,
		handleChangeBusinessType,
		handleBusinessClick,
		paginationProps,
		handleChangeSearch
	} = props
	const [, t] = useLanguage()
	const [{ user, auth }] = useSession()
	const [orderState] = useOrder()
	const [{ configs }] = useConfig()
	const [{ parseDate }] = useUtils()
	const [, { showToast }] = useToast()

	const [businesses, setBusinesses] = useState(businessesList?.businesses || []);
	const [hasFeatured, setHasFeatured] = useState(false);
	const [isFarAway, setIsFarAway] = useState(false);

	const theme = useTheme();

	const styles = StyleSheet.create({
		container: {
			paddingHorizontal: 40,
			marginBottom: 0
		},
		welcome: {
			flex: 1,
			flexDirection: 'row'
		},
		inputStyle: {
			backgroundColor: theme.colors.white,
			lineHeight: 21,
			height: 22,
			marginEnd: 7
		},
		wrapperOrderOptions: {
			width: '100%',
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			marginBottom: 10,
			zIndex: 100
		},
		borderStyle: {
			borderColor: theme.colors.backgroundGray,
			borderWidth: 1,
			borderRadius: 40,
		},
		iconStyle: {
			fontSize: 18,
			color: theme.colors.warning5,
			marginRight: 8
		},
		farAwayMsg: {
			paddingVertical: 6,
			paddingHorizontal: 20
		}
	})

	const configTypes = configs?.order_types_allowed?.value.split('|').map((value: any) => Number(value)) || []

	const handleScroll = ({ nativeEvent }: any) => {
		const y = nativeEvent.contentOffset.y
		const height = nativeEvent.contentSize.height
		const hasMore = !(paginationProps.totalPages === paginationProps.currentPage)

		if (y + PIXELS_TO_SCROLL > height && !businessesList.loading && hasMore) {
			getBusinesses()
			showToast(ToastType.Info, 'loading more business')
		}
	}

	const sorts = [
		{
			name: 'Distance',
			value: 'distance'
		},
		{
			name: 'Ranking',
			value: 'rate'
		},
		{
			name: 'Newest',
			value: 'date'
		},
		{
			name: 'A to Z',
			value: 'alphabetic'
		}
	]

	const handleSortBy = (value: string) => {
		if (businessesList?.businesses.length == 0) return;

		const tmp = businessesList.businesses.sort((a: any, b: any) => {
			if (value == sorts[0].value) {
				return a.distance > b.distance ? 1 : -1
			} else if (value == sorts[1].value) {
				return a.reviews.total > b.reviews.total ? 1 : -1
			} else if (value == sorts[2].value) {
				return a.id > b.id ? 1 : -1
			} else if (value == sorts[3].value) {
				return a.name > b.name ? 1 : -1
			} else {
				return 1;
			}
		});
		console.log(tmp.length)
		setBusinesses([...tmp]);
	}

	useEffect(() => {
		if (!businessesList.loading && businessesList?.businesses.length > 0) {
			setBusinesses(businessesList.businesses);
		}
	}, [businessesList])

	useEffect(() => {
		if (businesses.length > 0) {
			const aFeatured = businesses.find(({featured}) => featured === true);
			setHasFeatured(aFeatured ? true : false);
		} else {
			setHasFeatured(false);
		}
	}, [businesses])

	useEffect(() => {
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
  }, [orderState?.options?.address?.location])

	return (
		<ScrollView style={styles.container} onScroll={(e) => handleScroll(e)} scrollEventThrottle={50}>
			<HeaderCont>
				{!auth && (
					<TouchableOpacity onPress={() => navigation?.canGoBack() && navigation.goBack()}>
						<OIcon src={theme.images.general.arrow_left} width={16} />
					</TouchableOpacity>
				)}
				<AddressInput
					onPress={() => auth
						? navigation.navigate('AddressList', { isFromBusinesses: true })
						: navigation.navigate('AddressForm', { address: orderState.options?.address, isFromBusinesses: true })}
				>
					<OText color={theme.colors.red} size={12} weight={Platform.OS == 'ios' ? '600' : 'bold'}>{t('DELIVER_TO', 'Deliver to')}</OText>
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<OText size={14} style={styles.inputStyle} numberOfLines={1} weight={Platform.OS == 'ios' ? '600' : 'bold'}>
							{orderState?.options?.address?.address}
						</OText>
						<OIcon color={theme.colors.red} src={theme.images.general.chevron_right} style={{ transform: [{ rotate: '90deg' }] }} width={16} />
					</View>
				</AddressInput>
			</HeaderCont>
			<View style={{ height: 1, backgroundColor: theme.colors.border, marginHorizontal: -40 }} />
			{isFarAway && (
				<FarAwayMessage style={styles.farAwayMsg}>
					<Ionicons name='md-warning-outline' style={styles.iconStyle} />
					<OText size={12} numberOfLines={1} ellipsizeMode={'tail'} color={theme.colors.textNormal}>{t('YOU_ARE_FAR_FROM_ADDRESS', 'You are far from this address')}</OText>
				</FarAwayMessage>
			)}
			{!auth && (
				<Search>
					<SearchBar
						onSearch={handleChangeSearch}
						searchValue={searchValue}
						lazyLoad
						isCancelXButtonShow={!!searchValue}
						borderStyle={styles.borderStyle}
						onCancel={() => handleChangeSearch('')}
						placeholder={t('FIND_BUSINESS', 'Find a Business')}
						inputWrapStyle={{ height: 40, maxHeight: 40 }}
					/>
				</Search>
			)}
			<View>
				<BusinessTypeFilter
					images={props.images}
					businessTypes={props.businessTypes}
					defaultBusinessType={props.defaultBusinessType}
					handleChangeBusinessType={handleChangeBusinessType}
				/>
				<BusinessesSortBy
					items={sorts}
					onHandleFilter={handleSortBy}
				/>
				{hasFeatured && 
				<>
					<OText size={16} weight={Platform.OS == 'android' ? 'bold' : '600'}>{t('FEATURED BUSINESSES', 'Featured Businesses')}</OText>
					<FeaturedBussiCont horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 40 }}>
						{
							businesses?.map((business: any) => business?.featured && (
								<BusinessController
									key={business.id}
									business={business}
									handleCustomClick={handleBusinessClick}
									orderType={orderState?.options?.type}
									isBusinessOpen={business?.open}
									isHorizontal={true}
								/>
							))
						}
					</FeaturedBussiCont>
				</>
				}
			</View>
			{
				!businessesList.loading && businesses.length === 0 && (
					<NotFoundSource
						content={t('NOT_FOUND_BUSINESSES', 'No businesses to delivery / pick up at this address, please change filters or change address.')}
					/>
				)
			}
			{businesses.length > 0 &&
				<>
				<View style={{height: 7, marginBottom: 26, marginHorizontal: -40, backgroundColor: theme.colors.backgroundGray}} />
				<OText size={16} weight={Platform.OS == 'android' ? 'bold' : '600'}>{t('ALL BUSINESSES', 'All Businesses')}</OText>
				</>
			}
			{
				businesses?.map((business: any) => !business?.featured && (
					<BusinessController
						key={business.id}
						business={business}
						handleCustomClick={handleBusinessClick}
						orderType={orderState?.options?.type}
						isBusinessOpen={business?.open}
					/>
				))
			}
			{businessesList.loading && (
				<>
					{[...Array(paginationProps.nextPageItems ? paginationProps.nextPageItems : 8).keys()].map((item, i) => (
						<Placeholder Animation={Fade} key={i} style={{ marginBottom: 20 }}>
							<View style={{ width: '100%' }}>
								<PlaceholderLine height={200} style={{ marginBottom: 20, borderRadius: 25 }} />
								<View style={{ paddingHorizontal: 10 }}>
									<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
										<PlaceholderLine height={25} width={40} style={{ marginBottom: 10 }} />
										<PlaceholderLine height={25} width={20} style={{ marginBottom: 10 }} />
									</View>
									<PlaceholderLine height={20} width={30} style={{ marginBottom: 10 }} />
									<PlaceholderLine height={20} width={80} style={{ marginBottom: 10 }} />
								</View>
							</View>
						</Placeholder>
					))}
				</>
			)}
		</ScrollView>
	)
}

export const BusinessesListing = (props: BusinessesListingParams) => {

	const BusinessesListingProps = {
		...props,
		isForceSearch: Platform.OS === 'ios',
		UIComponent: BusinessesListingUI
	}

	return <BusinessesListingController {...BusinessesListingProps} />
}
