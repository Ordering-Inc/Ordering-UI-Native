import React, { useState } from 'react';
import { ActivityIndicator, View } from 'react-native'
import {
  Cart,
  useOrder,
  useLanguage,
  useUtils,
  useConfig,
  useValidationFields,
} from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import {
  OSContainer,
  OSProductList,
  OSBill,
  OSTable,
  OSRow
} from './styles';

import { ProductItemAccordion } from '../ProductItemAccordion';
import { CouponControl } from '../CouponControl';
import { OInput, OModal, OText } from '../shared';
import { verifyDecimals } from '../../utils';
import AntIcon from 'react-native-vector-icons/AntDesign'
import { TaxInformation } from '../TaxInformation';
import { TouchableOpacity } from 'react-native';

const OrderSummaryUI = (props: any) => {
  const {
    changeQuantity,
    getProductMax,
    offsetDisabled,
    removeProduct,
    isCartPending,
    isFromCheckout,
    commentState,
    handleChangeComment,
    onNavigationRedirect
  } = props;

  const theme = useTheme()
  const [, t] = useLanguage();
  const [{ configs }] = useConfig();
  const [orderState] = useOrder();
  const [{ parsePrice, parseNumber }] = useUtils();
  const [validationFields] = useValidationFields();
  const [openTaxModal, setOpenTaxModal] = useState<any>({ open: false, data: null })

  const isCouponEnabled = validationFields?.fields?.checkout?.coupon?.enabled;

  const handleDeleteClick = (product: any) => {
    removeProduct(product, cart)
  }

  const handleEditProduct = (product: any) => {
    onNavigationRedirect('ProductDetails', {
      isCartProduct: true,
      productCart: product,
      businessSlug: cart?.business?.slug,
      businessId: cart?.business_id,
      categoryId: product?.category_id,
      productId: product?.id,
      isFromCheckout: isFromCheckout,
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

  const cart = orderState?.carts?.[`businessId:${props.cart.business_id}`]

  const walletName: any = {
    cash: {
      name: t('PAY_WITH_CASH_WALLET', 'Pay with Cash Wallet'),
    },
    credit_point: {
      name: t('PAY_WITH_CREDITS_POINTS_WALLET', 'Pay with Credit Points Wallet'),
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
                <OText size={12}>{t('SUBTOTAL', 'Subtotal')}</OText>
                <OText size={12}>{parsePrice(cart?.subtotal + getIncludedTaxes())}</OText>
              </OSTable>
              {cart?.discount > 0 && cart?.total >= 0 && (
                <OSTable>
                  {cart?.discount_type === 1 ? (
                    <OText size={12}>
                      {t('DISCOUNT', 'Discount')}
                      <OText size={12}>{`(${verifyDecimals(cart?.discount_rate, parsePrice)}%)`}</OText>
                    </OText>
                  ) : (
                    <OText size={12}>{t('DISCOUNT', 'Discount')}</OText>
                  )}
                  <OText size={12}>- {parsePrice(cart?.discount || 0)}</OText>
                </OSTable>
              )}
              {
                cart?.taxes?.length > 0 && cart?.taxes?.filter((tax: any) => tax?.type === 2 && tax?.rate !== 0).map((tax: any) => (
                  <OSTable key={tax?.id}>
                    <OSRow>
                      <OText size={12} numberOfLines={1}>
                        {tax?.name || t('INHERIT_FROM_BUSINESS', 'Inherit from business')}{' '}
                        {`(${verifyDecimals(tax?.rate, parseNumber)}%)`}{' '}
                      </OText>
                      <TouchableOpacity onPress={() => setOpenTaxModal({ open: true, data: tax })} >
                        <AntIcon name='exclamationcircleo' size={20} color={theme.colors.primary} />
                      </TouchableOpacity>
                    </OSRow>
                    <OText size={12}>{parsePrice(tax?.summary?.tax || 0)}</OText>
                  </OSTable>
                ))
              }
              {
                cart?.fees?.length > 0 && cart?.fees?.filter((fee: any) => !(fee.fixed === 0 && fee.percentage === 0))?.map((fee: any) => (
                  <OSTable key={fee.id}>
                    <OSRow>
                      <OText size={12} numberOfLines={1}>
                        {fee.name || t('INHERIT_FROM_BUSINESS', 'Inherit from business')}{' '}
                        ({parsePrice(fee?.fixed)} + {fee.percentage}%){' '}
                      </OText>
                      <TouchableOpacity onPress={() => setOpenTaxModal({ open: true, data: fee })} >
                        <AntIcon name='exclamationcircleo' size={20} color={theme.colors.primary} />
                      </TouchableOpacity>
                    </OSRow>
                    <OText size={12}>{parsePrice(fee?.summary?.fixed + fee?.summary?.percentage || 0)}</OText>
                  </OSTable>
                ))
              }
              {orderState?.options?.type === 1 && cart?.delivery_price > 0 && (
                <OSTable>
                  <OText size={12}>{t('DELIVERY_FEE', 'Delivery Fee')}</OText>
                  <OText size={12}>{parsePrice(cart?.delivery_price)}</OText>
                </OSTable>
              )}
              {cart?.driver_tip > 0 && (
                <OSTable>
                  <OText size={12}>
                    {t('DRIVER_TIP', 'Driver tip')}
                    {cart?.driver_tip_rate > 0 &&
                      parseInt(configs?.driver_tip_type?.value, 10) === 2 &&
                      !parseInt(configs?.driver_tip_use_custom?.value, 10) &&
                      (
                        `(${verifyDecimals(cart?.driver_tip_rate, parseNumber)}%)`
                      )}
                  </OText>
                  <OText size={12}>{parsePrice(cart?.driver_tip)}</OText>
                </OSTable>
              )}
              {cart?.payment_events?.length > 0 && cart?.payment_events?.map((event: any) => (
                <OSTable key={event.id}>
                  <OText size={12} numberOfLines={1}>
                    {walletName[cart?.wallets?.find((wallet: any) => wallet.id === event.wallet_id)?.type]?.name}
                  </OText>
                  <OText size={12}>-{parsePrice(event.amount)}</OText>
                </OSTable>
              ))}
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
                    <OText size={14} style={{ fontWeight: 'bold' }}>
                      {t('TOTAL', 'Total')}
                    </OText>
                    <OText size={14} style={{ fontWeight: 'bold' }} >
                      {parsePrice(cart?.balance ?? cart?.total)}
                    </OText>
                  </OSTable>
                </View>
              )}
              {cart?.status !== 2 && (
                <OSTable>
                  <View style={{ width: '100%', marginTop: 20 }}>
                    <OText size={12}>{t('COMMENTS', 'Comments')}</OText>
                    <View style={{ flex: 1, width: '100%' }}>
                      <OInput
                        value={cart?.comment}
                        placeholder={t('SPECIAL_COMMENTS', 'Special Comments')}
                        onChange={(value: string) => handleChangeComment(value)}
                        style={{
                          alignItems: 'flex-start',
                          width: '100%',
                          height: 100,
                          borderColor: theme.colors.border,
                          paddingRight: 50,
                          marginTop: 10,
                          borderRadius: 8
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
