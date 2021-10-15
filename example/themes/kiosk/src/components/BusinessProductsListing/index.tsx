import React, { useEffect, useState } from 'react'
import { View, StyleSheet } from 'react-native'
import {
  BusinessAndProductList,
  useLanguage,
  useOrder,
  useSession,
  useConfig,
  useApi,
  useToast,
  ToastType
} from 'ordering-components/native'
import Carousel from 'react-native-snap-carousel';
import Geocoder from 'react-native-geocoding';
import { BusinessProductsListingParams, Business, Product } from '../../types'
import { OCard, OText } from '../shared'
import GridContainer from '../../layouts/GridContainer'
import PromoCard from '../PromoCard';
import Spinner from 'react-native-loading-spinner-overlay';
import { LANDSCAPE, useDeviceOrientation } from '../../../../../src/hooks/DeviceOrientation';
import { useTheme } from 'styled-components/native';
import { OIcon } from '../shared';

const BusinessProductsListingUI = (props: BusinessProductsListingParams) => {
  const {navigation, businessState} = props;

  const business: Business = businessState.business;

  const theme = useTheme();
  const [, t] = useLanguage();
  const [{user, auth, accessToken}] = useSession()
  const [orderState, {changeAddress}] = useOrder()
  const [orientationState] = useDeviceOrientation();
  const [configState] = useConfig()
  const [ordering] = useApi()
  const [, {showToast}] = useToast()
  const [addressState, setAddressState] = useState<any>({ loading: false, changes: {}, error: null, address: {} })
  const googleMapsApiKey = configState?.configs?.google_maps_api_key?.value

  const _categories: any = business?.original?.categories;
  let _promos: any = [];
  _categories?.forEach((categ: any) => {
    const _featuredProds = categ?.products?.filter(
      (prod: any) => prod.featured,
    );

    if (_featuredProds?.length > 0) {
      _promos = [..._promos, ..._featuredProds];
    }
  });

  const handleCurrentUserLocation = async () => {
    let addressValue : any = []
    let data: any = { address: null, error: null }
    const filterAddressInfo = [
      { tag: 'street_number', isShort: true },
      { tag: 'route', isShort: true },
      { tag: 'locality', isShort: true },
      { tag: 'administrative_area_level_1', isShort: false },
      { tag: 'country', isShort: false },
    ]
      Geocoder.init(googleMapsApiKey);
      Geocoder.from({
        latitude: business.location?.lat,
        longitude: business.location?.lng
      }).then( async (json : any) => {
        if(json.results && json.results?.length > 0){
            for (const component of json.results?.[0].address_components) {
              const addressType = component.types?.[0]
              for (const filterProps of filterAddressInfo)  {
                if(filterProps.tag.includes(addressType)) {
                  addressValue.push(filterProps.isShort ? component.short_name : component.long_name)
                }
              }
            }
            data = {
              address: addressValue.join(', '),
              location: json.results[0].geometry.location,
              map_data: {
                library: 'google',
                place_id: json.results?.[0].place_id
              }
            }
            setAddressState({ ...addressState, loading: true })
            try {
              const { content } = await ordering
              .users(user?.id)
              .addresses()
              .save(data.address, { accessToken })
              setAddressState({
                ...addressState,
                loading: false,
                error: content.error ? content.result : null,
              })
              if (!content.error && data) {
                setAddressState({
                  ...addressState,
                  address: data
                })
                changeAddress(data)
              }
            } catch (err : any) {
              setAddressState({
                ...addressState,
                loading: false,
                error: [err.message],
                address: {}
              })
            }
        }
      })
  }

  useEffect(() => {
    if(business?.location?.lat && business?.location?.lng){
      handleCurrentUserLocation()
    }
  }, [business?.location, googleMapsApiKey])

  const _renderTitle = (title: string): React.ReactElement => (
    <View style={{paddingHorizontal: 20, paddingVertical: 40}}>
      <OText size={orientationState?.dimensions?.width * 0.035} weight="bold">
        {title}
      </OText>
    </View>
  );

  const _renderItem = ({item, index}: {item: Product; index: number}) => {
    return (
      <PromoCard
        title={item?.name}
        {...(!!item?.description && {description: item?.description})}
        image={{uri: item?.images}}
        isOutOfStock={!item?.inventoried}
        onPress={() => {
          navigation.navigate('ProductDetails', {
            businessId: business?.api?.businessId,
            businessSlug: business?.slug,
            product: item,
          });
        }}
      />
    );
  };

  let _carousel: Carousel<Product> | null;

  const _renderPromos = (): React.ReactElement => (
    <>
      {_renderTitle(t('PROMOS', 'Promos'))}
      <Carousel
        keyExtractor={(item: any) => item.id}
        ref={(c: any) => {
          _carousel = c;
        }}
        data={_promos || []}
        renderItem={_renderItem}
        sliderWidth={orientationState?.dimensions?.width}
        itemWidth={orientationState?.dimensions?.width * 0.4}
        alwaysBounceHorizontal={false}
        slideStyle={{
          width: orientationState?.dimensions?.width * 0.45,
          marginLeft: 20,
        }}
        inactiveSlideScale={1}
        snapToAlignment="start"
        activeSlideAlignment="start"
        inactiveSlideOpacity={1}
        initialScrollIndex={0}
        onScrollToIndexFailed={(_: any) => {}}
      />
    </>
  );

  const _renderCategories = (): React.ReactElement => (
    <>
      {_renderTitle(t('CATEGORIES', 'Categories'))}
      <GridContainer>
        {_categories && _categories.map((category: any) => (
          <OCard
            key={category.id}
            title={category?.name || ''}
            image={{uri: category?.image}}
            style={{
              width:
                orientationState?.orientation === LANDSCAPE
                  ? orientationState?.dimensions?.width * 0.16
                  : orientationState?.dimensions?.width * 0.21,
            }}
            onPress={() => {
              navigation.navigate('Category', {
                category,
                categories: business.original.categories,
                businessId: business?.api?.businessId,
                businessSlug: business?.slug,
              });
            }}
            titleStyle={{textAlign: 'center'}}
          />
        ))}
      </GridContainer>
    </>
  );

  if (businessState?.error || addressState.error) {
    return <OText>{t('ERROR', 'Error')}</OText>;
  }

  return (
    <View>
      <Spinner visible={businessState?.loading} />
      {!businessState?.loading && (_promos?.length > 0 || _categories?.length > 0) && (
        <>
          {_promos?.length > 0 && _renderPromos()}
          {_categories?.length > 0 && _renderCategories()}
        </>
      )}

      {!businessState?.loading && _promos && _promos?.length === 0 && _categories && _categories?.length === 0 && (
        <OIcon src={theme.images.general.notFound} style={styles.logo} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 500,
    height: 400,
    alignSelf: 'center',
  },
  wrapper: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    backgroundColor: 'yellow'
  },
});

export const BusinessProductsListing = (props: any) => {
  const businessProductslistingProps = {
    ...props,
    UIComponent: BusinessProductsListingUI,
  };
  return <BusinessAndProductList {...businessProductslistingProps} />;
};
