import React, { useState } from 'react';
import { Dimensions, View } from 'react-native';
import { useLanguage, useOrder } from 'ordering-components/native';

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
  const onChangeTabs = (idx: number) => setIndexCateg(idx);

  const goToBack = () => navigation.goBack()

  const [{ carts }] = useOrder();
  const cartsList = (carts && Object.values(carts).filter((cart: any) => cart.products.length > 0)) || []

  let cart;
  
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
      height: VISIBLE_CART_BOTTOM_SHEET_HEIGHT,
      visible: !!cart,
    },
    showNotFound: false,
  }

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
            title={t('CATEGORY', 'Category')}
            onActionLeft={goToBack}
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
            size={_dim.width * 0.05}
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
              onPress={() => {
                navigation.navigate('ProductDetails', {
                  businessId,
                  businessSlug,
                  product,
                });
              }}
              {...(!!product?.description && { description: product?.description } )}
              {...(!!product?.price && { price: `$${product?.price}` } )}
              {...(product?.in_offer && { prevPrice: `$${product?.offer_price}` } )}
            />
          ))}
        </GridContainer>
      </Container>
      
      <CartContent
        {...cartProps}
      />
    </View>
	);
};

interface Params {
  category: Category;
  categories: Category[];
  businessId: string;
  businessSlug: string;
}

const _dim = Dimensions.get('window');
const VISIBLE_CART_BOTTOM_SHEET_HEIGHT = _dim.height * 0.5;

export default CategoryPage;
