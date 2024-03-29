import React, { useState, useEffect } from 'react'
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import {
  BusinessAndProductList,
  useLanguage,
  useOrder,
  useSession,
  useUtils,
  useToast,
  ToastType
} from 'ordering-components/native'
import { OButton, OText } from '../shared'
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
    businessId,
    categoryId,
    productId,
    getNextProducts,
    handleChangeCategory,
    setProductLogin,
    updateProductModal,
  } = props

  const theme = useTheme()
  const [, t] = useLanguage()
  const [{ auth }] = useSession()
  const [orderState] = useOrder()
  const [{ parsePrice }] = useUtils()
  const [ ,{showToast}] = useToast()
  const { business, loading, error } = businessState
  const [openBusinessInformation, setOpenBusinessInformation] = useState(false)
  const [isOpenSearchBar, setIsOpenSearchBar] = useState(false)
  const [curProduct, setCurProduct] = useState(null)
  const [openUpselling, setOpenUpselling] = useState(false)
  const [canOpenUpselling, setCanOpenUpselling] = useState(false)
  const [openModalProduct,setOpenModalProduct] = useState(false)
  const currentCart: any = Object.values(orderState.carts).find((cart: any) => cart?.business?.slug === business?.slug) ?? {}

  const onRedirect = (route: string, params?: any) => {
    navigation.navigate(route, params)
  }

  const onProductClick = (product: any) => {
    onRedirect('ProductDetails', {
			product: product,
      businessSlug: business.slug,
      businessId: business.id,
      categoryId: categoryId,
      productId: productId,
		})
  }

  const handleCancel = () => {
    setIsOpenSearchBar(false)
    handleChangeSearch('')
  }

  const handleCloseProductModal = () => {
    setCurProduct(null)
    setOpenModalProduct(false)
    updateProductModal && updateProductModal(null)
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

  useEffect(() => {
    if(businessId && categoryId && productId){
      setOpenModalProduct(true)
    }
  }, [])

  const handleScroll = ({ nativeEvent }: any) => {
    const y = nativeEvent.contentOffset.y
    const height = nativeEvent.contentSize.height
    const hasMore = !(categoryState.pagination.totalPages === categoryState.pagination.currentPage)
    if (y + PIXELS_TO_SCROLL > height && !loading && hasMore && getNextProducts) {
      getNextProducts()
      showToast(ToastType.Info, t('LOADING_MORE_PRODUCTS', 'Loading more products'))
    }
  }

  return (
    <>
      <BusinessProductsListingContainer
        style={styles.mainContainer}
        isActiveFloatingButtom={currentCart?.products?.length > 0 && categoryState.products.length !== 0}
        onScroll={(e: any) => handleScroll(e)}
      >
        <WrapHeader>
          {!loading && business?.id && (
            <TopHeader>
              {!isOpenSearchBar && (
                <>
                  <View style={{ ...styles.headerItem, flex: 1 }}>
                    <OButton
                      imgLeftSrc={theme.images.general.arrow_left}
                      imgRightSrc={null}
                      style={styles.btnBackArrow}
                      onClick={() => (navigation?.canGoBack() && navigation.goBack()) || (auth && navigation.navigate('BottomTab'))}
                      imgLeftStyle={{ tintColor: '#fff' }}
                    />
                    <AddressInput
                      onPress={() => auth
                        ? onRedirect('AddressList', { isGoBack: true, isFromProductsList: true })
                        : onRedirect('AddressForm', { address: orderState.options?.address })}
                    >
                      <OText color={theme.colors.white} numberOfLines={1}>
                        {orderState?.options?.address?.address}
                      </OText>
                    </AddressInput>
                  </View>
                  {!errorQuantityProducts && (
                    <View style={{ ...styles.headerItem }}>
                      <TouchableOpacity
                        onPress={() => setIsOpenSearchBar(true)}
                        style={styles.searchIcon}
                      >
                        <MaterialIcon
                          name='search'
                          color={theme.colors.white}
                          size={25}
                        />
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
          )}
          <BusinessBasicInformation
            businessState={businessState}
            openBusinessInformation={openBusinessInformation}
            header={header}
            logo={logo}
          />
        </WrapHeader>
        {!loading && business?.id && (
          <>
            {!(business?.categories?.length === 0) && (
              <BusinessProductsCategories
                categories={[{ id: null, name: t('ALL', 'All') }, { id: 'featured', name: t('FEATURED', 'Featured') }, ...business?.categories?.sort((a: any, b: any) => a.rank - b.rank)]}
                categorySelected={categorySelected}
                onClickCategory={handleChangeCategory}
                featured={featuredProducts}
                openBusinessInformation={openBusinessInformation}
              />
            )}
            <WrapContent>
              <BusinessProductsList
                categories={[
                  { id: null, name: t('ALL', 'All') },
                  { id: 'featured', name: t('FEATURED', 'Featured') },
                  ...business?.categories?.sort((a: any, b: any) => a.rank - b.rank)
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
            currentCart?.subtotal_to_calculate >= currentCart?.minimum
              ? !openUpselling ? t('VIEW_ORDER', 'View Order') : t('LOADING', 'Loading')
              : `${t('MINIMUN_SUBTOTAL_ORDER', 'Minimum subtotal order:')} ${parsePrice(currentCart?.minimum)}`
          }
          isSecondaryBtn={currentCart?.subtotal_to_calculate < currentCart?.minimum}
          btnLeftValueShow={currentCart?.subtotal_to_calculate >= currentCart?.minimum && !openUpselling && currentCart?.products?.length > 0}
          btnRightValueShow={currentCart?.subtotal_to_calculate >= currentCart?.minimum && !openUpselling && currentCart?.products?.length > 0}
          btnLeftValue={currentCart?.products?.length}
          btnRightValue={parsePrice(currentCart?.total)}
          disabled={openUpselling || currentCart?.subtotal_to_calculate < currentCart?.minimum}
          handleClick={() => setOpenUpselling(true)}
        />
      )}
      {openUpselling && (
        <UpsellingProducts
          setOpenUpselling={setOpenUpselling}
          businessId={currentCart?.business_id}
          business={currentCart?.business}
          cartProducts={currentCart?.products}
          handleUpsellingPage={handleUpsellingPage}
          openUpselling={openUpselling}
          canOpenUpselling={canOpenUpselling}
          setCanOpenUpselling={setCanOpenUpselling}
          onRedirect={onRedirect}
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
    marginVertical: 15,
    marginHorizontal: 20,
  },
  btnBackArrow: {
    borderWidth: 0,
    color: '#FFF',
    backgroundColor: 'rgba(0,0,0,0.3)',
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
    isForceSearch: Platform.OS === 'ios',
    UIComponent: BusinessProductsListingUI
  }
  return (
    <BusinessAndProductList {...businessProductslistingProps} />
  )
}
