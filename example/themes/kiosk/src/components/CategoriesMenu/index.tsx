import React, { useEffect, useState } from 'react';
import { Dimensions, Platform, View } from 'react-native';
import { useLanguage, useOrder, useUtils } from 'ordering-components/native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'

import { Container } from '../../layouts/Container';
import GridContainer from '../../layouts/GridContainer';
import NavBar from '../../components/NavBar';
import {
  OCard,
  OSegment,
  OText
} from '../../components/shared';
import { CartBottomSheet } from '../../components/CartBottomSheet';
import { Category } from '../../types';
import { CartContent } from '../../components/CartContent';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { LANDSCAPE, PORTRAIT, useDeviceOrientation } from '../../../../../src/hooks/DeviceOrientation';
import { useCartBottomSheet } from '../../providers/CartBottomSheetProvider';
import styled, { useTheme } from 'styled-components/native';
import { DrawerView } from '../DrawerView';
import { ProductForm } from '../ProductForm';

const CategoriesMenu = (props: any): React.ReactElement => {

  const {
    navigation,
    route,
    isDrawer
  } = props;

  const {
    category,
    categories,
    businessId,
    businessSlug,
    clearInactivityTimeout,
    resetInactivityTimeout
  }: Params = route.params;

  const theme = useTheme()
  const [, t] = useLanguage();
  const [curIndexCateg, setIndexCateg] = useState(categories.indexOf(category));
  const [{ parsePrice }] = useUtils();
  const [orientationState] = useDeviceOrientation();
  const [bottomSheetVisibility, { showCartBottomSheet, hideCartBottomSheet }] = useCartBottomSheet();
  const [productSelected, setProductSelected] = useState({})
  const [drawerState, setDrawerState] = useState({ isOpen: false, data: { order: null } });

  const width_dimension = Dimensions.get('window').width;
  const height_dimension = Dimensions.get('window').height;
  
  const KeyboardView = styled.KeyboardAvoidingView`
    flex: 1;
  `;
  
  const onChangeTabs = (idx: number) => {
    resetInactivityTimeout();
    setIndexCateg(idx);
  }

  const goToBack = () => navigation.goBack()

  const setDrawerValues = ({ isOpen, data }: any) => {
    setDrawerState({ ...drawerState, isOpen, data });
  }

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
      clearInactivityTimeout,
      resetInactivityTimeout,
    },
    showNotFound: false,
    showCartBottomSheet,
  }

  const onToggleCart = () => {
    if (bottomSheetVisibility) hideCartBottomSheet();
    else showCartBottomSheet();
  }

  return (
    <>
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
            <View style={{ paddingTop: 20 }}>
              <NavBar
                title={categories[curIndexCateg].name}
                onActionLeft={goToBack}
                rightComponent={cart && (
                  <TouchableOpacity
                    style={{ paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center' }}
                    onPress={onToggleCart}
                  >
                    <OText
                      color={theme.colors.mediumGray}
                    >
                      {`${cart?.products?.length || 0} ${t('ITEMS', 'items')}`} {parsePrice(cart?.total || 0)} {' '}
                    </OText>

                    <MaterialIcon
                      name={bottomSheetVisibility ? "cart-off" : "cart-outline"}
                      color={theme.colors.primary}
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

            <GridContainer style={{ marginTop: 20 }}>
              {categories[curIndexCateg].products.map((product) => (
                <OCard
                  key={product.id}
                  title={product?.name}
                  image={{ uri: product?.images }}
                  style={{
                    width: orientationState?.orientation === LANDSCAPE
                      ? bottomSheetVisibility ? orientationState?.dimensions?.width * 0.145 :orientationState?.dimensions?.width * 0.16
                      : orientationState?.dimensions?.width * 0.20
                  }}
                  titleStyle={{marginTop: Platform.OS === 'ios' ? 10 : 0}}
                  onPress={() => {
                    resetInactivityTimeout()
                    if (isDrawer) {
                      setProductSelected(product)
                      setDrawerValues({ isOpen: true, data: null })
                    } else {
                      navigation.navigate('ProductDetails', {
                        businessId,
                        businessSlug,
                        product,
                      });
                    }
                  }}
                  {...(!!product?.description && { description: product?.description } )}
                  {...(!!product?.price && { price: parsePrice(product?.price) } )}
                  {...(product?.in_offer && { prevPrice: `$${product?.offer_price}` } )}
                />
              ))}
            </GridContainer>
          </Container>
        </View>

          <View
            style={{
              flex: bottomSheetVisibility && orientationState?.orientation === PORTRAIT ? 0 : 0.8,
              display: bottomSheetVisibility ? 'flex' : 'none'
            }}
          >
            <CartContent
              {...cartProps}
            />
          </View>
      </View>
      <DrawerView
        isOpen={drawerState.isOpen}
        width={width_dimension - (width_dimension * 0.4)}
        height={height_dimension}
        onClickIcon={() => setDrawerValues({ isOpen: !drawerState.isOpen, data: null })}
      >
        <KeyboardView
          enabled
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ProductForm
            isDrawer
            product={productSelected}
            businessId={parseInt(businessId, 10)}
            businessSlug={businessSlug}
            onSave={() => {
              setDrawerValues({ isOpen: !drawerState.isOpen, data: null })
            }}
            navigation={navigation}
          />
        </KeyboardView>
      </DrawerView>
    </>
	);
};

interface Params {
  category: Category;
  categories: Category[];
  businessId: string;
  businessSlug: string;
  clearInactivityTimeout: any;
  resetInactivityTimeout: any;
}

export default CategoriesMenu;
