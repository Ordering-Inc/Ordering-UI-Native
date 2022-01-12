import React, { useState } from 'react';
import { ActivityIndicator, TextStyle, TouchableOpacity, View } from 'react-native'
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
import { OInput, OModal, OText } from '../shared';
import { useTheme } from 'styled-components/native';
import { ProductForm } from '../ProductForm';
import { verifyDecimals } from '../../utils';
import { UpsellingProducts } from '../UpsellingProducts';
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
    isFromCheckout,
    hasUpSelling,
    title,
    paddingH,
    isMini,
    commentState,
    handleChangeComment
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
          <OSProductList style={{ paddingHorizontal: paddingH }}>
            {title && <OText style={{ ...theme.labels.middle, marginVertical: 12 } as TextStyle}>{title}</OText>}
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
                isMini={isMini}
              />
            ))}
          </OSProductList>
          {hasUpSelling && (
            <View style={{ marginVertical: 28, paddingBottom: 36, borderBottomWidth: 8, borderBottomColor: theme.colors.inputDisabled }}>
              <UpsellingProducts
                businessId={cart?.business_id}
                business={cart?.business}
                cartProducts={cart?.products}
                handleUpsellingPage={() => { }}
                openUpselling={true}
                canOpenUpselling={true}
                isCustomMode
                scrollContainerStyle={{ paddingHorizontal: paddingH }}
              />
            </View>
          )}
          {cart?.valid && (
            <OSBill style={{ paddingHorizontal: paddingH }}>
              {!isMini ? (
                <View>
                  {cart?.total >= 1 && (
                    <View style={{ borderBottomWidth: 1, borderBottomColor: theme.colors.border, paddingBottom: 12, marginBottom: 4 }}>
                      <OSTable>
                        <OText style={theme.labels.middle as TextStyle}>
                          {t('TOTAL', 'Total')}
                        </OText>
                        <OText style={theme.labels.middle as TextStyle}>
                          {parsePrice(cart?.total)}
                        </OText>
                      </OSTable>
                    </View>
                  )}
                  {isCouponEnabled && !isCartPending && (
                    <View style={{ paddingVertical: 5, marginBottom: 7 }}>
                      <CouponControl
                        businessId={cart.business_id}
                        price={cart.total}
                      />
                    </View>
                  )}
                </View>
              ) : null}
              <OSTable>
                <OText style={theme.labels.normal as TextStyle}>{t('SUBTOTAL', 'Subtotal')}</OText>
                <OText style={theme.labels.normal as TextStyle}>{parsePrice(cart?.subtotal + getIncludedTaxes())}</OText>
              </OSTable>
              {cart?.discount > 0 && cart?.total >= 0 && (
                <OSTable>
                  {cart?.discount_type === 1 ? (
                    <OText style={theme.labels.normal as TextStyle}>
                      {t('DISCOUNT', 'Discount')}
                      <OText style={theme.labels.normal as TextStyle}>{`(${verifyDecimals(cart?.discount_rate, parsePrice)}%)`}</OText>
                    </OText>
                  ) : (
                    <OText style={theme.labels.normal as TextStyle}>{t('DISCOUNT', 'Discount')}</OText>
                  )}
                  <OText style={theme.labels.normal as TextStyle}>- {parsePrice(cart?.discount || 0)}</OText>
                </OSTable>
              )}
              {
                cart?.taxes?.length > 0 && cart?.taxes?.filter((tax: any) => tax?.type === 2 && tax?.rate !== 0).map((tax: any) => (
                  <OSTable key={tax?.id}>
                    <OSRow>
                      <OText numberOfLines={1}>
                        {tax?.name || t('INHERIT_FROM_BUSINESS', 'Inherit from business')}{' '}
                        {`(${verifyDecimals(tax?.rate, parseNumber)}%)`}{' '}
                      </OText>
                      <TouchableOpacity onPress={() => setOpenTaxModal({ open: true, data: tax })} >
                        <AntIcon name='exclamationcircleo' size={20} color={theme.colors.primary} />
                      </TouchableOpacity>
                    </OSRow>
                    <OText>{parsePrice(tax?.summary?.tax || 0)}</OText>
                  </OSTable>
                ))
              }
              {
                cart?.fees?.length > 0 && cart?.fees?.filter((fee: any) => !(fee.fixed === 0 && fee.percentage === 0))?.map((fee: any) => (
                  <OSTable key={fee.id}>
                    <OSRow>
                      <OText numberOfLines={1}>
                        {fee.name || t('INHERIT_FROM_BUSINESS', 'Inherit from business')}{' '}
                        ({parsePrice(fee?.fixed)} + {fee.percentage}%){' '}
                      </OText>
                      <TouchableOpacity onPress={() => setOpenTaxModal({ open: true, data: fee })} >
                        <AntIcon name='exclamationcircleo' size={20} color={theme.colors.primary} />
                      </TouchableOpacity>
                    </OSRow>
                    <OText>{parsePrice(fee?.summary?.fixed + fee?.summary?.percentage || 0)}</OText>
                  </OSTable>
                ))
              }
              {orderState?.options?.type === 1 && cart?.delivery_price > 0 && (
                <OSTable>
                  <OText style={theme.labels.normal as TextStyle}>{t('DELIVERY_FEE', 'Delivery Fee')}</OText>
                  <OText style={theme.labels.normal as TextStyle}>{parsePrice(cart?.delivery_price)}</OText>
                </OSTable>
              )}
              {cart?.driver_tip > 0 && (
                <OSTable>
                  <OText style={theme.labels.normal as TextStyle}>
                    {t('DRIVER_TIP', 'Driver tip')}
                    {cart?.driver_tip_rate > 0 &&
                      parseInt(configs?.driver_tip_type?.value, 10) === 2 &&
                      !parseInt(configs?.driver_tip_use_custom?.value, 10) &&
                      (
                        `(${verifyDecimals(cart?.driver_tip_rate, parseNumber)}%)`
                      )}
                  </OText>
                  <OText style={theme.labels.normal as TextStyle}>{parsePrice(cart?.driver_tip)}</OText>
                </OSTable>
              )}
              {isMini ? (
                <View style={{ marginTop: 10 }}>
                  {cart?.total >= 1 && (
                    <View style={{ borderTopWidth: 1, borderTopColor: theme.colors.border, paddingTop: 12, marginBottom: 4 }}>
                      <OSTable>
                        <OText style={theme.labels.middle as TextStyle}>
                          {t('TOTAL', 'Total')}
                        </OText>
                        <OText style={theme.labels.middle as TextStyle}>
                          {parsePrice(cart?.total)}
                        </OText>
                      </OSTable>
                    </View>
                  )}
                  {isCouponEnabled && !isCartPending && (
                    <View style={{ paddingVertical: 5, marginBottom: 7 }}>
                      <CouponControl
                        businessId={cart.business_id}
                        price={cart.total}
                      />
                    </View>
                  )}
                </View>
              ) : null}
              {cart?.status !== 2 && (
                <OSTable>
                  <View style={{ width: '100%', marginTop: 20 }}>
                    <OText>{t('COMMENTS', 'Comments')}</OText>
                    <View style={{ flex: 1, width: '100%' }}>
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
          <OModal
            open={openProduct}
            entireModal
            customClose
            onClose={() => setModalIsOpen(false)}
            overScreen
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
