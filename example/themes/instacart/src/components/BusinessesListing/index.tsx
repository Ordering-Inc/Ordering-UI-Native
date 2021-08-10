import React from 'react'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder'
import { View, StyleSheet, ScrollView, Platform, PanResponder, I18nManager } from 'react-native'
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import {
	BusinessList as BusinessesListingController,
	useLanguage,
	useSession,
	useOrder,
	useConfig,
	useUtils,
	ToastType,
	useToast
} from 'ordering-components/native'

import { WelcomeTitle, Search, OrderControlContainer, AddressInput, WrapMomentOption } from './styles'

import NavBar from '../NavBar'
import { SearchBar } from '../SearchBar'
import { OIcon, OText } from '../shared'
import { BusinessesListingParams } from '../../types'
import { NotFoundSource } from '../NotFoundSource'
import { BusinessTypeFilter } from '../BusinessTypeFilter'
import { BusinessController } from '../BusinessController'
import { OrderTypeSelector } from '../OrderTypeSelector'
import { useTheme } from 'styled-components/native'

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

	const theme = useTheme();

	const styles = StyleSheet.create({
		container: {
			marginBottom: 0
		},
		welcome: {
			flex: 1,
			flexDirection: 'row'
		},
		inputStyle: {
			backgroundColor: theme.colors.clear,
			flex: 1,
			paddingStart: 12,
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
			borderRadius: 10,
		}
	})

	const [, t] = useLanguage()
	const [{ user, auth }] = useSession()
	const [orderState] = useOrder()
	const [{ configs }] = useConfig()
	const [{ parseDate }] = useUtils()
	const [, { showToast }] = useToast()

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

	const hasFeatured = () => {
		if (businessesList?.businesses?.length === 0) return false;
		const fBusiness = businessesList.businesses.find(({ featured }): any => featured === true);
		return fBusiness !== undefined && fBusiness !== null;
	}

	return (
		<ScrollView style={styles.container} contentContainerStyle={{ paddingHorizontal: 40 }} onScroll={(e: any) => handleScroll(e)}>
			{!auth && (
				<NavBar
					onActionLeft={() => navigation?.canGoBack() && navigation.goBack()}
					showCall={false}
					btnStyle={{ paddingLeft: 0 }}
					style={{ paddingBottom: 0 }}
				/>
			)}
			{auth && (
				<WelcomeTitle>
					<View style={{...styles.welcome, marginTop: auth ? 17 : 0}}>
						<OText style={{ fontWeight: '600', alignSelf: 'center' }} size={20} lineHeight={30} color={theme.colors.textPrimary} >
							{t('SELECT_A_STORE_TO_SHOP', 'Select a store to shop')}
						</OText>
						{/* <View style={{ maxWidth: '65%' }}>
              <OText
                style={{ fontWeight: 'bold' }}
                size={28}
                color={theme.colors.primary}
                numberOfLines={1}
                ellipsizeMode='tail'
              >
                {I18nManager.isRTL ? `${user?.name}, ` : `, ${user?.name}`}
              </OText>
            </View> */}
					</View>
				</WelcomeTitle>
			)}
			{/* <Search>
        <SearchBar
          onSearch={handleChangeSearch}
          searchValue={searchValue}
          lazyLoad
          isCancelXButtonShow={!!searchValue}
          borderStyle={styles.borderStyle}
          onCancel={() => handleChangeSearch('')}
          placeholder={t('FIND_BUSINESS', 'Find a Business')}
        />
      </Search> */}
			<OrderControlContainer>

				<AddressInput
					onPress={() => auth
						? navigation.navigate('AddressList', { isFromBusinesses: true })
						: navigation.navigate('AddressForm', { address: orderState.options?.address, isFromBusinesses: true })}
				>
					<OIcon src={theme.images.general.pin_line} width={16} color={theme.colors.primary} />
					<OText size={12} lineHeight={18} style={styles.inputStyle} numberOfLines={1}>
						{orderState?.options?.address?.address}
					</OText>
				</AddressInput>

				<View style={styles.wrapperOrderOptions}>
					<OrderTypeSelector configTypes={configTypes} />
					<WrapMomentOption
						onPress={() => navigation.navigate('MomentOption')}
					>
						<OText size={12} lineHeight={18} numberOfLines={1} ellipsizeMode='tail'>
							{orderState.options?.moment
								? parseDate(orderState.options?.moment, { outputFormat: configs?.format_time?.value === '12' ? 'MM/DD hh:mma' : 'MM/DD HH:mm' })
								: t('ASAP_ABBREVIATION', 'ASAP')}
						</OText>
						<OIcon src={theme.images.general.drop_down} width={10} color={theme.colors.textPrimary} style={{marginStart: 5}} />
					</WrapMomentOption>
				</View>

			</OrderControlContainer>
			{/* <BusinessTypeFilter
				images={props.images}
				businessTypes={props.businessTypes}
				defaultBusinessType={props.defaultBusinessType}
				handleChangeBusinessType={handleChangeBusinessType}
			/> */}

			{
				!businessesList.loading && businessesList.businesses.length === 0 && (
					<NotFoundSource
						content={t('NOT_FOUND_BUSINESSES', 'No businesses to delivery / pick up at this address, please change filters or change address.')}
					/>
				)
			}

			{hasFeatured() && (
				<>
					<OText size={16} lineHeight={24} weight={'600'} mBottom={8}>{t('FEATURED_BUSINESS', 'Featured business')}</OText>
					{
						businessesList.businesses?.map((business: any) => business?.featured && (
							<BusinessController
								key={business.id}
								business={business}
								handleCustomClick={handleBusinessClick}
								orderType={orderState?.options?.type}
								isBusinessOpen={business?.open}
							/>
						))
					}
				</>
			)}

			{!businessesList.loading && businessesList.businesses.length > 0 && (
				<>
					<OText size={16} lineHeight={24} weight={'600'} mBottom={8}>{t('ALL_BUSINESS', 'All business')}</OText>
					{
						businessesList.businesses?.map((business: any) => !business?.featured && (
							<BusinessController
								key={business.id}
								business={business}
								handleCustomClick={handleBusinessClick}
								orderType={orderState?.options?.type}
								isBusinessOpen={business?.open}
							/>
						))
					}
				</>
			)
			}
			{businessesList.loading && (
				<>
					{[...Array(paginationProps.nextPageItems ? paginationProps.nextPageItems : 8).keys()].map((item, i) => (
						<Placeholder Animation={Fade} key={i} style={{ marginBottom: 20 }}>
							<View style={{ width: '100%', flexDirection: 'row' }}>
								<PlaceholderLine height={50} style={{ borderRadius: 25, width: 50 }} />
								<Placeholder style={{ marginStart: 10 }}>
									<PlaceholderLine height={24} width={50} style={{ marginBottom: 4 }} />
									<PlaceholderLine height={15} width={40} style={{ marginBottom: 4 }} />
									<PlaceholderLine height={15} width={70} />
								</Placeholder>
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
