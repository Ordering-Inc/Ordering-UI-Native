import React, { useState } from 'react'
import Spinner from 'react-native-loading-spinner-overlay'
import IconAntDesign from 'react-native-vector-icons/AntDesign'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

import {
  BusinessAndProductList,
  useLanguage,
  useOrder,
  useSession,
  useUtils
} from 'ordering-components/native'
import { OBottomPopup, OModal, OText } from '../shared'
import { BusinessBasicInformation } from '../BusinessBasicInformation'
import { SearchBar } from '../SearchBar'
import { BusinessProductsCategories } from '../BusinessProductsCategories'
import { BusinessProductsList } from '../BusinessProductsList'
import { BusinessProductsListingParams } from '../../types'
import { View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import {
  WrapHeader,
  TopHeader,
  AddressInput,
  WrapSearchBar,
  WrapContent
} from './styles'
import { colors } from '../../theme'
import { FloatingButton } from '../FloatingButton'
import { ProductForm } from '../ProductForm'
import { UpsellingProducts } from '../UpsellingProducts'
import { BusinessCategories } from '../BusinessTypeFilter/styles'
import { AddressForm } from '../AddressForm'
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
    featuredProducts
  } = props

  const [, t] = useLanguage()
  const [{ auth }] = useSession()
  const [orderState] = useOrder()
  const [{ parsePrice }] = useUtils()

  const { business, loading, error } = businessState
  const [openBusinessInformation, setOpenBusinessInformation] = useState(false)
  const [isOpenSearchBar, setIsOpenSearchBar] = useState(false)
  const [curProduct, setCurProduct] = useState(null)
  const [openUpselling, setOpenUpselling] = useState(false)
  const [canOpenUpselling, setCanOpenUpselling] = useState(false)
  const [isOpenAddressForm, setIsOpenAddressForm] = useState(false)

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
    onRedirect('CheckoutNavigator', { cartUuid: currentCart?.uuid })
    setOpenUpselling(false)
  }

  const handleCloseAddressForm = () => {
    setIsOpenAddressForm(false)
  }

  return (
    <>
      <ScrollView style={styles.mainContainer}>
        {loading && !error && (
          <>
            <BusinessBasicInformation
              businessState={{ business: {}, loading: true }}
              openBusinessInformation={openBusinessInformation}
            />
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
              />
            </WrapContent>
          </>
        )}
        {
          !loading && business?.id && (
            <>
              <WrapHeader>
                <TopHeader>
                  {!isOpenSearchBar && (
                    <>
                      <View style={{ ...styles.headerItem, flex: 1 }}>
                        <TouchableOpacity
                          onPress={() => navigation.goBack()}
                        >
                          <IconAntDesign
                            name='arrowleft'
                            color={colors.white}
                            style={{ backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 50, marginRight: 20 }}
                            size={25}
                          />
                        </TouchableOpacity>
                        <AddressInput onPress={() => auth ? onRedirect('AddressList', { isGoBack: true, isFromBusinesses: true }) : setIsOpenAddressForm(true)}>
                          <OText color={colors.white} numberOfLines={1}>
                            {orderState?.options?.address?.address}
                          </OText>
                        </AddressInput>
                      </View>
                      <View style={{ ...styles.headerItem, width: 30 }}>
                        <TouchableOpacity
                          onPress={() => setIsOpenSearchBar(true)}
                        >
                          <MaterialIcon
                            name='search'
                            color={colors.white}
                            size={25}
                          />
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                  {isOpenSearchBar && (
                    <WrapSearchBar>
                      <SearchBar
                        onSearch={handleChangeSearch}
                        onCancel={() => handleCancel()}
                        isCancelButtonShow
                        noBorderShow
                        placeholder={t('SEARCH_PRODUCTS', 'Search Products')}
                        lazyLoad={businessState?.business?.lazy_load_products_recommended}
                      />
                    </WrapSearchBar>
                  )}
                </TopHeader>
                <BusinessBasicInformation
                  businessState={businessState}
                />
              </WrapHeader>
              {!(business?.categories?.length === 0) && (
                <BusinessProductsCategories
                  categories={[{ id: null, name: t('ALL', 'All') }, { id: 'featured', name: t('FEATURED', 'Featured') }, ...business?.categories.sort((a: any, b: any) => a.rank - b.rank)]}
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
                />
              </WrapContent>
            </>
          )
        }
      </ScrollView>
      {!loading && auth && (
        <FloatingButton
          btnText={
            !(currentCart?.products?.length > 0)
              ? t('EMPTY_CART', 'Empty cart')
              : currentCart?.subtotal >= currentCart?.minimum
                ? !openUpselling ? t('VIEW_ORDER', 'View Order') : t('LOADING', 'Loading')
                : `${t('MINIMUN_SUBTOTAL_ORDER', 'Minimum subtotal order:')} ${parsePrice(currentCart?.minimum)}`
          }
          isSecondaryBtn={currentCart?.subtotal < currentCart?.minimum || !(currentCart?.products?.length > 0)}
          btnLeftValueShow={currentCart?.subtotal >= currentCart?.minimum && !openUpselling && currentCart?.products?.length > 0}
          btnRightValueShow={currentCart?.subtotal >= currentCart?.minimum && !openUpselling && currentCart?.products?.length > 0}
          btnLeftValue={currentCart?.products?.length}
          btnRightValue={parsePrice(currentCart?.total)}
          disabled={openUpselling || currentCart?.subtotal < currentCart?.minimum}
          handleClick={() => setOpenUpselling(true)}
        />
      )}
      <OModal open={!!curProduct} onClose={handleCloseProductModal} entireModal customClose>
        <ProductForm
          product={curProduct}
          businessSlug={business.slug}
          businessId={business.id}
          onClose={handleCloseProductModal}
          navigation={navigation}
          onSave={handlerProductAction}
        />
      </OModal>
      {isOpenAddressForm && (
        <OModal open={isOpenAddressForm} onClose={() => handleCloseAddressForm()} entireModal>
          <AddressForm
            isSelectedAfterAdd
            handleCloseAddressForm={() => handleCloseAddressForm()}
            address={orderState.options?.address}
          />
        </OModal>
      )}
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
    marginBottom: 50,
  },
  BackIcon: {
    paddingRight: 20,
  },
  headerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    marginHorizontal: 20,
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
