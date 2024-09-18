import React, { useEffect, useMemo, useState } from 'react'
import { useLanguage, BusinessSearchList, useOrder, useUtils, useEvent, showToast, ToastType } from 'ordering-components/native'
import { ScrollView, StyleSheet, Dimensions, FlatList } from 'react-native'
import { useTheme } from 'styled-components/native'
import { OButton, OText } from '../shared'

import { SingleProductCard } from '../SingleProductCard'
import {
  SingleBusinessSearch,
  BusinessInfo,
  BusinessInfoItem,
  Metadata,
  SingleBusinessContainer,
  BContainer,
} from './styles'
import FastImage from 'react-native-fast-image'
import { convertHoursToMinutes } from '../../utils'
import { BusinessSearchParams } from '../../types'
import { useIsFocused } from '@react-navigation/native';

import { BusinessSearchHeader } from './BusinessSearchHeader'
import { BusinessSearchFooter } from './BusinessSearchFooter'

const PIXELS_TO_SCROLL = 1000

export const BusinessListingSearchUI = (props: BusinessSearchParams) => {
  const {
    navigation,
    businessesSearchList,
    onBusinessClick,
    handleChangeTermValue,
    termValue,
    handleSearchbusinessAndProducts,
    handleChangeFilters,
    filters,
    businessTypes,
    setFilters,
    brandList,
    paginationProps,
    handleUpdateProducts
  } = props

  const screenWidth = Dimensions.get('window').width;
  const theme = useTheme()
  const [orderState] = useOrder()
  const [events] = useEvent()
  const [, t] = useLanguage()
  const [{ parsePrice, parseDistance, optimizeImage }] = useUtils();

  const [openFilters, setOpenFilters] = useState(false)

  const isFocused = useIsFocused();

  const styles = StyleSheet.create({
    productsContainer: {
      marginTop: 20
    }
  });

  const handleOpenfilters = () => {
    setOpenFilters(true)
  }

  const handleCloseFilters = () => {
    clearFilters()
    setOpenFilters(false)
  }

  const clearFilters = () => {
    setFilters({ business_types: [], orderBy: 'default', franchise_ids: [], price_level: null })
  }

  const handleChangeActiveBusinessType = (type: any) => {
    if (type?.id === null) {
      handleChangeFilters('business_types', [])
      return
    }
    if (filters?.business_types?.includes(type?.id)) {
      const arrayAux = filters?.business_types
      const index = arrayAux?.indexOf(type?.id)
      arrayAux.splice(index, 1)
      handleChangeFilters('business_types', arrayAux)
    } else {
      handleChangeFilters('business_types', [...filters?.business_types, type?.id])
    }
  }

  const handleChangeBrandFilter = (brandId: number) => {
    let franchiseIds = [...filters?.franchise_ids]
    if (filters?.franchise_ids?.includes(brandId)) franchiseIds = filters?.franchise_ids?.filter((item: any) => item !== brandId)
    else franchiseIds.push(brandId)
    handleChangeFilters && handleChangeFilters('franchise_ids', franchiseIds)
  }

  const handleChangePriceRange = (value: string) => {
    if (value === filters?.price_level) handleChangeFilters('price_level', null)
    else handleChangeFilters('price_level', value)
  }

  const handleApplyFilters = () => {
    handleSearchbusinessAndProducts(true)
    setOpenFilters(false)
  }

  const isInteger = (val: any) => Number.isInteger(Number(val)) && !!val


  const onProductClick = (business: any, categoryId: any, productId: any, product: any) => {
    if (!isInteger(business?.id) ||
      !isInteger(categoryId) ||
      !isInteger(productId) ||
      !business.slug || !business.header || !business.logo) {
      showToast(ToastType.error, t('NOT_AVAILABLE', 'Not Available'))
      return
    }
    const currentCart: any = Object.values(orderState.carts).find((cart: any) => cart?.business?.slug === business?.slug) ?? {}
    const productAddedToCartLength = currentCart?.products?.reduce((productsLength: number, Cproduct: any) => { return productsLength + (Cproduct?.id === productId ? Cproduct?.quantity : 0) }, 0) || 0
    navigation.navigate('ProductDetails', {
      isRedirect: 'business',
      businessId: business?.id,
      categoryId: categoryId,
      productId: productId,
      product: product,
      business: {
        store: business.slug,
        header: business.header,
        logo: business.logo,
      },
      productAddedToCartLength
    })
  }

  const handleScroll = ({ nativeEvent }: any) => {
    const y = nativeEvent.contentOffset.y;
    const height = nativeEvent.contentSize.height;
    const hasMore = !(
      paginationProps.totalPages === paginationProps.currentPage
    );

    if (y + PIXELS_TO_SCROLL > height && !businessesSearchList.loading && hasMore && businessesSearchList?.businesses?.length > 0) {
      handleSearchbusinessAndProducts();
    }
  };

  const onChangeTermValue = (query: any) => {
    handleChangeTermValue(query)
    if (query) {
      events.emit('products_searched', query)
    }
  }

  useEffect(() => {
    if (filters.business_types?.length === 0 && filters.orderBy === 'default' && Object.keys(filters)?.length === 2 && !openFilters) {
      handleSearchbusinessAndProducts(true)
    }
  }, [filters, openFilters])

  useEffect(() => {
    handleSearchbusinessAndProducts(true)
  }, [])


  useEffect(() => {
    handleChangeTermValue('')
  }, [isFocused])

  const businessFiltered = useMemo(() => {
    return businessesSearchList.businesses?.filter((business: any) => business?.categories?.length > 0)
  }, [businessesSearchList.businesses])

  return (
    <>
      <FlatList
        data={businessFiltered}
        ListFooterComponent={<BusinessSearchFooter
          businessesSearchList={businessesSearchList}
          handleCloseFilters={handleCloseFilters}
          handleChangeFilters={handleChangeFilters}
          brandList={brandList}
          filters={filters}
          handleChangeBrandFilter={handleChangeBrandFilter}
          handleChangePriceRange={handleChangePriceRange}
          businessTypes={businessTypes}
          handleApplyFilters={handleApplyFilters}
          clearFilters={clearFilters}
          handleChangeActiveBusinessType={handleChangeActiveBusinessType}
          openFilters={openFilters}
        />}
        ListHeaderComponent={<BusinessSearchHeader
          businessesSearchList={businessesSearchList}
          onChangeTermValue={onChangeTermValue}
          termValue={termValue}
          handleOpenfilters={handleOpenfilters}
        />}
        onScroll={(e: any) => handleScroll(e)}
        showsVerticalScrollIndicator={false}
        keyExtractor={(business: any, index: number) => `card-${business?.id}-${index}`}
        renderItem={({ item: business }: any) => (
          <BContainer
            style={{ paddingHorizontal: 20, paddingTop: 0, paddingBottom: 0 }}
          >
            <SingleBusinessSearch>
              <SingleBusinessContainer>
                <BusinessInfo>
                  {(business?.logo || theme.images?.dummies?.businessLogo) && (
                    <FastImage
                      style={{ height: 48, width: 48 }}
                      source={{
                        uri: optimizeImage(business?.logo, 'h_120,c_limit'),
                        priority: FastImage.priority.normal,
                      }}
                      resizeMode={FastImage.resizeMode.cover}
                    />
                  )}
                </BusinessInfo>
                <BusinessInfoItem>
                  <OText size={12}>{business?.name}</OText>
                  <Metadata>
                    {orderState?.options?.type === 1 && (
                      <>
                        <OText size={10}>{t('DELIVERY_FEE', 'Delivery fee')}{' '}</OText>
                        <OText size={10} mRight={3}>
                          {business && parsePrice(business?.delivery_price)}
                        </OText>
                      </>
                    )}
                    <OText size={10} mRight={3}>
                      {convertHoursToMinutes(orderState?.options?.type === 1 ? business?.delivery_time : business?.pickup_time)}
                    </OText>
                    <OText size={10}>
                      {parseDistance(business?.distance)}
                    </OText>
                  </Metadata>
                </BusinessInfoItem>
                <OButton
                  onClick={() => onBusinessClick(business)}
                  textStyle={{ fontSize: 10 }}
                  text={t('GO_TO_STORE', 'Go to store')}
                  style={{
                    borderRadius: 23,
                    paddingLeft: 10,
                    paddingRight: 10,
                    height: 23,
                    shadowOpacity: 0,
                    borderWidth: 0
                  }}
                />
              </SingleBusinessContainer>
              <ScrollView horizontal style={styles.productsContainer} contentContainerStyle={{ flexGrow: 1 }}>
                {business?.categories?.map((category: any) => category?.products?.map((product: any, i: number) => (
                  <SingleProductCard
                    key={product?.id}
                    isSoldOut={(product.inventoried && !product.quantity)}
                    product={product}
                    enableIntersection={false}
                    businessId={business?.id}
                    onProductClick={(product: any) => onProductClick(business, category?.id, product?.id, product)}
                    productAddedToCartLength={0}
                    handleUpdateProducts={(productId: number, changes: any) => handleUpdateProducts(productId, category?.id, business?.id, changes)}
                    style={{
                      width: screenWidth - (category?.products?.length > 1 ? 120 : 80),
                      maxWidth: screenWidth - (category?.products?.length > 1 ? 120 : 80),
                      marginRight: 20
                    }}
                  />
                )))}
              </ScrollView>
            </SingleBusinessSearch>
          </BContainer>
        )}
      />
      {/* <IOScrollView
        onScroll={(e: any) => handleScroll(e)}
        showsVerticalScrollIndicator={false}
      >

      </IOScrollView> */}
    </>
  )
}

export const BusinessListingSearch = (props: BusinessSearchParams) => {
  const BusinessListSearchProps = {
    ...props,
    UIComponent: BusinessListingSearchUI,
    lazySearch: true
  }
  return <BusinessSearchList {...BusinessListSearchProps} />
}
