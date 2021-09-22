import React from 'react';
import { ProductsList, useLanguage, useUtils } from 'ordering-components/native';
import { SingleProductCard } from '../SingleProductCard';
import { NotFoundSource } from '../NotFoundSource';
import { BusinessProductsListParams } from '../../types';
import { OIcon, OText } from '../shared';
import { ProductsContainer, ErrorMessage, WrapperNotFound } from './styles';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
import { View } from 'react-native';
import { StyleSheet } from 'react-native';

const BusinessProductsListUI = (props: BusinessProductsListParams) => {
  const {
    errors,
    businessId,
    category,
    categories,
    categoryState,
    onProductClick,
    featured,
    searchValue,
    isBusinessLoading,
    handleSearchRedirect,
    handleClearSearch,
    errorQuantityProducts,
    handleCancelSearch,
  } = props;

  const [, t] = useLanguage();
  const [{ optimizeImage }] = useUtils()

  return (
    <ProductsContainer>
      {category.id &&
        categoryState.products?.map((product: any) => (
          <SingleProductCard
            key={'prod_' + product.id}
            isSoldOut={product.inventoried && !product.quantity}
            product={product}
            businessId={businessId}
            onProductClick={() => onProductClick(product)}
          />
        ))}

      {!category.id &&
        featured &&
        categoryState?.products?.find((product: any) => product.featured) && (
          <>
            <OText size={16} weight={'600'} mBottom={15}>
              {t('FEATURED', 'Featured')}
            </OText>
            <>
              {categoryState.products?.map(
                (product: any) =>
                  product.featured && (
                    <SingleProductCard
                      key={product.id}
                      isSoldOut={product.inventoried && !product.quantity}
                      product={product}
                      businessId={businessId}
                      onProductClick={onProductClick}
                    />
                  ),
              )}
            </>
          </>
        )}

      {!category.id &&
        categories &&
        categories
          .filter((category) => category.id !== null)
          .map((category, i, _categories) => {
            const products =
              categoryState.products?.filter(
                (product: any) => product.category_id === category.id,
              ) || [];
            return (
              <React.Fragment key={'cat_' + category.id}>
                {products.length > 0 && (
                  <>
                    <View style={bpStyles.catWrap}>
                      <View style={bpStyles.catIcon}>
                        <OIcon
                          url={optimizeImage(category.image, 'h_100,c_limit')}
                          width={41}
                          height={41}
                          style={{ borderRadius: 7.6 }}
                        />
                      </View>
                      <OText size={16} weight="600">
                        {category.name}
                      </OText>
                    </View>
                    <>
                      {products.map((product: any) => (
                        <SingleProductCard
                          key={product.id}
                          isSoldOut={product.inventoried && !product.quantity}
                          businessId={businessId}
                          product={product}
                          onProductClick={onProductClick}
                        />
                      ))}
                    </>
                  </>
                )}
              </React.Fragment>
            );
          })}

      {(categoryState.loading || isBusinessLoading) && (
        <>
          {[...Array(categoryState?.pagination?.nextPageItems).keys()].map(
            (item, i) => (
              <Placeholder key={i} style={{ padding: 5 }} Animation={Fade}>
                <View style={{ flexDirection: 'row' }}>
                  <PlaceholderLine
                    width={24}
                    height={70}
                    style={{ marginRight: 10, marginBottom: 10 }}
                  />
                  <Placeholder style={{ paddingVertical: 10 }}>
                    <PlaceholderLine width={60} style={{ marginBottom: 25 }} />
                    <PlaceholderLine width={20} />
                  </Placeholder>
                </View>
              </Placeholder>
            ),
          )}
        </>
      )}
      {!categoryState.loading &&
        !isBusinessLoading &&
        categoryState.products.length === 0 &&
        !errors &&
        !(
          (searchValue && errorQuantityProducts) ||
          (!searchValue && !errorQuantityProducts)
        ) && (
          <WrapperNotFound>
            <NotFoundSource
              content={
                !searchValue
                  ? t(
                      'ERROR_NOT_FOUND_PRODUCTS_TIME',
                      'No products found at this time',
                    )
                  : t(
                      'ERROR_NOT_FOUND_PRODUCTS',
                      'No products found, please change filters.',
                    )
              }
              btnTitle={
                !searchValue
                  ? t('SEARCH_REDIRECT', 'Go to Businesses')
                  : t('CLEAR_FILTERS', 'Clear filters')
              }
              onClickButton={() =>
                !searchValue
                  ? handleSearchRedirect && handleSearchRedirect()
                  : handleCancelSearch && handleCancelSearch()
              }
            />
          </WrapperNotFound>
        )}

      {errors &&
        errors.length > 0 &&
        errors.map((e: any, i: number) => (
          <ErrorMessage key={i}>
            <OText space>ERROR:</OText>
            <OText>{e}</OText>
          </ErrorMessage>
        ))}
    </ProductsContainer>
  );
};

const bpStyles = StyleSheet.create({
  catWrap: { flexDirection: 'row', alignItems: 'center', height: 41, marginBottom: 19 },
  catIcon: {
    borderRadius: 7.6,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 1,
    marginEnd: 13,
  },
});

export const BusinessProductsList = (props: BusinessProductsListParams) => {
  const businessProductsListProps = {
    ...props,
    UIComponent: BusinessProductsListUI,
  };

  return <ProductsList {...businessProductsListProps} />;
};
