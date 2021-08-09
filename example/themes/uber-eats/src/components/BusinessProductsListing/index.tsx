import React, { useState } from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import {
  BusinessAndProductList,
  useLanguage,
  useOrder,
  useSession,
  useUtils,
  useConfig
} from 'ordering-components/native'
import { OModal, OText } from '../../../../../components/shared'
import { OBottomPopup } from '../shared'
import { BusinessBasicInformation } from '../BusinessBasicInformation'
import { SearchBar } from '../SearchBar'
import { BusinessProductsCategories } from '../../../../../components/BusinessProductsCategories'
import { BusinessProductsList } from '../BusinessProductsList'
import { BusinessProductsListingParams } from '../../../../../types'
import { OrderTypeSelector } from '../OrderTypeSelector'
import { FloatingButton } from '../FloatingButton'
import { ProductForm } from '../ProductForm'
import { BusinessInformation } from '../../../../../components/BusinessInformation'
import { useTheme } from 'styled-components/native'
import { Cart } from '../Cart'
import Animated from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import {
  WrapHeader,
  TopHeader,
  AddressInput,
  WrapSearchBar,
  WrapContent,
  BusinessProductsListingContainer,
  WrapperOrderTypeSelector,
  WrapBusinesssProductsCategories
} from './styles'

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
    isCartOnProductsList
  } = props

  const theme = useTheme()

  const styles = StyleSheet.create({
    mainContainer: {
      flex: 1
    },
    headerItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 15,
      marginHorizontal: 20,
    },
    iconBtn: {
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 0,
      width: 40,
      height: 40,
      color: '#FFF',
      backgroundColor: theme.colors.white,
      borderRadius: 25,
    },
    searchIcon: {
      borderWidth: 0,
      color: '#FFF',
      backgroundColor: 'rgba(0,0,0,0.3)',
      borderRadius: 24,
      padding: 15,
      justifyContent: 'center'
    },
    modalTitleSectionStyle: {
      position: 'absolute',
      width: '100%',
      top: 0,
      zIndex: 100
    }
  })

  const [, t] = useLanguage()
  const [{ auth }] = useSession()
  const [orderState] = useOrder()
  const [{ parsePrice }] = useUtils()
  const [{ configs }] = useConfig()

  const { business, loading, error } = businessState
  const [openBusinessInformation, setOpenBusinessInformation] = useState(false)
  const [isOpenSearchBar, setIsOpenSearchBar] = useState(false)
  const [curProduct, setCurProduct] = useState(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
	const [isStickyCategory, setStickyCategory] = useState(false)

  const configTypes = configs?.order_types_allowed?.value.split('|').map((value: any) => Number(value)) || []
  const currentCart: any = Object.values(orderState.carts).find((cart: any) => cart?.business?.slug === business?.slug) ?? {}

  const { top } = useSafeAreaInsets();

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

  const handlerProductAction = () => {
    handleCloseProductModal()
  }

  const handlePageScroll = (event: any) => {
		const y = event?.nativeEvent?.contentOffset?.y || 0;
		if (y > 30 && !isStickyCategory) {
			setStickyCategory(true);
		} else if (y < 19 && isStickyCategory) {
			setStickyCategory(false);
		}
	}

  return (
    <>
      <Animated.View style={{ flex: 1, position: 'absolute', width: '100%', top: top, zIndex: 100 }}>
	      {!loading && business?.id && (
          <TopHeader bgWhite={isStickyCategory}>
            <View style={{ ...styles.headerItem, flex: 1 }}>
              <TouchableOpacity
                onPress={() => (navigation?.canGoBack() && navigation.goBack()) || (auth && navigation.navigate('BottomTab'))}
                style={styles.iconBtn}
              >
                <MaterialComIcon
                  name='arrow-left'
                  color={theme.colors.black}
                  size={24}
                />
              </TouchableOpacity>
              {isStickyCategory ? (
                <OText size={20} color={theme.colors.black} numberOfLines={1} style={{ flex: 1, paddingHorizontal: 15 }}>
                  {business?.name}
                </OText>
              ) : (
                <AddressInput
                  onPress={() => auth
                    ? onRedirect('AddressList', { isGoBack: true, isFromProductsList: true })
                    : onRedirect('AddressForm', { address: orderState.options?.address })}
                >
                  <OText color={theme.colors.black} numberOfLines={1} style={{ paddingHorizontal: 15 }}>
                    {orderState?.options?.address?.address}
                  </OText>
                </AddressInput>
              )}
              <TouchableOpacity
                onPress={() => setOpenBusinessInformation(true)}
                style={styles.iconBtn}
              >
                <MaterialComIcon
                  name='dots-horizontal'
                  color={theme.colors.black}
                  size={24}
                />
              </TouchableOpacity>
            </View>
          </TopHeader>
        )}
			</Animated.View>
      <BusinessProductsListingContainer
        stickyHeaderIndices={[2]}
        style={{ ...styles.mainContainer, marginTop: isStickyCategory ? 60 : 0 }}
        isActiveFloatingButtom={currentCart?.products?.length > 0 && categoryState.products.length !== 0}
        onScroll={handlePageScroll}
        scrollEventThrottle={14}
      >
        <WrapHeader>
          <BusinessBasicInformation
            businessState={businessState}
            header={header}
            logo={logo}
          />
        </WrapHeader>
        {!isOpenSearchBar ? (
          <WrapperOrderTypeSelector>
            <OrderTypeSelector configTypes={configTypes} />
            {!errorQuantityProducts && (
              <TouchableOpacity
                onPress={() => setIsOpenSearchBar(true)}
              >
                <MaterialIcon
                  name='search'
                  color={theme.colors.black}
                  size={25}
                />
              </TouchableOpacity>
            )}
          </WrapperOrderTypeSelector>
        ) : (
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

        {!loading && business?.id && (
          <WrapBusinesssProductsCategories>
            {!(business?.categories?.length === 0) && (
              <BusinessProductsCategories
                categories={[{ id: null, name: t('ALL', 'All') }, { id: 'featured', name: t('FEATURED', 'Featured') }, ...business?.categories.sort((a: any, b: any) => a.rank - b.rank)]}
                categorySelected={categorySelected}
                onClickCategory={handleChangeCategory}
                featured={featuredProducts}
              />
            )}
          </WrapBusinesssProductsCategories>
        )}
        
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
        {loading && !error && (
          <>
            <BusinessProductsCategories
              categories={[]}
              categorySelected={categorySelected}
              onClickCategory={handleChangeCategory}
              featured={featuredProducts}
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
              ? !isCartOpen
                ? `${t('VIEW_CART', 'View cart')}`
                : t('LOADING', 'Loading')
              : `${t('MINIMUN_SUBTOTAL_ORDER', 'Minimum subtotal order:')} ${parsePrice(currentCart?.minimum)}`
          }
          isSecondaryBtn={currentCart?.subtotal < currentCart?.minimum}
          btnLeftValueShow={currentCart?.subtotal >= currentCart?.minimum && !isCartOpen && currentCart?.products?.length > 0}
          btnRightValueShow={currentCart?.subtotal >= currentCart?.minimum && !isCartOpen && currentCart?.products?.length > 0}
          btnLeftValue={currentCart?.products?.length}
          btnRightValue={parsePrice(currentCart?.total)}
          disabled={isCartOpen || currentCart?.subtotal < currentCart?.minimum}
          handleClick={() => setIsCartOpen(true)}
        />
      )}
      <OBottomPopup
        customHeaderShow
        open={isCartOpen}
        title={business?.name}
        onClose={() => setIsCartOpen(false)}
      >
        {!loading && auth && currentCart?.products?.length > 0 && (
          <Cart
            isForceOpenCart
            isBusinessCart
            cart={currentCart}
            isCartPending={currentCart?.status === 2}
            isProducts={currentCart.products.length}
            isCartOnProductsList={isCartOnProductsList && currentCart?.products?.length > 0}
            handleCartOpen={(val: any) => setIsCartOpen(val)}
            onNavigationRedirect={onRedirect}
          />
        )}
      </OBottomPopup>
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
        titleSectionStyle={styles.modalTitleSectionStyle}
        open={openBusinessInformation}
        onClose={() => setOpenBusinessInformation(false)}
        styleCloseButton={{color: theme.colors.white, backgroundColor: 'rgba(0,0,0,0.3)'}}
        isNotDecoration
      >
        <BusinessInformation
          businessState={businessState}
          business={business}
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
