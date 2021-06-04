import React from 'react'
import { Dimensions, FlatList, View } from 'react-native'
import {
  BusinessAndProductList,
  useLanguage,
} from 'ordering-components/native'

import { BusinessProductsListingParams } from '../../types'
import { OCard, OText } from '../shared'
import GridContainer from '../../layouts/GridContainer'

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

  const _renderTitle = (title: string): React.ReactElement => (
    <View style={{ paddingHorizontal: 20, paddingVertical: 8 }}>
      <OText
        size={_dim.width * 0.09}
        weight="bold"
      >
        {title}
      </OText>
    </View>
  );

  const _renderPromos = (): React.ReactElement => (
    <>
      {_renderTitle(t('PROMOS', 'Promos'))}
    </>
  );

  const _renderCategories = (): React.ReactElement => (
    <>    
      {_renderTitle(t('CATEGORIES', 'Categories'))}
        
      <GridContainer
        style={{ justifyContent: 'space-between' }}
      >
        {
          businessState?.business?.original?.categories.map((category: any) => (
            <OCard
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
      {businessState?.business?.original?.promos?.length > 0
        && _renderPromos()}
      
      {businessState?.business?.original?.categories?.length > 0
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
