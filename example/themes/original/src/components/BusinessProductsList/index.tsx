import React, { useState } from 'react';
import { ProductsList, useLanguage, useUtils, useConfig } from 'ordering-components/native';
import { SingleProductCard } from '../SingleProductCard';
import { NotFoundSource } from '../NotFoundSource';
import { BusinessProductsListParams } from '../../types';
import { OButton, OIcon, OModal, OText } from '../shared';
import { ProductsContainer, ErrorMessage, WrapperNotFound } from './styles';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
import { View } from 'react-native';
import { StyleSheet } from 'react-native';
import { useTheme } from 'styled-components/native';

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
    categoriesLayout,
    setCategoriesLayout,
    currentCart
  } = props;

  const [, t] = useLanguage();
  const [{ optimizeImage }] = useUtils()
  const [{ configs }] = useConfig()
  const theme = useTheme()
  const isUseParentCategory = configs?.use_parent_category?.value === 'true' || configs?.use_parent_category?.value === '1'
  const [openDescription, setOpenDescription] = useState<any>(null)
  const handleOnLayout = (event: any, categoryId: any) => {
    const _categoriesLayout = { ...categoriesLayout }
    const categoryKey = 'cat_' + categoryId
    _categoriesLayout[categoryKey] = event.nativeEvent.layout
    setCategoriesLayout(_categoriesLayout)
  }

  return (
    <ProductsContainer renderToHardwareTextureAndroid={categoryState.loading || isBusinessLoading}>
      {category.id &&
        categoryState.products?.sort((a: any, b: any) => a.rank - b.rank).map((product: any) => (
          <SingleProductCard
            key={'prod_' + product.id}
            isSoldOut={product.inventoried && !product.quantity}
            product={product}
            businessId={businessId}
            onProductClick={() => onProductClick(product)}
            productAddedToCartLength={currentCart?.products?.reduce((productsLength: number, Cproduct: any) => { return productsLength + (Cproduct?.id === product?.id ? Cproduct?.quantity : 0) }, 0)}
          />
        ))}

      {!category.id &&
        featured &&
        categoryState?.products?.find((product: any) => product.featured) && (
          <View
            onLayout={(event: any) => handleOnLayout(event, 'featured')}
          >
            <OText size={16} weight={'600'} mBottom={15}>
              {t('FEATURED', 'Featured')}
            </OText>
            <>
              {categoryState.products?.sort((a: any, b: any) => a.rank - b.rank).map(
                (product: any, i: any) =>
                  product.featured && (
                    <SingleProductCard
                      key={i}
                      isSoldOut={product.inventoried && !product.quantity}
                      product={product}
                      businessId={businessId}
                      onProductClick={onProductClick}
                      productAddedToCartLength={currentCart?.products?.reduce((productsLength: number, Cproduct: any) => { return productsLength + (Cproduct?.id === product?.id ? Cproduct?.quantity : 0) }, 0)}
                    />
                  ),
              )}
            </>
          </View>
        )}

      {!category?.id && categories.filter(category => category?.id !== null).map((category, i, _categories) => {
        const products = !isUseParentCategory
          ? categoryState?.products?.filter((product: any) => product?.category_id === category?.id) ?? []
          : categoryState?.products?.filter((product: any) => category?.children?.some((cat: any) => cat.category_id === product?.category_id)) ?? []

        const shortCategoryDescription = category?.description?.length > 80 ? `${category?.description?.substring(0, 80)}...` : category?.description

        return (
          <React.Fragment key={'cat_' + category.id}>
            {products.length > 0 && (
              <>
                <View
                  style={bpStyles.catWrap}
                  onLayout={(event: any) => handleOnLayout(event, category.id)}
                >
                  <View style={bpStyles.catIcon}>
                    <OIcon
                      url={optimizeImage(category.image, 'h_250,c_limit')}
                      width={41}
                      height={41}
                      style={{ borderRadius: 7.6 }}
                    />
                  </View>
                  <OText size={16} weight="600">
                    {category.name}
                  </OText>
                </View>
                {!!category?.description && (
                  <View style={{ position: 'relative' }}>
                    <OText size={12} weight={'500'} mBottom={5}>
                      {shortCategoryDescription}
                      {category?.description?.length > 80 && (
                        <OButton
                          style={{ height: 15, paddingRight: 0, paddingLeft: 0, borderWidth: 0 }}
                          text={t('SEE_MORE', 'See more')}
                          parentStyle={{ padding: 0 }}
                          onClick={() => setOpenDescription(category)}
                          bgColor='transparent'
                          textStyle={{
                            fontSize: 12,
                            borderBottomWidth: 1,
                            borderBottomColor: theme.colors.primary,
                            color: theme.colors.primary
                          }}
                        />
                      )}
                    </OText>
                  </View>
                )}
                <>
                  {products.sort((a: any, b: any) => a.rank - b.rank).map((product: any, i: any) => (
                    <SingleProductCard
                      key={i}
                      isSoldOut={product.inventoried && !product.quantity}
                      businessId={businessId}
                      product={product}
                      onProductClick={onProductClick}
                      productAddedToCartLength={currentCart?.products?.reduce((productsLength: number, Cproduct: any) => { return productsLength + (Cproduct?.id === product?.id ? Cproduct?.quantity : 0) }, 0)}
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
      <OModal
        open={!!openDescription}
        title={openDescription?.name}
        onClose={() => setOpenDescription(null)}
      >
        <View style={{ padding: 20 }}>
          {!!openDescription?.image && (
            <OIcon
              url={optimizeImage(openDescription?.image, 'h_100,c_limit')}
              width={240}
              height={240}
              style={{ borderRadius: 7.6 }}
            />
          )}
          <OText>{openDescription?.description}</OText>
        </View>
      </OModal>
    </ProductsContainer>
  );
};

const bpStyles = StyleSheet.create({
  catWrap: { flexDirection: 'row', alignItems: 'center', marginBottom: 19 },
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
