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
  OSRow,
  Divider
} from './styles';

import { ProductItemAccordion } from '../ProductItemAccordion';
import { CouponControl } from '../CouponControl';
import { OInput, OModal, OText, OAlert } from '../shared';
import { verifyDecimals } from '../../utils';
import AntIcon from 'react-native-vector-icons/AntDesign'
import { TaxInformation } from '../TaxInformation';
import { TouchableOpacity } from 'react-native';
import { MomentOption } from '../MomentOption';

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
    onNavigationRedirect,
    handleRemoveOfferClick,
    preorderSlotInterval,
    preorderLeadTime,
    preorderTimeRange,
    preorderMaximumDays,
    preorderMinimumDays,
    cateringTypes,
    hideDeliveryFee,
    loyaltyRewardRate,
    maxDate
  } = props;

  const theme = useTheme()
  const [, t] = useLanguage();
  const [{ configs }] = useConfig();
  const [orderState] = useOrder();
  const [{ parsePrice, parseNumber }] = useUtils();
  const [validationFields] = useValidationFields();
  const [openTaxModal, setOpenTaxModal] = useState<any>({ open: false, data: null, type: '' })
  const isCouponEnabled = validationFields?.fields?.checkout?.coupon?.enabled;
  const hideCartComments = !validationFields?.fields?.checkout?.comments?.enabled

  const cart = orderState?.carts?.[`businessId:${props.cart.business_id}`]

  const walletName: any = {
    cash: {
      name: t('PAY_WITH_CASH_WALLET', 'Pay with Cash Wallet'),
    },
    credit_point: {
      name: t('PAY_WITH_CREDITS_POINTS_WALLET', 'Pay with Credit Points Wallet'),
    }
  }

  const getIncludedTaxes = () => {
    if (cart?.taxes === null || !cart?.taxes) {
      return cart?.business?.tax_type === 1 ? cart?.tax : 0
    } else {
      return cart?.taxes.reduce((taxIncluded: number, tax: any) => {
        return taxIncluded + (tax.type === 1 ? tax.summary?.tax : 0)
      }, 0)
    }
  }

  const clearAmount = (value: any) => parseFloat((Math.trunc(value * 100) / 100).toFixed(configs.format_number_decimal_length?.value ?? 2))
  const loyaltyRewardValue = clearAmount((cart?.subtotal + getIncludedTaxes()) * loyaltyRewardRate)

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

  const getIncludedTaxesDiscounts = () => {
    return cart?.taxes?.filter((tax: any) => tax?.type === 1)?.reduce((carry: number, tax: any) => carry + (tax?.summary?.tax_after_discount ?? tax?.summary?.tax), 0)
  }

  const OfferAlert = ({ offerId }: any) => {
    return (
      <OAlert
        title={t('OFFER', 'Offer')}
        message={t('QUESTION_DELETE_OFFER', 'Are you sure that you want to delete the offer?')}
        onAccept={() => handleRemoveOfferClick(offerId)}
      >
        <AntIcon style={{ marginLeft: 3 }} name='closecircle' size={16} color={theme.colors.primary} />
      </OAlert>
    )
  }

  return (
    <OSContainer>
      {cart?.products?.length > 0 && (
        <>
          <OSProductList>
            {cart?.products?.map((product: any) => (
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
                isDisabledEdit={!cart?.business_id}
              />
            ))}
          </OSProductList>
          {cart?.valid && (
            <OSBill>
              <OSTable>
                <OText size={12}>{t('SUBTOTAL', 'Subtotal')}</OText>
                <OText size={12}>
                  {parsePrice(cart?.subtotal + getIncludedTaxes())}
                </OText>
              </OSTable>
              {cart?.discount > 0 && cart?.total >= 0 && cart?.offers?.length === 0 && (
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
                cart?.offers?.length > 0 && cart?.offers?.filter((offer: any) => offer?.target === 1)?.map((offer: any) => (
                  <OSTable key={offer.id}>
                    <OSRow>
                      <OText size={12}>{offer.name}</OText>
                      {offer.rate_type === 1 && (
                        <OText size={12}>{`(${verifyDecimals(offer?.rate, parsePrice)}%)`}</OText>
                      )}
                      <TouchableOpacity style={{ marginLeft: 3 }} onPress={() => setOpenTaxModal({ open: true, data: offer, type: 'offer_target_1' })}>
                        <AntIcon name='infocirlceo' size={16} color={theme.colors.primary} />
                      </TouchableOpacity>
                      {!!offer?.id && (
                        <OfferAlert offerId={offer?.id} />
                      )}
                    </OSRow>
                    <OText size={12}>
                      - {parsePrice(offer?.summary?.discount)}
                    </OText>
                  </OSTable>
                ))
              }
              {cart?.business_id && (
                <Divider />
              )}
              {cart?.subtotal_with_discount > 0 && cart?.discount > 0 && cart?.total >= 0 && (
                <OSTable>
                  <OText size={12} numberOfLines={1}>{t('SUBTOTAL_WITH_DISCOUNT', 'Subtotal with discount')}</OText>
                  {cart?.business?.tax_type === 1 ? (
                    <OText size={12}>{parsePrice(cart?.subtotal_with_discount + getIncludedTaxesDiscounts() ?? 0)}</OText>
                  ) : (
                    <OText size={12}>{parsePrice(cart?.subtotal_with_discount ?? 0)}</OText>
                  )}
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
                      <TouchableOpacity onPress={() => setOpenTaxModal({ open: true, data: tax, type: 'tax' })} >
                        <AntIcon name='infocirlceo' size={16} color={theme.colors.primary} />
                      </TouchableOpacity>
                    </OSRow>
                    <OText size={12}>{parsePrice(tax?.summary?.tax_after_discount ?? tax?.summary?.tax ?? 0)}</OText>
                  </OSTable>
                ))
              }
              {
                cart?.fees?.length > 0 && cart?.fees?.filter((fee: any) => !(fee.fixed === 0 && fee.percentage === 0)).map((fee: any) => (
                  <OSTable key={fee?.id}>
                    <OSRow>
                      <OText size={12} numberOfLines={1}>
                        {fee.name || t('INHERIT_FROM_BUSINESS', 'Inherit from business')}{' '}
                        ({fee?.fixed > 0 && `${parsePrice(fee?.fixed)}${fee.percentage > 0 ? ' + ' : ''}`}{fee.percentage > 0 && `${fee.percentage}%`}){' '}
                      </OText>
                      <TouchableOpacity onPress={() => setOpenTaxModal({ open: true, data: fee, type: 'fee' })} >
                        <AntIcon name='infocirlceo' size={16} color={theme.colors.primary} />
                      </TouchableOpacity>
                    </OSRow>
                    <OText size={12}>{parsePrice(fee?.summary?.fixed + (fee?.summary?.percentage_after_discount ?? fee?.summary?.percentage) ?? 0)}</OText>
                  </OSTable>
                ))
              }
              {
                cart?.offers?.length > 0 && cart?.offers?.filter((offer: any) => offer?.target === 3)?.map((offer: any) => (
                  <OSTable key={offer.id}>
                    <OSRow>
                      <OText size={12}>{offer.name}</OText>
                      {offer.rate_type === 1 && (
                        <OText size={12}>{`(${verifyDecimals(offer?.rate, parsePrice)}%)`}</OText>
                      )}
                      <TouchableOpacity style={{ marginLeft: 3 }} onPress={() => setOpenTaxModal({ open: true, data: offer, type: 'offer_target_3' })}>
                        <AntIcon name='infocirlceo' size={16} color={theme.colors.primary} />
                      </TouchableOpacity>
                      {!!offer?.id && (
                        <OfferAlert offerId={offer?.id} />
                      )}
                    </OSRow>
                    <OText size={12}>
                      - {parsePrice(offer?.summary?.discount)}
                    </OText>
                  </OSTable>
                ))
              }
              {orderState?.options?.type === 1 && !hideDeliveryFee && (
                <OSTable>
                  <OText size={12}>{t('DELIVERY_FEE', 'Delivery Fee')}</OText>
                  <OText size={12}>{parsePrice(cart?.delivery_price_with_discount)}</OText>
                </OSTable>
              )}
              {
                cart?.offers?.length > 0 && cart?.offers?.filter((offer: any) => offer?.target === 2)?.map((offer: any) => (
                  <OSTable key={offer.id}>
                    <OSRow>
                      <OText size={12}>{offer.name}</OText>
                      {offer.rate_type === 1 && (
                        <OText size={12}>{`(${verifyDecimals(offer?.rate, parsePrice)}%)`}</OText>
                      )}
                      <TouchableOpacity style={{ marginLeft: 3 }} onPress={() => setOpenTaxModal({ open: true, data: offer, type: 'offer_target_2' })}>
                        <AntIcon name='infocirlceo' size={16} color={theme.colors.primary} />
                      </TouchableOpacity>
                      {!!offer?.id && (
                        <OfferAlert offerId={offer?.id} />
                      )}
                    </OSRow>
                    <OText size={12}>
                      - {parsePrice(offer?.summary?.discount)}
                    </OText>
                  </OSTable>
                ))
              }
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
                  <OText size={12}>-{parsePrice(event.amount, { isTruncable: true })}</OText>
                </OSTable>
              ))}
              {isCouponEnabled && !isCartPending && cart?.business_id && (
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
                    <OText size={14} style={{ fontWeight: 'bold' }} color={theme.colors.textNormal}>
                      {t('TOTAL', 'Total')}
                    </OText>
                    <OText size={14} style={{ fontWeight: 'bold' }} color={theme.colors.textNormal}>
                      {parsePrice(cart?.balance >= 0 ? cart?.balance : 0)}
                    </OText>
                  </OSTable>
                  {!!loyaltyRewardValue && (
                    <OSTable style={{ justifyContent: 'flex-end' }}>
                      <OText size={12} color={theme.colors.textNormal}>
                        {t('REWARD_LOYALTY_POINT', 'Reward :amount: on loyalty points').replace(':amount:', loyaltyRewardValue)}
                      </OText>
                    </OSTable>
                  )}
                </View>
              )}
              {cart?.business_id && cart?.status !== 2 && !hideCartComments && (
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
          {cateringTypes.includes(orderState?.options?.type) && maxDate && cart?.business && (
            <View>
              <MomentOption
                maxDate={maxDate}
                cateringPreorder
                isCart
                preorderSlotInterval={preorderSlotInterval}
                preorderLeadTime={preorderLeadTime}
                preorderTimeRange={preorderTimeRange}
                preorderMaximumDays={preorderMaximumDays}
                preorderMinimumDays={preorderMinimumDays}
                business={cart?.business}
              />
            </View>
          )}
          <OModal
            open={openTaxModal.open}
            onClose={() => setOpenTaxModal({ open: false, data: null, type: '' })}
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
