import React from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { useTheme } from 'styled-components/native';
import { OIcon, OText, OIconButton } from '../shared';
import { NotFoundSource } from '../NotFoundSource';
import ToggleSwitch from 'toggle-switch-react-native';
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder';
import {
  useLanguage,
  useUtils
} from 'ordering-components/native'

export const ProductList = (props: any) => {
  const { categoryState, onClose, updateProduct } = props

  const { loading, products, error } = categoryState

  const theme = useTheme()
  const [{ optimizeImage }] = useUtils();
  const [, t] = useLanguage()

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
    arrowLeft: {
      maxWidth: 40,
      height: 25,
      justifyContent: 'flex-end',
      marginTop: 8
    },
    sectionTitle: {
      fontStyle: 'normal',
      fontWeight: '600',
      fontSize: 24,
      color: theme.colors.textGray,
    },
    logo: {
      padding: 2,
      borderRadius: 18,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1.5,
      },
      shadowOpacity: 0.21,
      shadowRadius: 3,
      elevation: 7,
    },
    icon: {
      borderRadius: 7.6,
      width: 35,
      height: 35,
      marginRight: 5
    },
  });

  const handleSwitch = (enabled: boolean, categoryId: any, productId: any) => {
    updateProduct && updateProduct(categoryId, productId, { enabled })
  };

  return (
    <View style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 20 }}>
      <View style={styles.header}>
        <OIconButton
          icon={theme.images.general.arrow_left}
          borderColor={theme.colors.clear}
          iconStyle={{ width: 20, height: 20 }}
          style={styles.arrowLeft}
          onClick={onClose}
        />
        <OText style={styles.sectionTitle}>{t('PRODUCTS', 'Products')}</OText>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.container}>
        {!loading && products?.length === 0 && (
          <NotFoundSource
            content={t('NO_RESULTS_FOUND', 'Sorry, no results found')}
            image={theme.images.general.notFound}
            conditioned={false}
          />
        )}
        {!loading && products?.length > 0 && (
          <View style={{ borderTopColor: theme.colors.borderTops, borderTopWidth: 1 }}>
            {products.map((product: any, i: number) => (
              <View
                key={i}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  borderBottomColor: theme.colors.borderTops,
                  borderBottomWidth: 1,
                  paddingVertical: 10
                }}
              >
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginRight: 36 }}>
                  <OIcon
                    url={optimizeImage(product?.images, 'h_300,c_limit')}
                    src={!product?.images && theme?.images?.dummies?.businessLogo}
                    style={styles.icon}
                  />
                  <OText numberOfLines={2} size={12} ellipsizeMode='tail'>{product?.name}</OText>
                </View>
                <ToggleSwitch
                  isOn={product?.enabled}
                  onColor={theme.colors.primary}
                  offColor={theme.colors.offColor}
                  size="small"
                  onToggle={(value: boolean) => handleSwitch(value, product?.category_id, product.id)}
                  disabled={loading}
                  animationSpeed={200}
                />
              </View>
            ))}
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
    </View>
  )
}
