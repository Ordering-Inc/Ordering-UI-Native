import React, { useEffect, useState, useRef } from 'react';
import {
  Cart as CartController,
  useOrder,
  useLanguage,
  useConfig,
  useUtils,
  useValidationFields,
} from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { CContainer, CheckoutAction, DriverTipsContainer } from './styles';

import { OSBill, OSTable, OSCoupon, OSTotal, OSRow } from '../OrderSummary/styles';

import { ProductItemAccordion } from '../ProductItemAccordion';
import { BusinessItemAccordion } from '../BusinessItemAccordion';
import { CouponControl } from '../CouponControl';

import { OButton, OInput, OModal, OText } from '../shared';
import { UpsellingProducts } from '../UpsellingProducts';
import { verifyDecimals } from '../../utils';
import { ActivityIndicator, TouchableOpacity, View, Vibration } from 'react-native';
import AntIcon from 'react-native-vector-icons/AntDesign'
import { TaxInformation } from '../TaxInformation';
import { CartStoresListing } from '../CartStoresListing';
import { OAlert } from '../shared'
import { PlaceSpot } from '../PlaceSpot'
import { DriverTips } from '../DriverTips'
import { MomentOption } from '../MomentOption'

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
    handleChangeComment,
    commentState,
    onNavigationRedirect,
    handleRemoveOfferClick,
    isMultiCheckout,
    hideDeliveryFee,
    hideDriverTip,
    hideCouponInput,
    preorderSlotInterval,
    preorderLeadTime,
    preorderTimeRange,
    preorderMaximumDays,
    preorderMinimumDays,
    cateringTypes,
    isFromUpselling,
    cartsOpened,
    setCartsOpened,
    changeActiveState,
    isActive
  } = props

  const theme = useTheme();

  const [, t] = useLanguage()
  const [orderState] = useOrder()
  const [{ configs }] = useConfig();
  const [{ parsePrice, parseNumber, parseDate }] = useUtils()
  const [validationFields] = useValidationFields()
  const commentRef = useRef()
  const [openUpselling, setOpenUpselling] = useState(false)
  const [openChangeStore, setOpenChangeStore] = useState(false)
  const [canOpenUpselling, setCanOpenUpselling] = useState(false)
  const [openTaxModal, setOpenTaxModal] = useState<any>({ open: false, data: null, type: '' })
  const [openPlaceModal, setOpenPlaceModal] = useState(false)
  const [maxDate, setMaxDate] = useState<any>(null)
  const [comment] = useState<any>(cart?.comment ?? '')
  const isCartPending = cart?.status === 2
  const isCouponEnabled = validationFields?.fields?.checkout?.coupon?.enabled
  const business: any = (orderState?.carts && Object.values(orderState.carts).find((_cart: any) => _cart?.uuid === props.cartuuid)) ?? {}
  const businessId = business?.business_id ?? null
  const placeSpotTypes = [4]
  const hideCartComments = theme?.business_view?.components?.cart?.components?.comments?.hidden
  const hideCartDiscount = theme?.business_view?.components?.cart?.components?.discount?.hidden
  const driverTipsOptions = typeof configs?.driver_tip_options?.value === 'string'
    ? JSON.parse(configs?.driver_tip_options?.value) || []
    : configs?.driver_tip_options?.value || []
  const allowDriverTipPickup = configs?.driver_tip_allowed_at_pickup?.value === '1' && orderState?.options?.type === 2

  const momentFormatted = !orderState?.option?.moment
    ? t('RIGHT_NOW', 'Right Now')
    : parseDate(orderState?.option?.moment, { outputFormat: 'YYYY-MM-DD HH:mm' })

  const handleDeleteClick = (product: any) => {
    removeProduct(product, cart)
  }

  const handleEditProduct = (product: any) => {
    onNavigationRedirect('ProductDetails', {
      businessId,
      isCartProduct: true,
      productCart: product,
      businessSlug: cart?.business?.slug,
      categoryId: product?.category_id,
      productId: product?.id,
    })
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

  const handleUpsellingPage = (individualCart: any) => {
    Vibration.vibrate(100)
    const isProductCartParam = !!individualCart?.products?.length
    setOpenUpselling(false)
    setCanOpenUpselling(false)

    const cartsAvailable: any = Object.values(orderState?.carts)
      ?.filter((_cart: any) => _cart?.valid && _cart?.status !== 2 && _cart?.products?.length)
      ?.filter((_c: any) => !isProductCartParam ? _c.uuid !== individualCart?.uuid : _c)
    if (cartsAvailable.length === 1 || !isMultiCheckout || !cart?.business_id) {
      const cart = isMultiCheckout ? cartsAvailable[0] : individualCart
      onNavigationRedirect('CheckoutNavigator', {
        screen: 'CheckoutPage',
        cartUuid: cart?.uuid,
        businessLogo: cart?.business?.logo,
        businessName: cart?.business?.name,
        cartTotal: cart?.total,
        fromProductsList: isFromUpselling
      })
    } else {
      const groupKeys: any = {}
      cartsAvailable.forEach((_cart: any) => {
        groupKeys[_cart?.group?.uuid]
          ? groupKeys[_cart?.group?.uuid] += 1
          : groupKeys[_cart?.group?.uuid ?? 'null'] = 1
      })

      if (
        (Object.keys(groupKeys).length === 1 && Object.keys(groupKeys)[0] === 'null') ||
        Object.keys(groupKeys).length > 1
      ) {
        onNavigationRedirect('CheckoutNavigator', {
          screen: 'MultiCheckout',
          checkCarts: true
        })
      } else {
        onNavigationRedirect('CheckoutNavigator', {
          screen: 'MultiCheckout',
          cartUuid: cartsAvailable[0]?.group?.uuid
        })
      }
    }
  }

  const getIncludedTaxes = (isDeliveryFee?: boolean) => {
    if (cart?.taxes === null || !cart?.taxes) {
      return cart?.business.tax_type === 1 ? cart?.tax : 0
    } else {
      return cart?.taxes.reduce((taxIncluded: number, tax: any) => {
        return taxIncluded +
          (((!isDeliveryFee && tax.type === 1 && tax.target === 'product') ||
            (isDeliveryFee && tax.type === 1 && tax.target === 'delivery_fee')) ? tax.summary?.tax : 0)
      }, 0)
    }
  }

  const getIncludedTaxesDiscounts = () => {
    return cart?.taxes?.filter((tax: any) => (tax?.type === 1 && tax?.target === 'product'))?.reduce((carry: number, tax: any) => carry + (tax?.summary?.tax_after_discount ?? tax?.summary?.tax), 0)
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

  const walletName: any = {
    cash: {
      name: t('PAY_WITH_CASH_WALLET', 'Pay with Cash Wallet'),
    },
    credit_point: {
      name: t('PAY_WITH_CREDITS_POINTS_WALLET', 'Pay with Credit Points Wallet'),
    }
  }

  const subtotalWithTaxes = cart?.taxes?.reduce((acc: any, item: any) => {
    if (item?.type === 1)
      return acc = acc + item?.summary?.tax
    return acc = acc
  }, cart?.subtotal)

  const handleClickCheckout = () => {
    Vibration.vibrate(100)
    if (cart?.business_id) {
      setOpenUpselling(true)
    } else {
      onNavigationRedirect('CheckoutNavigator', {
        screen: 'CheckoutPage',
        cartUuid: cart?.uuid,
        cartTotal: cart?.total
      }, true)
    }
  }

  useEffect(() => {
    const limitDays = parseInt(preorderMaximumDays ?? configs?.max_days_preorder?.value, 10)
    const currentDate = new Date()
    const time = limitDays > 1
      ? currentDate.getTime() + ((limitDays - 1) * 24 * 60 * 60 * 1000)
      : limitDays === 1 ? currentDate.getTime() : currentDate.getTime() + (6 * 24 * 60 * 60 * 1000)

    currentDate.setTime(time)
    currentDate.setHours(23)
    currentDate.setMinutes(59)
    setMaxDate(currentDate)
  }, [preorderMaximumDays, configs?.max_days_preorder?.value])

  return (
    <CContainer>
      {!!openUpselling && (
        <UpsellingProducts
          handleUpsellingPage={handleUpsellingPage}
          openUpselling={openUpselling}
          businessId={cart?.business_id}
          business={cart?.business}
          cartProducts={cart?.products}
          canOpenUpselling={canOpenUpselling}
          setCanOpenUpselling={setCanOpenUpselling}
          handleCloseUpsellingPage={() => { }}
          isFromCart
        />
      )}
      <BusinessItemAccordion
        cart={cart}
        singleBusiness={props.singleBusiness}
        moment={momentFormatted}
        handleClearProducts={handleClearProducts}
        handleCartOpen={handleCartOpen}
        onNavigationRedirect={props.onNavigationRedirect}
        handleChangeStore={() => {
          Vibration.vibrate(100)
          setOpenChangeStore(true)
        }}
        handleClickCheckout={() => handleClickCheckout()}
        checkoutButtonDisabled={(openUpselling && !canOpenUpselling) || subtotalWithTaxes < cart?.minimum || !cart?.valid_address}
        isMultiCheckout={isMultiCheckout}
        isFromUpselling={isFromUpselling}
        cartsOpened={cartsOpened}
        setCartsOpened={setCartsOpened}
        changeActiveState={changeActiveState}
        isActive={isActive}
        isGiftCart={!cart?.business_id}
      >
        {cart?.products?.length > 0 && cart?.products.map((product: any, i: number) => (
          <ProductItemAccordion
            key={`${product.code}_${i}`}
            isCartPending={isCartPending}
            isCartProduct
            isDisabledEdit={!cart?.business_id}
            product={product}
            changeQuantity={changeQuantity}
            getProductMax={getProductMax}
            offsetDisabled={offsetDisabled}
            onDeleteProduct={handleDeleteClick}
            onEditProduct={handleEditProduct}
            viewString='business_view'
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
            {!hideCartDiscount && cart?.discount > 0 && cart?.total >= 0 && cart?.offers?.length === 0 && (
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
              !hideCartDiscount && cart?.offers?.length > 0 && cart?.offers?.filter((offer: any) => offer?.target === 1)?.map((offer: any, i: number) => (
                <OSTable key={`${offer.id}_${i}`}>
                  <OSRow>
                    <OText size={12} lineHeight={18}>{offer.name}</OText>
                    {offer.rate_type === 1 && (
                      <OText size={12} lineHeight={18}>{`(${verifyDecimals(offer?.rate, parsePrice)}%)`}</OText>
                    )}
                    <TouchableOpacity style={{ marginLeft: 3 }} onPress={() => setOpenTaxModal({ open: true, data: offer, type: 'offer_target_1' })}>
                      <AntIcon name='infocirlceo' size={16} color={theme.colors.primary} />
                    </TouchableOpacity>
                    {!!offer?.id && (
                      <OfferAlert offerId={offer?.id} />
                    )}
                  </OSRow>
                  <OText size={12} lineHeight={18}>
                    - {parsePrice(offer?.summary?.discount)}
                  </OText>
                </OSTable>
              ))
            }
            {/* <Divider /> */}
            {!hideCartDiscount && cart?.subtotal_with_discount > 0 && cart?.discount > 0 && cart?.total >= 0 && (
              <OSTable>
                <OText size={12} lineHeight={18} numberOfLines={1}>{t('SUBTOTAL_WITH_DISCOUNT', 'Subtotal with discount')}</OText>
                {cart?.business?.tax_type === 1 ? (
                  <OText size={12} lineHeight={18}>{parsePrice(cart?.subtotal_with_discount + getIncludedTaxesDiscounts() ?? 0)}</OText>
                ) : (
                  <OText size={12} lineHeight={18}>{parsePrice(cart?.subtotal_with_discount ?? 0)}</OText>
                )}
              </OSTable>
            )}
            {
              cart.taxes?.length > 0 && cart.taxes.filter((tax: any) => tax.type === 2 && tax?.rate !== 0 && tax?.target === 'product').map((tax: any, i: number) => (
                <OSTable key={`${tax.id}_${i}`}>
                  <OSRow>
                    <OText size={12} lineHeight={18} numberOfLines={1} >
                      {tax.name || t('INHERIT_FROM_BUSINESS', 'Inherit from business')}{' '}
                      {`(${verifyDecimals(tax?.rate, parseNumber)}%)`}{' '}
                    </OText>
                    <TouchableOpacity onPress={() => setOpenTaxModal({ open: true, data: tax, type: 'tax' })} >
                      <AntIcon name='infocirlceo' size={16} color={theme.colors.primary} />
                    </TouchableOpacity>
                  </OSRow>
                  <OText size={12} lineHeight={18}>{parsePrice(tax?.summary?.tax_after_discount ?? tax?.summary?.tax ?? 0)}</OText>
                </OSTable>
              ))
            }
            {
              cart?.fees?.length > 0 && cart?.fees?.filter((fee: any) => !(fee.fixed === 0 && fee.percentage === 0)).map((fee: any, i: number) => (
                <OSTable key={`${fee.id}_${i}`}>
                  <OSRow>
                    <OText size={12} lineHeight={18} numberOfLines={1}>
                      {fee.name || t('INHERIT_FROM_BUSINESS', 'Inherit from business')}{' '}
                      ({fee?.fixed > 0 && `${parsePrice(fee?.fixed)}${fee.percentage > 0 ? ' + ' : ''}`}{fee.percentage > 0 && `${fee.percentage}%`}){' '}
                    </OText>
                    <TouchableOpacity onPress={() => setOpenTaxModal({ open: true, data: fee, type: 'fee' })} >
                      <AntIcon name='infocirlceo' size={16} color={theme.colors.primary} />
                    </TouchableOpacity>
                  </OSRow>
                  <OText size={12} lineHeight={18}>{parsePrice(fee?.summary?.fixed + (fee?.summary?.percentage_after_discount ?? fee?.summary?.percentage) ?? 0)}</OText>
                </OSTable>
              ))
            }
            {
              cart?.offers?.length > 0 && cart?.offers?.filter((offer: any) => offer?.target === 3)?.map((offer: any) => (
                <OSTable key={offer.id}>
                  <OSRow>
                    <OText size={12} lineHeight={18}>{offer.name}</OText>
                    {offer.rate_type === 1 && (
                      <OText size={12} lineHeight={18}>{`(${verifyDecimals(offer?.rate, parsePrice)}%)`}</OText>
                    )}
                    <TouchableOpacity style={{ marginLeft: 3 }} onPress={() => setOpenTaxModal({ open: true, data: offer, type: 'offer_target_3' })}>
                      <AntIcon name='infocirlceo' size={16} color={theme.colors.primary} />
                    </TouchableOpacity>
                    {!!offer?.id && (
                      <OfferAlert offerId={offer?.id} />
                    )}
                  </OSRow>
                  <OText size={12} lineHeight={18}>
                    - {parsePrice(offer?.summary?.discount)}
                  </OText>
                </OSTable>
              ))
            }
            {orderState?.options?.type === 1 && cart?.delivery_price_with_discount > 0 && !hideDeliveryFee && (
              <OSTable>
                <OText size={12} lineHeight={18}>{t('DELIVERY_FEE', 'Delivery Fee')}</OText>
                <OText size={12} lineHeight={18}>{parsePrice(cart?.delivery_price_with_discount + getIncludedTaxes(true))}</OText>
              </OSTable>
            )}
            {
              cart?.taxes?.length > 0 && cart?.taxes?.filter((tax: any) => tax?.type === 2 && tax?.rate !== 0 && tax?.target === 'delivery_fee').map((tax: any, i: number) => (
                <OSTable key={`${tax.description}_${i}`}>
                  <OSRow>
                    <OText size={12} lineHeight={18} numberOfLines={1}>
                      {tax.name || t('INHERIT_FROM_BUSINESS', 'Inherit from business')}
                      {`(${verifyDecimals(tax?.rate, parseNumber)}%)`}
                    </OText>
                    <TouchableOpacity onPress={() => setOpenTaxModal({ open: true, data: tax, type: 'tax' })}>
                      <AntIcon name='infocirlceo' size={16} color={theme.colors.primary} />
                    </TouchableOpacity>
                  </OSRow>
                  <OText size={12} lineHeight={18}>{parsePrice(tax?.summary?.tax_after_discount ?? tax?.summary?.tax ?? 0)}</OText>
                </OSTable>
              ))
            }
            {
              cart?.offers?.length > 0 && cart?.offers?.filter((offer: any) => offer?.target === 2)?.map((offer: any, i: number) => (
                <OSTable key={`${offer.id}_${i}`}>
                  <OSRow>
                    <OText size={12} lineHeight={18}>{offer.name}</OText>
                    {offer.rate_type === 1 && (
                      <OText size={12} lineHeight={18}>{`(${verifyDecimals(offer?.rate, parsePrice)}%)`}</OText>
                    )}
                    <TouchableOpacity style={{ marginLeft: 3 }} onPress={() => setOpenTaxModal({ open: true, data: offer, type: 'offer_target_2' })}>
                      <AntIcon name='infocirlceo' size={16} color={theme.colors.primary} />
                    </TouchableOpacity>
                    {!!offer?.id && (
                      <OfferAlert offerId={offer?.id} />
                    )}
                  </OSRow>
                  <OText size={12} lineHeight={18}>
                    - {parsePrice(offer?.summary?.discount)}
                  </OText>
                </OSTable>
              ))
            }
            {cart?.driver_tip > 0 && !hideDriverTip && (
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
            {cart?.payment_events?.length > 0 && cart?.payment_events?.map((event: any) => (
              <OSTable key={event.id}>
                <OText size={12} numberOfLines={1}>
                  {walletName[cart?.wallets?.find((wallet: any) => wallet.id === event.wallet_id)?.type]?.name}
                </OText>
                <OText size={12}>-{parsePrice(event.amount, { isTruncable: true })}</OText>
              </OSTable>
            ))}
            {isCouponEnabled && !isCartPending && !hideCouponInput && (
              <OSTable>
                <OSCoupon>
                  <CouponControl
                    businessId={businessId}
                    price={cart.total}
                    cart={cart}
                  />
                </OSCoupon>
              </OSTable>
            )}

            {!isMultiCheckout &&
              cart &&
              cart?.valid &&
              (orderState?.options?.type === 1 || allowDriverTipPickup) &&
              cart?.status !== 2 &&
              validationFields?.fields?.checkout?.driver_tip?.enabled &&
              driverTipsOptions && driverTipsOptions?.length > 0 &&
              cart?.business_id &&
              (
                <DriverTipsContainer>
                  <OText size={14} lineHeight={20} color={theme.colors.textNormal}>
                    {t('DRIVER_TIPS', 'Driver Tips')}
                  </OText>
                  <DriverTips
                    uuid={cart?.uuid}
                    businessId={cart?.business_id}
                    driverTipsOptions={!driverTipsOptions.includes(0) ? [0, ...driverTipsOptions] : driverTipsOptions}
                    isFixedPrice={parseInt(configs?.driver_tip_type?.value, 10) === 1}
                    isDriverTipUseCustom={!!parseInt(configs?.driver_tip_use_custom?.value, 10)}
                    driverTip={parseInt(configs?.driver_tip_type?.value, 10) === 1
                      ? cart?.driver_tip
                      : cart?.driver_tip_rate}
                    useOrderContext
                    cart={cart}
                  />
                </DriverTipsContainer>
              )}

            <OSTotal>
              <OSTable style={{ marginTop: 15 }}>
                <OText size={14} lineHeight={21} weight={'bold'} color={theme.colors.textNormal}>
                  {t('TOTAL', 'Total')}
                </OText>
                <OText size={14} lineHeight={21} weight={'bold'} color={theme.colors.textNormal}>
                  {parsePrice(cart?.balance >= 0 ? cart?.balance : 0)}
                </OText>
              </OSTable>
            </OSTotal>
            {placeSpotTypes.includes(orderState?.options?.type) && (
              <OSTable style={{ marginTop: 15 }}>
                <OText size={14} lineHeight={21} weight={'600'}>
                  {t('SPOT', 'Spot')}: {cart?.place?.name || t('NO_SELECTED', 'No selected')}
                </OText>
                <TouchableOpacity onPress={() => setOpenPlaceModal(true)}>
                  <OText
                    size={14}
                    lineHeight={21}
                    weight={'600'}
                    color={theme.colors.primary}
                    style={{ textDecorationLine: 'underline' }}
                  >
                    {t('EDIT', 'Edit')}
                  </OText>
                </TouchableOpacity>
              </OSTable>
            )}
            {cart?.status !== 2 && !hideCartComments && (
              <OSTable>
                <View style={{ width: '100%', marginTop: 20 }}>
                  <OText size={16} lineHeight={18}>{t('COMMENTS', 'Comments')}</OText>
                  <View style={{ flex: 1, width: '100%' }}>
                    <OInput
                      value={comment || cart?.comment}
                      placeholder={t('SPECIAL_COMMENTS', 'Special Comments')}
                      onChange={(value: string) => handleChangeComment(value)}
                      style={{
                        alignItems: 'flex-start',
                        width: '100%',
                        height: 100,
                        borderColor: theme.colors.border,
                        paddingRight: 50,
                        marginTop: 10,
                        borderRadius: 7.6
                      }}
                      forwardRef={commentRef}
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
        {cateringTypes.includes(orderState?.options?.type) && maxDate && cart?.valid_products && (
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
        {!cart?.valid_address && cart?.status !== 2 && (
          <OText
            color={theme.colors.error}
            size={12}
          >
            {t('INVALID_CART_ADDRESS', 'Selected address is invalid, please select a closer address.')}
          </OText>
        )}
        {(!isMultiCheckout || !cart?.business_id) && (
          <>
            {cart?.valid_products ? (
              <CheckoutAction>
                <OButton
                  text={(subtotalWithTaxes >= cart?.minimum || !cart?.minimum) && cart?.valid_address ? (
                    !openUpselling !== canOpenUpselling ? t('CHECKOUT', 'Checkout') : t('LOADING', 'Loading')
                  ) : !cart?.valid_address ? (
                    `${t('OUT_OF_COVERAGE', 'Out of Coverage')}`
                  ) : (
                    `${t('MINIMUN_SUBTOTAL_ORDER', 'Minimum subtotal order:')} ${parsePrice(cart?.minimum)}`
                  )}
                  bgColor={(subtotalWithTaxes < cart?.minimum || !cart?.valid_address) ? theme.colors.secundary : theme.colors.primary}
                  borderColor={(subtotalWithTaxes < cart?.minimum || !cart?.valid_address) ? theme.colors.secundary : theme.colors.primary}
                  isDisabled={(openUpselling && !canOpenUpselling) || subtotalWithTaxes < cart?.minimum || !cart?.valid_address}
                  imgRightSrc={null}
                  textStyle={{ textAlign: 'center', flex: 1 }}
                  onClick={() => handleClickCheckout()}
                  style={{ width: '100%', flexDirection: 'row', justifyContent: 'center', borderRadius: 7.6, shadowOpacity: 0 }}
                />
              </CheckoutAction>
            ) : (
              <View style={{ alignItems: 'center', width: '100%' }}>
                <OText size={12} color={theme.colors.red} style={{ textAlign: 'center', marginTop: 5 }}>
                  {t('WARNING_INVALID_PRODUCTS_CHECKOUT', 'To continue with your checkout, please remove from your cart the products that are not available.')}
                </OText>
              </View>
            )}
          </>
        )}
      </BusinessItemAccordion>

      <OModal
        open={openChangeStore}
        entireModal
        customClose
        onClose={() => setOpenChangeStore(false)}
      >
        <CartStoresListing
          cartuuid={cart?.uuid}
          onClose={() => setOpenChangeStore(false)}
        />
      </OModal>
      <OModal
        open={openTaxModal.open}
        onClose={() => setOpenTaxModal({ open: false, data: null, type: '' })}
        entireModal
      >
        <TaxInformation
          type={openTaxModal.type}
          data={openTaxModal.data}
          products={cart?.products}
        />
      </OModal>
      <OModal
        open={openPlaceModal}
        title={t('CHOOSE_YOUR_SPOT', 'Choose your spot')}
        onClose={() => setOpenPlaceModal(false)}
        entireModal
      >
        <PlaceSpot
          cart={cart}
          isOpenPlaceSpot={openPlaceModal}
          setOpenPlaceModal={setOpenPlaceModal}
        />
      </OModal>
    </CContainer>
  )
}

export const Cart = (props: any) => {
  const cartProps = {
    ...props,
    disablePreviousComment: true,
    UIComponent: CartUI
  }

  return (
    <CartController {...cartProps} />
  )
}
