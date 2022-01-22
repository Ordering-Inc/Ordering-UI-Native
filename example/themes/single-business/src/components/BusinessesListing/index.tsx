import React, { useEffect, useState } from 'react';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
import Geolocation from '@react-native-community/geolocation'
import {
  View,
  StyleSheet,
  ScrollView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {
  BusinessList as BusinessesListingController,
  useLanguage,
  useSession,
  useOrder,
  useConfig,
  useUtils,
} from 'ordering-components/native';
import { useTheme } from 'styled-components/native';

import {
  Search,
  OrderControlContainer,
  AddressInput,
  WrapMomentOption,
  HeaderWrapper,
  ListWrapper,
  FeaturedWrapper,
  TopHeader,
  DropOptionButton,
  WrapSearchBar,
  FarAwayMessage
} from './styles';

import { SearchBar } from '../SearchBar';
import { OButton, OIcon, OText } from '../shared';
import { BusinessesListingParams } from '../../types';
import { NotFoundSource } from '../NotFoundSource';
import { BusinessTypeFilter } from '../BusinessTypeFilter';
import { BusinessController } from '../BusinessController';
import { OrderTypeSelector } from '../OrderTypeSelector';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BusinessFeaturedController } from '../BusinessFeaturedController';
import { getTypesText } from '../../utils';
import NavBar from '../NavBar';
import { getDistance } from '../../utils'
import Ionicons from 'react-native-vector-icons/Ionicons'

const PIXELS_TO_SCROLL = 1000;

const BusinessesListingUI = (props: BusinessesListingParams) => {
  const {
    navigation,
    businessesList,
    searchValue,
    getBusinesses,
    handleChangeBusinessType,
    handleBusinessClick,
    paginationProps,
    handleChangeSearch,
  } = props;

  const theme = useTheme();


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
      justifyContent: 'flex-start',
      marginBottom: 10,
      zIndex: 100,
    },
    borderStyle: {
      borderColor: theme.colors.backgroundGray,
      borderWidth: 1,
      borderRadius: 10,
    },
    searchInput: {
      fontSize: 12,
    },
    btnBackArrow: {
      borderWidth: 0,
      backgroundColor: theme.colors.clear,
      shadowColor: theme.colors.clear,
      paddingLeft: 40,
      paddingRight: 40
    },
    headerStyle: {
      height: 260,
      paddingHorizontal: 40
    },
    iconStyle: {
			fontSize: 18,
			color: theme.colors.warning5,
			marginRight: 8
		},
		farAwayMsg: {
			paddingVertical: 6,
			paddingHorizontal: 20
		}
  });


  const [, t] = useLanguage();
  const [{ user, auth }] = useSession();
  const [orderState] = useOrder();
  const [{ configs }] = useConfig();
  const [{ parseDate }] = useUtils();

  const { top } = useSafeAreaInsets();

  const [featuredBusiness, setFeaturedBusinesses] = useState(Array);
	const [isFarAway, setIsFarAway] = useState(false)

  const configTypes = configs?.order_types_allowed?.value.split('|').map((value: any) => Number(value)) || [];

  const handleScroll = ({ nativeEvent }: any) => {
    const y = nativeEvent.contentOffset.y;
    const height = nativeEvent.contentSize.height;
    const hasMore = !(
      paginationProps.totalPages === paginationProps.currentPage
    );

    if (y + PIXELS_TO_SCROLL > height && !businessesList.loading && hasMore) {
      getBusinesses();
    }
  };

  useEffect(() => {
    if (businessesList.businesses.length > 0) {
      const fb = businessesList.businesses.filter((b) => b.featured == true);
      const ary = [];
      while (fb.length > 0) {
        ary.push(fb.splice(0, 2));
      }
      setFeaturedBusinesses(ary);
    }
  }, [businessesList.businesses]);

  useEffect(() => {
		Geolocation.getCurrentPosition((pos) => {
      const crd = pos.coords
      const distance = getDistance(crd.latitude, crd.longitude, orderState?.options?.address?.location?.lat, orderState?.options?.address?.location?.lng)
      if (distance > 20) setIsFarAway(true)
			else setIsFarAway(false)
    }, (err) => {
      console.log(`ERROR(${err.code}): ${err.message}`)
    }, {
      enableHighAccuracy: true, timeout: 15000, maximumAge: 10000
    })
  }, [orderState?.options?.address?.location])

  return (
    <ScrollView
      style={styles.container}
      onScroll={(e) => handleScroll(e)}
      showsVerticalScrollIndicator={false}
    >
      <HeaderWrapper
        source={theme.images.backgrounds.business_list_header}
      >
        {!auth && (
          <TopHeader style={{ top: top }}>
            <NavBar
              style={{ paddingBottom: 0, marginLeft: 20, backgroundColor: 'transparent' }}
              btnStyle={{ backgroundColor: 'transparent' }}
              leftImageStyle={{ tintColor: theme.colors.white }}
              onActionLeft={() => navigation?.canGoBack() && navigation.goBack()}
            />
          </TopHeader>
        )}

        <AddressInput
          onPress={() => auth
            ? navigation.navigate('AddressList', { isFromBusinesses: true })
            : navigation.navigate('AddressForm', {
              address: orderState.options?.address,
              isFromBusinesses: true,
            })
          }
          style={{ marginTop: !auth ? 36 : 20 }}
          activeOpacity={0.8}
        >
          <OIcon src={theme.images.general.pin} width={16} color={theme.colors.textSecondary} />
          <OText color={theme.colors.textPrimary} numberOfLines={1} lineHeight={20} weight={Platform.OS === 'android' ? 'bold' : '600'} style={{ paddingStart: 10, flexBasis: '90%' }}>
            {orderState?.options?.address?.address}
          </OText>
        </AddressInput>
        {isFarAway && (
					<FarAwayMessage style={styles.farAwayMsg}>
						<Ionicons name='md-warning-outline' style={styles.iconStyle} />
						<OText size={12} numberOfLines={1} ellipsizeMode={'tail'} color={theme.colors.textNormal}>{t('YOU_ARE_FAR_FROM_ADDRESS', 'Your are far from this address')}</OText>
					</FarAwayMessage>
				)}
        <OrderControlContainer>
          <View style={styles.wrapperOrderOptions}>
            <DropOptionButton
              activeOpacity={0.7}
              onPress={() => navigation.navigate('OrderTypes', { configTypes: configTypes })}
            >
              <OText
                size={12}
                numberOfLines={1}
                ellipsizeMode={'tail'}
                color={theme.colors.textSecondary}
              >
                {t(getTypesText(orderState?.options?.type || 1), 'Delivery')}
              </OText>
              <OIcon
                src={theme.images.general.arrow_down}
                width={10}
                style={{ marginStart: 8 }}
              />
            </DropOptionButton>
            <DropOptionButton
              onPress={() => navigation.navigate('MomentOption')}>
              <OText
                size={12}
                numberOfLines={1}
                ellipsizeMode="tail"
                color={theme.colors.textSecondary}>
                {orderState.options?.moment
                  ? parseDate(orderState.options?.moment, {
                    outputFormat:
                      configs?.format_time?.value === '12'
                        ? 'MM/DD hh:mma'
                        : 'MM/DD HH:mm',
                  })
                  : t('ASAP_ABBREVIATION', 'ASAP')}
              </OText>
              <OIcon
                src={theme.images.general.arrow_down}
                width={10}
                style={{ marginStart: 8 }}
              />
            </DropOptionButton>
          </View>
        </OrderControlContainer>
      </HeaderWrapper>
      <WrapSearchBar>
        <SearchBar
          onSearch={handleChangeSearch}
          isCancelXButtonShow
          noBorderShow
          placeholder={t('SEARCH', 'Search')}
          lazyLoad
        />
      </WrapSearchBar>
      <View style={{ height: 8, backgroundColor: theme.colors.backgroundGray100 }} />
      {featuredBusiness && featuredBusiness.length > 0 && (
        <FeaturedWrapper>
          <OText size={16} style={{ marginLeft: 40 }} weight={Platform.OS === 'ios' ? '600' : 'bold'}>{t('FEATURED_BUSINESS', 'Featured business')}</OText>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled
            horizontal contentContainerStyle={{ paddingHorizontal: 40 }}>
            {featuredBusiness.map((bAry: any, idx) => (
              <View key={'f-listing_' + idx}>
                <BusinessFeaturedController
                  key={bAry[0].id}
                  business={bAry[0]}
                  handleCustomClick={handleBusinessClick}
                  orderType={orderState?.options?.type}
                />
                {bAry.length > 1 && (
                  <BusinessFeaturedController
                    key={bAry[1].id}
                    business={bAry[1]}
                    handleCustomClick={handleBusinessClick}
                    orderType={orderState?.options?.type}
                  />
                )}
              </View>
            ))}
          </ScrollView>
        </FeaturedWrapper>
      )}
      <View style={{ height: 8, backgroundColor: theme.colors.backgroundGray100 }} />
      <ListWrapper>
        <BusinessTypeFilter
          images={props.images}
          businessTypes={props.businessTypes}
          defaultBusinessType={props.defaultBusinessType}
          handleChangeBusinessType={handleChangeBusinessType}
        />
        {!businessesList.loading && businessesList.businesses.length === 0 && (
          <NotFoundSource
            content={t(
              'NOT_FOUND_BUSINESSES',
              'No businesses to delivery / pick up at this address, please change filters or change address.',
            )}
          />
        )}
        {businessesList.businesses?.map(
          (business: any) =>
            !business.featured && (
              <BusinessController
                key={business.id}
                business={business}
                handleCustomClick={handleBusinessClick}
                orderType={orderState?.options?.type}
              />
            ),
        )}
        {businessesList.loading && (
          <>
            {[
              ...Array(
                paginationProps.nextPageItems
                  ? paginationProps.nextPageItems
                  : 8,
              ).keys(),
            ].map((item, i) => (
              <Placeholder
                Animation={Fade}
                key={i}
                style={{ marginBottom: 20 }}>
                <View style={{ width: '100%' }}>
                  <PlaceholderLine
                    height={200}
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
                      style={{ marginBottom: 10 }}
                    />
                  </View>
                </View>
              </Placeholder>
            ))}
          </>
        )}
      </ListWrapper>
    </ScrollView>
  );
};

export const BusinessesListing = (props: BusinessesListingParams) => {
  const BusinessesListingProps = {
    ...props,
    isForceSearch: Platform.OS === 'ios',
    UIComponent: BusinessesListingUI,
  };

  return <BusinessesListingController {...BusinessesListingProps} />;
};
