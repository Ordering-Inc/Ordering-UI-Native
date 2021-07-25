import React, { useState } from 'react'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder'
import { View, StyleSheet, ScrollView, Platform, TouchableOpacity } from 'react-native'
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

import { Search } from './styles'

import { SearchBar } from '../SearchBar'
import { OIcon, OText } from '../shared'
import { BusinessesListingParams } from '../../../../types'
import { NotFoundSource } from '../NotFoundSource'
import { BusinessTypeFilter } from '../BusinessTypeFilter'
import { BusinessController } from '../BusinessController'
import { useTheme } from 'styled-components/native'

const PIXELS_TO_SCROLL = 1200

const SearchBusinessUI = (props: BusinessesListingParams) => {
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
			
		}
	})

	const [, t] = useLanguage()
	const [{ user, auth }] = useSession()
	const [orderState] = useOrder()
	const [{ configs }] = useConfig()
	const [{ parseDate }] = useUtils()
	const [, { showToast }] = useToast()
	const [isFilter, setIsFilter] = useState(false);

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

	return (
		<ScrollView style={styles.container} contentContainerStyle={{ paddingHorizontal: 40 }} onScroll={(e: any) => handleScroll(e)}>
			<Search>
				<SearchBar
					onSearch={handleChangeSearch}
					searchValue={searchValue}
					lazyLoad
					isCancelXButtonShow={!!searchValue}
					borderStyle={styles.borderStyle}
					onCancel={() => handleChangeSearch('')}
					placeholder={t('FIND_BUSINESS', 'Find a Business')}
				/>
				<TouchableOpacity style={{paddingStart: 12}} activeOpacity={0.7} onPress={() => setIsFilter(!isFilter)}>
					<OIcon src={theme.images.general.filter} width={16} color={theme.colors.textPrimary} />
				</TouchableOpacity>
			</Search>
			
			{isFilter && <BusinessTypeFilter
				images={props.images}
				businessTypes={props.businessTypes}
				defaultBusinessType={props.defaultBusinessType}
				handleChangeBusinessType={handleChangeBusinessType}
				isMini
				noTitle
			/>}

			{
				!businessesList.loading && businessesList.businesses.length === 0 && (
					<NotFoundSource
						content={t('NOT_FOUND_BUSINESSES', 'No businesses to delivery / pick up at this address, please change filters or change address.')}
					/>
				)
			}

			{!businessesList.loading && businessesList.businesses.length > 0 && (
				businessesList.businesses?.map((business: any) => (
					<BusinessController
						key={business.id}
						business={business}
						handleCustomClick={handleBusinessClick}
						orderType={orderState?.options?.type}
						isBusinessOpen={business?.open}
					/>
				))
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

export const SearchBusiness = (props: BusinessesListingParams) => {

	const BusinessesListingProps = {
		...props,
		isForceSearch: Platform.OS === 'ios',
		UIComponent: SearchBusinessUI
	}

	return <BusinessesListingController {...BusinessesListingProps} />
}
