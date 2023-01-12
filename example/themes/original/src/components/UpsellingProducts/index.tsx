import React, { useState, useEffect } from 'react'
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native'
import {
  UpsellingPage as UpsellingPageController,
  useUtils,
  useLanguage,
  useOrder,
  useConfig
} from 'ordering-components/native'
import { useTheme } from 'styled-components/native';
import { OText, OIcon, OBottomPopup, OButton } from '../shared'
import { UpsellingProductsParams } from '../../types'
import {
  Container,
  UpsellingContainer,
  Item,
  Details,
  AddButton,
  CartList,
  CartDivider
} from './styles'
import { OrderSummary } from '../OrderSummary';
import { Cart } from '../Cart';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const UpsellingProductsUI = (props: UpsellingProductsParams) => {
  const {
    isCustomMode,
    upsellingProducts,
    business,
    handleUpsellingPage,
    handleCloseUpsellingPage,
    openUpselling,
    canOpenUpselling,
    setCanOpenUpselling,
    isFromCart,
    onNavigationRedirect,
    onGoBack
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
      alignSelf: 'center',
      height: 44,
      shadowOpacity: 0,
      width: '80%',
    },
    cancelBtn: {
      paddingHorizontal: 18,
      borderWidth: 1,
      borderRadius: 7.6,
      borderColor: theme.colors.textSecondary,
      height: 38
    },
    headerItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 2,
      marginHorizontal: 20,
    },
    btnBackArrow: {
      borderWidth: 0,
      width: 26,
      height: 26,
      backgroundColor: theme.colors.clear,
      borderColor: theme.colors.clear,
      shadowColor: theme.colors.clear,
      paddingLeft: 0,
      paddingRight: 0,
      marginLeft: 20,
      marginBottom: 10
    },
  })

  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [{ carts }] = useOrder()
  const [{ parsePrice }] = useUtils()
  const [{ configs }] = useConfig()
  const [, t] = useLanguage()
  const { bottom } = useSafeAreaInsets()
  const [isCheckout, setIsCheckout] = useState(false)
  const [isCartsLoading, setIsCartsLoading] = useState(false)

  const isMultiCheckout = configs?.checkout_multi_business_enabled?.value === '1'
  const isChewLayout = theme?.header?.components?.layout?.type?.toLowerCase() === 'chew'
  const showCartList = isChewLayout
  const commentDelayTime = isChewLayout ? 500 : null

  const cart = carts?.[`businessId:${props.businessId}`] ?? {}
  const cartList = (carts && Object.values(carts).filter((_cart: any) => _cart?.products?.length > 0 && _cart.uuid !== cart?.uuid)) || []
  const cartProducts = cart?.products?.length
    ? cart?.products.map((product: any) => product.id)
    : []

  const productsList = !upsellingProducts.loading && !upsellingProducts.error
    ? upsellingProducts?.products?.length
      ? upsellingProducts?.products.filter((product: any) => !cartProducts.includes(product.id))
      : (props?.products ?? []).filter((product: any) => !cartProducts.includes(product.id)) ?? []
    : []

  useEffect(() => {
    if (!isCustomMode && !props.products) {
      if (!upsellingProducts.loading) {
        if (upsellingProducts?.products?.length && !isFromCart) {
          setCanOpenUpselling && setCanOpenUpselling(true)
        } else {
          handleUpsellingPage && handleUpsellingPage()
        }
      }
    }
  }, [upsellingProducts.loading, upsellingProducts?.products.length])

  const handleFormProduct = (product: any) => {
    onNavigationRedirect && onNavigationRedirect('ProductDetails', {
      product: product,
      businessId: product?.api?.businessId,
      businessSlug: business.slug,
    })
  }

  const UpsellingLayout = () => {
    return (
      <Container>
        <UpsellingContainer
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: Platform.OS === 'ios' ? 40 : 0 }}
        >
          {
            !upsellingProducts.loading && (
              <>
                {
                  !upsellingProducts.error ? productsList.map((product: any, i: number) => (
                    <Item key={`${product.id}_${i}`}>
                      <View style={{ flexBasis: '57%' }}>
                        <Details>
                          <OText size={12} lineHeight={18} numberOfLines={1} ellipsizeMode='tail'>{product.name}</OText>
                          <OText size={12} lineHeight={18} color={theme.colors.textNormal}>{parsePrice(product.price)}</OText>
                        </Details>
                        <AddButton onPress={() => handleFormProduct(product)}>
                          <OText size={10} color={theme.colors.primary}>{t('ADD', 'Add')}</OText>
                        </AddButton>
                      </View>
                      <View>
                        <OIcon url={product?.images || theme?.images?.dummies?.product} style={styles.imageStyle} />
                      </View>
                    </Item>
                  )) : (
                    <OText>
                      {upsellingProducts.message}
                    </OText>
                  )
                }
              </>
            )
          }
        </UpsellingContainer>
      </Container>
    )
  }

  const UpsellingContent = () => {
    return (
      <>
        <View style={{ ...styles.headerItem, flex: 1, marginTop: Platform.OS == 'ios' ? 35 : 14 }}>
          <TouchableOpacity onPress={() => onGoBack()} style={styles.btnBackArrow}>
            <OIcon src={theme.images.general.arrow_left} color={theme.colors.textNormal} />
          </TouchableOpacity>
        </View>
        <ScrollView style={{ marginTop: 10, marginBottom: props.isPage ? 40 : bottom + (Platform.OS == 'ios' ? 96 : 130) }} showsVerticalScrollIndicator={false}>
          {productsList.length > 0 &&
            <View style={{ paddingHorizontal: 40, overflow: 'visible' }}>
              <OText size={16} lineHeight={24} weight={'500'}>{t('WANT_SOMETHING_ELSE', 'Do you want something else?')}</OText>
              <UpsellingLayout />
            </View>
          }
          <View style={{ paddingHorizontal: 40 }}>
            <OText size={20} lineHeight={30} weight={600} style={{ marginTop: 10, marginBottom: 17 }}>{t('YOUR_CART', 'Your cart')}</OText>
            <OrderSummary
              cart={cart}
              commentDelayTime={commentDelayTime}
              isCartPending={cart?.status === 2}
              onNavigationRedirect={onNavigationRedirect}
            />
          </View>
          {showCartList && cartList.map((cart: any, i: number) => (
            <CartList key={i}>
              <Cart
                cart={cart}
                cartuuid={cart.uuid}
                hideUpselling
                singleBusiness={props.singleBusiness}
                isFranchiseApp={props.isFranchiseApp}
                isCartsLoading={isCartsLoading}
                setIsCartsLoading={setIsCartsLoading}
                isMultiCheckout={isMultiCheckout}
                onNavigationRedirect={props.onNavigationRedirect}
              />
              <CartDivider />
            </CartList>
          ))}
        </ScrollView>
        <View
          style={{
            alignItems: 'center',
            bottom: props.isPage ? Platform.OS === 'ios' ? 0 : 20 : Platform.OS === 'ios' ? bottom + 59 : bottom + 125
          }}
        >
          <OButton
            imgRightSrc=''
            text={t('CHECKOUT', 'Checkout')}
            style={{ ...styles.closeUpsellingButton }}
            textStyle={{ color: theme.colors.white, fontSize: 14 }}
            onClick={() => {
              handleUpsellingPage()
              setIsCheckout(true)
            }}
          />
        </View>
      </>
    )
  }

  return (
    <>
      {isCustomMode ? (
        <UpsellingLayout />
      ) : (
        <>
          {props.isPage ? (
            <UpsellingContent />
          ) : (
            canOpenUpselling && !modalIsOpen && (
              <OBottomPopup
                title={''}
                open={openUpselling}
                onClose={() => handleUpsellingPage()}
                isStatusBar
              >
                <UpsellingContent />
              </OBottomPopup>
            )
          )}
        </>
      )}
    </>
  )
}

export const UpsellingProducts = (props: UpsellingProductsParams) => {
  const upsellingProductsProps = {
    ...props,
    UIComponent: UpsellingProductsUI
  }
  return (
    <UpsellingPageController {...upsellingProductsProps} />
  )
}
