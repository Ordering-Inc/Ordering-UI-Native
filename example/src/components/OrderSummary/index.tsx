import React, { useState } from 'react';
import { View } from 'react-native'
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
  OSTotal,
  OSCoupon
} from './styles';

import { ProductItemAccordion } from '../ProductItemAccordion';
import { CouponControl } from '../CouponControl';
import { OModal, OText } from '../shared';
import { colors } from '../../theme.json';
import { ProductForm } from '../ProductForm';
import { verifyDecimals } from '../../utils';


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

  const [, t] = useLanguage();
  const [{ configs }] = useConfig();
  const [orderState] = useOrder();
  const [{ parsePrice, parseNumber }] = useUtils();
  const [validationFields] = useValidationFields();
  const [openProduct, setModalIsOpen] = useState(false)
  const [curProduct, setCurProduct] = useState<any>(null)

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
            <View>
              <View>
                <OText>{t('SUBTOTAL', 'Subtotal')}</OText>
                <OText>{cart.business.tax_type === 1
                    ? parsePrice((cart?.subtotal + cart?.tax) || 0)
                    : parsePrice(cart?.subtotal || 0)}</OText>
              </View>
              {cart?.discount > 0 && cart?.total >= 0 && (
                <View>
                  {cart?.discount_type === 1 ? (
                    <OText>
                      {t('DISCOUNT', 'Discount')}
                      <OText>{`(${verifyDecimals(cart?.discount_rate, parsePrice)}%)`}</OText>
                    </OText>
                  ) : (
                    <OText>{t('DISCOUNT', 'Discount')}</OText>
                  )}
                  <OText>- {parsePrice(cart?.discount || 0)}</OText>
                </View>
              )}
              {cart.business.tax_type !== 1 && (
                <View>
                  <OText>
                    {t('TAX', 'Tax')}
                    {`(${verifyDecimals(cart?.business?.tax, parseNumber)}%)`}
                  </OText>
                  <OText>{parsePrice(cart?.tax || 0)}</OText>
                </View>
              )}
              {orderState?.options?.type === 1 && cart?.delivery_price > 0 && (
                <View>
                  <OText>{t('DELIVERY_FEE', 'Delivery Fee')}</OText>
                  <OText>{parsePrice(cart?.delivery_price)}</OText>
                </View>
              )}
              {cart?.driver_tip > 0 && (
                <View>
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
                </View>
              )}
              {cart?.service_fee > 0 && (
                <View>
                  <OText>
                    {t('SERVICE_FEE', 'Service Fee')}
                    {`(${verifyDecimals(cart?.business?.service_fee, parseNumber)}%)`}
                  </OText>
                  <OText>{parsePrice(cart?.service_fee)}</OText>
                </View>
              )}
              {isCouponEnabled && !isCartPending && (
                <View>
                  <View>
                    <CouponControl
                      businessId={cart.business_id}
                      price={cart.total}
                    />
                  </View>
                </View>
              )}
              {cart?.total >= 1 && (
                <View>
                  <View style={{ marginTop: 15 }}>
                    <OText style={{ fontWeight: 'bold' }}>
                      {t('TOTAL', 'Total')}
                    </OText>
                    <OText style={{ fontWeight: 'bold' }} color={colors.primary}>
                      {parsePrice(cart?.total)}
                    </OText>
                  </View>
                </View>
              )}
            </View>
          )}
          {/* {cart?.valid && (
            <OSBill>
              <OSTable>
                <OText>{t('SUBTOTAL', 'Subtotal')}</OText>
                <OText>
                  {cart.business.tax_type === 1
                    ? parsePrice((cart?.subtotal + cart?.tax) || 0)
                    : parsePrice(cart?.subtotal || 0)}
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
              {cart.business.tax_type !== 1 && (
                <OSTable>
                  <OText>
                    {t('TAX', 'Tax')}
                    {`(${verifyDecimals(cart?.business?.tax, parseNumber)}%)`}
                  </OText>
                  <OText>{parsePrice(cart?.tax || 0)}</OText>
                </OSTable>
              )}
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
              {cart?.total >= 1 && (
                <OSTotal>
                  <OSTable style={{ marginTop: 15 }}>
                    <OText style={{ fontWeight: 'bold' }}>
                      {t('TOTAL', 'Total')}
                    </OText>
                    <OText style={{ fontWeight: 'bold' }} color={colors.primary}>
                      {parsePrice(cart?.total)}
                    </OText>
                  </OSTable>
                </OSTotal>
              )}
            </OSBill>
          )} */}
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
              isFromCheckout={isFromCheckout}
            />
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
