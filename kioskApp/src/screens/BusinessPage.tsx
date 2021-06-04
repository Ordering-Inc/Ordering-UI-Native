import React from 'react';
import { View } from 'react-native';
import { useLanguage, useApi } from 'ordering-components/native';

import { Container } from '../layouts/Container';
import { BusinessProductsListing } from '../components/BusinessProductsListing';
import NavBar from '../components/NavBar';

const BusinessPage = (props:any): React.ReactElement => {
  const [, t] = useLanguage()
  const [ordering] = useApi()

  const {
    navigation
  } = props;

  const businessProductsListingProps = {
    ...props,
    ordering,
    isSearchByName: true,
    isSearchByDescription: true,
    slug: '41',
    categoryId: null,
    productId: null,
    langFallbacks: null,
    businessProps: [
      'name',
      'id',
      'name',
      'header',
      'logo',
      'name',
      'open',
      'about',
      'description',
      'address',
      'location',
      'timezone',
      'schedule',
      'service_fee',
      'delivery_price',
      'distance',
      'delivery_time',
      'gallery',
      'pickup_time',
      'reviews',
      'featured',
      'offers',
      'food',
      'laundry',
      'alcohol',
      'groceries',
      'slug',
      'products',
      'zones'
    ],
    handleSearchRedirect: () => {},
    onProductRedirect: (x:any) => {},
    onCheckoutRedirect: (cartUuid:any) => {}
  }

  const goToBack = () => navigation.goBack()

  return (
    <Container nopadding>
      <View style={{ paddingVertical: 20 }}>
        <NavBar
          title={t('MENU', 'Menu')}
          onActionLeft={goToBack}
        />
      </View>

      <BusinessProductsListing
        { ...businessProductsListingProps }
      />
    </Container>
  );
};

export default BusinessPage;
