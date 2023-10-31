import React, { useCallback, useEffect, useRef, useState } from 'react'
import { View, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions, Platform, KeyboardAvoidingViewBase, KeyboardAvoidingView, Keyboard, KeyboardEvent, BackHandler, ScrollView, Vibration } from 'react-native'
import { IOScrollView } from 'react-native-intersection-observer'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from 'styled-components/native';
import {
  BusinessAndProductList,
  useLanguage,
  useOrder,
  useSession,
  useUtils,
  ToastType,
  useToast,
  useConfig,
  useEvent
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
import { useIsFocused } from '@react-navigation/native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import ReactNativeHapticFeedback from "react-native-haptic-feedback";

import {
  TopHeader,
  WrapSearchBar,
  WrapContent,
  FiltProductsContainer,
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
import { PageBanner } from '../PageBanner'
import { NavBack } from 'ordering-ui-react-native/src/components/OrderDetails/styles';

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
    handleUpdateProfessionals,
    handleChangeProfessionalSelected,
    onBusinessClick,
    businessSingleId,
    productModal
  } = props

  const insets = useSafeAreaInsets()
  const theme = useTheme();
  const [, t] = useLanguage()
  const [{ auth }] = useSession()
  const [orderState, { addProduct, updateProduct }] = useOrder()
  const [{ parsePrice }] = useUtils()
  const [, { showToast }] = useToast()
  const [{ configs }] = useConfig()
  const [events] = useEvent()
  const isFocused = useIsFocused();
  const isPreOrder = configs?.preorder_status_enabled?.value === '1'

  const isChewLayout = theme?.header?.components?.layout?.type === 'chew'
  const showLogo = !theme?.business_view?.components?.header?.components?.business?.components?.logo?.hidden
  const hideBusinessNearCity = theme?.business_view?.components?.near_business?.hidden ?? true
  const backgroundColor = theme?.business_view?.components?.style?.backgroundColor
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
      padding: 10,
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
  const [searchBarHeight, setSearchBarHeight] = useState(60)
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [viewedCategory, setViewedCategory] = useState<any>(null)
  const [showTitle, setShowTitle] = useState(false)

  const isCheckoutMultiBusinessEnabled: Boolean = configs?.checkout_multi_business_enabled?.value === '1'
  const isQuickAddProduct = configs?.add_product_with_one_click?.value === '1'
  const openCarts = (Object.values(orderState?.carts)?.filter((cart: any) => cart?.products && cart?.products?.length && cart?.status !== 2 && cart?.valid_schedule && cart?.valid_products && cart?.valid_address && cart?.valid_maximum && cart?.valid_minimum && !cart?.wallets) || null) || []
  const currentCart: any = Object.values(orderState.carts).find((cart: any) => cart?.business?.slug === business?.slug) ?? {}
  const isOpenFiltProducts = isOpenSearchBar && !!searchValue
  const filtProductsHeight = Platform.OS === 'ios' ? 65 : 30
  const viewOrderButtonVisible = !loading && auth && currentCart?.products?.length > 0 && categoryState.products.length !== 0

  const onRedirect = (route: string, params?: any) => {
    navigation.navigate(route, params)
  }
  const vibrateApp = (impact?: string) => {
    const options = {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false
    };
    ReactNativeHapticFeedback.trigger(impact || "impactLight", options);
  }
  const onProductClick = async (product: any) => {
    if (product.ingredients?.length === 0 && product.extras.length === 0 && !product.inventoried && auth && isQuickAddProduct) {
      const isProductAddedToCart = currentCart?.products?.find((Cproduct: any) => Cproduct.id === product.id)
      const productQuantity = isProductAddedToCart?.quantity
      const minimumPerOrder = product?.minimum_per_order || 1
      const addCurrentProduct = {
        ...product,
        quantity: minimumPerOrder
      }
      const updateCurrentProduct = {
        name: product?.name,
        id: product.id,
        code: isProductAddedToCart?.code,
        quantity: productQuantity + 1
      }
      vibrateApp()
      const cartData = currentCart?.business_id ? currentCart : { business_id: business.id }
      if (isProductAddedToCart) {
        await updateProduct(updateCurrentProduct, cartData, isQuickAddProduct)
      } else {
        await addProduct(addCurrentProduct, cartData, isQuickAddProduct)
      }
    } else {
      const productAddedToCartLength = currentCart?.products?.reduce((productsLength: number, Cproduct: any) => { return productsLength + (Cproduct?.id === product?.id ? Cproduct?.quantity : 0) }, 0) || 0
      if (product?.type === 'service' && business?.professionals?.length > 0) {
        setCurrentProduct(product)
        setOpenService(true)
        return
      }
      if (product?.enabled) {
        onRedirect('ProductDetails', {
          product: product,
          businessSlug: business.slug,
          businessId: business.id || product?.category?.business_id,
          productAddedToCartLength,
          isRedirect: false
        })
      } else {
        showToast(ToastType.Error, t('PRODUCT_NOT_FOUND', 'Product not found'))
      }
    }
    events.emit('product_clicked', product)
  }

  const handleCancel = () => {
    setIsOpenSearchBar(false)
    handleChangeSearch('')
  }

  const handleUpsellingPage = (cart: any) => {
    const isProductCartParam = !!cart?.products?.length
    setOpenUpselling(false)
    setCanOpenUpselling(false)
    const cartsAvailable: any = Object.values(orderState?.carts)
      ?.filter((_cart: any) => _cart?.valid && _cart?.status !== 2 && _cart?.products?.length)
      ?.filter((_c: any) => !isProductCartParam ? _c.uuid !== cart?.uuid : _c)
    if (cartsAvailable.length === 1 || !isCheckoutMultiBusinessEnabled) {
      const cart = isCheckoutMultiBusinessEnabled ? cartsAvailable[0] : currentCart

      props.onNavigationRedirect('CheckoutNavigator', {
        screen: 'CheckoutPage',
        cartUuid: cart?.uuid,
        businessLogo: cart?.business?.logo,
        businessName: cart?.business?.name,
        cartTotal: cart?.total,
        fromProductsList: true
      })
    } else {
      const groupKeys: any = {}
      cartsAvailable.forEach((_cart: any) => {
        groupKeys[_cart?.group?.uuid]
          ? groupKeys[_cart?.group?.uuid] += 1
          : groupKeys[_cart?.group?.uuid ?? 'null'] = 1
      })

      if (
        (Object.keys(groupKeys).length === 1 && Object.keys(groupKeys)[0] === 'null') ||
        Object.keys(groupKeys).length > 1
      ) {
        props.onNavigationRedirect('CheckoutNavigator', {
          screen: 'MultiCheckout',
          checkCarts: true
        }, true)
      } else {
        props.onNavigationRedirect('CheckoutNavigator', {
          screen: 'MultiCheckout',
          cartUuid: cartsAvailable[0]?.group?.uuid
        }, true)
      }
    }
  }

  const handleCloseUpsellingPage = () => {
    setOpenUpselling(false)
  }

  const [selectedCategoryId, setSelectedCategoryId] = useState<any>(null)

  const handlePageScroll = useCallback(({ nativeEvent }: any) => {
    const scrollOffset = nativeEvent.contentOffset.y
    setShowTitle(scrollOffset > 30)

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
    navigation?.canGoBack() && !props.fromMulti ? navigation.goBack() : navigation.navigate('BottomTab')
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

  useEffect(() => {
    if (!isFocused) {
      handleChangeSearch('')
      setIsOpenSearchBar(false)
    }
  }, [isFocused])


  useEffect(() => {
    function onKeyboardDidShow(e: KeyboardEvent) {
      setKeyboardHeight(e?.endCoordinates?.height);
    }

    function onKeyboardDidHide() {
      setKeyboardHeight(0);
    }

    const showSubscription = Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
    const hideSubscription = Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const subtotalWithTaxes = currentCart?.taxes?.reduce((acc: any, item: any) => {
    if (item?.type === 1)
      return acc = acc + item?.summary?.tax
    return acc = acc
  }, currentCart?.subtotal)

  const onChangeSearch = (query: any) => {
    handleChangeSearch(query)
    if (query) {
      events.emit('products_searched', query)
    }
  }

  useEffect(() => {
    let categoryId: any = null
    if (business?.lazy_load_products_recommended) {
      if (categorySelected?.id) {
        categoryId = categorySelected.id
      }
    } else {
      if (selectedCategoryId) {
        const originCategoryId = selectedCategoryId.replace('cat_', '')
        if (!isNaN(originCategoryId)) {
          categoryId = Number(originCategoryId)
        }
      }
    }
    if (categoryId) {
      const _viewedCategory = business.categories.find(category => category.id === categoryId)
      if (_viewedCategory?.id !== viewedCategory?.id) {
        setViewedCategory(_viewedCategory)
        events.emit('product_list_viewed', _viewedCategory)
      }
    } else {
      if (business.categories) {
        const categoryAll: any = {}
        categoryAll.business_id = business.id
        categoryAll.id = null
        categoryAll.name = 'All'
        events.emit('product_list_viewed', categoryAll)
      }
    }
  }, [business?.lazy_load_products_recommended, selectedCategoryId, categorySelected?.id, viewedCategory])

  useEffect(() => {
    const handleArrowBack: any = () => {
      navigation.goBack()
      return true
    }
    BackHandler.addEventListener('hardwareBackPress', handleArrowBack);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleArrowBack);
    }
  }, [])

  useEffect(() => {
    if (!business && !loading && !error) {
      showToast(ToastType.Error, t('BUSINESS_NOT_FOUND', 'Business not found'))
      navigation.navigate('BusinessList')
    }
  }, [business, error, loading])

  useEffect(() => {
    if (productModal?.product && !productModal?.loading && !productModal?.error) {
      onProductClick(props?.productModal?.product)
    }
  }, [productModal])

  return (
    <>
      <View style={{ flex: 1, backgroundColor: backgroundColor }}>
        <Animated.View style={{ position: 'relative' }}>
          <TopHeader
            style={{
              marginTop: Platform.OS === 'ios' ? insets.top : 0
            }}
            onLayout={(event: any) => setSearchBarHeight(event.nativeEvent.layout.height)}
            hideArrow={(businessSingleId && auth)}
          >
            {!isOpenSearchBar && (
              <>
                {!(businessSingleId && auth) && (
                  <TopActions onPress={() => handleBackNavigation()}>
                    <AntDesignIcon
                      name='arrowleft'
                      size={26}
                    />
                  </TopActions>
                )}
                {showTitle && (
                  <OText
                    size={16}
                    style={{ flex: 1, textAlign: 'center' }}
                    weight={Platform.OS === 'ios' ? '600' : 'bold'}
                    numberOfLines={2}
                    ellipsizeMode='tail'
                  >
                    {business?.name}
                  </OText>
                )}
                {!errorQuantityProducts && (
                  <View style={{ ...styles.headerItem }}>
                    <TouchableOpacity
                      onPress={() => setIsOpenSearchBar(true)}
                      style={styles.searchIcon}
                    >
                      <OIcon src={theme.images.general.search} color={theme.colors.textNormal} width={20} />
                    </TouchableOpacity>
                  </View>
                )}
              </>
            )}
            {isOpenSearchBar && (
              <WrapSearchBar>
                <SearchBar
                  autoFocus
                  onSearch={onChangeSearch}
                  onCancel={() => handleCancel()}
                  isCancelXButtonShow
                  noBorderShow
                  placeholder={t('SEARCH_PRODUCTS', 'Search Products')}
                  lazyLoad
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
            style={{
              height: Dimensions.get('window').height - filtProductsHeight - keyboardHeight - (keyboardHeight > 0 && viewOrderButtonVisible ? 10 : 0),
              top: Platform.OS === 'ios' ? viewOrderButtonVisible ? (searchBarHeight - 10) + insets.top + 10 : (searchBarHeight - 10) + insets.top : searchBarHeight,
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
                businessSingleId={businessSingleId}
              />
            </View>
          </FiltProductsContainer>
        )}
        <ScrollView
          stickyHeaderIndices={[business?.professionals?.length > 0 ? 4 : 3]}
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
                handleUpdateProfessionals={handleUpdateProfessionals}
              />
            </ProfessionalFilterWrapper>
          )}
          {businessState?.business?.id && (
            <PageBanner position='app_business_page' businessId={businessState?.business?.id} navigation={navigation} />
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
                style={{ paddingHorizontal: 20 }}
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
                  businessSingleId={businessSingleId}
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
          {isOpenFiltProducts && (
            <BackgroundGray isIos={Platform.OS === 'ios'} />
          )}
        </ScrollView>
        {viewOrderButtonVisible && (
          <View style={{ marginBottom: 0 }}>
            <FloatingButton
              btnText={
                openUpselling
                  ? t('LOADING', 'Loading')
                  : subtotalWithTaxes >= currentCart?.minimum
                    ? t('VIEW_ORDER', 'View Order')
                    : `${t('MINIMUN_SUBTOTAL_ORDER', 'Minimum subtotal order:')} ${parsePrice(currentCart?.minimum)}`
              }
              isSecondaryBtn={subtotalWithTaxes < currentCart?.minimum || openUpselling}
              btnLeftValueShow={subtotalWithTaxes >= currentCart?.minimum && currentCart?.products?.length > 0}
              btnRightValueShow={subtotalWithTaxes >= currentCart?.minimum && currentCart?.products?.length > 0}
              btnLeftValue={currentCart?.products.reduce((prev: number, product: any) => prev + product.quantity, 0)}
              btnRightValue={parsePrice(currentCart?.total)}
              disabled={subtotalWithTaxes < currentCart?.minimum || openUpselling}
              handleClick={() => {
                Vibration.vibrate(100)
                setOpenUpselling(true)
              }}
            />
          </View>
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
      </View>
      <OModal
        open={openService}
        onClose={() => setOpenService(false)}
        entireModal
      >
        <ServiceForm
          navigation={navigation}
          product={currentProduct}
          businessSlug={business?.slug}
          businessId={business?.id}
          professionalList={business?.professionals}
          professionalSelected={professionalSelected}
          handleChangeProfessional={handleChangeProfessionalSelected}
          handleUpdateProfessionals={handleUpdateProfessionals}
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
    isForceSearch: Platform.OS === 'ios',
    isApp: true,
    isFetchAllProducts: true,
    UIComponent: BusinessProductsListingUI
  }
  return (
    <BusinessAndProductList {...businessProductslistingProps} />
  )
}
