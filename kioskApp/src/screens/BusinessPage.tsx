import React, { useRef } from 'react';
import { Button, View } from 'react-native';
import { useLanguage, useApi } from 'ordering-components/native';

import { Container } from '../layouts/Container';
import { BusinessProductsListing } from '../components/BusinessProductsListing';
import NavBar from '../components/NavBar';
import CartBottomSheet from '../components/CartBottomSheet';

const BusinessPage = (props:any): React.ReactElement => {
  const [, t] = useLanguage()
  const [ordering] = useApi()
  const refRBSheet = useRef<any>(null);

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

      <CartBottomSheet
        refRBSheet={refRBSheet}
      >
        <BusinessProductsListing
          { ...businessProductsListingProps }
        />
      </CartBottomSheet>

      <Button title="OPEN BOTTOM SHEET >" onPress={() => refRBSheet.current.open()} />
    </Container>
  );
};

export default BusinessPage;
