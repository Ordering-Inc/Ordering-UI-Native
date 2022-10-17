import React, { useCallback, useEffect, useRef, useState } from 'react'
import { View, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions, Platform, KeyboardAvoidingViewBase, KeyboardAvoidingView } from 'react-native'
import { IOScrollView } from 'react-native-intersection-observer'
import { useTheme } from 'styled-components/native';
import {
	BusinessAndProductList,
	useLanguage,
	useOrder,
	useSession,
	useUtils,
	ToastType,
	useToast,
	useConfig
} from 'ordering-components/native'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
import { OButton, OIcon, OModal, OText } from '../shared'
import Alert from '../../providers/AlertProvider'
import { BusinessBasicInformation } from '../BusinessBasicInformation'
import { SearchBar } from '../SearchBar'
import { BusinessProductsCategories } from '../BusinessProductsCategories'
import { BusinessProductsList } from '../BusinessProductsList'
import { BusinessProductsListingParams } from '../../types'
import { _retrieveStoreData, _removeStoreData } from '../../providers/StoreUtil';
import IconAntDesign from 'react-native-vector-icons/AntDesign';

import {
	TopHeader,
	WrapSearchBar,
	WrapContent,
	FiltProductsContainer,
	ContainerSafeAreaView,
	BackgroundGray,
	ProfessionalFilterWrapper,
	NearBusiness,
	TopActions
} from './styles'
import { FloatingButton } from '../FloatingButton'
import { UpsellingRedirect } from './UpsellingRedirect'
import Animated from 'react-native-reanimated'
import { ProfessionalFilter } from '../ProfessionalFilter';
import { ServiceForm } from '../ServiceForm';
import { BusinessesListing } from '../BusinessesListing/Layout/Original'

const PIXELS_TO_SCROLL = 2000

const BusinessProductsListingUI = (props: BusinessProductsListingParams) => {
	const {
		navigation,
		errors,
		businessState,
		categoryState,
		handleChangeSearch,
		categorySelected,
		searchValue,
		handleChangeCategory,
		handleSearchRedirect,
		featuredProducts,
		errorQuantityProducts,
		header,
		logo,
		alertState,
		setAlertState,
		multiRemoveProducts,
		getNextProducts,
		handleUpdateProducts,
		professionalSelected,
		handleChangeProfessionalSelected,
		onBusinessClick
	} = props

	const theme = useTheme();
	const [, t] = useLanguage()
	const [{ auth }] = useSession()
	const [orderState, { clearCart }] = useOrder()
	const [{ parsePrice }] = useUtils()
	const [, { showToast }] = useToast()
	const [{ configs }] = useConfig()
	const isPreOrder = configs?.preorder_status_enabled?.value === '1'

	const isChewLayout = theme?.business_view?.components?.header?.components?.layout?.type === 'chew'
	const showLogo = !theme?.business_view?.components?.header?.components?.business?.components?.logo?.hidden
	const hideBusinessNearCity = theme?.business_view?.components?.near_business?.hidden ?? true

	const styles = StyleSheet.create({
		mainContainer: {
			flex: 1
		},
		BackIcon: {
			paddingRight: 20,
		},
		headerItem: {
			flexDirection: 'row',
			alignItems: 'center',
			marginVertical: 2,
			marginHorizontal: 20,
		},
		btnBackArrow: {
			borderWidth: 0,
			backgroundColor: theme.colors.clear,
			shadowColor: theme.colors.clear,
			padding: 40,
		},
		searchIcon: {
			borderWidth: 0,
			padding: 15,
			justifyContent: 'center',
			shadowColor: theme.colors.clear,
		},
		businessSkeleton: {
			borderRadius: 8,
			marginRight: 20,
			width: 56,
			height: 56
		},
	})

	const { business, loading, error } = businessState
	const [openBusinessInformation, setOpenBusinessInformation] = useState(false)
	const [isOpenSearchBar, setIsOpenSearchBar] = useState(false)
	const [openUpselling, setOpenUpselling] = useState(false)
	const [canOpenUpselling, setCanOpenUpselling] = useState(false)
	const scrollViewRef = useRef<any>(null)
	const [categoriesLayout, setCategoriesLayout] = useState<any>({})
	const [productListLayout, setProductListLayout] = useState<any>(null)
	const [isCategoryClicked, setCategoryClicked] = useState(false)
	const [subcategoriesSelected, setSubcategoriesSelected] = useState([])
	const [openService, setOpenService] = useState(false)
	const [currentProduct, setCurrentProduct] = useState(null)

	const isCheckoutMultiBusinessEnabled: Boolean = configs?.checkout_multi_business_enabled?.value === '1'
	const openCarts = (Object.values(orderState?.carts)?.filter((cart: any) => cart?.products && cart?.products?.length && cart?.status !== 2 && cart?.valid_schedule && cart?.valid_products && cart?.valid_address && cart?.valid_maximum && cart?.valid_minimum && !cart?.wallets) || null) || []

	const currentCart: any = Object.values(orderState.carts).find((cart: any) => cart?.business?.slug === business?.slug) ?? {}
	const isOpenFiltProducts = isOpenSearchBar && !!searchValue
	const filtProductsHeight = Platform.OS === 'ios' ? 0 : 100
	const onRedirect = (route: string, params?: any) => {
		navigation.navigate(route, params)
	}

	const onProductClick = (product: any) => {
		const productAddedToCartLength = currentCart?.products?.reduce((productsLength: number, Cproduct: any) => { return productsLength + (Cproduct?.id === product?.id ? Cproduct?.quantity : 0) }, 0)
		if (product?.type === 'service' && professionalSelected) {
			setCurrentProduct(product)
			setOpenService(true)
			return
		}
		onRedirect('ProductDetails', {
			product: product,
			businessSlug: business.slug,
			businessId: business.id,
			productAddedToCartLength
		})
	}

	const handleCancel = () => {
		setIsOpenSearchBar(false)
		handleChangeSearch('')
	}

	const handleUpsellingPage = () => {
		if (isCheckoutMultiBusinessEnabled && openCarts.length > 1) {
			onRedirect('CheckoutNavigator', {
				screen: 'MultiCheckout'
			})
		} else {
			onRedirect('CheckoutNavigator', {
				screen: 'CheckoutPage',
				cartUuid: currentCart?.uuid,
				businessLogo: logo,
				businessName: business?.name,
				cartTotal: currentCart?.total
			})
		}
		setOpenUpselling(false)
	}

	const handleCloseUpsellingPage = () => {
		setOpenUpselling(false)
	}

	const [selectedCategoryId, setSelectedCategoryId] = useState<any>(null)

	const handlePageScroll = useCallback(({ nativeEvent }: any) => {
		const scrollOffset = nativeEvent.contentOffset.y
		if (businessState?.business?.lazy_load_products_recommended) {
			const height = nativeEvent.contentSize.height
			const hasMore = !(categoryState.pagination.totalPages === categoryState.pagination.currentPage)
			if (scrollOffset + PIXELS_TO_SCROLL > height && !loading && hasMore && getNextProducts) {
				getNextProducts()
				showToast(ToastType.Info, t('LOADING_MORE_PRODUCTS', 'Loading more products'))
			}
		} else {
			if (!scrollOffset || !categoriesLayout || !productListLayout || isCategoryClicked) return

			for (const key in categoriesLayout) {
				const categoryOffset = categoriesLayout[key].y + productListLayout?.y - 70
				if (scrollOffset < 10) {
					setSelectedCategoryId('cat_all');
					return;
				}
				if (categoryOffset - 50 <= scrollOffset && scrollOffset <= categoryOffset + 50) {
					if (selectedCategoryId !== key) {
						setSelectedCategoryId(key)
					}
				}
			}
		}
	}, [isCategoryClicked, selectedCategoryId, productListLayout])

	const handleTouchDrag = useCallback(() => {
		setCategoryClicked(false);
	}, []);

	const handleBackNavigation = () => {
		navigation?.canGoBack() ? navigation.goBack() : navigation.navigate('BottomTab')
	}

	const adjustBusiness = async (adjustBusinessId: number) => {
		const _carts = orderState?.carts?.[adjustBusinessId]
		const products = _carts?.products
		const unavailableProducts = products.filter((product: any) => product.valid !== true)
		const alreadyRemoved = await _retrieveStoreData('already-removed')
		_removeStoreData('already-removed')
		if (unavailableProducts.length > 0) {
			multiRemoveProducts && await multiRemoveProducts(unavailableProducts, _carts)
			return
		}

		if (alreadyRemoved === 'removed') {
			setAlertState({ open: true, content: [t('NOT_AVAILABLE_PRODUCT', 'This product is not available.')] })
		}
	}

	const removeCartByReOrder = async () => {
		const adjustBusinessId = await _retrieveStoreData('adjust-cart-products')
		if (currentCart && adjustBusinessId) {
			_removeStoreData('adjust-cart-products')
			adjustBusiness(adjustBusinessId)
		}
	}

	useEffect(() => {
		removeCartByReOrder()
	}, [currentCart])

	return (
		<>
			<ContainerSafeAreaView
				style={{ flex: 1 }}
				isOpenFiltProducts={isOpenFiltProducts}
			>
				<Animated.View style={{ position: 'relative' }}>
					<TopHeader isIos={Platform.OS === 'ios'}>
						{!isOpenSearchBar && (
							<>
								<TopActions onPress={() => handleBackNavigation()}>
									<IconAntDesign name='arrowleft' size={26} />
								</TopActions>
								{!errorQuantityProducts && (
									<View style={{ ...styles.headerItem }}>
										<TouchableOpacity
											onPress={() => setIsOpenSearchBar(true)}
											style={styles.searchIcon}
										>
											<OIcon src={theme.images.general.search} color={theme.colors.textNormal} width={16} />
										</TouchableOpacity>
									</View>
								)}
							</>
						)}
						{isOpenSearchBar && (
							<WrapSearchBar>
								<SearchBar
									autoFocus
									onSearch={handleChangeSearch}
									onCancel={() => handleCancel()}
									isCancelXButtonShow
									noBorderShow
									placeholder={t('SEARCH_PRODUCTS', 'Search Products')}
									lazyLoad={businessState?.business?.lazy_load_products_recommended}
								/>
							</WrapSearchBar>
						)}
					</TopHeader>
					{!hideBusinessNearCity && loading && (
						<NearBusiness style={{ paddingBottom: 10 }}>
							<Placeholder Animation={Fade}>
								<View style={{ flexDirection: 'row' }}>
									{[...Array(10).keys()].map(i => (
										<View style={styles.businessSkeleton} key={i}>
											<PlaceholderLine style={{ width: '100%', height: '100%' }} />
										</View>
									))}
								</View>
							</Placeholder>
						</NearBusiness>
					)}
					{!loading && !hideBusinessNearCity && businessState?.business?.city_id && (
						<NearBusiness>
							<BusinessesListing
								logosLayout
								propsToFetch={['id', 'logo', 'location', 'timezone', 'schedule', 'open', 'slug']}
								cityId={businessState?.business?.city_id}
								onBusinessClick={onBusinessClick}
								actualSlug={businessState?.business?.slug}
							/>
						</NearBusiness>
					)}
				</Animated.View>

				{business?.categories?.length > 0 && isOpenFiltProducts && (
					<FiltProductsContainer
						isIos={Platform.OS === 'ios'}
						style={{
							height: Dimensions.get('window').height - filtProductsHeight
						}}
						contentContainerStyle={{ flexGrow: 1 }}
					>
						<View style={{ padding: 20, backgroundColor: theme.colors.white }}>
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
								categoriesLayout={categoriesLayout}
								subcategoriesSelected={subcategoriesSelected}
								lazyLoadProductsRecommended={business?.lazy_load_products_recommended}
								setCategoriesLayout={setCategoriesLayout}
								currentCart={currentCart}
								setSubcategoriesSelected={setSubcategoriesSelected}
								onClickCategory={handleChangeCategory}
								handleUpdateProducts={handleUpdateProducts}
								previouslyProducts={business?.previously_products}
								navigation={navigation}
								isFiltMode
							/>
						</View>
					</FiltProductsContainer>
				)}
				{isOpenFiltProducts && (
					<BackgroundGray />
				)}
				<IOScrollView
					stickyHeaderIndices={[business?.professionals?.length > 0 ? 3 : 2]}
					style={{
						...styles.mainContainer,
						marginBottom: currentCart?.products?.length > 0 && categoryState.products.length !== 0 ?
							50 : 0
					}}
					ref={scrollViewRef}
					onScroll={handlePageScroll}
					onScrollBeginDrag={handleTouchDrag}
					scrollEventThrottle={16}
					bounces={false}
				>
					<BusinessBasicInformation
						navigation={navigation}
						businessState={businessState}
						openBusinessInformation={openBusinessInformation}
						header={header}
						logo={logo}
						isPreOrder={isPreOrder}
					/>
					{business?.professionals?.length > 0 && (
						<ProfessionalFilterWrapper>
							<OText
								size={16}
								style={{ marginBottom: 16 }}
								weight={Platform.OS === 'ios' ? '600' : 'bold'}
							>
								{t('PROFESSIONALS', 'Professionals')}
							</OText>
							<ProfessionalFilter
								professionals={business?.professionals}
								professionalSelected={professionalSelected}
								handleChangeProfessionalSelected={handleChangeProfessionalSelected}
							/>
						</ProfessionalFilterWrapper>
					)}
					<View
						style={{
							height: 8,
							backgroundColor: theme.colors.backgroundGray100,
							marginTop: isChewLayout && showLogo ? 10 : 0
						}}
					/>
					{!loading && business?.id && !(business?.categories?.length === 0) && (
						<BusinessProductsCategories
							categories={[{ id: null, name: t('ALL', 'All') }, { id: 'featured', name: t('FEATURED', 'Featured') }, ...business?.categories.sort((a: any, b: any) => a.rank - b.rank)]}
							categorySelected={categorySelected}
							onClickCategory={handleChangeCategory}
							featured={featuredProducts}
							openBusinessInformation={openBusinessInformation}
							scrollViewRef={scrollViewRef}
							productListLayout={productListLayout}
							categoriesLayout={categoriesLayout}
							selectedCategoryId={selectedCategoryId}
							lazyLoadProductsRecommended={business?.lazy_load_products_recommended}
							setSelectedCategoryId={setSelectedCategoryId}
							setCategoryClicked={setCategoryClicked}
						/>
					)}
					{!loading && business?.id && (
						<>
							<WrapContent
								onLayout={(event: any) => setProductListLayout(event.nativeEvent.layout)}
							>
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
									categoriesLayout={categoriesLayout}
									subcategoriesSelected={subcategoriesSelected}
									lazyLoadProductsRecommended={business?.lazy_load_products_recommended}
									setCategoriesLayout={setCategoriesLayout}
									currentCart={currentCart}
									setSubcategoriesSelected={setSubcategoriesSelected}
									onClickCategory={handleChangeCategory}
									handleUpdateProducts={handleUpdateProducts}
									navigation={navigation}
									previouslyProducts={business?.previously_products}
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
									handleUpdateProducts={handleUpdateProducts}
									navigation={navigation}
								/>
							</WrapContent>
						</>
					)}
				</IOScrollView>
				{!loading && auth && currentCart?.products?.length > 0 && categoryState.products.length !== 0 && (
					<FloatingButton
						btnText={
							openUpselling
								? t('LOADING', 'Loading')
								: currentCart?.subtotal >= currentCart?.minimum
									? t('VIEW_ORDER', 'View Order')
									: `${t('MINIMUN_SUBTOTAL_ORDER', 'Minimum subtotal order:')} ${parsePrice(currentCart?.minimum)}`
						}
						isSecondaryBtn={currentCart?.subtotal < currentCart?.minimum || openUpselling}
						btnLeftValueShow={currentCart?.subtotal >= currentCart?.minimum && currentCart?.products?.length > 0}
						btnRightValueShow={currentCart?.subtotal >= currentCart?.minimum && currentCart?.products?.length > 0}
						btnLeftValue={currentCart?.products.reduce((prev: number, product: any) => prev + product.quantity, 0)}
						btnRightValue={parsePrice(currentCart?.total)}
						disabled={currentCart?.subtotal < currentCart?.minimum || openUpselling}
						handleClick={() => setOpenUpselling(true)}
					/>
				)}
				{openUpselling && (
					<UpsellingRedirect
						businessId={currentCart?.business_id}
						business={currentCart?.business}
						cartProducts={currentCart?.products}
						cart={currentCart}
						setOpenUpselling={setOpenUpselling}
						handleUpsellingPage={handleUpsellingPage}
						handleCloseUpsellingPage={handleCloseUpsellingPage}
						openUpselling={openUpselling}
						canOpenUpselling={canOpenUpselling}
						setCanOpenUpselling={setCanOpenUpselling}
						onRedirect={onRedirect}
					/>
				)}
				<Alert
					open={alertState?.open || false}
					title=''
					content={[t('NOT_AVAILABLE_PRODUCTS', 'These products are not available.')]}
					onAccept={() => setAlertState({ open: false, content: [] })}
					onClose={() => setAlertState({ open: false, content: [] })}
				/>
			</ContainerSafeAreaView>
			<OModal
				open={openService}
				onClose={() => setOpenService(false)}
				entireModal
			>
				<ServiceForm
					navigation={navigation}
					product={currentProduct}
					businessSlug={business.slug}
					businessId={business.id}
					professionalList={business?.professionals}
					professionalSelected={professionalSelected}
					handleChangeProfessional={handleChangeProfessionalSelected}
					onSave={() => setOpenService(false)}
					onClose={() => setOpenService(false)}
				/>
			</OModal>
		</>
	)
}

export const BusinessProductsListing = (props: BusinessProductsListingParams) => {
	const businessProductslistingProps = {
		...props,
		UIComponent: BusinessProductsListingUI
	}
	return (
		<BusinessAndProductList {...businessProductslistingProps} />
	)
}
