import React from 'react';
import { Dimensions, View } from 'react-native';
import { useLanguage, useApi, useOrder } from 'ordering-components/native';

import { Container } from '../layouts/Container';
import { BusinessProductsListing } from '../components/BusinessProductsListing';
import NavBar from '../components/NavBar';
import { CartBottomSheet } from '../components/CartBottomSheet';
import { CartContent } from '../components/CartContent';

import config from '../config.json';

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
    slug: config.businessSlug,
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

  const [{ carts }] = useOrder();
  const cartsList = (carts && Object.values(carts).filter((cart: any) => cart.products.length > 0)) || []

  let cart;
  
  if (cartsList?.length > 0) {
    cart = cartsList?.find((item: any) => item.business_id == config.businessSlug);
  }
  const cartProps = {
    ...props,
    cart,
    isOrderStateCarts: !!carts,
    onNavigationRedirect: (route: string, params: any) => props.navigation.navigate(route, params),
    CustomCartComponent: CartBottomSheet,
    extraPropsCustomCartComponent: {
      height: VISIBLE_CART_BOTTOM_SHEET_HEIGHT,
      visible: !!cart,
    },
    showNotFound: false,
  }

  const goToBack = () => navigation.goBack()  

  return (
    <View
      style={{
        flex: 1,
        paddingBottom: !!cart ? VISIBLE_CART_BOTTOM_SHEET_HEIGHT : 0,
      }}
    >
      <Container nopadding nestedScrollEnabled>
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

      <CartContent
        {...cartProps}
      />
    </View>
  );
};

const _dim = Dimensions.get('window');
const VISIBLE_CART_BOTTOM_SHEET_HEIGHT = _dim.height * 0.5;

export default BusinessPage;
