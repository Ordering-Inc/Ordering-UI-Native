import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder';
import { useTheme } from 'styled-components/native';
import { SearchBar } from '../SearchBar';
import {
  ToastType,
  useToast,
  useLanguage,
  StoreProductList
} from 'ordering-components/native';
import { NotFoundSource } from '../NotFoundSource';
import { OText, OIcon } from '../shared';
import { IterateCategories } from './IterateCategories';
import { ProductList } from './ProductList'

const BusinessProductListUI = (props: any) => {
  const {
    navigation,
    businessState,
    productsList,
    updateStoreCategory,
    updateStoreProduct,
    productSearch,
    categorySearch,
    handleChangeCategory,
    handleChangeProductSearch,
    handleChangeCategorySearch,
    getCategoryProducts,
    categories
  } = props;

  const { loading, error, business } = businessState;

  const [, t] = useLanguage();
  const [, { showToast }] = useToast();
  const theme = useTheme();

  const [showModal, setShowModal] = useState(false)

  const handleOpenProducts = (category: any) => {
    handleChangeCategory(category)
    setShowModal(true)
  }

  useEffect(() => {
    if (error) {
      showToast(
        ToastType.Error,
        error || error[0] || t('NETWORK_ERROR', 'Network Error'),
      );
    }
  }, [loading]);

  const styles = StyleSheet.create({
    container: {
      paddingBottom: 20,
      marginBottom: 0,
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    sectionTitle: {
      fontStyle: 'normal',
      fontWeight: '600',
      fontSize: 20,
      color: theme.colors.textGray,
    },
    borderStyle: {
      borderColor: theme.colors.red,
      borderWidth: 0,
      borderRadius: 10,
    },
    btnBackArrow: {
      borderWidth: 0,
      width: 32,
      height: 32,
      tintColor: theme.colors.textGray,
      backgroundColor: theme.colors.clear,
      borderColor: theme.colors.clear,
      shadowColor: theme.colors.clear,
      paddingLeft: 0,
      paddingRight: 0
    },
  });

  return (
    <>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => navigation?.canGoBack() && navigation.goBack()}
            style={styles.btnBackArrow}
          >
            <OIcon src={theme.images.general.arrow_left} color={theme.colors.textGray} />
          </TouchableOpacity>
          <OText style={styles.sectionTitle}>{t('CATEGORIES', 'Categories')}</OText>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <SearchBar
            borderStyle={styles.borderStyle}
            onSearch={handleChangeCategorySearch}
            searchValue={categorySearch}
            lazyLoad
            isCancelXButtonShow={!!categorySearch}
            onCancel={() => handleChangeCategorySearch('')}
            placeholder={t('SEARCH', 'Search')}
            containerStyle={{ width: 180 }}
          />
        </View>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.container}>
        {!loading && business?.categories?.length === 0 && (
          <NotFoundSource
            content={t('NO_RESULTS_FOUND', 'Sorry, no results found')}
            image={theme.images.general.notFound}
            conditioned={false}
          />
        )}
        {!error && !loading && categories?.length > 0 && (
          <View
            style={{
              borderTopColor: theme.colors.borderTops,
              borderTopWidth: 1
            }}
          >
            <IterateCategories
              list={categories}
              handlerClickCategory={handleOpenProducts}
              updateCategory={updateStoreCategory}
            />
          </View>
        )}
        {loading && (
          <View style={{ borderTopColor: theme.colors.borderTops, borderTopWidth: 1 }}>
            {[...Array(6)].map((item, i) => (
              <Placeholder key={i} Animation={Fade}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 10,
                    borderBottomColor: theme.colors.borderTops,
                    borderBottomWidth: 1,
                    paddingVertical: 10
                  }}
                >
                  <PlaceholderLine width={50} />
                  <PlaceholderLine width={20} />
                </View>
              </Placeholder>
            ))}
          </View>
        )}
      </ScrollView>
      {showModal && (
        <View
          style={{
            flex: 1,
            position: 'absolute',
            top: 0,
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
            backgroundColor: theme.colors.backgroundLight,
            left: 0
          }}
        >
          <ProductList
            productsList={productsList}
            updateProduct={updateStoreProduct}
            searchValue={productSearch}
            handleChangeSearch={handleChangeProductSearch}
            getCategoryProducts={getCategoryProducts}
            onClose={() => setShowModal(false)}
          />
        </View>
      )}
    </>
  );
};

export const BusinessProductList = (props: any) => {
  const businessProductListProps = {
    ...props,
    UIComponent: BusinessProductListUI,
    isIos: Platform.OS === 'ios'
  };

  return <StoreProductList {...businessProductListProps} />;
};
