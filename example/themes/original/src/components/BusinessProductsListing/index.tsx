import React, { useEffect, useRef, useState } from 'react'
import { View, TouchableOpacity, StyleSheet, SafeAreaView, Platform } from 'react-native'
import { useTheme } from 'styled-components/native';
import {
	BusinessAndProductList,
	useLanguage,
	useOrder,
	useSession,
	useUtils,
	ToastType,
	useToast
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
	BusinessProductsListingContainer
} from './styles'
import { FloatingButton } from '../FloatingButton'
import { ProductForm } from '../ProductForm'
import { UpsellingProducts } from '../UpsellingProducts'

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
		handleChangeCategory,
		handleSearchRedirect,
		featuredProducts,
		errorQuantityProducts,
		header,
		logo,
		getNextProducts
	} = props

	const theme = useTheme();
	const [, t] = useLanguage()
	const [{ auth }] = useSession()
	const [orderState] = useOrder()
	const [{ parsePrice }] = useUtils()
  const [ ,{showToast}] = useToast()

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
			marginVertical: 2,
			marginHorizontal: 20,
		},
		btnBackArrow: {
			borderWidth: 0,
			backgroundColor: theme.colors.clear,
			shadowColor: theme.colors.clear,
		},
		searchIcon: {
			borderWidth: 0,
			padding: 15,
			justifyContent: 'center',
			shadowColor: theme.colors.clear,
		}
	})

	const { business, loading, error } = businessState
	const [openBusinessInformation, setOpenBusinessInformation] = useState(false)
	const [isOpenSearchBar, setIsOpenSearchBar] = useState(false)
	const [curProduct, setCurProduct] = useState(null)
	const [openUpselling, setOpenUpselling] = useState(false)
	const [canOpenUpselling, setCanOpenUpselling] = useState(false)
	const scrollViewRef = useRef<any>(null)
	const [categoriesLayout, setCategoriesLayout] = useState<any>({})
	const [productListLayout, setProductListLayout] = useState<any>(null)

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

	const handleCloseUpsellingPage = () => {
		setOpenUpselling(false)
	}

	const [selectedCategoryId, setSelectedCategoryId] = useState<any>(null)

	const handleScroll = ({ nativeEvent }: any) => {
		const scrollOffset = nativeEvent.contentOffset.y
		if (businessState?.business?.lazy_load_products_recommended) {
			const height = nativeEvent.contentSize.height
			const hasMore = !(categoryState.pagination.totalPages === categoryState.pagination.currentPage)
			if (scrollOffset + PIXELS_TO_SCROLL > height && !loading && hasMore && getNextProducts) {
				getNextProducts()
				showToast(ToastType.Info, t('LOADING_MORE_PRODUCTS', 'Loading more products'))
			}
		} else {
			if (!scrollOffset || !categoriesLayout || !productListLayout) return
			for (const key in categoriesLayout) {
				const categoryOffset = categoriesLayout[key].y + productListLayout?.y - 70
				if (categoryOffset - 50 <= scrollOffset && scrollOffset <= categoryOffset + 50) {
					if (selectedCategoryId !== key) {
						setSelectedCategoryId(key)
					}
				}
			}
		}
	}

	useEffect(() => {
		if (!orderState.loading) {
			handleCloseProductModal()
		}
	}, [orderState.loading])

	return (
		<SafeAreaView
			style={{ flex: 1 }}
		>
			<WrapHeader>
				<TopHeader>
					{!isOpenSearchBar && (
						<>
							<View style={{ ...styles.headerItem, flex: 1 }}>
								<OButton
									imgLeftSrc={theme.images.general.arrow_left}
									imgRightSrc={null}
									style={styles.btnBackArrow}
									onClick={() => navigation?.canGoBack() && navigation.goBack()}
									imgLeftStyle={{ tintColor: theme.colors.textNormal, width: 16 }}
								/>
							</View>
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
			</WrapHeader>
			<BusinessProductsListingContainer
				stickyHeaderIndices={[2]}
				style={styles.mainContainer}
				ref={scrollViewRef}
				isActiveFloatingButtom={currentCart?.products?.length > 0 && categoryState.products.length !== 0}
				onScroll={(e: any) => handleScroll(e)}
				scrollEventThrottle={16}
			>
				<BusinessBasicInformation
					navigation={navigation}
					businessState={businessState}
					openBusinessInformation={openBusinessInformation}
					header={header}
					logo={logo}
				/>
				<View style={{ height: 8, backgroundColor: theme.colors.backgroundGray100 }} />
				{!loading && business?.id && (
					<>
						{!(business?.categories?.length === 0) && (
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
							/>
						)}
					</>
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
								setCategoriesLayout={setCategoriesLayout}
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
			{!loading && auth && !openUpselling && currentCart?.products?.length > 0 && categoryState.products.length !== 0 && (
				<FloatingButton
					btnText={
						currentCart?.subtotal >= currentCart?.minimum
							? !openUpselling ? t('VIEW_ORDER', 'View Order') : t('LOADING', 'Loading')
							: `${t('MINIMUN_SUBTOTAL_ORDER', 'Minimum subtotal order:')} ${parsePrice(currentCart?.minimum)}`
					}
					isSecondaryBtn={currentCart?.subtotal < currentCart?.minimum}
					btnLeftValueShow={currentCart?.subtotal >= currentCart?.minimum && !openUpselling && currentCart?.products?.length > 0}
					btnRightValueShow={currentCart?.subtotal >= currentCart?.minimum && !openUpselling && currentCart?.products?.length > 0}
					btnLeftValue={currentCart?.products?.length}
					btnRightValue={parsePrice(currentCart?.total)}
					disabled={openUpselling || currentCart?.subtotal < currentCart?.minimum}
					handleClick={() => setOpenUpselling(true)}
				/>
			)}
			<OModal
				open={!!curProduct}
				onClose={handleCloseProductModal}
				entireModal
				customClose
				isAvoidKeyBoardView
			>
				<ProductForm
					product={curProduct}
					businessSlug={business.slug}
					businessId={business.id}
					onClose={handleCloseProductModal}
					navigation={navigation}
					onSave={handlerProductAction}
				/>
			</OModal>
			{openUpselling && (
				<UpsellingProducts
					businessId={currentCart?.business_id}
					business={currentCart?.business}
					cartProducts={currentCart?.products}
					cart={currentCart}
					handleUpsellingPage={handleUpsellingPage}
					handleCloseUpsellingPage={handleCloseUpsellingPage}
					openUpselling={openUpselling}
					canOpenUpselling={canOpenUpselling}
					setCanOpenUpselling={setCanOpenUpselling}
				/>
			)}
		</SafeAreaView>
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
