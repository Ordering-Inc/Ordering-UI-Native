import React, { useState, useEffect } from 'react'
import { Platform, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native'
import {
  UpsellingPage as UpsellingPageController,
  useUtils,
  useLanguage,
} from 'ordering-components/native'
import { useTheme } from 'styled-components/native';
import { OText, OIcon, OModal, OBottomPopup, OButton } from '../shared'
import { UpsellingProductsParams } from '../../types'
import {
  Container,
  UpsellingContainer,
  Item,
  Details,
  AddButton,
  CloseUpselling,
  TopBar,
  TopActions,
  WrapPrice,
  WrapperAdd
} from './styles'
import { ProductForm } from '../ProductForm';
import { OrderSummary } from '../OrderSummary';
import { ScrollView } from 'react-native-gesture-handler';
import NavBar from '../NavBar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const UpsellingProductsUI = (props: UpsellingProductsParams) => {
  const {
    isCustomMode,
    isShowTitle,
    upsellingProducts,
    business,
    cart,
    handleUpsellingPage,
    handleCloseUpsellingPage,
    openUpselling,
    canOpenUpselling,
    setCanOpenUpselling
  } = props

  const theme = useTheme();

  const styles = StyleSheet.create({
    imageStyle: {
      width: 73,
      height: 73,
      resizeMode: 'cover',
      borderRadius: 7.6,
    },
    closeUpsellingButton: {
      borderRadius: 7.6,
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary,
      borderWidth: 1,
      height: 44,
      marginBottom: 10,
      shadowOpacity: 0
    },
    cancelBtn: {
      paddingHorizontal: 18,
      borderWidth: 1,
      borderRadius: 7.6,
      borderColor: theme.colors.textSecondary,
      height: 38
    }
  })

  const [actualProduct, setActualProduct] = useState<any>(null)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [{ parsePrice, optimizeImage }] = useUtils()
  const [, t] = useLanguage()
  const { bottom } = useSafeAreaInsets()

  useEffect(() => {
    if (!isCustomMode) {
      if (upsellingProducts?.products?.length && !upsellingProducts.loading) {
        setCanOpenUpselling && setCanOpenUpselling(true)
      }
      if ((!upsellingProducts?.products?.length && !upsellingProducts.loading && !canOpenUpselling && openUpselling) ||
        (!upsellingProducts?.products?.length && !upsellingProducts.loading && openUpselling)) {
        handleUpsellingPage && handleUpsellingPage()
      }
    }
  }, [upsellingProducts.loading, upsellingProducts?.products.length])

  const handleFormProduct = (product: any) => {
    setActualProduct(product)
    setModalIsOpen(true)
  }

  const handleSaveProduct = () => {
    setActualProduct(null)
    setModalIsOpen(false)
  }

  const getProductPriceWithOffers = (product: any) => {
    return product?.in_offer
      ? product?.offer_rate_type === 1
        ? product?.price - ((product?.price * product?.offer_rate) / 100)
        : product?.offer_rate
      : product?.price
  }

  const UpsellingLayout = () => {
    return (
      <Container>
        {isShowTitle && (
          <OText
            size={16}
            lineHeight={24}
            weight={'500'}
            style={{ marginBottom: 10, marginTop: 0, paddingTop: 0 }}
          >
            {t('WANT_SOMETHING_ELSE', 'Do you want something else?')}
          </OText>
        )}
        <UpsellingContainer
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {upsellingProducts.products.map((product: any) =>(
            <Item key={product.id}>
              <Details>
                <OText
                  size={16}
                  numberOfLines={1}
                  ellipsizeMode='tail'
                  weight='bold'
                >
                  {product.name}
                </OText>
                <WrapPrice>
                  <OText
                    size={14}
                  >
                    {parsePrice(getProductPriceWithOffers(product))}
                  </OText>
                  {product?.in_offer && (
                    <OText
                      size={15}
                      color={theme.colors.lightGray}
                      style={{
                        textDecorationLine: 'line-through',
                        textDecorationStyle: 'solid',
                        marginLeft: 20
                      }}
                    >
                      {parsePrice(product?.price)}
                    </OText>
                  )}
                </WrapPrice>
                <AddButton onPress={() => handleFormProduct(product)}>
                  <WrapperAdd>
                    <OText
                      color={theme.colors.primary}
                      size={14}
                    >
                      {t('ADD', 'Add')}
                    </OText>
                  </WrapperAdd>
                </AddButton>
              </Details>
              <View style={{ width: '30%', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                <OIcon
                  url={optimizeImage(product?.images, 'h_200,c_limit')}
                  style={styles.imageStyle}
                />
              </View>
            </Item>
          ))}
        </UpsellingContainer>
      </Container>
    )
  }

  return (
    <>
      {upsellingProducts?.products?.length === 0 ? null : (
        isCustomMode ? (
          <UpsellingLayout />
        ) : (
          <>
            {!canOpenUpselling || upsellingProducts?.products?.length === 0 ? null : (
              <>
                {!modalIsOpen && (
                  <OBottomPopup
                    title={''}
                    open={openUpselling}
                    onClose={() => handleUpsellingPage()}
                  >
                    <TopBar style={{ paddingTop: Platform.OS == 'ios' ? 10 : 30 }}>
                      <TopActions onPress={() => handleCloseUpsellingPage()}>
                        <OIcon src={theme.images.general.arrow_left} width={20} />
                      </TopActions>
                      {/* <TopActions style={styles.cancelBtn} onPress={() => handleCloseUpsellingPage()}>
                        <OText size={12} color={theme.colors.textSecondary}>{t('CANCEL', 'Cancel')}</OText>
                      </TopActions> */}
                    </TopBar>
                    <ScrollView style={{ marginBottom: bottom + (Platform.OS == 'ios' ? 46 : 70) }} showsVerticalScrollIndicator={false}>
                      <View style={{ paddingHorizontal: 40 }}>
                        <OText size={20} lineHeight={30} weight={600} style={{ marginTop: 10, marginBottom: 17 }}>{t('YOUR_CART', 'Your cart')}</OText>
                        <OrderSummary
                          cart={cart}
                          isCartPending={cart?.status === 2}
                        />
                      </View>
                      <View style={{ height: 8, backgroundColor: theme.colors.backgroundGray100, marginHorizontal: -40, marginBottom: 23 }} />
                      <View style={{ paddingHorizontal: 40, overflow: 'visible' }}>
                        <OText size={16} lineHeight={24} weight={'500'}>{t('WANT_SOMETHING_ELSE', 'Do you want something else?')}</OText>
                        <UpsellingLayout />
                        <CloseUpselling>
                          <OButton
                            imgRightSrc=''
                            text={t('CHECKOUT', 'Checkout')}
                            style={styles.closeUpsellingButton}
                            textStyle={{ color: theme.colors.white, fontSize: 14 }}
                            onClick={() => handleUpsellingPage()}
                          />
                        </CloseUpselling>
                      </View>
                    </ScrollView>
                  </OBottomPopup>
                )}
              </>
            )}
          </>
        )
      )}
      <OModal
        open={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        entireModal
        customClose
      >
        {actualProduct && (
          <ProductForm
            product={actualProduct}
            businessId={actualProduct?.api?.businessId}
            businessSlug={business.slug}
            onSave={() => handleSaveProduct()}
            onClose={() => setModalIsOpen(false)}
          />
        )}
      </OModal>
    </>
  )
}

export const UpsellingProducts = (props: UpsellingProductsParams) => {
  const upsellingProductsProps = {
    ...props,
    UIComponent: UpsellingProductsUI,
  }
  return (
    <UpsellingPageController {...upsellingProductsProps} />
  )
}
