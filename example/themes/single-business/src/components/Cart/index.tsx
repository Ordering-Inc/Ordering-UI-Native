import React, { useState } from 'react';
import {
  Cart as CartController,
  useOrder,
  useLanguage,
  useConfig,
  useUtils,
  useValidationFields,
} from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { ScrollView, View, useWindowDimensions } from 'react-native';
import {
  CheckoutAction,
  OSBill,
  OSTable,
  OSCoupon,
  OSTotal,
  Title,
  LineDivider
} from './styles';

import { ProductItemAccordion } from '../ProductItemAccordion';
import { CouponControl } from '../CouponControl';

import { OButton, OModal, OText } from '../shared';
import { ProductForm } from '../ProductForm';
import { UpsellingProducts } from '../UpsellingProducts';
import { verifyDecimals } from '../../utils';
import { Container } from '../../layouts/Container';
import { NotFoundSource } from '../NotFoundSource'
import { OSRow } from '../OrderSummary/styles';
import AntIcon from 'react-native-vector-icons/AntDesign'
import { TaxInformation } from '../TaxInformation';
import { TouchableOpacity } from 'react-native';
const CartUI = (props: any) => {
  const {
    cart,
    clearCart,
    changeQuantity,
    getProductMax,
    offsetDisabled,
    removeProduct,
    handleCartOpen,
    setIsCartsLoading,
  } = props

  const theme = useTheme();
  const { height } = useWindowDimensions()

  const [, t] = useLanguage()
  const [orderState] = useOrder()
  const [{ configs }] = useConfig();
  const [{ parsePrice, parseNumber, parseDate }] = useUtils()
  const [validationFields] = useValidationFields()

  const [openProduct, setModalIsOpen] = useState(false)
  const [curProduct, setCurProduct] = useState<any>(null)
  const [openUpselling, setOpenUpselling] = useState(false)
  const [canOpenUpselling, setCanOpenUpselling] = useState(false)
  const [isUpsellingProducts, setIsUpsellingProducts] = useState(false)
  const [openTaxModal, setOpenTaxModal] = useState<any>({ open: false, data: null })

  const isCartPending = cart?.status === 2
  const isCouponEnabled = validationFields?.fields?.checkout?.coupon?.enabled

  const handleDeleteClick = (product: any) => {
    removeProduct(product, cart)
  }

  const handleEditProduct = (product: any) => {
    setCurProduct(product)
    setModalIsOpen(true)
  }

  const handlerProductAction = (product: any) => {
    if (Object.keys(product).length) {
      setModalIsOpen(false)
    }
  }

  // const handleClearProducts = async () => {
  //   try {
  //     setIsCartsLoading && setIsCartsLoading(true)
  //     const result = await clearCart(cart?.uuid)
  //     setIsCartsLoading && setIsCartsLoading(false)
  //   } catch (error) {
  //     setIsCartsLoading && setIsCartsLoading(false)
  //   }
  // }

  const handleUpsellingPage = () => {
    setOpenUpselling(false)
    setCanOpenUpselling(false)
    props.onNavigationRedirect('CheckoutNavigator', {
      screen: 'CheckoutPage',
      cartUuid: cart?.uuid,
      businessLogo: cart?.business?.logo,
      businessName: cart?.business?.name,
      cartTotal: cart?.total
    })
  }

  const getIncludedTaxes = () => {
    if (cart?.taxes === null) {
      return cart.business.tax_type === 1 ? cart?.tax : 0
    } else {
      return cart?.taxes.reduce((taxIncluded: number, tax: any) => {
        return taxIncluded + (tax.type === 1 ? tax.summary?.tax : 0)
      }, 0)
    }
  }

  return (
    cart?.products?.length > 0 ? (
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={{ height, backgroundColor: theme.colors.backgroundPage }}
      >
        <Container>
          <Title>
            <OText
              size={20}
              weight='bold'
            >
              {t('YOUR_CART', 'Your cart')}
            </OText>
          </Title>

          {cart?.products?.length > 0 && (
            <View>
              {cart?.products?.map((product: any) => (
                <ProductItemAccordion
                  key={product.code}
                  isCartPending={isCartPending}
                  isCartProduct
                  product={product}
                  changeQuantity={changeQuantity}
                  getProductMax={getProductMax}
                  offsetDisabled={offsetDisabled}
                  onDeleteProduct={handleDeleteClick}
                  onEditProduct={handleEditProduct}
                />
              ))}

              {cart?.valid_products && (
                <OSBill>
                  <OSTable>
                    <OText size={12} lineHeight={18}>{t('SUBTOTAL', 'Subtotal')}</OText>
                    <OText size={12} lineHeight={18}>
                      {parsePrice(cart?.subtotal + getIncludedTaxes())}
                    </OText>
                  </OSTable>
                  {cart?.discount > 0 && cart?.total >= 0 && (
                    <OSTable>
                      {cart?.discount_type === 1 ? (
                        <OText size={12} lineHeight={18}>
                          {t('DISCOUNT', 'Discount')}
                          <OText size={12} lineHeight={18}>{`(${verifyDecimals(cart?.discount_rate, parsePrice)}%)`}</OText>
                        </OText>
                      ) : (
                        <OText size={12} lineHeight={18}>{t('DISCOUNT', 'Discount')}</OText>
                      )}
                      <OText size={12} lineHeight={18}>- {parsePrice(cart?.discount || 0)}</OText>
                    </OSTable>
                  )}
                  {
                    cart.taxes?.length > 0 && cart.taxes.filter((tax: any) => tax.type === 2 && tax?.rate !== 0).map((tax: any) => (
                      <OSTable key={tax.id}>
                        <OSRow>
                          <OText size={12} numberOfLines={1} >
                            {tax.name || t('INHERIT_FROM_BUSINESS', 'Inherit from business')}{' '}
                            {`(${verifyDecimals(tax?.rate, parseNumber)}%)`}{' '}
                          </OText>
                          <TouchableOpacity onPress={() => setOpenTaxModal({ open: true, data: tax })} >
                            <AntIcon name='exclamationcircleo' size={12} color={theme.colors.primary} />
                          </TouchableOpacity>
                        </OSRow>
                        <OText size={12}>{parsePrice(tax?.summary?.tax || 0)}</OText>
                      </OSTable>
                    ))
                  }
                  {
                    cart?.fees?.length > 0 && cart?.fees?.filter((fee: any) => !(fee.fixed === 0 && fee.percentage === 0)).map((fee: any) => (
                      <OSTable key={fee?.id}>
                        <OSRow>
                          <OText size={12} numberOfLines={1}>
                            {fee.name || t('INHERIT_FROM_BUSINESS', 'Inherit from business')}{' '}
                            ({parsePrice(fee?.fixed)} + {fee?.percentage}%){' '}
                          </OText>
                          <TouchableOpacity onPress={() => setOpenTaxModal({ open: true, data: fee })} >
                            <AntIcon name='exclamationcircleo' size={12} color={theme.colors.primary} />
                          </TouchableOpacity>
                        </OSRow>
                        <OText size={12}>{parsePrice(fee?.summary?.fixed + fee?.summary?.percentage || 0)}</OText>
                      </OSTable>
                    ))
                  }
                  {orderState?.options?.type === 1 && cart?.delivery_price > 0 && (
                    <OSTable>
                      <OText size={12} lineHeight={18}>{t('DELIVERY_FEE', 'Delivery Fee')}</OText>
                      <OText size={12} lineHeight={18}>{parsePrice(cart?.delivery_price)}</OText>
                    </OSTable>
                  )}
                  {cart?.driver_tip > 0 && (
                    <OSTable>
                      <OText size={12} lineHeight={18}>
                        {t('DRIVER_TIP', 'Driver tip')}
                        {cart?.driver_tip_rate > 0 &&
                          parseInt(configs?.driver_tip_type?.value, 10) === 2 &&
                          !parseInt(configs?.driver_tip_use_custom?.value, 10) &&
                          (
                            `(${verifyDecimals(cart?.driver_tip_rate, parseNumber)}%)`
                          )}
                      </OText>
                      <OText size={12} lineHeight={18}>{parsePrice(cart?.driver_tip)}</OText>
                    </OSTable>
                  )}
                  {isCouponEnabled && !isCartPending && (
                    <OSTable>
                      <OSCoupon>
                        <CouponControl
                          businessId={cart.business_id}
                          price={cart.total}
                        />
                      </OSCoupon>
                    </OSTable>
                  )}

                  <OSTotal>
                    <OSTable style={{ marginTop: 15 }}>
                      <OText size={14} lineHeight={21} weight={'600'}>
                        {t('TOTAL', 'Total')}
                      </OText>
                      <OText size={14} lineHeight={21} weight={'600'}>
                        {cart?.total >= 1 && parsePrice(cart?.total)}
                      </OText>
                    </OSTable>
                  </OSTotal>
                </OSBill>
              )}
            </View>
          )}
        </Container>

        {cart?.products?.length > 0 && (
          <>
            <LineDivider />

            <Container>
              <View style={{ padding: 0, }}>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                >
                  <UpsellingProducts
                    isCustomMode
                    isShowTitle
                    openUpselling={openUpselling}
                    businessId={cart?.business_id}
                    business={cart?.business}
                    cartProducts={cart?.products}
                    canOpenUpselling={canOpenUpselling}
                    setCanOpenUpselling={setCanOpenUpselling}
                    handleUpsellingPage={handleUpsellingPage}
                    handleCloseUpsellingPage={() => { }}
                    handleUpsellingProducts={setIsUpsellingProducts}
                  />
                </ScrollView>

                {cart?.valid_products && (
                  <CheckoutAction>
                    <OButton
                      text={(cart?.subtotal >= cart?.minimum || !cart?.minimum) && cart?.valid_address ? (
                        !openUpselling !== canOpenUpselling ? t('CHECKOUT', 'Checkout') : t('LOADING', 'Loading')
                      ) : !cart?.valid_address ? (
                        `${t('OUT_OF_COVERAGE', 'Out of Coverage')}`
                      ) : (
                        `${t('MINIMUN_SUBTOTAL_ORDER', 'Minimum subtotal order:')} ${parsePrice(cart?.minimum)}`
                      )}
                      bgColor={(cart?.subtotal < cart?.minimum || !cart?.valid_address) ? theme.colors.secundary : theme.colors.primary}
                      isDisabled={(openUpselling && !canOpenUpselling) || cart?.subtotal < cart?.minimum || !cart?.valid_address}
                      borderColor={theme.colors.primary}
                      imgRightSrc={null}
                      textStyle={{ color: 'white', textAlign: 'center', flex: 1 }}
                      onClick={() => props.onNavigationRedirect('CheckoutNavigator', {
                        screen: 'CheckoutPage',
                        cartUuid: cart?.uuid,
                        businessLogo: cart?.business?.logo,
                        businessName: cart?.business?.name,
                        cartTotal: cart?.total
                      })}
                      style={{ width: '100%', flexDirection: 'row', justifyContent: 'center', borderRadius: 7.6, shadowOpacity: 0 }}
                    />
                  </CheckoutAction>
                )}
              </View>
            </Container>
          </>
        )}

        <OModal
          open={openProduct}
          entireModal
          customClose
          onClose={() => setModalIsOpen(false)}
        >
          <ProductForm
            isCartProduct
            productCart={curProduct}
            businessSlug={cart?.business?.slug}
            businessId={cart?.business_id}
            categoryId={curProduct?.category_id}
            productId={curProduct?.id}
            onSave={handlerProductAction}
            onClose={() => setModalIsOpen(false)}
          />

        </OModal>
      </ScrollView>
    ) : (
      <Container>
        <Title>
          <OText
            size={20}
            weight='bold'
          >
            {t('YOUR_CART', 'Your cart')}
          </OText>
        </Title>
        <View style={{ height: height * 0.7, justifyContent: 'center' }}>
          <NotFoundSource
            content={t('NO_PRODUCTS_FOUND', 'Sorry, no products found')}
            image={theme.images.general.notFound}
          />
        </View>
        <OModal
          open={openTaxModal.open}
          onClose={() => setOpenTaxModal({ open: false, data: null })}
          entireModal
        >
          <TaxInformation data={openTaxModal.data} products={cart.products} />
        </OModal>
      </Container>
    )
  )
}

export const Cart = (props: any) => {
  const cartProps = {
    ...props,
    UIComponent: CartUI
  }

  return (
    <CartController {...cartProps} />
  )
}
