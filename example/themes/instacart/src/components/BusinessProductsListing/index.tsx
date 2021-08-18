import React, { useState } from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import {
	BusinessAndProductList,
	useLanguage,
	useOrder,
	useSession,
	useUtils
} from 'ordering-components/native'
import { OButton, OModal, OText } from '../shared'
import { BusinessBasicInformation } from '../BusinessBasicInformation'
import { SearchBar } from '../SearchBar'
import { BusinessProductsCategories } from '../BusinessProductsCategories'
import { BusinessProductsList } from '../BusinessProductsList'
import { BusinessProductsListingParams } from '../../types'
import {
	WrapHeader,
	TopHeader,
	AddressInput,
	WrapSearchBar,
	WrapContent,
	BusinessProductsListingContainer
} from './styles'
import { FloatingButton } from '../FloatingButton'
import { ProductForm } from '../ProductForm'
import { UpsellingProducts } from '../UpsellingProducts'
import { useTheme } from 'styled-components/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { OrderSummary } from '../OrderSummary'
import { Cart } from '../Cart'

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
	const [openCart, setOpenCart] = useState(false)

	const { top, bottom } = useSafeAreaInsets();

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
				<WrapHeader>
					{!loading && business?.id && (
						<>
							<TopHeader style={{ marginTop: top }}>
								<View style={{ ...styles.headerItem, flex: 1 }}>
									<OButton
										imgLeftSrc={theme.images.general.arrow_left}
										imgRightSrc={null}
										style={styles.btnBackArrow}
										onClick={() => (navigation?.canGoBack() && navigation.goBack()) || (auth && navigation.navigate('BottomTab'))}
										imgLeftStyle={{ tintColor: '#fff' }}
									/>
									{/* <AddressInput
										onPress={() => auth
											? onRedirect('AddressList', { isGoBack: true, isFromProductsList: true })
											: onRedirect('AddressForm', { address: orderState.options?.address })}
									>
										<OText color={theme.colors.white} numberOfLines={1}>
											{orderState?.options?.address?.address}
										</OText>
									</AddressInput> */}
								</View>

							</TopHeader>
							{/* <WrapSearchBar>
								<SearchBar
									onSearch={handleChangeSearch}
									onCancel={() => handleCancel()}
									isCancelXButtonShow
									noBorderShow
									placeholder={t('SEARCH_PRODUCTS', 'Search Products')}
									lazyLoad={businessState?.business?.lazy_load_products_recommended}
								/>
							</WrapSearchBar> */}
						</>
					)}
					<BusinessBasicInformation
						businessState={businessState}
						openBusinessInformation={openBusinessInformation}
						header={header}
						logo={logo}
						handleChangeSearch={handleChangeSearch}
						navigation={navigation}
					/>
				</WrapHeader>
				{!loading && business?.id && (
					<>
						{/* {!(business?.categories?.length === 0) && (
							<BusinessProductsCategories
								categories={[{ id: null, name: t('ALL', 'All') }, { id: 'featured', name: t('FEATURED', 'Featured') }, ...business?.categories.sort((a: any, b: any) => a.rank - b.rank)]}
								categorySelected={categorySelected}
								onClickCategory={handleChangeCategory}
								featured={featuredProducts}
								openBusinessInformation={openBusinessInformation}
							/>
						)} */}
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
				{loading && !error && (
					<>
						<BusinessProductsCategories
							categories={[]}
							categorySelected={categorySelected}
							onClickCategory={handleChangeCategory}
							featured={featuredProducts}
							openBusinessInformation={openBusinessInformation}
							loading={loading}
						/>
						<WrapContent>
							<BusinessProductsList
								categories={[]}
								category={categorySelected}
								categoryState={categoryState}
								isBusinessLoading={loading}
								errorQuantityProducts={errorQuantityProducts}
							/>
						</WrapContent>
					</>
				)}
			</BusinessProductsListingContainer>
			{!loading && auth && currentCart?.products?.length > 0 && categoryState.products.length !== 0 && (
				<FloatingButton
					btnText={
						currentCart?.subtotal >= currentCart?.minimum
							? !openUpselling ? t('VIEW_CART', 'View cart') + `(${currentCart?.products?.length})` : t('LOADING', 'Loading')
							: `${t('MINIMUN_SUBTOTAL_ORDER', 'Minimum subtotal order:')} ${parsePrice(currentCart?.minimum)}`
					}
					isSecondaryBtn={currentCart?.subtotal < currentCart?.minimum}
					btnLeftValueShow={currentCart?.subtotal >= currentCart?.minimum && !openUpselling && currentCart?.products?.length > 0}
					btnRightValueShow={false}
					btnRightValue={parsePrice(currentCart?.total)}
					disabled={openUpselling || currentCart?.subtotal < currentCart?.minimum}
					handleClick={() => onRedirect('CartPage', { cart: currentCart })}
				/>
			)}
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

export const BusinessProductsListing = (props: BusinessProductsListingParams) => {
	const businessProductslistingProps = {
		...props,
		UIComponent: BusinessProductsListingUI
	}
	return (
		<BusinessAndProductList {...businessProductslistingProps} />
	)
}
