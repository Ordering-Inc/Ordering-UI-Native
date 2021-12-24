import React, { useState, useRef, useCallback } from 'react'
import { View, TouchableOpacity, StyleSheet, TextStyle, ScrollView, I18nManager, Platform } from 'react-native'
import {
	BusinessAndProductList,
	useLanguage,
	useOrder,
	useSession,
	useUtils,
	useToast,
	ToastType
} from 'ordering-components/native'
import { OButton, OIcon, OModal, OText } from '../shared'
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
	BusinessProductsListingContainer,
	SortWrap,
	SortButton,
	CategoryWrap,
} from './styles'
import { useTheme } from 'styled-components/native'
import { FloatingButton } from '../FloatingButton'
import { ProductForm } from '../ProductForm'
import { UpsellingProducts } from '../UpsellingProducts'
import Animated from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Cart } from '../Cart'
import { OrderSummary } from '../OrderSummary'
import NavBar from '../NavBar'
import SocialShareFav from '../SocialShare'

const PIXELS_TO_SCROLL = 1000

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
		updateProductModal,
		getNextProducts
	} = props
	const theme = useTheme()

	const styles = StyleSheet.create({
		mainContainer: {
			flex: 1,
			marginTop: 64
		},
		BackIcon: {
			paddingRight: 20,
		},
		headerItem: {
			flexDirection: 'row',
			alignItems: 'center',
		},
		btnBackArrow: {
			borderWidth: 0,
			backgroundColor: theme.colors.clear,
			paddingLeft: I18nManager.isRTL ? 7 : 0,
			paddingRight: I18nManager.isRTL ? 0 : 7,
		},
		searchIcon: {
			width: 25,
			height: 25,
			borderWidth: 0,
			backgroundColor: theme.colors.white,
			borderRadius: 24,
			justifyContent: 'center',
			alignItems: 'center',
			shadowOpacity: 0,
			marginEnd: -6
		},
		categorySticky: {
			position: 'absolute',
			start: 1,
			end: 0,
			top: 0
		}
	})

	const [, t] = useLanguage()
	const [{ auth }] = useSession()
	const [orderState] = useOrder()
	const [{ parsePrice }] = useUtils()
	const [ ,{showToast}] = useToast()
	const { business, loading, error } = businessState
	const [openBusinessInformation, setOpenBusinessInformation] = useState(false)
	const [curProduct, setCurProduct] = useState(null)
	const [openUpselling, setOpenUpselling] = useState(false)
	const [openCart, setOpenCart] = useState(false)
	const [isCategoryClicked, setCategoryClicked] = useState(false)
	const [categoriesLayout, setCategoriesLayout] = useState<any>({})
	const [productListLayout, setProductListLayout] = useState<any>(null)
	const [selectedCategoryId, setSelectedCategoryId] = useState<any>('cat_all')

	const scrollViewRef = useRef<any>(null)

	const { top } = useSafeAreaInsets();
	const [sortBy, setSortBy] = useState('alphabet');

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

	const handleCloseCartModal = () => {
		setOpenCart(false);
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
		setOpenCart(false)
	}

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
	}, [isCategoryClicked, selectedCategoryId])

	const handleTouchDrag = useCallback(() => {
		setCategoryClicked(false);
	}, []);

	return (
		<>
			<Animated.View style={{ flex: 1, backgroundColor: theme.colors.white, position: 'absolute', width: '100%', top: top, zIndex: 1 }}>
				{!loading && business?.id && (
					<TopHeader>
						<OButton
							imgLeftSrc={theme.images.general.arrow_left}
							imgRightSrc={null}
							style={styles.btnBackArrow}
							onClick={() => (navigation?.canGoBack() && navigation.goBack()) || (auth && navigation.navigate('BottomTab'))}
							imgLeftStyle={{ tintColor: theme.colors.textPrimary }}
						/>
						{!errorQuantityProducts && (
							<View style={{ ...styles.headerItem }}>
								<View
									style={styles.searchIcon}
								>
									<SocialShareFav 
										icon={theme.images.general.share}
										style={{width: 19, height: 19}}
									/>
								</View>
							</View>
						)}
					</TopHeader>
				)}
			</Animated.View>
			<BusinessProductsListingContainer
				style={styles.mainContainer}
				isActiveFloatingButtom={currentCart?.products?.length > 0 && categoryState.products.length !== 0}
				stickyHeaderIndices={[1]}
				ref={scrollViewRef}
				onScroll={handlePageScroll}
				onScrollBeginDrag={handleTouchDrag}
				scrollEventThrottle={16}
			>
				<WrapHeader>
					<BusinessBasicInformation
						businessState={businessState}
						openBusinessInformation={openBusinessInformation}
						header={header}
						logo={logo}
						noImage={true}
					/>
					<View style={{ display: 'flex', position: 'relative', flexDirection: 'row', minHeight: 42, paddingHorizontal: 40, marginTop: 12 }}>
						<WrapSearchBar>
							<SearchBar
								onSearch={handleChangeSearch}
								isCancelXButtonShow
								noBorderShow
								placeholder={t('SEARCH', 'Search')}
								lazyLoad={businessState?.business?.lazy_load_products_recommended}
								inputWrapStyle={{ height: 40, backgroundColor: theme.colors.clear, borderWidth: 0, paddingStart: 11, marginEnd: 0 }}
							/>
						</WrapSearchBar>
						<SortWrap>
							<SortButton onPress={() => setSortBy('rank')} style={{ marginEnd: 7 }}>
								<OText size={12} weight={Platform.OS == 'ios' ? '600' : 'bold'} color={theme.colors.textPrimary}>{t('RANK', 'Rank')}</OText>
							</SortButton>
							<SortButton onPress={() => setSortBy('alphabet')}>
								<OText size={12} weight={Platform.OS == 'ios' ? '600' : 'bold'} color={theme.colors.textPrimary}>{t('A_TO_Z', 'A to Z')}</OText>
							</SortButton>
						</SortWrap>
					</View>
				</WrapHeader>
				{!loading && business?.id && !(business?.categories?.length === 0) && (
					<CategoryWrap>
						<BusinessProductsCategories
							categories={[{ id: 'all', name: t('ALL', 'All') }, { id: 'featured', name: t('FEATURED', 'Featured') }, ...business?.categories.sort((a: any, b: any) => a.rank - b.rank)]}
							categorySelected={categorySelected}
							onClickCategory={handleChangeCategory}
							featured={featuredProducts}
							openBusinessInformation={openBusinessInformation}
							scrollViewRef={scrollViewRef}
							contentStyle={{ paddingHorizontal: 40 }}
							productListLayout={productListLayout}
							categoriesLayout={categoriesLayout}
							selectedCategoryId={selectedCategoryId}
							setSelectedCategoryId={setSelectedCategoryId}
							setCategoryClicked={setCategoryClicked}
							lazyLoadProductsRecommended={business?.lazy_load_products_recommended}
						/>
					</CategoryWrap>
				)}
				<View>
					{!loading && business?.id && (
						<WrapContent onLayout={(event: any) => setProductListLayout(event.nativeEvent.layout)}>
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
								sortBy={sortBy}
								categoriesLayout={categoriesLayout}
								setCategoriesLayout={setCategoriesLayout}
							/>
						</WrapContent>
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
				</View>
			</BusinessProductsListingContainer>
			{!loading && auth && currentCart?.products?.length > 0 && categoryState.products.length !== 0 && !openCart && curProduct === null && (
				<FloatingButton
					btnText={
						currentCart?.subtotal >= currentCart?.minimum
							? !openUpselling ? t('VIEW_CART', 'View Cart') : t('LOADING', 'Loading')
							: `${t('MINIMUN_SUBTOTAL_ORDER', 'Minimum subtotal order:')} ${parsePrice(currentCart?.minimum)}`
					}
					isSecondaryBtn={currentCart?.subtotal < currentCart?.minimum}
					// btnLeftValueShow={currentCart?.subtotal >= currentCart?.minimum && !openUpselling && currentCart?.products?.length > 0}
					// btnRightValueShow={currentCart?.subtotal >= currentCart?.minimum && !openUpselling && currentCart?.products?.length > 0}
					btnLeftValue={currentCart?.products?.length}
					btnRightValue={parsePrice(currentCart?.total)}
					disabled={openUpselling || currentCart?.subtotal < currentCart?.minimum}
					handleClick={() => setOpenCart(true)}
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
			<OModal
				open={openCart}
				onClose={handleCloseCartModal}
				entireModal
				customClose
			>
				<ScrollView stickyHeaderIndices={[0]} style={{backgroundColor: 'white'}} contentContainerStyle={{ paddingBottom: 100 }}>
					<NavBar title={t('CART', 'Cart')} onActionLeft={handleCloseCartModal} leftImg={theme.images.general.close} noBorder btnStyle={{paddingLeft: 0}} />
					<OrderSummary
						cart={currentCart}
						isCartPending={currentCart?.status === 2}
						hasUpSelling={true}
						isFromCheckout
						title={t('ITEMS', 'Items')}
						paddingH={40}
					/>
				</ScrollView>
				<FloatingButton btnText={t('CHECKOUT', 'Checkout')} handleClick={() => handleUpsellingPage()} />
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
