import React, { useState } from 'react'
import { useLanguage, useOrder } from 'ordering-components/native'
import { ScrollView, StyleSheet, TouchableOpacity, View, Dimensions } from 'react-native'
import { useTheme } from 'styled-components/native'
import { OButton, OModal, OText } from '../shared'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import {
    ProductsList,
    TagsContainer,
    SortContainer,
    BrandContainer,
    BrandItem,
    PriceFilterWrapper,
    BContainer,
    WrapperButtons
} from './styles'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder'
import { MaxSectionItem } from './MaxSectionItem'

export const BusinessSearchFooter = (props : any) => {
    const {
        businessesSearchList,
        handleCloseFilters,
        handleChangeFilters,
        brandList,
        filters,
        handleChangeBrandFilter,
        handleChangePriceRange,
        businessTypes,
        handleApplyFilters,
        clearFilters,
        handleChangeActiveBusinessType,
        openFilters
    } = props

    const screenHeight = Dimensions.get('window').height;
    const theme = useTheme()
    const [orderState] = useOrder()

    const [, t] = useLanguage()

    const maxDeliveryFeeOptions = [15, 25, 35, 'default']
    // const maxProductPriceOptions = [5, 10, 15, 'default']
    const maxDistanceOptions = [1000, 2000, 5000, 'default']
    const maxTimeOptions = [5, 15, 30, 'default']
    const sortItems = [
        { text: t('PICKED_FOR_YOU', 'Picked for you (default)'), value: 'distance' },
        { text: t('DELIVERY_TIME', 'Delivery time'), value: 'delivery_time' },
        { text: t('PICKUP_TIME', 'Pickup time'), value: 'pickup_time' }
    ]

    const priceList = [
        { level: '1', content: '$' },
        { level: '2', content: '$$' },
        { level: '3', content: '$$$' },
        { level: '4', content: '$$$$' },
        { level: '5', content: '$$$$$' }
    ]

    const styles = StyleSheet.create({
        container: {
            paddingHorizontal: 40,
            width: '100%'
        },
        filterContainer: {
            maxHeight: screenHeight - 150,
            paddingHorizontal: 20,
            width: '100%'
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

    return (
        <>
            <BContainer
                style={{ paddingHorizontal: 20 }}
            >
                <ProductsList>
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
            </BContainer>
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
        </>
    )
}
