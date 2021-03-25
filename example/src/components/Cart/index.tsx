import React, { useState, useEffect } from 'react';
import {
  Cart as CartController,
  useOrder,
  useLanguage,
  useEvent,
  useUtils,
  useValidationFields,
} from 'ordering-components/native';

import {
  CContainer,
  OrderBill,
  CheckoutAction,
  CouponContainer
} from './styles';

import { OSBill, OSTable, OSCoupon, OSTotal } from '../OrderSummary/styles';

import { ProductItemAccordion } from '../ProductItemAccordion';
import { BusinessItemAccordion } from '../BusinessItemAccordion';
import { CouponControl } from '../CouponControl';

// import { ProductForm } from '../ProductForm';

import { OButton, OModal, OText, OBottomPopup } from '../shared';
import { colors } from '../../theme';
import { ProductForm } from '../ProductForm';
import { UpsellingProducts } from '../UpsellingProducts';

const CartUI = (props: any) => {
  const {
    cart,
    clearCart,
    changeQuantity,
    getProductMax,
    offsetDisabled,
    removeProduct,
    handleCartOpen
  } = props

  const [, t] = useLanguage()
  const [orderState] = useOrder()
  // const [events] = useEvent()
  const [{ parsePrice, parseNumber, parseDate }] = useUtils()
  const [validationFields] = useValidationFields()

  const [confirm, setConfirm] = useState<any>({ open: false, content: null, handleOnAccept: null })
  const [openProduct, setModalIsOpen] = useState(false)
  const [curProduct, setCurProduct] = useState<any>(null)
  const [openUpselling, setOpenUpselling] = useState(false)
  const [canOpenUpselling, setCanOpenUpselling] = useState(false)

  const [isCartsLoading, setIsCartsLoading] = useState(false)

  const isCartPending = cart?.status === 2
  const isCouponEnabled = validationFields?.fields?.checkout?.coupon?.enabled

  const momentFormatted = !orderState?.option?.moment
    ? t('RIGHT_NOW', 'Right Now')
    : parseDate(orderState?.option?.moment, { outputFormat: 'YYYY-MM-DD HH:mm' })

  const handleDeleteClick = (product: any) => {
    removeProduct(product)
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
      setIsCartsLoading(true)
      const result = await clearCart(cart?.uuid)
      setIsCartsLoading(false)
    } catch (error) {
      setIsCartsLoading(false)
    }
  }

  const handleUpsellingPage = () => {
    setOpenUpselling(false)
    setCanOpenUpselling(false)
    props.onNavigationRedirect('CheckoutNavigator', { cartUuid: cart?.uuid })
  }

  return (
    <CContainer>
      <BusinessItemAccordion
        cart={cart}
        moment={momentFormatted}
        isCartsLoading={isCartsLoading}
        handleClearProducts={handleClearProducts}
        handleCartOpen={handleCartOpen}
        onNavigationRedirect={props.onNavigationRedirect}
      >
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
              <OText>{parsePrice(cart?.subtotal || 0)}</OText>
            </OSTable>
            <OSTable>
              <OText>
                {
                  cart.business.tax_type === 1
                    ? t('TAX_INCLUDED', 'Tax (included)')
                    : t('TAX', 'Tax')
                }
                {`(${parseNumber(cart?.business?.tax)}%)`}
              </OText>
              <OText>{parsePrice(cart?.tax || 0)}</OText>
            </OSTable>
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
                  {(cart?.driver_tip_rate > 0) && (
                    `(${parseNumber(cart?.driver_tip_rate)}%)`
                  )}
                </OText>
                <OText>{parsePrice(cart?.driver_tip)}</OText>
              </OSTable>
            )}
            {cart?.service_fee > 0 && (
              <OSTable>
                <OText>
                  {t('SERVICE_FEE', 'Service Fee')}
                  {`(${parseNumber(cart?.business?.service_fee)}%)`}
                </OText>
                <OText>{parsePrice(cart?.service_fee)}</OText>
              </OSTable>
            )}
            {cart?.discount > 0 && cart?.total >= 0 && (
              <OSTable>
                {cart?.discount_type === 1 ? (
                  <OText>
                    {t('DISCOUNT', 'Discount')}
                    <OText>{`(${parseNumber(cart?.discount_rate)}%)`}</OText>
                  </OText>
                ) : (
                  <OText>{t('DISCOUNT', 'Discount')}</OText>
                )}
                <OText>- {parsePrice(cart?.discount || 0)}</OText>
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
                <OText style={{ fontWeight: 'bold' }} color={colors.primary}>
                  {cart?.total >= 1 && parsePrice(cart?.total)}
                </OText>
              </OSTable>
            </OSTotal>
          </OSBill>
        )}
        <CheckoutAction>
          <OButton
            text={(cart?.subtotal >= cart?.minimum || !cart?.minimum) && cart?.valid_address ? (
              !openUpselling !== canOpenUpselling ? t('CHECKOUT', 'Checkout') : t('LOADING', 'Loading')
            ) : !cart?.valid_address ? (
              `${t('OUT_OF_COVERAGE', 'Out of Coverage')}`
            ) : (
              `${t('MINIMUN_SUBTOTAL_ORDER', 'Minimum subtotal order:')} ${parsePrice(cart?.minimum)}`
            )}
            bgColor={(cart?.subtotal < cart?.minimum || !cart?.valid_address) ? colors.secundary : colors.primary}
            isDisabled={(openUpselling && !canOpenUpselling) || cart?.subtotal < cart?.minimum || !cart?.valid_address}
            borderColor={colors.primary}
            imgRightSrc={null}
            textStyle={{ color: 'white', textAlign: 'center', flex: 1 }}
            onClick={() => setOpenUpselling(true)}
            style={{width: '100%', flexDirection: 'row', justifyContent: 'center'}}
          />
        </CheckoutAction>
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
          businessId={curProduct?.business_id}
          categoryId={curProduct?.category_id}
          productId={curProduct?.id}
          onSave={handlerProductAction}
          onClose={() => setModalIsOpen(false)}
        />

      </OModal>
      <OBottomPopup open={openUpselling}>
        <UpsellingProducts
          handleUpsellingPage={handleUpsellingPage}
          openUpselling={openUpselling}
          businessId={cart?.business_id}
          business={cart?.business}
          cartProducts={cart?.products}
          canOpenUpselling={canOpenUpselling}
          setCanOpenUpselling={setCanOpenUpselling}
        />
      </OBottomPopup>

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
