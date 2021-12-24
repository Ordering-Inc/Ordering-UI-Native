import React from 'react'
import { View, StyleSheet } from 'react-native'
import { BusinessAndProductList, useLanguage } from 'ordering-components/native'
import Carousel from 'react-native-snap-carousel';
import { BusinessProductsListingParams, Business, Product } from '../../types'
import { OCard, OText, OIcon } from '../shared'
import GridContainer from '../../layouts/GridContainer'
import PromoCard from '../PromoCard';
import Spinner from 'react-native-loading-spinner-overlay';
import { LANDSCAPE, useDeviceOrientation } from '../../../../../src/hooks/DeviceOrientation';
import { useTheme } from 'styled-components/native';

const BusinessProductsListingUI = (props: BusinessProductsListingParams) => {
  const {navigation, businessState, resetInactivityTimeout, clearInactivityTimeout, bottomSheetVisibility } = props;

  const business: Business = businessState.business;

  const theme = useTheme();
  const [, t] = useLanguage();
  const [orientationState] = useDeviceOrientation();

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

  const _renderTitle = (title: string): React.ReactElement => (
    <View style={{paddingHorizontal: 20, paddingVertical: 15 }}>
      <OText size={orientationState?.dimensions?.width * 0.022} weight="bold">
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
          resetInactivityTimeout()
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
      {_renderTitle(t('FEATURED', 'Featured'))}
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
        enableMomentum={true}
      />
    </>
  );

  const _renderCategories = (): React.ReactElement => (
    <>
      {_renderTitle(t('CATEGORIES', 'Categories'))}
      <GridContainer 
        style={{
          paddingLeft: orientationState?.orientation === LANDSCAPE
          ? bottomSheetVisibility ? orientationState?.dimensions?.width * 0.004 :orientationState?.dimensions?.width * 0.008
          : 0
        }}
      >
        {_categories && _categories.map((category: any) => (
          <OCard
            key={category.id}
            title={category?.name || ''}
            image={{uri: category?.image}}
            style={{
              width:
                orientationState?.orientation === LANDSCAPE
                  ? bottomSheetVisibility ? orientationState?.dimensions?.width * 0.145 :orientationState?.dimensions?.width * 0.16
                  : orientationState?.dimensions?.width * 0.20,
            }}
            onPress={() => {
              resetInactivityTimeout()
              navigation.navigate('Category', {
                category,
                categories: business.original.categories,
                businessId: business?.api?.businessId,
                businessSlug: business?.slug,
                clearInactivityTimeout,
                resetInactivityTimeout,
              });
            }}
            titleStyle={{textAlign: 'center'}}
          />
        ))}
      </GridContainer>
    </>
  );

  if (businessState?.error) {
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
