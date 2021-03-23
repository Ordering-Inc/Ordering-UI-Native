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
import { OModal, OText } from '../shared'
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

  const currentCart: any = Object.values(orderState.carts).find((cart : any) => cart?.business?.slug === business?.slug) ?? {}

  const onRedirect = (route: string, params?: any) => {
    navigation.navigate(route, params)
  }

  const onProductClick = (product : any) => {
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

  return (
    <>
      <Spinner visible={loading} />
      <ScrollView style={styles.mainContainer}>
        {
          !loading && business?.id && (
            <>
              <WrapHeader>
                <TopHeader>
                  {!isOpenSearchBar && (
                    <>
                      <View style={styles.headerItem}>
                        <TouchableOpacity
                          onPress={() => navigation.goBack()}
                        >
                          <IconAntDesign
                            name='arrowleft'
                            color={colors.white}
                            size={25}
                            style={styles.BackIcon}
                          />
                        </TouchableOpacity>
                        <AddressInput onPress={() => auth ? onRedirect('AddressList') : onRedirect('AddressForm')}>
                          <OText color={colors.white} numberOfLines={1}>
                            {orderState?.options?.address?.address}
                          </OText>
                        </AddressInput>
                      </View>
                      <View style={styles.headerItem}>
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
                  categories={[{ id: null, name: t('ALL', 'All') }, { id: 'featured', name: t('FEATURED', 'Featured') }, ...business?.categories.sort((a : any, b : any) => a.rank - b.rank)]}
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
            currentCart?.products?.length > 0 ? t('VIEW_ORDER', 'View Order') : t('EMPTY_CART', 'Empty cart')
          }
          isSecondaryBtn={!(currentCart?.products?.length > 0)}
          btnLeftValueShow={currentCart?.products?.length > 0}
          btnRightValueShow={currentCart?.products?.length > 0}
          btnLeftValue={currentCart?.products?.length}
          btnRightValue={parsePrice(currentCart?.total)}
          disabled={currentCart?.subtotal < currentCart?.minimum || currentCart?.products?.length === 0}
          handleClick={() => onRedirect('CheckoutNavigator', { cartUuid: currentCart?.uuid })}
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
