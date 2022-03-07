import React, { useState } from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native'
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
  OSRow,
  Divider
} from './styles';

import { ProductItemAccordion } from '../ProductItemAccordion';
import { CouponControl } from '../CouponControl';
import { OAlert, OInput, OModal, OText } from '../shared';
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
    isFromCheckout,
    commentState,
    handleChangeComment,
    onNavigationRedirect,
    handleRemoveOfferClick
  } = props;

  const theme = useTheme();
  const [, t] = useLanguage();
  const [{ configs }] = useConfig();
  const [orderState] = useOrder();
  const [{ parsePrice, parseNumber }] = useUtils();
  const [validationFields] = useValidationFields();
  const [openTaxModal, setOpenTaxModal] = useState<any>({ open: false, data: null })
  const [confirm, setConfirm] = useState<any>({ open: false, content: null, handleOnAccept: null, id: null, title: null })

  const isCouponEnabled = validationFields?.fields?.checkout?.coupon?.enabled;

  const handleDeleteClick = (product: any) => {
    removeProduct(product, cart)
  }

  const handleEditProduct = (product: any) => {
    onNavigationRedirect &&
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

  const getIncludedTaxesDiscounts = () => {
    return cart?.taxes?.filter((tax: any) => tax?.type === 1)?.reduce((carry: number, tax: any) => carry + (tax?.summary?.tax_after_discount ?? tax?.summary?.tax), 0)
  }

  const onRemoveOffer = (id: number) => {
    setConfirm({
      open: true,
      content: [t('QUESTION_DELETE_OFFER', 'Are you sure that you want to delete the offer?')],
      title: t('OFFER', 'Offer'),
      handleOnAccept: () => {
        setConfirm({ ...confirm, open: false })
        handleRemoveOfferClick(id)
      }
    })
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
                <OText size={16}>{t('SUBTOTAL', 'Subtotal')}</OText>
                <OText size={16}>{parsePrice(cart?.subtotal + getIncludedTaxes())}</OText>
              </OSTable>
              {cart?.discount > 0 && cart?.total >= 0 && cart?.offers?.length === 0 && (
                <OSTable>
                  {cart?.discount_type === 1 ? (
                    <OText size={16}>
                      {t('DISCOUNT', 'Discount')}{' '}
                      <OText size={16}>{`(${verifyDecimals(cart?.discount_rate, parsePrice)}%)`}</OText>
                    </OText>
                  ) : (
                    <OText size={16}>{t('DISCOUNT', 'Discount')}</OText>
                  )}
                  <OText size={16}>- {parsePrice(cart?.discount || 0)}</OText>
                </OSTable>
              )}
              {
                cart?.offers?.length > 0 && cart?.offers?.filter((offer: any) => offer?.target === 1)?.map((offer: any) => (
                  <OSTable key={offer.id}>
                    <OSRow>
                      <OText size={16}>{offer.name}</OText>
                      {offer.rate_type === 1 && (
                        <OText size={16}>{`(${verifyDecimals(offer?.rate, parsePrice)}%)`}</OText>
                      )}
                      <TouchableOpacity style={{ marginLeft: 5, top: 3 }} onPress={() => setOpenTaxModal({ open: true, data: offer, type: 'offer_target_1' })}>
                        <AntIcon name='exclamationcircleo' size={20} color={theme.colors.primary} />
                      </TouchableOpacity>
                      <TouchableOpacity style={{ marginLeft: 5, top: 3 }} onPress={() => onRemoveOffer(offer?.id)}>
                        <AntIcon name='closecircle' size={20} color={theme.colors.primary} />
                      </TouchableOpacity>
                    </OSRow>
                    <OText size={16} numberOfLines={2}>- {parsePrice(offer?.summary?.discount)}</OText>
                  </OSTable>
                ))
              }
              <Divider />
              {cart?.subtotal_with_discount > 0 && cart?.discount > 0 && cart?.total >= 0 && (
                <OSTable>
                  <OText size={16} numberOfLines={1}>{t('SUBTOTAL_WITH_DISCOUNT', 'Subtotal with discount')}</OText>
                  {cart?.business?.tax_type === 1 ? (
                    <OText size={16}>{parsePrice(cart?.subtotal_with_discount + getIncludedTaxesDiscounts() ?? 0)}</OText>
                  ) : (
                    <OText size={16}>{parsePrice(cart?.subtotal_with_discount ?? 0)}</OText>
                  )}
                </OSTable>
              )}
              {
                cart?.taxes?.length > 0 && cart?.taxes?.filter((tax: any) => tax?.type === 2 && tax?.rate !== 0).map((tax: any) => (
                  <OSTable key={tax?.id}>
                    <OSRow>
                      <OText size={16} numberOfLines={1}>
                        {tax?.name || t('INHERIT_FROM_BUSINESS', 'Inherit from business')}{' '}
                        {`(${verifyDecimals(tax?.rate, parseNumber)}%)`}{' '}
                      </OText>
                      <TouchableOpacity onPress={() => setOpenTaxModal({ open: true, data: tax, type: 'tax' })} >
                        <AntIcon name='exclamationcircleo' size={20} color={theme.colors.primary} />
                      </TouchableOpacity>
                    </OSRow>
                    <OText size={16}>{parsePrice(tax?.summary?.tax_after_discount ?? tax?.summary?.tax ?? 0)}</OText>
                  </OSTable>
                ))
              }
              {
                cart?.fees?.length > 0 && cart?.fees?.filter((fee: any) => !(fee.fixed === 0 && fee.percentage === 0))?.map((fee: any) => (
                  <OSTable key={fee.id}>
                    <OSRow>
                      <OText size={16} numberOfLines={1}>
                        {fee.name || t('INHERIT_FROM_BUSINESS', 'Inherit from business')}{' '}
                        ({parsePrice(fee?.fixed)} + {fee.percentage}%){' '}
                      </OText>
                      <TouchableOpacity onPress={() => setOpenTaxModal({ open: true, data: fee, type: 'fee' })} >
                        <AntIcon name='exclamationcircleo' size={20} color={theme.colors.primary} />
                      </TouchableOpacity>
                    </OSRow>
                    <OText size={16}>{parsePrice(fee?.summary?.fixed + (fee?.summary?.percentage_after_discount ?? fee?.summary?.percentage) ?? 0)}</OText>
                  </OSTable>
                ))
              }
              {
                cart?.offers?.length > 0 && cart?.offers?.filter((offer: any) => offer?.target === 3)?.map((offer: any) => (
                  <OSTable key={offer.id}>
                    <OSRow>
                      <OText size={16}>{offer.name}</OText>
                      {offer.rate_type === 1 && (
                        <OText size={16}>{`(${verifyDecimals(offer?.rate, parsePrice)}%)`}</OText>
                      )}
                      <TouchableOpacity style={{ marginLeft: 5, top: 3 }} onPress={() => setOpenTaxModal({ open: true, data: offer, type: 'offer_target_3' })}>
                        <AntIcon name='exclamationcircleo' size={20} color={theme.colors.primary} />
                      </TouchableOpacity>
                      <TouchableOpacity style={{ marginLeft: 5, top: 3 }} onPress={() => onRemoveOffer(offer?.id)}>
                        <AntIcon name='closecircle' size={20} color={theme.colors.primary} />
                      </TouchableOpacity>
                    </OSRow>
                    <OText size={16}>
                      - {parsePrice(offer?.summary?.discount)}
                    </OText>
                  </OSTable>
                ))
              }
              {orderState?.options?.type === 1 && cart?.delivery_price > 0 && (
                <OSTable>
                  <OText size={16}>{t('DELIVERY_FEE', 'Delivery Fee')}</OText>
                  <OText size={16}>{parsePrice(cart?.delivery_price)}</OText>
                </OSTable>
              )}
              {
                cart?.offers?.length > 0 && cart?.offers?.filter((offer: any) => offer?.target === 2)?.map((offer: any) => (
                  <OSTable key={offer.id}>
                    <OSRow>
                      <OText size={16}>{offer.name}</OText>
                      {offer.rate_type === 1 && (
                        <OText size={16}>{`(${verifyDecimals(offer?.rate, parsePrice)}%)`}</OText>
                      )}
                      <TouchableOpacity style={{ marginLeft: 3, top: 3 }} onPress={() => setOpenTaxModal({ open: true, data: offer, type: 'offer_target_2' })}>
                        <AntIcon name='exclamationcircleo' size={20} color={theme.colors.primary} />
                      </TouchableOpacity>
                      <TouchableOpacity style={{ marginLeft: 3, top: 3 }} onPress={() => onRemoveOffer(offer?.id)}>
                        <AntIcon name='closecircle' size={20} color={theme.colors.primary} />
                      </TouchableOpacity>
                    </OSRow>
                    <OText size={16}>
                      - {parsePrice(offer?.summary?.discount)}
                    </OText>
                  </OSTable>
                ))
              }
              {cart?.driver_tip > 0 && (
                <OSTable>
                  <OText size={16}>
                    {t('DRIVER_TIP', 'Driver tip')}
                    {cart?.driver_tip_rate > 0 &&
                      parseInt(configs?.driver_tip_type?.value, 10) === 2 &&
                      !parseInt(configs?.driver_tip_use_custom?.value, 10) &&
                      (
                        `(${verifyDecimals(cart?.driver_tip_rate, parseNumber)}%)`
                      )}
                  </OText>
                  <OText size={16}>{parsePrice(cart?.driver_tip)}</OText>
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
                <View style={{ marginTop: 15, borderTopWidth: 1, borderTopColor: '#d9d9d9' }}>
                  <OSTable style={{ marginTop: 15 }}>
                    <OText size={16} style={{ fontWeight: 'bold' }}>
                      {t('TOTAL', 'Total')}
                    </OText>
                    <OText size={16} style={{ fontWeight: 'bold' }} color={theme.colors.primary}>
                      {parsePrice(cart?.total >= 0 ? cart?.total : 0)}
                    </OText>
                  </OSTable>
                </View>
              {cart?.status !== 2 && (
                <OSTable>
                  <View style={{ width: '100%', marginTop: 20 }}>
                    <OText size={16}>{t('COMMENTS', 'Comments')}</OText>
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
            open={openTaxModal.open}
            onClose={() => setOpenTaxModal({ open: false, data: null })}
            entireModal
            title={`${openTaxModal.data?.name ||
              t('INHERIT_FROM_BUSINESS', 'Inherit from business')} ${openTaxModal.data?.rate_type !== 2 ? `(${typeof openTaxModal.data?.rate === 'number' ? `${openTaxModal.data?.rate}%` : `${parsePrice(openTaxModal.data?.fixed ?? 0)} + ${openTaxModal.data?.percentage}%`})` : ''}  `}
          >
            <TaxInformation
              type={openTaxModal.type}
              data={openTaxModal.data}
              products={cart?.products}
            />
          </OModal>
          <OAlert
            open={confirm.open}
            title={confirm.title}
            content={confirm.content}
            onAccept={confirm.handleOnAccept}
            onCancel={() => setConfirm({ ...confirm, open: false, title: null })}
            onClose={() => setConfirm({ ...confirm, open: false, title: null })}
          />
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
