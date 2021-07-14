import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useLanguage, useOrder, useUtils } from 'ordering-components/native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'

import { Container } from '../layouts/Container';
import GridContainer from '../layouts/GridContainer';
import NavBar from '../components/NavBar';
import {
  OCard,
  OSegment,
  OText
} from '../components/shared';
import { CartBottomSheet } from '../components/CartBottomSheet';
import { Category } from '../types';
import { CartContent } from '../components/CartContent';
import { colors } from '../theme.json';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { LANDSCAPE, PORTRAIT, useDeviceOrientation } from '../hooks/device_orientation_hook';
import { useCartBottomSheet } from '../providers/CartBottomSheetProvider';

const CategoryPage = (props: any): React.ReactElement => {

  const {
    navigation,
    route,
  } = props;
  
  const {
    category,
    categories,
    businessId,
    businessSlug,
  }: Params = route.params;

  const [, t] = useLanguage();
  const [curIndexCateg, setIndexCateg] = useState(categories.indexOf(category));
  const [{ parsePrice }] = useUtils();
  const [orientationState] = useDeviceOrientation();
  const {
    bottomSheetVisibility,
    showCartBottomSheet,
    hideCartBottomSheet
  } = useCartBottomSheet();
  
  const onChangeTabs = (idx: number) => setIndexCateg(idx);
  
  const goToBack = () => navigation.goBack()
  
  const [{ carts }] = useOrder();
  const cartsList = (carts && Object.values(carts).filter((cart: any) => cart.products.length > 0)) || [];
  const VISIBLE_CART_BOTTOM_SHEET_HEIGHT = orientationState?.dimensions?.height * (orientationState.orientation === PORTRAIT ? 0.5 : 1);

  let cart: any;
  
  if (cartsList?.length > 0) {
    cart = cartsList?.find((item: any) => item.business_id == businessId);
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
              title={t('CATEGORY', 'Category')}
              onActionLeft={goToBack}
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
            <OSegment
              items={categories.map((category) => ({
                text: category.name
              }))}
              selectedIdx={curIndexCateg} 
              onSelectItem={onChangeTabs}
            />
          </View>
          
          <View style={{ paddingHorizontal: 20, paddingVertical: 8 }}>
            <OText
              size={orientationState?.dimensions?.width * 0.048}
              weight="bold"
            >
              {categories[curIndexCateg].name}
            </OText>
          </View>

          <GridContainer>
            {categories[curIndexCateg].products.map((product) => (
              <OCard
                key={product.id}
                title={product?.name}
                image={{ uri: product?.images }}
                style={{
                  width: orientationState?.orientation === LANDSCAPE
                    ? orientationState?.dimensions?.width * 0.16
                    : orientationState?.dimensions?.width * 0.21,
                }}
                onPress={() => {
                  navigation.navigate('ProductDetails', {
                    businessId,
                    businessSlug,
                    product,
                  });
                }}
                {...(!!product?.description && { description: product?.description } )}
                {...(!!product?.price && { price: parsePrice(product?.price) } )}
                {...(product?.in_offer && { prevPrice: `$${product?.offer_price}` } )}
              />
            ))}
          </GridContainer>
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

interface Params {
  category: Category;
  categories: Category[];
  businessId: string;
  businessSlug: string;
}

export default CategoryPage;
