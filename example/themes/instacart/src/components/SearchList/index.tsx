import React, { useState } from 'react'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder'
import { View, StyleSheet, ScrollView, Platform, TouchableOpacity } from 'react-native'
import {
	BusinessList as BusinessesListingController,
	BusinessAndProductList,
	useLanguage,
	useSession,
	useOrder,
	useConfig,
	useUtils,
	ToastType,
	useToast
} from 'ordering-components/native'

import { Search, WrapContent } from './styles'

import { SearchBar } from '../SearchBar'
import { OIcon, OModal, OText } from '../shared'
import { BusinessesListingParams, BusinessProductsListingParams } from '../../types'
import { NotFoundSource } from '../NotFoundSource'
import { BusinessTypeFilter } from '../BusinessTypeFilter'
import { BusinessController } from '../BusinessController'
import { useTheme } from 'styled-components/native'
import { BusinessProductsListingContainer } from '../BusinessProductsListing/styles'
import { BusinessProductsList } from '../BusinessProductsList'
import { ProductForm } from '../ProductForm'
import { UpsellingProducts } from '../UpsellingProducts'

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
		<View style={{flex: 1}}>
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
				<TouchableOpacity style={{ paddingStart: 12 }} activeOpacity={0.7} onPress={() => setIsFilter(!isFilter)}>
					<OIcon src={theme.images.general.filter} width={16} color={theme.colors.textPrimary} />
				</TouchableOpacity>
			</Search>
			<ScrollView style={styles.container} contentContainerStyle={{ paddingHorizontal: 40 }} onScroll={(e: any) => handleScroll(e)}>

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
		</View>
	)
}

const SearchBusinessList = (businessProps: BusinessesListingParams) => {

	const BusinessesListingProps = {
		...businessProps,
		isForceSearch: Platform.OS === 'ios',
		UIComponent: SearchBusinessUI
	}

	return <BusinessesListingController {...BusinessesListingProps} />
}

const BusinessProductsListingUI = (props: BusinessProductsListingParams) => {
	const {
		navigation,
		errors,
		businessState,
		categoryState,
		handleChangeSearch,
		categorySelected,
		searchValue,
		handleSearchRedirect,
		featuredProducts,
		errorQuantityProducts,
		header,
		logo,
		productModal,
		handleChangeCategory,
		setProductLogin,
		updateProductModal
	} = props

	const theme = useTheme()
	const [, t] = useLanguage()
	const [{ auth }] = useSession()
	const [orderState] = useOrder()
	const [{ parsePrice }] = useUtils()
	const { business, loading, error } = businessState
	const [openBusinessInformation, setOpenBusinessInformation] = useState(false)
	const [curProduct, setCurProduct] = useState(null)
	const [openUpselling, setOpenUpselling] = useState(false)
	const [canOpenUpselling, setCanOpenUpselling] = useState(false)

	const styles = StyleSheet.create({
		mainContainer: {
			flex: 1,
		},
		BackIcon: {
			paddingRight: 20,
		},
		headerItem: {
			flexDirection: 'row',
			alignItems: 'center',
			marginHorizontal: 20,
		},
		btnBackArrow: {
			borderWidth: 0,
			color: '#FFF',
			backgroundColor: 'transparent',
			borderRadius: 24,
			marginRight: 15,
		},
		searchIcon: {
			borderWidth: 0,
			color: '#FFF',
			backgroundColor: 'rgba(0,0,0,0.3)',
			borderRadius: 24,
			padding: 15,
			justifyContent: 'center'
		}
	})

	const currentCart: any = Object.values(orderState.carts).find((cart: any) => cart?.business?.slug === business?.slug) ?? {}

	const onRedirect = (route: string, params?: any) => {
		navigation.navigate(route, params)
	}

	const onProductClick = (product: any) => {
		setCurProduct(product)
	}

	const handleCancel = () => {
		handleChangeSearch('')
	}

	const handleCloseProductModal = () => {
		setCurProduct(null)
		updateProductModal && updateProductModal(null)
	}

	const handlerProductAction = () => {
		handleCloseProductModal()
	}

	const handleUpsellingPage = () => {
		onRedirect('CheckoutNavigator', {
			screen: 'CheckoutPage',
			cartUuid: currentCart?.uuid,
			businessLogo: logo,
			businessName: business?.name,
			cartTotal: currentCart?.total
		})
		setOpenUpselling(false)
	}

	return (
		<>
			<BusinessProductsListingContainer
				style={styles.mainContainer}
				isActiveFloatingButtom={currentCart?.products?.length > 0 && categoryState.products.length !== 0}
				contentContainerStyle={{ paddingBottom: 40 }}
				showsVerticalScrollIndicator={false}
			>

				{!loading && business?.id && (
					<>
						<WrapContent>
							<BusinessProductsList
								categories={[
									{ id: null, name: t('ALL', 'All') },
									{ id: 'featured', name: t('FEATURED', 'Featured') },
									...business?.categories.sort((a: any, b: any) => a.rank - b.rank)
								]}
								category={categorySelected}
								categoryState={categoryState}
								businessId={business.id}
								errors={errors}
								onProductClick={onProductClick}
								handleSearchRedirect={handleSearchRedirect}
								featured={featuredProducts}
								searchValue={searchValue}
								handleClearSearch={handleChangeSearch}
								errorQuantityProducts={errorQuantityProducts}
								handleCancelSearch={handleCancel}
							/>
						</WrapContent>
					</>
				)}

			</BusinessProductsListingContainer>

			<OModal
				open={!!curProduct || (!!productModal.product && !orderState.loading)}
				onClose={handleCloseProductModal}
				entireModal
				customClose
			>
				<ProductForm
					product={curProduct || productModal.product}
					businessSlug={business?.slug}
					businessId={business?.id || productModal?.product?.category?.business_id}
					onClose={handleCloseProductModal}
					navigation={navigation}
					onSave={handlerProductAction}
					setProductLogin={setProductLogin}
				/>
			</OModal>
			{openUpselling && (
				<UpsellingProducts
					businessId={currentCart?.business_id}
					business={currentCart?.business}
					cartProducts={currentCart?.products}
					handleUpsellingPage={handleUpsellingPage}
					openUpselling={openUpselling}
					canOpenUpselling={canOpenUpselling}
					setCanOpenUpselling={setCanOpenUpselling}
				/>
			)}
		</>
	)
}

const SearchProductsListing = (props: BusinessProductsListingParams) => {
	const businessProductslistingProps = {
		...props,
		UIComponent: BusinessProductsListingUI
	}
	return (
		<BusinessAndProductList {...businessProductslistingProps} />
	)
}

interface SearchProps {
	bProps: BusinessesListingParams,
	pProps: BusinessProductsListingParams
}

export const SearchList = ({ bProps, pProps }: SearchProps) => {

	return (
		// <View>
		<SearchBusinessList {...bProps} />
		// <SearchProductsListing {...pProps} />
		// </View>
	)
}
