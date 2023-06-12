import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder';
import { useTheme } from 'styled-components/native';
import {
  ToastType,
  useToast,
  useLanguage,
  BusinessAndProductList,
} from 'ordering-components/native';
import { NotFoundSource } from '../NotFoundSource';
import { OText, OIconButton } from '../shared';
import { IterateCategories } from './IterateCategories';
import { ProductList } from './ProductList'

const BusinessProductListUI = (props: any) => {
  const {
    navigation,
    businessState,
    handleChangeCategory,
    categoryState,
    updateStoreCategory,
    updateStoreProduct
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
      fontSize: 24,
      color: theme.colors.textGray,
    },
    arrowLeft: {
      maxWidth: 40,
      height: 25,
      justifyContent: 'flex-end',
      marginTop: 8
    },
  });

  return (
    <>
      <View style={styles.header}>
        <OIconButton
          icon={theme.images.general.arrow_left}
          borderColor={theme.colors.clear}
          iconStyle={{ width: 20, height: 20 }}
          style={styles.arrowLeft}
          onClick={() => navigation?.canGoBack() && navigation.goBack()}
        />
        <OText style={styles.sectionTitle}>{t('CATEGORIES', 'Categories')}</OText>
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
        {!error && !loading && business?.categories?.length > 0 && (
          <View
            style={{
              borderTopColor: theme.colors.borderTops,
              borderTopWidth: 1
            }}
          >
            <IterateCategories
              list={business?.categories}
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
            categoryState={categoryState}
            updateProduct={updateStoreProduct}
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
    isFetchAllProducts: true,
    UIComponent: BusinessProductListUI,
  };

  return <BusinessAndProductList {...businessProductListProps} />;
};
