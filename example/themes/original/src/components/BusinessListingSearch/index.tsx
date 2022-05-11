import React, { useEffect, useState } from 'react'
import { useLanguage, BusinessSearchList, useOrder, useUtils } from 'ordering-components/native'
import { ScrollView, StyleSheet, TouchableOpacity, Platform, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from 'styled-components/native'
import { OButton, OIcon, OModal, OText } from '../shared'
import { SearchBar } from '../SearchBar';
import { BusinessController } from '../BusinessController'
import { NotFoundSource } from '../NotFoundSource'
import { SingleProductCard } from '../SingleProductCard'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import {
  SearchWrapper,
  WrapHeader,
  ProductsList,
  SingleBusinessSearch,
  BusinessInfo,
  BusinessInfoItem,
  Metadata,
  SingleBusinessContainer,
  LoadMoreBusinessContainer,
  ProgressContentWrapper,
  ProgressBar,
  TagsContainer,
  SortContainer
} from './styles'
import FastImage from 'react-native-fast-image'
import { convertHoursToMinutes } from '../../utils'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder'
import { BusinessSearchParams } from '../../types'

export const BusinessListingSearchUI = (props : BusinessSearchParams) => {

  const {
    navigation,
    businessesSearchList,
    onBusinessClick,
    handleChangeTermValue,
    termValue,
    paginationProps,
    handleSearchbusinessAndProducts,
    handleChangeFilters,
    filters,
    businessTypes,
    setFilters
  } = props

  const theme = useTheme()
  const [orderState] = useOrder()
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

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 40,
      width: '100%'
    },
    searchInput: {
      fontSize: 10,
    },
    productsContainer: {
      marginTop: 20
    },
    maxContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    businessTypesContainer: {
      width: '100%',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center'
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
    applyButton: {
      paddingHorizontal: 40,
      width: '100%',
      marginTop: 20
    }
  });

  const handleOpenfilters = () => {
    setOpenFilters(true)
  }

  const handleCloseFilters = () => {
    setFilters({ business_types: [], orderBy: 'default' })
    setOpenFilters(false)
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

  const handleApplyFilters = () => {
    handleSearchbusinessAndProducts(true)
    setOpenFilters(false)
  }

  useEffect(() => {
    if (filters.business_types?.length === 0 && filters.orderBy === 'default' && Object.keys(filters)?.length === 2 && !openFilters) {
      handleSearchbusinessAndProducts(true)
    }
  }, [filters, openFilters])

  useEffect(() => {
    handleSearchbusinessAndProducts(true)
  }, [])

  const MaxSectionItem = ({ title, options, filter }: any) => {
    const parseValue = (option: number) => {
      return filter === 'max_distance'
        ? `${option / 1000} ${t('KM', 'Km')}`
        : filter === 'max_eta'
          ? `${option} ${t('MIN', 'min')}`
          : parsePrice(option)
    }
    return (
      <View style={{ marginBottom: 20 }}>
        <OText weight='bold' mBottom={10} size={16}>
          {title}
        </OText>
        <ProgressContentWrapper>
          <ProgressBar style={{ width: `${((options.indexOf(filters?.[filter]) / 3) * 100) ?? 100}%` }} />
        </ProgressContentWrapper>
        <View style={styles.maxContainer}>
          {options.map((option: any, i: number) => (
            <TouchableOpacity
              onPress={() => handleChangeFilters(filter, option)}
              key={option}
            >
              <OText
                size={12}
                weight={filters?.[filter] === option || (option === 'default' && (filters?.[filter] === 'default' || !filters?.[filter])) ? 'bold' : '500'}
              >
                {option === 'default' ? `${parseValue(options[i - 1])}+` : parseValue(option)}
              </OText>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <WrapHeader style={{ paddingTop: top + 20, marginVertical: 2 }}>
        <TouchableOpacity onPress={() => navigation?.canGoBack() && navigation.goBack()} style={{ position: 'absolute', paddingVertical: 20 }}>
          <OIcon src={theme.images.general.arrow_left} width={20} />
        </TouchableOpacity>
        <OText
          size={20}
          mBottom={15}
          weight='bold'
          style={{ marginTop: 10 }}
        >
          {t('SEARCH', 'Search')}
        </OText>
      </WrapHeader>
      <SearchWrapper>
        <SearchBar
          lazyLoad
          inputStyle={{ ...styles.searchInput, ...Platform.OS === 'ios' ? {} : { paddingBottom: 4 } }}
          placeholder={`${t('SEARCH_BUSINESSES', 'Search Businesses')} / ${t('TYPE_AT_LEAST_3_CHARACTERS', 'type at least 3 characters')}`}
          onSearch={(val: string) => handleChangeTermValue(val)}
          value={termValue}
          iconCustomRight={<AntDesignIcon name='filter' size={16} style={{ bottom: 2 }} onPress={() => handleOpenfilters()} />}
        />

      </SearchWrapper>
      {
        noResults && (
          <View>
            <NotFoundSource
              content={t('NOT_FOUND_BUSINESSES', 'No businesses to delivery / pick up at this address, please change filters or change address.')}
            />
          </View>
        )
      }
      <ScrollView horizontal>
        {businessesSearchList.businesses?.length > 0 && businessesSearchList.businesses.map((business: any, i: number) => (
          <BusinessController
            key={business.id}
            business={business}
            isBusinessOpen={business.open}
            handleCustomClick={() => onBusinessClick(business)}
            orderType={orderState?.options?.type}
            style={{ width: 320, marginRight: (businessesSearchList.loading || i !== businessesSearchList.businesses?.length - 1) ? 20 : 0 }}
          />
        ))}
        {!businessesSearchList.loading && paginationProps?.totalPages && paginationProps?.currentPage < paginationProps?.totalPages && (
          <LoadMoreBusinessContainer>
            <OButton
              bgColor='transparent'
              borderColor={theme.colors.primary}
              onClick={() => handleSearchbusinessAndProducts()}
              text={t('LOAD_MORE_BUSINESS', 'Load more business')}
              textStyle={{ color: theme.colors.primary }}
            />
          </LoadMoreBusinessContainer>
        )}
        {businessesSearchList.loading && (
          <>
            {[
              ...Array(
                paginationProps.nextPageItems
                  ? paginationProps.nextPageItems
                  : 3,
              ).keys(),
            ].map((item, i) => (
              <Placeholder
                Animation={Fade}
                key={i}
                style={{ width: 320, marginRight: 20, marginTop: 20 }}>
                <View style={{ width: 320 }}>
                  <PlaceholderLine
                    height={155}
                    style={{ marginBottom: 20, borderRadius: 25 }}
                  />
                  <View style={{ paddingHorizontal: 10 }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <PlaceholderLine
                        height={25}
                        width={40}
                        style={{ marginBottom: 10 }}
                      />
                      <PlaceholderLine
                        height={25}
                        width={20}
                        style={{ marginBottom: 10 }}
                      />
                    </View>
                    <PlaceholderLine
                      height={20}
                      width={30}
                      style={{ marginBottom: 10 }}
                    />
                    <PlaceholderLine
                      height={20}
                      width={80}
                      style={{ marginBottom: 0 }}
                    />
                  </View>
                </View>
              </Placeholder>
            ))}
          </>
        )}
      </ScrollView>
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
            <ScrollView horizontal style={styles.productsContainer}>
              {business?.categories?.map((category: any) => category?.products?.map((product: any, i: number) => (
                <SingleProductCard
                  key={product?.id}
                  isSoldOut={(product.inventoried && !product.quantity)}
                  product={product}
                  businessId={business?.id}
                  onProductClick={() => { }}
                  productAddedToCartLength={0}
                  style={{ width: 320, marginRight: i === category?.products?.length - 1 ? 0 : 20 }}
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
                    <View style={{ flexDirection: 'row-reverse' }}>
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
        <ScrollView style={styles.container}>
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
          {orderState?.options?.type === 1 && (
            <MaxSectionItem
              title={t('MAX_DELIVERY_FEE', 'Max delivery fee')}
              options={maxDeliveryFeeOptions}
              filter='max_delivery_price'
            />
          )}
          {[1, 2].includes(orderState?.options?.type) && (
            <MaxSectionItem
              title={orderState?.options?.type === 1 ? t('MAX_DELIVERY_TIME', 'Max delivery time') : t('MAX_PICKUP_TIME', 'Max pickup time')}
              options={maxTimeOptions}
              filter='max_eta'
            />
          )}
          <MaxSectionItem
            title={t('MAX_DISTANCE', 'Max distance')}
            options={maxDistanceOptions}
            filter='max_distance'
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
        <OButton
          text={t('APPLY', 'Apply')}
          parentStyle={styles.applyButton}
          textStyle={{ color: '#fff' }}
          onClick={() => handleApplyFilters()}
        />
      </OModal>
    </ScrollView>
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
