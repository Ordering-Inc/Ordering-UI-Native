import React, { useState } from 'react';
import {
  Cart as CartController,
  useOrder,
  useLanguage,
  useConfig,
  useUtils,
  useValidationFields,
} from 'ordering-components/native';

import { CContainer, CartContent, CheckoutAction } from './styles';

import { OSBill, OSTable, OSCoupon, OSTotal, OSRow } from '../OrderSummary/styles';

import { ProductItemAccordion } from '../ProductItemAccordion';
import { BusinessItemAccordion } from '../BusinessItemAccordion';
import { CouponControl } from '../CouponControl';

import { OButton, OInput, OModal, OText } from '../shared';
import { ProductForm } from '../ProductForm';
import { UpsellingProducts } from '../UpsellingProducts';
import { verifyDecimals } from '../../utils';
import { useTheme } from 'styled-components/native';
import AntIcon from 'react-native-vector-icons/AntDesign'
import { TaxInformation } from '../TaxInformation';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';

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
    isForceOpenCart,
    isBusinessCart,
    handleChangeComment,
    commentState
  } = props

  const theme = useTheme()
  const [, t] = useLanguage()
  const [orderState] = useOrder()
  const [{ configs }] = useConfig();
  const [{ parsePrice, parseNumber, parseDate }] = useUtils()
  const [validationFields] = useValidationFields()

  const [openProduct, setModalIsOpen] = useState(false)
  const [curProduct, setCurProduct] = useState<any>(null)
  const [openUpselling, setOpenUpselling] = useState(false)
  const [canOpenUpselling, setCanOpenUpselling] = useState(false)
  const [openTaxModal, setOpenTaxModal] = useState<any>({ open: false, data: null })

  const isCartPending = cart?.status === 2
  const isCouponEnabled = validationFields?.fields?.checkout?.coupon?.enabled

  const momentFormatted = !orderState?.option?.moment
    ? t('RIGHT_NOW', 'Right Now')
    : parseDate(orderState?.option?.moment, { outputFormat: 'YYYY-MM-DD HH:mm' })

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

  const handleClearProducts = async () => {
    try {
      setIsCartsLoading && setIsCartsLoading(true)
      const result = await clearCart(cart?.uuid)
      setIsCartsLoading && setIsCartsLoading(false)
    } catch (error) {
      setIsCartsLoading && setIsCartsLoading(false)
    }
  }

  const handleUpsellingPage = () => {
    setOpenUpselling(false)
    setCanOpenUpselling(false)
    handleCartOpen && handleCartOpen(false)
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
    <CContainer>
      <BusinessItemAccordion
        cart={cart}
        moment={momentFormatted}
        isForceOpenAccordion={isForceOpenCart}
        isBusinessCart={isBusinessCart}
        handleClearProducts={handleClearProducts}
        handleCartOpen={handleCartOpen}
        onNavigationRedirect={props.onNavigationRedirect}
      >
        <CartContent isBusinessCart={isBusinessCart}>
          {cart?.products?.length > 0 && cart?.products.map((product: any) => (
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
                <OText>{t('SUBTOTAL', 'Subtotal')}</OText>
                <OText>
                  {parsePrice(cart?.subtotal + getIncludedTaxes())}
                </OText>
              </OSTable>
              {cart?.discount > 0 && cart?.total >= 0 && (
                <OSTable>
                  {cart?.discount_type === 1 ? (
                    <OText>
                      {t('DISCOUNT', 'Discount')}
                      <OText>{`(${verifyDecimals(cart?.discount_rate, parsePrice)}%)`}</OText>
                    </OText>
                  ) : (
                    <OText>{t('DISCOUNT', 'Discount')}</OText>
                  )}
                  <OText>- {parsePrice(cart?.discount || 0)}</OText>
                </OSTable>
              )}
              {
                cart.taxes?.length > 0 && cart.taxes.filter((tax: any) => tax.type === 2 && tax?.rate !== 0).map((tax: any) => (
                  <OSTable key={tax.id}>
                    <OSRow>
                      <OText numberOfLines={1} >
                        {tax.name || t('INHERIT_FROM_BUSINESS', 'Inherit from business')}{' '}
                        {`(${verifyDecimals(tax?.rate, parseNumber)}%)`}{' '}
                      </OText>
                      <TouchableOpacity onPress={() => setOpenTaxModal({ open: true, data: tax })} >
                        <AntIcon name='exclamationcircleo' size={18} color={theme.colors.primary} />
                      </TouchableOpacity>
                    </OSRow>
                    <OText>{parsePrice(tax?.summary?.tax || 0)}</OText>
                  </OSTable>
                ))
              }
              {
                cart?.fees?.length > 0 && cart?.fees?.filter((fee: any) => !(fee.fixed === 0 && fee.percentage === 0)).map((fee: any) => (
                  <OSTable key={fee?.id}>
                    <OSRow>
                      <OText numberOfLines={1}>
                        {fee.name || t('INHERIT_FROM_BUSINESS', 'Inherit from business')}{' '}
                        ({parsePrice(fee?.fixed)} + {fee?.percentage}%){' '}
                      </OText>
                      <TouchableOpacity onPress={() => setOpenTaxModal({ open: true, data: fee })} >
                        <AntIcon name='exclamationcircleo' size={18} color={theme.colors.primary} />
                      </TouchableOpacity>
                    </OSRow>
                    <OText>{parsePrice(fee?.summary?.fixed + fee?.summary?.percentage || 0)}</OText>
                  </OSTable>
                ))
              }
              {orderState?.options?.type === 1 && cart?.delivery_price > 0 && (
                <OSTable>
                  <OText>{t('DELIVERY_FEE', 'Delivery Fee')}</OText>
                  <OText>{parsePrice(cart?.delivery_price)}</OText>
                </OSTable>
              )}
              {cart?.driver_tip > 0 && (
                <OSTable>
                  <OText>
                    {t('DRIVER_TIP', 'Driver tip')}
                    {cart?.driver_tip_rate > 0 &&
                      parseInt(configs?.driver_tip_type?.value, 10) === 2 &&
                      !parseInt(configs?.driver_tip_use_custom?.value, 10) &&
                      (
                        `(${verifyDecimals(cart?.driver_tip_rate, parseNumber)}%)`
                      )}
                  </OText>
                  <OText>{parsePrice(cart?.driver_tip)}</OText>
                </OSTable>
              )}
              {cart?.service_fee > 0 && (
                <OSTable>
                  <OText>
                    {t('SERVICE_FEE', 'Service Fee')}
                    {`(${verifyDecimals(cart?.business?.service_fee, parseNumber)}%)`}
                  </OText>
                  <OText>{parsePrice(cart?.service_fee)}</OText>
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
                  <OText style={{ fontWeight: 'bold' }}>
                    {t('TOTAL', 'Total')}
                  </OText>
                  <OText style={{ fontWeight: 'bold' }} color={theme.colors.primary}>
                    {cart?.total >= 1 && parsePrice(cart?.total)}
                  </OText>
                </OSTable>
              </OSTotal>
              {cart?.status !== 2 && (
                <OSTable>
                  <View style={{ flex: 1, marginTop: 20, paddingBottom: 20 }}>
                    <OText>{t('COMMENTS', 'Comments')}</OText>
                    <View style={{ flex: 1 }}>
                      <OInput
                        value={cart?.comment}
                        placeholder={t('SPECIAL_COMMENTS', 'Special Comments')}
                        onChange={(value: string) => handleChangeComment(value)}
                        style={{
                          alignItems: 'flex-start',
                          width: '100%',
                          height: 100,
                          borderColor: theme.colors.textSecondary,
                          paddingRight: 50,
                          marginTop: 10
                        }}
                        multiline
                      />
                      {commentState?.loading && (
                        <View style={{ position: 'absolute', right: 20 }}>
                          <ActivityIndicator
                            size='large'
                            style={{ height: 100 }}
                            color={theme.colors.primary}
                          />
                        </View>
                      )}
                    </View>
                  </View>
                </OSTable>
              )}
            </OSBill>
          )}
        </CartContent>
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
              onClick={() => setOpenUpselling(true)}
              style={{ width: '100%', flexDirection: 'row', justifyContent: 'center', borderRadius: 0 }}
            />
          </CheckoutAction>
        )}
      </BusinessItemAccordion>
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

      {openUpselling && (
        <UpsellingProducts
          handleUpsellingPage={handleUpsellingPage}
          openUpselling={openUpselling}
          businessId={cart?.business_id}
          business={cart?.business}
          cartProducts={cart?.products}
          canOpenUpselling={canOpenUpselling}
          setCanOpenUpselling={setCanOpenUpselling}
        />
      )}
      <OModal
        open={openTaxModal.open}
        onClose={() => setOpenTaxModal({ open: false, data: null })}
        entireModal
      >
        <TaxInformation data={openTaxModal.data} products={cart.products} />
      </OModal>
    </CContainer>
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
