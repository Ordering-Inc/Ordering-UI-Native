import React, { useCallback, useState } from 'react';
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
import { NotFoundSource } from '../NotFoundSource';
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
  const [{ parsePrice }] = useUtils();
  const [orientationState] = useDeviceOrientation();
  const [bottomSheetVisibility, { showCartBottomSheet, hideCartBottomSheet }] = useCartBottomSheet();

  const [productState, setProductState] = useState<any>(null)
  const [productSelected, setProductSelected] = useState<any>({})
  const [curIndexCateg, setIndexCateg] = useState(categories.indexOf(category));
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

  const onEditProduct = (product: any) => {
    setProductSelected({ ...product, _isEditProduct: true })
    setDrawerValues({ isOpen: true, data: null })
  }

  const onAddProduct = (product: any) => {
    setProductSelected(product)
    setDrawerValues({ isOpen: true, data: null })
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
      onEditProduct,
      onAddProduct
    },
    showNotFound: false,
    showCartBottomSheet,
  }

  const onClickDrawer = () => {
    setDrawerValues({ isOpen: !drawerState.isOpen, data: null })
    setProductState(null)
  }

  const onSaveProductForm = () => {
    showCartBottomSheet()
    onClickDrawer()
  }

  const onToggleCart = () => {
    if (bottomSheetVisibility) hideCartBottomSheet();
    else showCartBottomSheet();
  }

  const onProductStateChange = useCallback((val: any) => {
    setProductState({ ...productState, ...val })
  }, [setProductState])

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

            <GridContainer
              style={{
                marginTop: 20,
                paddingLeft: orientationState?.orientation === LANDSCAPE
                  ? bottomSheetVisibility
                    ? orientationState?.dimensions?.width * 0.004
                    : orientationState?.dimensions?.width * 0.008
                  : 0
              }}
            >
              {categories[curIndexCateg].products.map((product) => (
                <OCard
                  key={product.id}
                  title={product?.name}
                  isUri={!!product.images}
                  image={product.images ? {uri: product.images} : theme.images.dummies.product}
                  price={parsePrice(product?.price)}
                  description={product?.description}
                  prevPrice={product?.offer_price > 0 && parsePrice(product?.offer_price)}
                  style={{
                    borderRadius: 10,
                    width: orientationState?.orientation === LANDSCAPE
                      ? bottomSheetVisibility ? orientationState?.dimensions?.width * 0.145 :orientationState?.dimensions?.width * 0.16
                      : orientationState?.dimensions?.width * 0.20
                  }}
                  onPress={() => {
                    resetInactivityTimeout()
                    if (isDrawer) {
                      onAddProduct && onAddProduct(product)
                    } else {
                      navigation.navigate('ProductDetails', {
                        businessId,
                        businessSlug,
                        product,
                      });
                    }
                  }}
                />
              ))}

              {categories[curIndexCateg].products.length === 0 && (
                <NotFoundSource
                  content={t('ERROR_NOT_FOUND_PRODUCTS_TIME', 'No products found at this time')}
                />
              )}
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
        onClickIcon={onClickDrawer}
      >
        <KeyboardView
          enabled
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ProductForm
            isDrawer
            navigation={navigation}
            {...(productSelected?._isEditProduct ? {
              isEdit: true,
              productCart: productState?.productCart ?? productSelected,
              product: productState?.product,
              businessSlug: cart?.business?.slug,
              businessId: cart?.business_id,
              categoryId: productSelected?.category_id,
              productId: productSelected?.id,
            } : {
              product: productSelected,
              businessSlug: businessSlug,
              businessId: parseInt(businessId, 10),
              productState: productState,
              productCart: productState,
            })}
            onSave={onSaveProductForm}
            onProductStateChange={onProductStateChange}
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
