import React from 'react'
import { Dimensions, View } from 'react-native'
import {
  BusinessAndProductList,
  useLanguage,
} from 'ordering-components/native'
import Carousel from 'react-native-snap-carousel';

import { BusinessProductsListingParams } from '../../types'
import { OCard, OText } from '../shared'
import GridContainer from '../../layouts/GridContainer'
import PromoCard from '../PromoCard';

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
    featuredProducts,
    errorQuantityProducts,
    header,
    logo
  } = props;

  const [, t] = useLanguage();

  const _categories:any = businessState?.business?.original?.categories;
  let _promos:any = [];

  _categories?.forEach((categ:any) => {
    const _featuredProds = categ?.products?.filter((prod:any) => prod.featured);

    if(_featuredProds?.length > 0) {
      _promos = [
        ..._promos,
        ..._featuredProds,
      ]
    }
  });

  const _renderTitle = (title: string): React.ReactElement => (
    <View style={{ paddingHorizontal: 20, paddingVertical: 40 }}>
      <OText
        size={_dim.width * 0.05}
        weight="bold"
      >
        {title}
      </OText>
    </View>
  );

  const _renderItem = ({item, index} : any) => {
    return (
      <PromoCard
        title={item?.name}
        description={!!item?.description && item?.description}
        image={{uri: item?.images}}
      />
    );
  }

  const _renderPromos = (): React.ReactElement => (
    <>
      {_renderTitle(t('PROMOS', 'Promos'))}
      
      <Carousel
        keyExtractor={(item:any) => item.id}
        ref={(_) => {}}
        data={_promos}
        renderItem={_renderItem}
        sliderWidth={_dim.width}
        itemWidth={_dim.width * 0.4}
        alwaysBounceHorizontal={false}
        slideStyle={{
          width: _dim.width * 0.45,
          marginLeft: 20,
        }}
        inactiveSlideScale={1}
        snapToAlignment="start"
        activeSlideAlignment="start"
        inactiveSlideOpacity={1}
      />

    </>
  );

  const _renderCategories = (): React.ReactElement => (
    <>    
      {_renderTitle(t('CATEGORIES', 'Categories'))}
        
      <GridContainer>
        {
          _categories.map((category: any) => (
            <OCard
              key={category.id}
              title={category?.name || ''}
              image={{ uri: category?.image}}
              onPress={() => {
                navigation.navigate('Category', {
                  category,
                  categories: businessState.business.original.categories,
                });
              }}
              titleStyle={{ textAlign: 'center' }}
            />
          ))
        }
      </GridContainer>
    </>
  );

  if (businessState?.loading) {
    return <OText>cargando...</OText>
  }

  if (businessState?.error) {
    return <OText>error!</OText>
  }

  return (
    <>
      {_promos?.length > 0
        && _renderPromos()}
      
      {_categories?.length > 0
        && _renderCategories()}
    </>
  );
}

const _dim = Dimensions.get('window');

export const BusinessProductsListing = (props:any) => {
  const businessProductslistingProps = {
    ...props,
    UIComponent: BusinessProductsListingUI
  }
  return (
    <BusinessAndProductList {...businessProductslistingProps} />
  )
}
