import React, { useState } from 'react'
import { View, TouchableOpacity, StyleSheet, TextStyle, ScrollView } from 'react-native'
import {
	BusinessAndProductList,
	useLanguage,
	useOrder,
	useSession,
	useUtils
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

	const styles = StyleSheet.create({
		mainContainer: {
			flex: 1,
			marginTop: 60
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
			paddingStart: 0,
			paddingEnd: 7,
		},
		searchIcon: {
			width: 25,
			height: 25,
			borderWidth: 0,
			backgroundColor: theme.colors.white,
			borderRadius: 24,
			justifyContent: 'center',
			alignItems: 'center',
			shadowColor: theme.colors.black,
			shadowOpacity: 0.1,
			shadowOffset: { width: 0, height: 2 },
			shadowRadius: 2,
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
	const { business, loading, error } = businessState
	const [openBusinessInformation, setOpenBusinessInformation] = useState(false)
	const [isOpenSearchBar, setIsOpenSearchBar] = useState(false)
	const [curProduct, setCurProduct] = useState(null)
	const [openUpselling, setOpenUpselling] = useState(false)
	const [openCart, setOpenCart] = useState(false)
	const [canOpenUpselling, setCanOpenUpselling] = useState(false)

	const [isStickyCategory, setStickyCategory] = useState(false);
	const { top } = useSafeAreaInsets();

	const currentCart: any = Object.values(orderState.carts).find((cart: any) => cart?.business?.slug === business?.slug) ?? {}

	const onRedirect = (route: string, params?: any) => {
		navigation.navigate(route, params)
	}

	const onProductClick = (product: any) => {
		setCurProduct(product)
	}

	const handleCancel = () => {
		setIsOpenSearchBar(false)
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
		console.log(`---- PASSED BUTTON PRESS ----`);
		onRedirect('CheckoutNavigator', {
			screen: 'CheckoutPage',
			cartUuid: currentCart?.uuid,
			businessLogo: logo,
			businessName: business?.name,
			cartTotal: currentCart?.total
		})
		setOpenCart(false)
	}

	const handlePageScroll = (event: any) => {
		const y = event?.nativeEvent?.contentOffset?.y || 0;
		if (y > 30 && !isStickyCategory) {
			setStickyCategory(true);
		} else if (y < 19 && isStickyCategory) {
			setStickyCategory(false);
		}
	}
	// useEffect(() => {
	//   if (!orderState.loading) {
	//     handleCloseProductModal()
	//   }
	// }, [orderState.loading])

	return (
		<>
			<Animated.View style={{ flex: 1, backgroundColor: theme.colors.white, position: 'absolute', width: '100%', top: top, zIndex: 100 }}>
				{!loading && business?.id && (
					<TopHeader>
						{!isOpenSearchBar && (
							<>
								<OButton
									imgLeftSrc={theme.images.general.arrow_left}
									imgRightSrc={null}
									style={styles.btnBackArrow}
									onClick={() => (navigation?.canGoBack() && navigation.goBack()) || (auth && navigation.navigate('BottomTab'))}
									imgLeftStyle={{ tintColor: theme.colors.textPrimary }}
								/>
								{isStickyCategory && (
									<Animated.View style={{ flexBasis: '74%', paddingHorizontal: 10, alignItems: 'center' }}>
										<OText style={theme.labels.middle as TextStyle} numberOfLines={1} ellipsizeMode={'tail'}>{business?.name}</OText>
									</Animated.View>
								)}
								{!errorQuantityProducts && (
									<View style={{ ...styles.headerItem }}>
										<TouchableOpacity
											onPress={() => { }}
											style={styles.searchIcon}
										>
											<OIcon src={theme.images.general.share} width={16} />
										</TouchableOpacity>
									</View>
								)}
							</>
						)}
					</TopHeader>
				)}
			</Animated.View>
			<BusinessProductsListingContainer
				style={styles.mainContainer}
				isActiveFloatingButtom={currentCart?.products?.length > 0 && categoryState.products.length !== 0}
				stickyHeaderIndices={[1]}
				onScroll={handlePageScroll}
				scrollEventThrottle={14}
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
								onCancel={() => handleCancel()}
								isCancelXButtonShow
								noBorderShow
								placeholder={t('SEARCH', 'Search')}
								lazyLoad={businessState?.business?.lazy_load_products_recommended}
								inputWrapStyle={{ height: 40, backgroundColor: theme.colors.clear, borderWidth: 0, paddingStart: 11, marginEnd: 0 }}
							/>
						</WrapSearchBar>
						<SortWrap>
							<SortButton onPress={() => { }} style={{ marginEnd: 7 }}>
								<OText size={12} weight={'600'} color={theme.colors.textPrimary}>{t('RANK', 'Rank')}</OText>
							</SortButton>
							<SortButton onPress={() => { }}>
								<OText size={12} weight={'600'} color={theme.colors.textPrimary}>{t('A_TO_Z', 'A to Z')}</OText>
							</SortButton>
						</SortWrap>
					</View>
				</WrapHeader>
				{!loading && business?.id && !(business?.categories?.length === 0) && (
					<CategoryWrap>
						<BusinessProductsCategories
							categories={[{ id: null, name: t('ALL', 'All') }, { id: 'featured', name: t('FEATURED', 'Featured') }, ...business?.categories.sort((a: any, b: any) => a.rank - b.rank)]}
							categorySelected={categorySelected}
							onClickCategory={handleChangeCategory}
							featured={featuredProducts}
							openBusinessInformation={openBusinessInformation}
							contentStyle={{ paddingHorizontal: 40 }}
						/>
					</CategoryWrap>
				)}
				<View>
					{!loading && business?.id && (
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
			{!loading && auth && currentCart?.products?.length > 0 && categoryState.products.length !== 0 && (
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
				transition={'pageSheet'}
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
				<ScrollView stickyHeaderIndices={[0]} contentContainerStyle={{ paddingBottom: 100 }}>
					<NavBar title={t('CART', 'Cart')} onActionLeft={handleCloseCartModal} leftImg={theme.images.general.close} noBorder />
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
