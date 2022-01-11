import React, { useEffect, useState } from 'react';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
import {
	View,
	StyleSheet,
	ScrollView,
	Platform,
	TouchableOpacity,
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

import {
	Search,
	OrderControlContainer,
	AddressInput,
	WrapMomentOption,
	HeaderWrapper,
	ListWrapper,
	FeaturedWrapper,
	OrderProgressWrapper
} from './styles';

import { SearchBar } from '../SearchBar';
import { OIcon, OText } from '../shared';
import { BusinessesListingParams } from '../../types';
import { NotFoundSource } from '../NotFoundSource';
import { BusinessTypeFilter } from '../BusinessTypeFilter';
import { BusinessController } from '../BusinessController';
import { OrderTypeSelector } from '../OrderTypeSelector';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BusinessFeaturedController } from '../BusinessFeaturedController';
import { HighestRatedBusinesses } from '../HighestRatedBusinesses';
import { getTypesText } from '../../utils';
import { OrderProgress } from '../OrderProgress';
import { useIsFocused } from '@react-navigation/native';

const PIXELS_TO_SCROLL = 1000;

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
	} = props;

	const theme = useTheme();
	const isFocused = useIsFocused();

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
			zIndex: 100,
		},
		borderStyle: {
			borderColor: theme.colors.backgroundGray,
			borderWidth: 1,
			borderRadius: 10,
		},
		searchInput: {
			fontSize: 12,
		}
	});


	const [, t] = useLanguage();
	const [{ user, auth }] = useSession();
	const [orderState] = useOrder();
	const [{ configs }] = useConfig();
	const [{ parseDate }] = useUtils();

	const { top } = useSafeAreaInsets();

	const [featuredBusiness, setFeaturedBusinesses] = useState(Array);

	// const timerId = useRef<any>(false)
	// const panResponder = useRef(
	//   PanResponder.create({
	//     onMoveShouldSetPanResponder: (e, gestureState) => {
	//       const {dx, dy} = gestureState;
	//       resetInactivityTimeout()
	//       return (Math.abs(dx) > 20) || (Math.abs(dy) > 20);
	//     },
	//   })
	// ).current

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

	useEffect(() => {
		if (businessesList.businesses.length > 0) {
			const fb = businessesList.businesses.filter((b) => b.featured == true);
			const ary = [];
			while (fb.length > 0) {
				ary.push(fb.splice(0, 2));
			}
			setFeaturedBusinesses(ary);
		}
	}, [businessesList.businesses]);
	// const resetInactivityTimeout = () => {
	//   clearTimeout(timerId.current)
	//   timerId.current = setInterval(() => {
	//     getBusinesses(true)
	//   }, 600000)
	// }

	// useEffect(() => {
	//   resetInactivityTimeout()
	// }, [])

	return (
		<ScrollView style={styles.container} onScroll={(e) => handleScroll(e)} showsVerticalScrollIndicator={false}>
			<HeaderWrapper
				source={theme.images.backgrounds.business_list_header}
				style={{ paddingTop: top + 20 }}>
				{!auth && (
					<TouchableOpacity onPress={() => navigation?.canGoBack() && navigation.goBack()} style={{ position: 'absolute', marginStart: 40, paddingVertical: 20 }}>
						<OIcon src={theme.images.general.arrow_left} width={20} style={{ tintColor: theme.colors.white }} />
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
				<OrderControlContainer>
					<View style={styles.wrapperOrderOptions}>
						<WrapMomentOption onPress={() => navigation.navigate('OrderTypes', { configTypes: configTypes })}>
							<OText size={12} numberOfLines={1} ellipsizeMode={'tail'} color={theme.colors.textSecondary}>{t(getTypesText(orderState?.options?.type || 1), 'Delivery')}</OText>
							<OIcon
								src={theme.images.general.arrow_down}
								width={10}
								style={{ marginStart: 8 }}
							/>
						</WrapMomentOption>
						<WrapMomentOption
							onPress={() => navigation.navigate('MomentOption')}>
							<OText
								size={12}
								numberOfLines={1}
								ellipsizeMode="tail"
								color={theme.colors.textSecondary}>
								{orderState.options?.moment
									? parseDate(orderState.options?.moment, {
										outputFormat:
											configs?.format_time?.value === '12'
												? 'MM/DD hh:mma'
												: 'MM/DD HH:mm',
									})
									: t('ASAP_ABBREVIATION', 'ASAP')}
							</OText>
							<OIcon
								src={theme.images.general.arrow_down}
								width={10}
								style={{ marginStart: 8 }}
							/>
						</WrapMomentOption>

						<SearchBar
							onSearch={handleChangeSearch}
							searchValue={searchValue}
							lazyLoad
							isCancelXButtonShow={!!searchValue}
							borderStyle={styles.borderStyle}
							onCancel={() => handleChangeSearch('')}
							placeholder={t('SEARCH', 'Search')}
							height={26}
							inputStyle={{ ...styles.searchInput, ...Platform.OS === 'ios' ? {} : { paddingBottom: 4 } }}
						/>
					</View>
				</OrderControlContainer>
			</HeaderWrapper>
			{isFocused && (
				<OrderProgressWrapper>
					<OrderProgress
						{...props}
					/>
				</OrderProgressWrapper>
			)}
			{featuredBusiness && featuredBusiness.length > 0 && (
				<FeaturedWrapper>
					<OText size={16} style={{ marginLeft: 40 }} weight={Platform.OS === 'ios' ? '600' : 'bold'}>{t('FEATURED_BUSINESS', 'Featured business')}</OText>
					<ScrollView
						showsHorizontalScrollIndicator={false}
						nestedScrollEnabled
						horizontal contentContainerStyle={{ paddingHorizontal: 40 }}>
						{featuredBusiness.map((bAry: any, idx) => (
							<View key={'f-listing_' + idx}>
								<BusinessFeaturedController
									key={bAry[0].id}
									business={bAry[0]}
									handleCustomClick={handleBusinessClick}
									orderType={orderState?.options?.type}
								/>
								{bAry.length > 1 && (
									<BusinessFeaturedController
										key={bAry[1].id}
										business={bAry[1]}
										handleCustomClick={handleBusinessClick}
										orderType={orderState?.options?.type}
									/>
								)}
							</View>
						))}
					</ScrollView>
				</FeaturedWrapper>
			)}
			<View style={{ height: 8, backgroundColor: theme.colors.backgroundGray100 }} />
			<HighestRatedBusinesses onBusinessClick={handleBusinessClick} navigation={navigation} />
			<View style={{ height: 8, backgroundColor: theme.colors.backgroundGray100 }} />
			<ListWrapper>
				<BusinessTypeFilter
					images={props.images}
					businessTypes={props.businessTypes}
					defaultBusinessType={props.defaultBusinessType}
					handleChangeBusinessType={handleChangeBusinessType}
				/>
				{!businessesList.loading && businessesList.businesses.length === 0 && (
					<NotFoundSource
						content={t(
							'NOT_FOUND_BUSINESSES',
							'No businesses to delivery / pick up at this address, please change filters or change address.',
						)}
					/>
				)}
				{businessesList.businesses?.map(
					(business: any) =>
						!business.featured && (
							<BusinessController
								key={business.id}
								business={business}
								handleCustomClick={handleBusinessClick}
								orderType={orderState?.options?.type}
								navigation={navigation}
							/>
						),
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
		</ScrollView>
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
