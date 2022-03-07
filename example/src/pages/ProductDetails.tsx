import * as React from 'react';
import styled, { useTheme } from 'styled-components/native';
import { Platform } from 'react-native';
import { ProductForm as ProductFormController } from '../components/ProductForm';
interface Props {
  navigation: any;
  route: any;
}

const ProductDetails = (props: Props) => {
  const theme = useTheme()

  const productProps = {
    ...props,
    isCartProduct: props.route.params?.isCartProduct,
    isFromCheckout: props.route.params?.isFromCheckout,
    productCart: props.route.params?.productCart,
    product: props.route.params?.product,
    businessSlug: props.route.params?.businessSlug,
    businessId: props.route.params?.businessId,
    categoryId: props.route.params?.categoryId,
    productId: props.route.params?.productId,
    onSave: props?.navigation?.canGoBack()
      ? () => { props.route.params?.onAction && props.route.params?.onAction(); props?.navigation?.goBack(); }
      : () => { props.route.params?.onAction && props.route.params?.onAction(); props?.navigation?.navigate('BottomTab') }
    ,
    handleGoBack: props?.navigation?.canGoBack()
      ? () => {
        props.route.params?.onAction &&
        props.route.params?.onAction();
        props?.navigation?.goBack();
      }
      : (businessSlug: any) => {
        props.route.params?.onAction &&
        props.route.params?.onAction();
        businessSlug
          ? props?.navigation.navigate('Business', { store: businessSlug })
          : props?.navigation.navigate('BottomTab')
      }
  };

  const BusinessProductsListView = styled.SafeAreaView`
    flex: 1;
    background-color: ${theme.colors.backgroundPage};
    padding-top: ${Platform.OS === 'ios' ? '0px' : '20px'};
  `;

  return (
    <BusinessProductsListView>
      <ProductFormController {...productProps} />
    </BusinessProductsListView>
  );
};

export default ProductDetails;
