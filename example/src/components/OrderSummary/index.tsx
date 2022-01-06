import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native'
import {
  Cart,
  useOrder,
  useLanguage,
  useUtils,
  useConfig,
  useValidationFields,
} from 'ordering-components/native';

import {
  OSContainer,
  OSProductList,
  OSBill,
  OSTable,
  OSRow
} from './styles';

import { ProductItemAccordion } from '../ProductItemAccordion';
import { CouponControl } from '../CouponControl';
import { OModal, OText } from '../shared';
import { ProductForm } from '../ProductForm';
import { verifyDecimals } from '../../utils';
import { useTheme } from 'styled-components/native';
import { TaxInformation } from '../TaxInformation';
import AntIcon from 'react-native-vector-icons/AntDesign'
const OrderSummaryUI = (props: any) => {
  const {
    cart,
    changeQuantity,
    getProductMax,
    offsetDisabled,
    removeProduct,
    isCartPending,
    isFromCheckout
  } = props;

  const theme = useTheme();
  const [, t] = useLanguage();
  const [{ configs }] = useConfig();
  const [orderState] = useOrder();
  const [{ parsePrice, parseNumber }] = useUtils();
  const [validationFields] = useValidationFields();
  const [openProduct, setModalIsOpen] = useState(false)
  const [curProduct, setCurProduct] = useState<any>(null)
  const [openTaxModal, setOpenTaxModal] = useState<any>({ open: false, data: null })

  const isCouponEnabled = validationFields?.fields?.checkout?.coupon?.enabled;

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
    <OSContainer>
      {cart?.products?.length > 0 && (
        <>
          <OSProductList>
            {cart?.products.map((product: any) => (
              <ProductItemAccordion
                key={product.code}
                product={product}
                isCartPending={isCartPending}
                isCartProduct
                changeQuantity={changeQuantity}
                getProductMax={getProductMax}
                offsetDisabled={offsetDisabled}
                onDeleteProduct={handleDeleteClick}
                onEditProduct={handleEditProduct}
                isFromCheckout={isFromCheckout}
              />
            ))}
          </OSProductList>
          {cart?.valid && (
            <OSBill>
              <OSTable>
                <OText size={18}>{t('SUBTOTAL', 'Subtotal')}</OText>
                <OText size={18}>{parsePrice(cart?.subtotal + getIncludedTaxes())}</OText>
              </OSTable>
              {cart?.discount > 0 && cart?.total >= 0 && (
                <OSTable>
                  {cart?.discount_type === 1 ? (
                    <OText size={18}>
                      {t('DISCOUNT', 'Discount')}
                      <OText size={18}>{`(${verifyDecimals(cart?.discount_rate, parsePrice)}%)`}</OText>
                    </OText>
                  ) : (
                    <OText size={18}>{t('DISCOUNT', 'Discount')}</OText>
                  )}
                  <OText size={18}>- {parsePrice(cart?.discount || 0)}</OText>
                </OSTable>
              )}
              {
                cart?.taxes?.length > 0 && cart?.taxes?.filter((tax: any) => tax?.type === 2 || tax?.rate === 0).map((tax: any) => (
                  <OSTable key={tax?.id}>
                    <OSRow>
                      <OText size={18} numberOfLines={1}>
                        {tax?.name || t('INHERIT_FROM_BUSINESS', 'Inherit from business')}{' '}
                        {`(${verifyDecimals(tax?.rate, parseNumber)}%)`}{' '}
                      </OText>
                      <TouchableOpacity onPress={() => setOpenTaxModal({ open: true, data: tax })} >
                        <AntIcon name='exclamationcircleo' size={20} color={theme.colors.primary} />
                      </TouchableOpacity>
                    </OSRow>
                    <OText size={18}>{parsePrice(tax?.summary?.tax || 0)}</OText>
                  </OSTable>
                ))
              }
              {
                cart?.fees?.length > 0 && cart?.fees?.filter((fee: any) => !(fee.fixed === 0 && fee.percentage === 0))?.map((fee: any) => (
                  <OSTable key={fee.id}>
                    <OSRow>
                      <OText size={18} numberOfLines={1}>
                        {fee.name || t('INHERIT_FROM_BUSINESS', 'Inherit from business')}{' '}
                        ({parsePrice(fee?.fixed)} + {fee.percentage}%){' '}
                      </OText>
                      <TouchableOpacity onPress={() => setOpenTaxModal({ open: true, data: fee })} >
                        <AntIcon name='exclamationcircleo' size={20} color={theme.colors.primary} />
                      </TouchableOpacity>
                    </OSRow>
                    <OText size={18}>{parsePrice(fee?.summary?.fixed + fee?.summary?.percentage || 0)}</OText>
                  </OSTable>
                ))
              }
              {orderState?.options?.type === 1 && cart?.delivery_price > 0 && (
                <OSTable>
                  <OText size={18}>{t('DELIVERY_FEE', 'Delivery Fee')}</OText>
                  <OText size={18}>{parsePrice(cart?.delivery_price)}</OText>
                </OSTable>
              )}
              {cart?.driver_tip > 0 && (
                <OSTable>
                  <OText size={18}>
                    {t('DRIVER_TIP', 'Driver tip')}
                    {cart?.driver_tip_rate > 0 &&
                      parseInt(configs?.driver_tip_type?.value, 10) === 2 &&
                      !parseInt(configs?.driver_tip_use_custom?.value, 10) &&
                      (
                        `(${verifyDecimals(cart?.driver_tip_rate, parseNumber)}%)`
                      )}
                  </OText>
                  <OText size={18}>{parsePrice(cart?.driver_tip)}</OText>
                </OSTable>
              )}
              {isCouponEnabled && !isCartPending && (
                <View>
                  <View style={{ paddingVertical: 5 }}>
                    <CouponControl
                      businessId={cart.business_id}
                      price={cart.total}
                    />
                  </View>
                </View>
              )}
              {cart?.total >= 1 && (
                <View style={{ marginTop: 15, borderTopWidth: 1, borderTopColor: '#d9d9d9' }}>
                  <OSTable style={{ marginTop: 15 }}>
                    <OText size={18} style={{ fontWeight: 'bold' }}>
                      {t('TOTAL', 'Total')}
                    </OText>
                    <OText size={18} style={{ fontWeight: 'bold' }} color={theme.colors.primary}>
                      {parsePrice(cart?.total)}
                    </OText>
                  </OSTable>
                </View>
              )}
            </OSBill>
          )}
          <OModal
            open={openProduct}
            entireModal
            customClose
            onClose={() => setModalIsOpen(false)}
            isAvoidKeyBoardView
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
              isFromCheckout={isFromCheckout}
            />
          </OModal>
          <OModal
            open={openTaxModal.open}
            onClose={() => setOpenTaxModal({ open: false, data: null })}
            entireModal
          >
            <TaxInformation data={openTaxModal.data} products={cart.products} />
          </OModal>
        </>
      )}
    </OSContainer>
  )
}

export const OrderSummary = (props: any) => {
  const orderSummaryProps = {
    ...props,
    UIComponent: OrderSummaryUI
  }

  return (
    <Cart {...orderSummaryProps} />
  )
}
