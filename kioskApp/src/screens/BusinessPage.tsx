import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import {
  useLanguage,
  useApi,
  useOrder,
  useUtils,
} from 'ordering-components/native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'

import { Container } from '../layouts/Container';
import { BusinessProductsListing } from '../components/BusinessProductsListing';
import NavBar from '../components/NavBar';
import { CartBottomSheet } from '../components/CartBottomSheet';
import { CartContent } from '../components/CartContent';

import config from '../config.json';
import { OText } from '../components/shared';
import { colors } from '../theme.json';
import { PORTRAIT, useDeviceOrientation } from '../hooks/device_orientation_hook';
import { useCartBottomSheet } from '../providers/CartBottomSheetProvider';

const BusinessPage = (props:any): React.ReactElement => {
  const [, t] = useLanguage()
  const [ordering] = useApi()
  const [{ parsePrice }] = useUtils()
  const [orientationState] = useDeviceOrientation();
  const {
    bottomSheetVisibility,
    showCartBottomSheet,
    hideCartBottomSheet
  } = useCartBottomSheet();

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
  const VISIBLE_CART_BOTTOM_SHEET_HEIGHT = orientationState?.dimensions?.height * (orientationState.orientation === PORTRAIT ? 0.5 : 1);

  let cart: any;
  
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
      orientationState,
      height: VISIBLE_CART_BOTTOM_SHEET_HEIGHT,
      visible: bottomSheetVisibility,
    },
    showNotFound: false,
  }
  
  const goToBack = () => navigation.goBack()

  const onToggleCart = () => {
    if (bottomSheetVisibility) hideCartBottomSheet();
    else showCartBottomSheet();
  }

  return (
    <View style={{
      flex: 1,
      flexDirection: orientationState?.orientation === PORTRAIT ? 'column' : 'row'
    }}>
      <View
        style={{
          flex: 1,
          paddingBottom: bottomSheetVisibility && !!cart && orientationState?.orientation === PORTRAIT
            ? VISIBLE_CART_BOTTOM_SHEET_HEIGHT
            : 0,
        }}
      >
        <Container nopadding nestedScrollEnabled>
          <View style={{ paddingVertical: 20 }}>
            <NavBar
              title={t('MENU', 'Menu')}
              onActionLeft={goToBack}
              includeOrderTypeSelector
              rightComponent={cart && (
                
                <TouchableOpacity
                  style={{ paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center' }}
                  onPress={onToggleCart}
                >
                  <OText
                    color={colors.mediumGray}
                  >
                    {`${cart?.products?.length || 0} ${t('ITEMS', 'items')}`} {parsePrice(cart?.total || 0)} {' '}
                  </OText>

                  <MaterialIcon
                    name={bottomSheetVisibility ? "cart-off" : "cart-outline"}
                    color={colors.primary}
                    size={30}
                  />
                </TouchableOpacity>
              )}
            />
          </View>

          <BusinessProductsListing
            { ...businessProductsListingProps }
          /> 
        </Container>
      </View>

      {bottomSheetVisibility &&  
        (<View
          style={{
            flex: bottomSheetVisibility && orientationState?.orientation === PORTRAIT ? 0 : 0.8,
          }}
        >
          <CartContent
            {...cartProps}
          />
        </View>)
      }
    </View>
  );
};

export default BusinessPage;
