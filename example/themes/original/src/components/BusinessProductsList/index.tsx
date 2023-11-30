import React, { useState } from 'react';
import { ProductsList, useLanguage, useUtils, useConfig } from 'ordering-components/native';
import { SingleProductCard } from '../SingleProductCard';
import { NotFoundSource } from '../NotFoundSource';
import { BusinessProductsListParams } from '../../types';
import { OButton, OIcon, OModal, OText } from '../shared';
import { ProductsContainer, ErrorMessage, WrapperNotFound, RibbonBox, SubCategoriesContainer, ContainerButton, HeaderWrapper } from './styles';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
import { View, ScrollView } from 'react-native';
import { StyleSheet } from 'react-native';
import { useTheme } from 'styled-components/native';
import { lightenDarkenColor, shape } from '../../utils'
import { CategoryDescriptionMemoized } from './CategoryDescription';
import { OrderItAgain } from '../OrderItAgain'
import { SubcategoriesComponentMemoized } from './SubcategoriesComponent';

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
    currentCart,
    setSubcategoriesSelected,
    subcategoriesSelected,
    onClickCategory,
    lazyLoadProductsRecommended,
    handleUpdateProducts,
    previouslyProducts,
    isFiltMode,
    navigation,
    businessSingleId
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

  const onClickSubcategory = (subCategory: any, parentCategory: any) => {
    if (parentCategory && lazyLoadProductsRecommended) {
      onClickCategory(parentCategory)
    }
    if (!subCategory) {
      setSubcategoriesSelected?.(subcategoriesSelected.filter((_subcategory: any) => _subcategory?.parent_category_id !== parentCategory?.id))
      return
    }
    const categoryFounded = subcategoriesSelected.find((_subcategory: any) => subCategory?.id === _subcategory?.id)
    setSubcategoriesSelected?.(categoryFounded
      ? subcategoriesSelected.filter((_subcategory: any) => subCategory?.id !== _subcategory?.id)
      : [...subcategoriesSelected, subCategory]
    )
  }

  return (
    <ProductsContainer renderToHardwareTextureAndroid={categoryState.loading || isBusinessLoading}>
      <HeaderWrapper>
        {category?.subcategories?.length > 0 && (
          <SubcategoriesComponentMemoized
            category={category}
            subcategoriesSelected={subcategoriesSelected}
            onClickSubcategory={onClickSubcategory}
          />
        )}
      </HeaderWrapper>
      {previouslyProducts?.length > 0 && (
        <OrderItAgain
          onProductClick={onProductClick}
          productList={previouslyProducts}
          businessId={businessId}
          categoryState={categoryState}
          navigation={navigation}
          handleUpdateProducts={handleUpdateProducts}
          currentCart={currentCart}
          searchValue={searchValue}
          businessSingleId={businessSingleId}
        />
      )}
      {category.id &&
        categoryState.products
          ?.filter((product: any) =>
            !subcategoriesSelected.find((subcategory: any) => subcategory?.parent_category_id === category?.id) ||
            subcategoriesSelected?.some((subcategory: any) => subcategory.id === product?.category_id))
          ?.sort((a: any, b: any) => a.rank - b.rank)
          ?.map((product: any, i: number) => (
            <SingleProductCard
              key={'prod_' + product.id + `_${i}`}
              isSoldOut={product.inventoried && !product.quantity}
              // enableIntersection={!isFiltMode}
              product={product}
              businessId={businessId}
              categoryState={categoryState}
              onProductClick={() => onProductClick(product)}
              productAddedToCartLength={currentCart?.products?.reduce((productsLength: number, Cproduct: any) => { return productsLength + (Cproduct?.id === product?.id ? Cproduct?.quantity : 0) }, 0)}
              handleUpdateProducts={handleUpdateProducts}
              navigation={navigation}
              businessSingleId={businessSingleId}
            />
          ))
      }
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
                      key={'feat_' + product.id + `_${i}`}
                      isSoldOut={product.inventoried && !product.quantity}
                      product={product}
                      // enableIntersection={!isFiltMode}
                      businessId={businessId}
                      categoryState={categoryState}
                      onProductClick={onProductClick}
                      handleUpdateProducts={handleUpdateProducts}
                      productAddedToCartLength={currentCart?.products?.reduce((productsLength: number, Cproduct: any) => { return productsLength + (Cproduct?.id === product?.id ? Cproduct?.quantity : 0) }, 0)}
                      navigation={navigation}
                      businessSingleId={businessSingleId}
                    />
                  ),
              )}
            </>
          </View>
        )}

      {!category?.id && categories.filter(category => category?.id !== null).map((category, i, _categories) => {
        const _products = !isUseParentCategory
          ? categoryState?.products?.filter((product: any) => product?.category_id === category?.id) ?? []
          : categoryState?.products?.filter((product: any) => category?.children?.some((cat: any) => cat.category_id === product?.category_id)) ?? []
        const products = subcategoriesSelected?.length > 0
          ? _products?.filter((product: any) =>
            !subcategoriesSelected.find((subcategory: any) => subcategory?.parent_category_id === category?.id) ||
            subcategoriesSelected?.some((subcategory: any) => subcategory.id === product?.category_id))
          : _products

        const shortCategoryDescription = category?.description?.length > 80 ? `${category?.description?.substring(0, 80)}...` : category?.description

        return (
          <React.Fragment key={'cat_' + category.id}>
            {products.length > 0 && (
              <>
                <View
                  style={bpStyles.catWrap}
                  onLayout={(event: any) => handleOnLayout(event, category.id)}
                >
                  {!!category.image && (
                    <View style={bpStyles.catIcon}>
                      <OIcon
                        url={optimizeImage(category.image, 'h_250,c_limit')}
                        width={41}
                        height={41}
                        style={{ borderRadius: 7.6 }}
                      />
                    </View>
                  )}
                  <OText size={16} weight="600">
                    {category.name}
                  </OText>
                  {category?.ribbon?.enabled && (
                    <RibbonBox
                      bgColor={category?.ribbon?.color}
                      colorText={lightenDarkenColor(category?.ribbon?.color)}
                      borderRibbon={lightenDarkenColor(category?.ribbon?.color)}
                      isRoundRect={category?.ribbon?.shape === shape?.rectangleRound}
                      isCapsule={category?.ribbon?.shape === shape?.capsuleShape}
                    >
                      <OText
                        size={10}
                        weight={'400'}
                        color={lightenDarkenColor(category?.ribbon?.color) ? theme.colors.black : theme.colors.white}
                        numberOfLines={2}
                        ellipsizeMode='tail'
                        lineHeight={13}
                      >
                        {category?.ribbon?.text}
                      </OText>
                    </RibbonBox>
                  )}
                </View>
                {!!category?.description && (
                  <View style={{ position: 'relative' }}>
                    <OText size={12} weight={'500'} mBottom={10} color='#909BA9'>
                      {shortCategoryDescription}
                      {category?.description?.length > 80 && (
                        <OButton
                          style={{ height: 15, paddingRight: 0, paddingLeft: 0, borderWidth: 0 }}
                          text={t('VIEW_MORE', 'View more')}
                          parentStyle={{ padding: 0 }}
                          onClick={() => setOpenDescription(category)}
                          bgColor={theme.colors.white}
                          borderColor={theme.colors.primary}
                          textStyle={{
                            fontSize: 12,
                            borderBottomWidth: 1,
                            color: theme.colors.primary
                          }}
                        />
                      )}
                    </OText>
                  </View>
                )}
                {category?.subcategories?.length > 0 && !isFiltMode && (
                  <SubcategoriesComponentMemoized
                    category={category}
                    subcategoriesSelected={subcategoriesSelected}
                    onClickSubcategory={onClickSubcategory}
                  />
                )}
                <>
                  {products.sort((a: any, b: any) => a.rank - b.rank).map((product: any, i: any) => (
                    <SingleProductCard
                      key={`${product?.id}_${i}`}
                      // enableIntersection={!isFiltMode}
                      isSoldOut={product.inventoried && !product.quantity}
                      businessId={businessId}
                      product={product}
                      categoryState={categoryState}
                      onProductClick={onProductClick}
                      handleUpdateProducts={handleUpdateProducts}
                      navigation={navigation}
                      productAddedToCartLength={currentCart?.products?.reduce((productsLength: number, Cproduct: any) => { return productsLength + (Cproduct?.id === product?.id ? Cproduct?.quantity : 0) }, 0)}
                      businessSingleId={businessSingleId}
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
              <View style={{ minHeight: 165, marginBottom: 28, padding: 12 }} key={i}>
                <Placeholder style={{ padding: 5 }} Animation={Fade}>
                  <View style={{ flexDirection: 'row' }}>
                    <Placeholder style={{ paddingVertical: 10, flex: 1 }}>
                      <PlaceholderLine width={60} style={{ marginBottom: 15 }} />
                      <PlaceholderLine width={20} />
                    </Placeholder>
                    <PlaceholderLine
                      width={24}
                      height={70}
                      style={{ marginLeft: 10, marginBottom: 10 }}
                    />
                  </View>
                  <PlaceholderLine
                    height={52}
                  />
                </Placeholder>
              </View>
            ),
          )}
        </>
      )}
      {!categoryState.loading &&
        !isBusinessLoading &&
        categoryState.products.length === 0 &&
        !errors &&
        !isFiltMode &&
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
              onClickButton={!businessSingleId ? () =>
                !searchValue
                  ? handleSearchRedirect && handleSearchRedirect()
                  : handleCancelSearch && handleCancelSearch()
                : null
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
      {!!openDescription && (
        <CategoryDescriptionMemoized
          openDescription={openDescription}
          setOpenDescription={setOpenDescription}
        />
      )}
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
  categoryButtonStyle: {
    borderWidth: 0,
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 10,
    height: 35,
    paddingLeft: 3,
    paddingRight: 3,
  }
});

export const BusinessProductsList = (props: BusinessProductsListParams) => {
  const businessProductsListProps = {
    ...props,
    UIComponent: BusinessProductsListUI,
  };

  return <ProductsList {...businessProductsListProps} />;
};
