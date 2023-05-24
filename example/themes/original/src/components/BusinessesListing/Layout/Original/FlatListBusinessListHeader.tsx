import React from 'react'
import {
    useLanguage,
    useSession,
    useOrder,
    useConfig,
    useUtils
} from 'ordering-components/native';
import { Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { OIcon, OModal, OText } from '../../../shared'
import { useTheme } from 'styled-components/native';
import { OrderProgress } from '../../../OrderProgress';
import { useIsFocused } from '@react-navigation/native';
import {
	Search,
	OrderControlContainer,
	AddressInput,
	WrapMomentOption,
	HeaderWrapper,
	ListWrapper,
	FeaturedWrapper,
	FarAwayMessage,
	AddressInputContainer,
	PreorderInput,
	OrderTypesContainer
} from './styles';
import { BusinessFeaturedController } from '../../../BusinessFeaturedController';
import { HighestRatedBusinesses } from '../../../HighestRatedBusinesses';
import { PageBanner } from '../../../PageBanner';
import { NotFoundSource } from '../../../NotFoundSource';
import { BusinessTypeFilter } from '../../../BusinessTypeFilter';
import { OrderTypeSelector } from '../../../OrderTypeSelector';
import { getTypesText } from '../../../../utils';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { CitiesControl } from '../../../CitiesControl';

export const FlatListBusinessListHeader = (props: any) => {
    const {
        navigation,
        businessesList,
        handleChangeBusinessType,
        handleBusinessClick,
        businessId,
        isGuestUser,
        citiesState,
        enabledPoweredByOrdering,
        orderTypeValue,
        setIsOpenCities,
        allCitiesDisabled,
        featuredBusiness,
        favoriteIds,
        setFavoriteIds,
        setOrderTypeValue,
        isFarAway,
        isOpenCities,
        handleChangeCity
    } = props

    const theme = useTheme()
    const [{ user, auth }] = useSession()
    const [orderState] = useOrder()
    const [{ configs }] = useConfig()
    const isFocused = useIsFocused()
    const [, t] = useLanguage()
    const [{ parseDate }] = useUtils();
    const { top } = useSafeAreaInsets();

    const hideCities = (theme?.business_listing_view?.components?.cities?.hidden || orderState?.options?.type !== 2 || allCitiesDisabled) ?? true
    const hideHero = theme?.business_listing_view?.components?.business_hero?.hidden
    const hidePreviousOrders = theme?.business_listing_view?.components?.previous_orders_block?.hidden
    const hideHighestBusiness = theme?.business_listing_view?.components?.highest_rated_business_block?.hidden
    const isAllCategoriesHidden = theme?.business_listing_view?.components?.categories?.hidden
    const bgHeader = theme?.business_listing_view?.components?.business_hero?.components?.image
    const bgHeaderHeight = theme?.business_listing_view?.components?.business_hero?.components?.style?.height
    const isChewLayout = theme?.header?.components?.layout?.type?.toLowerCase() === 'chew'

    const chewOrderTypes = [{ name: t('DELIVERY', 'Delivery').toUpperCase(), value: 1 }, { name: t('PICKUP', 'Pickup').toUpperCase(), value: 2 }]
    const isPreOrderSetting = configs?.preorder_status_enabled?.value === '1'
    const isPreorderEnabled = (configs?.preorder_status_enabled?.value === '1' || configs?.preorder_status_enabled?.value === 'true') &&
        Number(configs?.max_days_preorder?.value) > 0
    const configTypes =
        configs?.order_types_allowed?.value
            .split('|')
            .map((value: any) => Number(value)) || [];

    const styles = StyleSheet.create({
        container: {
            marginBottom: 0,
        },
        welcome: {
            flex: 1,
            flexDirection: 'row',
        },
        inputStyle: {
            backgroundColor: theme.colors.inputDisabled,
            flex: 1,
        },
        wrapperOrderOptions: {
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 10,
            zIndex: 100,
        },
        borderStyle: {
            borderColor: theme.colors.backgroundGray,
            borderWidth: 1,
            borderRadius: 10,
        },
        searchInput: {
            fontSize: 16,
            backgroundColor: theme.colors.white,
            paddingLeft: 10,
            paddingTop: 7
        },
        iconStyle: {
            fontSize: 18,
            color: theme.colors.warning5,
            marginRight: 8
        },
        farAwayMsg: {
            paddingVertical: 6,
            paddingHorizontal: 20
        },
        inputContainerStyles: {
            backgroundColor: theme.colors.white,
            borderColor: theme.colors.backgroundGray,
            borderWidth: 1,
        },
        buttonCityStyle: {
            backgroundColor: theme.colors.white,
            borderColor: theme.colors.backgroundGray,
            borderRadius: 8,
            marginHorizontal: 40,
            minHeight: 45,
            paddingVertical: 5,
            paddingHorizontal: 20,
            borderWidth: 1,
            justifyContent: 'center'
        },
        businessSkeleton: {
            borderRadius: 8,
            marginRight: 20,
            width: 56,
            height: 56
        },
    });

    const handleMomentClick = () => {
        if (isPreorderEnabled) {
            navigation.navigate('MomentOption')
        }
    }

    return (
        <>
            {enabledPoweredByOrdering && auth && (
                <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', top: 20 }}>
                    <OText>
                        Powered By Ordering.co
                    </OText>
                </View>
            )}
            <View style={{
                height: !isPreOrderSetting && isChewLayout ? 150 : isChewLayout ? 200 : isFarAway ? 150 : 100,
                marginTop: isChewLayout ? 0 : Platform.OS == 'ios' ? 0 : 50,
                backgroundColor: isChewLayout ? theme?.colors?.chew : theme.colors?.white
            }}
            >
                {isChewLayout && (
                    <View style={{ marginTop: 30, paddingHorizontal: 30, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <OText size={24} weight={700} color={theme.colors?.white}>
                            {t('WELCOME', 'Welcome')} {user?.name}
                        </OText>
                    </View>
                )}
                <Search isChewLayout={isChewLayout}>
                    <AddressInput
                        isChewLayout={isChewLayout}
                        onPress={() =>
                            auth
                                ? navigation.navigate('AddressList', { isFromBusinesses: true })
                                : navigation.navigate('AddressForm', {
                                    address: orderState.options?.address,
                                    isFromBusinesses: true,
                                    isGuestUser: isGuestUser
                                })
                        }>
                        <AddressInputContainer isChewLayout={isChewLayout}>
                            <OIcon
                                src={theme.images.general.pin}
                                color={theme.colors.disabled}
                                width={16}
                                style={{ marginRight: isChewLayout ? 0 : 10 }}
                            />
                            <OText size={12} numberOfLines={1} style={{ flex: 1 }}>
                                {orderState?.options?.address?.address || t('WHAT_IS_YOUR_ADDRESS', 'What\'s your address?')}
                            </OText>
                            {!isChewLayout && (
                                <OIcon
                                    src={theme.images.general.arrow_down}
                                    width={10}
                                    style={{ marginStart: 8 }}
                                />
                            )}
                        </AddressInputContainer>
                    </AddressInput>
                </Search>
                {isFarAway && !isChewLayout && (
                    <FarAwayMessage style={styles.farAwayMsg}>
                        <Ionicons name='md-warning-outline' style={styles.iconStyle} />
                        <OText size={12} numberOfLines={1} ellipsizeMode={'tail'} color={theme.colors.textNormal}>{t('YOU_ARE_FAR_FROM_ADDRESS', 'You are far from this address')}</OText>
                    </FarAwayMessage>
                )}
                {!isChewLayout ? (
                    <OrderControlContainer>
                        <View style={styles.wrapperOrderOptions}>
                            {isPreOrderSetting && (
                                <WrapMomentOption
                                    onPress={() => handleMomentClick()}>
                                    <OText
                                        size={12}
                                        numberOfLines={1}
                                        ellipsizeMode="tail"
                                        color={theme.colors.textSecondary}>
                                        {orderState.options?.moment
                                            ? parseDate(orderState.options?.moment, { outputFormat: configs?.dates_moment_format?.value })
                                            : t('ASAP_ABBREVIATION', 'ASAP')}
                                    </OText>
                                    {isPreorderEnabled && (
                                        <OIcon
                                            src={theme.images.general.arrow_down}
                                            width={10}
                                            style={{ marginStart: 8 }}
                                        />
                                    )}
                                </WrapMomentOption>
                            )}
                            <WrapMomentOption onPress={() => navigation.navigate('OrderTypes', { configTypes: configTypes, setOrderTypeValue })}>
                                <OText size={12} numberOfLines={1} ellipsizeMode={'tail'} color={theme.colors.textSecondary}>{t(getTypesText(orderTypeValue || orderState?.options?.type || 1), 'Delivery')}</OText>
                                <OIcon
                                    src={theme.images.general.arrow_down}
                                    width={10}
                                    style={{ marginStart: 8 }}
                                />
                            </WrapMomentOption>
                        </View>
                    </OrderControlContainer>
                ) : (
                    <>
                        {isPreOrderSetting && (
                            <View style={{ paddingHorizontal: 30 }}>
                                <PreorderInput
                                    isChewLayout={isChewLayout}
                                    onPress={() => handleMomentClick()}
                                >
                                    <OText color={theme.colors.textSecondary}>
                                        {orderState.options?.moment
                                            ? parseDate(orderState.options?.moment, { outputFormat: configs?.dates_moment_format?.value })
                                            : t('ASAP_ABBREVIATION', 'ASAP')}</OText>
                                </PreorderInput>
                            </View>
                        )}
                    </>
                )}
            </View>
            {!isChewLayout ? (
                <>
                    {!hideHero ? (
                        <HeaderWrapper
                            source={bgHeader ? { uri: bgHeader } : theme.images.backgrounds.business_list_header}
                            style={{ paddingTop: top + 20 }}
                            resizeMode='cover'
                            bgHeaderHeight={bgHeaderHeight}
                        >
                            {!auth && (
                                <TouchableOpacity onPress={() => navigation?.canGoBack() && navigation.goBack()} style={{ position: 'absolute', marginStart: 40, paddingVertical: 20 }}>
                                    <OIcon src={theme.images.general.arrow_left} color={theme.colors.textNormal} />
                                </TouchableOpacity>
                            )}
                        </HeaderWrapper>
                    ) : (
                        <>
                            {!auth && (
                                <TouchableOpacity onPress={() => navigation?.canGoBack() && navigation.goBack()} style={{ position: 'absolute', marginStart: 40, paddingVertical: 20 }}>
                                    <OIcon src={theme.images.general.arrow_left} color={theme.colors.textNormal} />
                                </TouchableOpacity>
                            )}
                        </>
                    )}
                </>
            ) : (
                <OrderTypesContainer>
                    <OrderTypeSelector
                        handleChangeBusinessType={handleChangeBusinessType}
                        isChewLayout
                        chewOrderTypes={chewOrderTypes}
                        handleChangeType={setOrderTypeValue}
                    />
                </OrderTypesContainer>
            )}

            {!hideCities && orderTypeValue === 2 && (
                <View style={{ marginTop: 20 }}>
                    <TouchableOpacity
                        style={styles.buttonCityStyle}
                        onPress={() => setIsOpenCities(true)}
                        disabled={orderState?.loading}
                    >
                        <OText size={18} color={theme.colors.backgroundGray} weight='bold' style={{ textAlign: 'center' }}>
                            {citiesState?.cities?.find((city: any) => city?.id === orderState?.options?.city_id)?.name || t('FILTER_BY_CITY', 'Filter by city')}
                        </OText>
                    </TouchableOpacity>
                </View>
            )}
            {!hidePreviousOrders && (
                <OrderProgress
                    {...props}
                    isFocused={isFocused}
                />
            )}
            {
                !businessId && !props.franchiseId && featuredBusiness && featuredBusiness.length > 0 && (
                    <FeaturedWrapper>
                        <OText size={16} style={{ marginLeft: 40 }} weight={Platform.OS === 'ios' ? '600' : 'bold'}>{t('BUSINESS_FEATURE', 'Featured business')}</OText>
                        <ScrollView
                            showsHorizontalScrollIndicator={false}
                            nestedScrollEnabled
                            horizontal
                            contentContainerStyle={{ paddingHorizontal: 40 }}
                        >
                            {featuredBusiness.map((bAry: any, idx: number) => (
                                <View key={'f-listing_' + idx}>
                                    <BusinessFeaturedController
                                        business={bAry[0]}
                                        isBusinessOpen={bAry[0]?.open}
                                        handleCustomClick={handleBusinessClick}
                                        orderType={orderState?.options?.type}
                                    />
                                    {bAry.length > 1 && (
                                        <BusinessFeaturedController
                                            business={bAry[1]}
                                            isBusinessOpen={bAry[1]?.open}
                                            handleCustomClick={handleBusinessClick}
                                            orderType={orderState?.options?.type}
                                        />
                                    )}
                                </View>
                            ))}
                        </ScrollView>
                    </FeaturedWrapper>
                )
            }
            {!isChewLayout && !hideHighestBusiness && (
                <>
                    <View style={{ height: 8, backgroundColor: theme.colors.backgroundGray100 }} />
                    {
                        !businessId && !props.franchiseId && (
                            <HighestRatedBusinesses
                                propsToFetch={props.propsToFetch}
                                onBusinessClick={handleBusinessClick}
                                navigation={navigation}
                                favoriteIds={favoriteIds}
                                setFavoriteIds={setFavoriteIds}
                            />
                        )
                    }
                </>
            )}
            <PageBanner position='app_business_listing' navigation={navigation} />
            <View style={{ height: 8, backgroundColor: theme.colors.backgroundGray100 }} />

            <ListWrapper style={{ paddingHorizontal: isChewLayout ? 20 : 40 }}>
                {!businessId && !isAllCategoriesHidden && (
                    <BusinessTypeFilter
                        images={props.images}
                        businessTypes={props.businessTypes}
                        defaultBusinessType={props.defaultBusinessType}
                        handleChangeBusinessType={handleChangeBusinessType}
                    />
                )}
                {!businessesList.loading && businessesList.businesses.length === 0 && businessesList?.fetched && (
                    <NotFoundSource
                        content={t(
                            'NOT_FOUND_BUSINESSES',
                            'No businesses to delivery / pick up at this address, please change filters or change address.',
                        )}
                    />
                )}
            </ListWrapper>
            <OModal
                open={isOpenCities}
                onClose={() => setIsOpenCities(false)}
                title={t('SELECT_A_CITY', 'Select a city')}
            >
                <CitiesControl
                    cities={citiesState?.cities}
                    onClose={() => setIsOpenCities(false)}
                    handleChangeCity={handleChangeCity}
                />
            </OModal>
        </>
    )
}
