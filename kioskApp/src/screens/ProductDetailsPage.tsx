import React from 'react';
import { Product } from '../types';
import { ProductForm } from '../components/ProductForm';

const ProductDetailsPage = (props:any) => {

  const {
    navigation,
    route,
  } = props;

  const { product, businessId, businessSlug } : Params  = route.params;

  return (
    <ProductForm
      product={product}
      businessId={businessId}
      businessSlug={businessSlug}
      onSave={() => {
        navigation.navigate('Cart');
      }}
      navigation={navigation}
    />
  );
}

interface Params {
  product: Product;
  businessId: string;
  businessSlug: string;
}

export default ProductDetailsPage;
