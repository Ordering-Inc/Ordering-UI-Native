import React from 'react';
import {
  Cart,
  useOrder,
  useLanguage,
  useEvent,
  useUtils,
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
import { OText } from '../shared';
import { colors } from '../../theme';


const OrderSummaryUI = (props: any) => {
  const {
    currentCartUuid,
    cart,
    clearCart,
    isProducts,
    changeQuantity,
    getProductMax,
    offsetDisabled,
    removeProduct,
    onClickCheckout,
    isCheckout,
    isCartPending,
    isCartPopover,
    isForceOpenCart,
    isCartOnProductsList,
    handleCartOpen
  } = props;

  const [, t] = useLanguage();
  const [orderState] = useOrder();
  const [{ parsePrice, parseNumber, parseDate }] = useUtils();
  const [validationFields] = useValidationFields();

  const isCouponEnabled = validationFields?.fields?.checkout?.coupon?.enabled;

  const handleDeleteClick = (product: any) => {
    console.log('handleDeleteClick', product);
    // setConfirm({
    //   open: true,
    //   content: t('QUESTION_DELETE_PRODUCT', 'Are you sure that you want to delete the product?'),
    //   handleOnAccept: () => {
    //     removeProduct(product)
    //     setConfirm({ ...confirm, open: false })
    //   }
    // })
  }

  const handleEditProduct = (product: any) => {
    console.log('handleEditProduct', product);
    // setCurProduct(product)
    // setModalIsOpen(true)
  }

  return (
    <OSContainer>
      <OSProductList>
        {cart?.products?.length > 0 && cart?.products.map((product: any) => (
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
          />
        ))}
      </OSProductList>
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
