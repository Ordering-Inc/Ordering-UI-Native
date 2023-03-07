import React, { useEffect, useState } from 'react'
import { useLanguage, BusinessSearchList, useOrder, useUtils, useEvent, showToast, ToastType } from 'ordering-components/native'
import { ScrollView, StyleSheet, TouchableOpacity, View, Dimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from 'styled-components/native'
import { HeaderTitle, OButton, OModal, OText } from '../shared'
import { SearchBar } from '../SearchBar';
import { NotFoundSource } from '../NotFoundSource'
import { SingleProductCard } from '../SingleProductCard'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import {
  SearchWrapper,
  ProductsList,
  SingleBusinessSearch,
  BusinessInfo,
  BusinessInfoItem,
  Metadata,
  SingleBusinessContainer,
  TagsContainer,
  SortContainer,
  BrandContainer,
  BrandItem,
  PriceFilterWrapper,
  BContainer,
  WrapperButtons
} from './styles'
import FastImage from 'react-native-fast-image'
import { convertHoursToMinutes } from '../../utils'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder'
import { BusinessSearchParams } from '../../types'
import { useIsFocused } from '@react-navigation/native';
import { MaxSectionItem } from './MaxSectionItem'
import { IOScrollView } from 'react-native-intersection-observer'

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
    handleUpdateProducts
  } = props

  const screenHeight = Dimensions.get('window').height;
  const screenWidth = Dimensions.get('window').width;
  const theme = useTheme()
  const [orderState] = useOrder()
  const [events] = useEvent()
  const { top } = useSafeAreaInsets();
  const [, t] = useLanguage()
  const [{ parsePrice, parseDistance, optimizeImage }] = useUtils();

  const [openFilters, setOpenFilters] = useState(false)
  const noResults = (!businessesSearchList.loading && !businessesSearchList.lengthError && businessesSearchList?.businesses?.length === 0)
  const maxDeliveryFeeOptions = [15, 25, 35, 'default']
  // const maxProductPriceOptions = [5, 10, 15, 'default']
  const maxDistanceOptions = [1000, 2000, 5000, 'default']
  const maxTimeOptions = [5, 15, 30, 'default']
  const sortItems = [
    { text: t('PICKED_FOR_YOU', 'Picked for you (default)'), value: 'distance' },
    { text: t('DELIVERY_TIME', 'Delivery time'), value: 'delivery_time' },
    { text: t('PICKUP_TIME', 'Pickup time'), value: 'pickup_time' }
  ]

  const isChewLayout = theme?.header?.components?.layout?.type?.toLowerCase() === 'chew'
  const hideBrowse = theme?.bar_menu?.components?.browse?.hidden

  const priceList = [
    { level: '1', content: '$' },
    { level: '2', content: '$$' },
    { level: '3', content: '$$$' },
    { level: '4', content: '$$$$' },
    { level: '5', content: '$$$$$' }
  ]

  const isFocused = useIsFocused();

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 40,
      width: '100%'
    },
    filterContainer: {
      maxHeight: screenHeight - 150,
      paddingHorizontal: 40,
      width: '100%'
    },
    searchInput: {
      fontSize: 12,
      height: 44
    },
    productsContainer: {
      marginTop: 20
    },
    businessTypesContainer: {
      width: '100%',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center'
    },
    priceContainer: {
      width: '100%',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between'
    },
    categoryStyle: {
      marginRight: 10,
      marginTop: 10,
      borderRadius: 50,
      paddingHorizontal: 10,
      paddingVertical: 4,
      paddingLeft: 0,
      paddingRight: 0,
      height: 28,
      borderWidth: 0
    },
    priceItem: {
      marginRight: 10,
      marginTop: 10,
      borderRadius: 50,
      paddingVertical: 4,
      paddingLeft: 5,
      paddingRight: 5,
      height: 27,
      borderWidth: 0
    },
    applyButton: {
      paddingHorizontal: 10,
      width: '100%',
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

  return (
    <IOScrollView
      onScroll={(e: any) => handleScroll(e)}
      showsVerticalScrollIndicator={false}
    >
      <View style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: hideBrowse && !isChewLayout ? 40 : 20,
      }}>
        {hideBrowse && !isChewLayout && (
          <OButton
            imgLeftStyle={{ width: 18 }}
            imgRightSrc={null}
            style={{
              borderWidth: 0,
              width: 26,
              height: 26,
              backgroundColor: '#FFF',
              borderColor: '#FFF',
              shadowColor: '#FFF',
              paddingLeft: 0,
              paddingRight: 0,
              marginTop: 50,
            }}
            onClick={() => props.navigation.goBack()}
            icon={AntDesignIcon}
            iconProps={{
              name: 'arrowleft',
              size: 26
            }}
          />
        )}
        <HeaderTitle ph={20} text={t('SEARCH', 'Search')} />
        <AntDesignIcon name='filter' size={18} style={{ marginLeft: 'auto', marginTop: 55, paddingHorizontal: 20 }} onPress={() => handleOpenfilters()} />
      </View>
      <BContainer
        style={{ paddingHorizontal: isChewLayout ? 20 : 40 }}
      >
        <SearchWrapper>
          <SearchBar
            lazyLoad
            {...(isChewLayout && { height: 55 })}
            inputStyle={{ ...styles.searchInput }}
            placeholder={t('SEARCH_BUSINESSES', 'Search Businesses')}
            onSearch={(val: string) => onChangeTermValue(val)}
            value={termValue}
          />
        </SearchWrapper>
        <OText size={12} lineHeight={20} color={theme.colors.textThird} mLeft={5}>
          {t('TYPE_AT_LEAST_2_CHARACTERS', 'Type at least 2 characters')}
        </OText>
        {
          noResults && (
            <View>
              <NotFoundSource
                content={t('NOT_FOUND_BUSINESSES', 'No businesses to delivery / pick up at this address, please change filters or change address.')}
              />
            </View>
          )
        }
        <ProductsList>
          {businessesSearchList.businesses?.filter((business: any) => business?.categories?.length > 0).map((business: any) => (
            <SingleBusinessSearch key={`card-${business?.id}`}>
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
                  textStyle={{ color: theme.colors.primary, fontSize: 10 }}
                  text={t('GO_TO_STORE', 'Go to store')}
                  bgColor='#F5F9FF'
                  borderColor='#fff'
                  style={{ borderRadius: 50, paddingLeft: 5, paddingRight: 5, height: 20 }}
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
          ))}
          {businessesSearchList?.loading && (
            <>
              {[...Array(3).keys()].map(
                (item, i) => (
                  <View key={`skeleton:${i}`} style={{ width: '100%', marginTop: 20 }}>
                    <Placeholder key={i} style={{ paddingHorizontal: 5 }} Animation={Fade}>
                      <View style={{ flexDirection: 'row' }}>
                        <PlaceholderLine
                          width={24}
                          height={70}
                          style={{ marginRight: 10, marginBottom: 10 }}
                        />
                        <Placeholder style={{ paddingVertical: 10 }}>
                          <PlaceholderLine width={20} style={{ marginBottom: 25 }} />
                          <PlaceholderLine width={60} />
                        </Placeholder>
                      </View>
                    </Placeholder>
                    <Placeholder style={{ paddingHorizontal: 5, bottom: 10 }} Animation={Fade}>
                      <View style={{ flexDirection: 'row-reverse', overflow: 'hidden' }}>
                        <PlaceholderLine
                          width={24}
                          height={70}
                          style={{ marginRight: 10, marginBottom: 5 }}
                        />
                        <Placeholder style={{ paddingVertical: 10 }}>
                          <PlaceholderLine width={60} height={10} />
                          <PlaceholderLine width={50} height={10} />
                          <PlaceholderLine width={70} height={10} />
                        </Placeholder>
                      </View>
                    </Placeholder>
                  </View>
                ),
              )}
            </>
          )}
        </ProductsList>
        <OModal
          open={openFilters}
          onCancel={() => handleCloseFilters()}
          onClose={() => handleCloseFilters()}
        >
          <ScrollView style={styles.filterContainer}>
            <OText
              size={20}
              mBottom={15}
              style={{ marginTop: 10 }}
            >
              {t('FILTER', 'Filter')}
            </OText>
            <SortContainer>
              <OText weight='bold' mBottom={7} size={16}>
                {t('SORT', 'Sort')}
              </OText>
              {sortItems?.filter(item => !(orderState?.options?.type === 1 && item?.value === 'pickup_time') && !(orderState?.options?.type === 2 && item?.value === 'delivery_time'))?.map(item => (
                <TouchableOpacity
                  key={item?.value}
                  onPress={() => handleChangeFilters('orderBy', item?.value)}
                  style={{ marginBottom: 7 }}
                >
                  <OText
                    weight={filters?.orderBy?.includes(item?.value) ? 'bold' : '500'}
                    mBottom={filters?.orderBy?.includes(item?.value) ? 5 : 0}
                  >
                    {item?.text}  {(filters?.orderBy?.includes(item?.value)) && <>{filters?.orderBy?.includes('-') ? <AntDesignIcon name='caretup' /> : <AntDesignIcon name='caretdown' />}</>}
                  </OText>
                </TouchableOpacity>
              ))}
            </SortContainer>
            <BrandContainer>
              <OText
                size={16}
                weight='bold'
                lineHeight={24}
                style={{ marginBottom: 10 }}
              >
                {t('BRANDS', 'Brands')}
              </OText>
              {!brandList?.loading && !brandList?.error && brandList?.brands?.length > 0 && (
                <ScrollView
                  style={{ maxHeight: 300, marginBottom: 10 }}
                  showsVerticalScrollIndicator={true}
                  nestedScrollEnabled={true}
                >
                  {brandList?.brands.map((brand: any, i: number) => brand?.enabled && (
                    <BrandItem
                      key={i}
                      onPress={() => handleChangeBrandFilter(brand?.id)}
                    >
                      <OText
                        size={14}
                        weight={'400'}
                        lineHeight={24}
                      >
                        {brand?.name}
                      </OText>
                      {filters?.franchise_ids?.includes(brand?.id) && (
                        <AntDesignIcon
                          name='check'
                          color={theme.colors.success500}
                          size={16}
                        />
                      )}
                    </BrandItem>
                  ))}
                </ScrollView>
              )}
              {!brandList?.loading && ((brandList?.brands?.filter((brand: any) => brand?.enabled))?.length === 0) && (
                <OText size={14} weight='400'>{t('NO_RESULTS_FOUND', 'Sorry, no results found')}</OText>
              )}
            </BrandContainer>
            <PriceFilterWrapper>
              <OText
                size={16}
                weight='bold'
                lineHeight={24}
                style={{ marginBottom: 5 }}
              >
                {t('PRICE_RANGE', 'Price range')}
              </OText>
              <View style={styles.priceContainer}>
                {priceList.map((price: any, i: number) => (
                  <OButton
                    key={i}
                    bgColor={(filters?.price_level === price?.level) ? theme.colors.primary : theme.colors.backgroundGray200}
                    onClick={() => handleChangePriceRange(price?.level)}
                    text={`${price.content} ${(filters?.price_level === price?.level) ? ' X' : ''}`}
                    style={styles.priceItem}
                    textStyle={{ fontSize: 10, color: (filters?.price_level === price?.level) ? theme.colors.backgroundLight : theme.colors.textNormal }}
                  />
                ))}
              </View>
            </PriceFilterWrapper>
            {orderState?.options?.type === 1 && (
              <MaxSectionItem
                filters={filters}
                title={t('MAX_DELIVERY_FEE', 'Max delivery fee')}
                options={maxDeliveryFeeOptions}
                filter='max_delivery_price'
                handleChangeFilters={handleChangeFilters}
              />
            )}
            {[1, 2].includes(orderState?.options?.type) && (
              <MaxSectionItem
                filters={filters}
                title={orderState?.options?.type === 1 ? t('MAX_DELIVERY_TIME', 'Max delivery time') : t('MAX_PICKUP_TIME', 'Max pickup time')}
                options={maxTimeOptions}
                filter='max_eta'
                handleChangeFilters={handleChangeFilters}
              />
            )}
            <MaxSectionItem
              filters={filters}
              title={t('MAX_DISTANCE', 'Max distance')}
              options={maxDistanceOptions}
              filter='max_distance'
              handleChangeFilters={handleChangeFilters}
            />
            {businessTypes?.length > 0 && (
              <TagsContainer>
                <OText weight='bold' mBottom={7} size={16}>{t('BUSINESS_CATEGORIES', 'Business categories')}</OText>
                <View style={styles.businessTypesContainer}>
                  {businessTypes.map((type: any, i: number) => type.enabled && (
                    <OButton
                      key={type?.id}
                      bgColor={(filters?.business_types?.includes(type?.id) || (type?.id === null && filters?.business_types?.length === 0)) ? theme.colors.primary : theme.colors.backgroundGray200}
                      onClick={() => handleChangeActiveBusinessType(type)}
                      text={`${t(`BUSINESS_TYPE_${type.name.replace(/\s/g, '_').toUpperCase()}`, type.name)} ${filters?.business_types?.includes(type?.id) ? 'X' : ''}`}
                      style={styles.categoryStyle}
                      textStyle={{ fontSize: 10, color: (filters?.business_types?.includes(type?.id) || (type?.id === null && filters?.business_types?.length === 0)) ? '#fff' : theme.colors.textNormal }}
                    />
                  ))}
                </View>
              </TagsContainer>
            )}
          </ScrollView>
          <WrapperButtons>
            <View style={{ width: '50%' }}>
              <OButton
                text={t('APPLY', 'Apply')}
                parentStyle={styles.applyButton}
                textStyle={{ color: '#fff' }}
                onClick={() => handleApplyFilters()}
              />
            </View>
            <View style={{ width: '50%' }}>
              <OButton
                text={t('CLEAR_FILTERS', 'Clear')}
                bgColor={theme.colors.white}
                borderColor={theme.colors.primary}
                parentStyle={styles.applyButton}
                textStyle={{ color: theme.colors.primary }}
                onClick={() => clearFilters()}
              />
            </View>
          </WrapperButtons>
        </OModal>
      </BContainer>
    </IOScrollView>
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
