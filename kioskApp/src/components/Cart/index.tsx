import React, { useState } from 'react';
import {
  Cart as CartController,
  useOrder,
  useLanguage,
  useConfig,
  useUtils,
  useValidationFields,
} from 'ordering-components/native';

import { CheckoutAction, Actions, KeyboardView, OrderTypeWrapper } from './styles';

import { OSBill, OSTable, OSTotal } from '../OrderSummary/styles';

import { OButton, OIcon, OModal, OText } from '../shared';
import { colors } from '../../theme.json';
import { ProductForm } from '../ProductForm';
import { UpsellingProducts } from '../UpsellingProducts';
import { verifyDecimals } from '../../utils';
import { Cart as TypeCart } from '../../types';
import CartItem from '../CartItem';
import NavBar from '../NavBar';
import { Dimensions, ScrollView, Platform, View } from 'react-native';
import { IMAGES } from '../../config/constants';

const windowHeight = Dimensions.get('window').height;

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
    isFromCart,
    navigation,
  } : CartUIProps = props
  

  const [, t] = useLanguage()
  const [orderState] = useOrder()
  const [{ configs }] = useConfig();
  const [{ parsePrice, parseNumber, parseDate }] = useUtils()
  const [validationFields] = useValidationFields()

  const [openProduct, setModalIsOpen] = useState(false)
  const [curProduct, setCurProduct] = useState<any>(null)
  const [openUpselling, setOpenUpselling] = useState(false)
  const [canOpenUpselling, setCanOpenUpselling] = useState(false)

  const selectedOrderType = orderState?.options?.type;

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
      setIsCartsLoading && setIsCartsLoading(true)
      const result = await clearCart(cart?.uuid)
      setIsCartsLoading && setIsCartsLoading(false)
    } catch (error) {
      setIsCartsLoading && setIsCartsLoading(false)
    }
  }

  const handleChangeOrderType = () => {
    navigation.push('DeliveryType', {
      callback : () => {navigation.pop(1)},
      goBack: () => {navigation.pop(1)},
    });
  }

  const handleUpsellingPage = () => {
    setOpenUpselling(false)
    setCanOpenUpselling(false)
    props.onNavigationRedirect('CheckoutNavigator', { screen: 'CheckoutPage', cartUuid: cart?.uuid })
  }
	
  const goToBack = () => navigation.goBack();

  return (
    <KeyboardView
      enabled
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <NavBar
        title={t('CONFIRM_YOUR_ORDER', 'Confirm your order')}
        onActionLeft={goToBack}
        style={{ height: windowHeight * 0.08 }}
        rightComponent={(
          <OButton
            text={t('CANCEL_ORDER', 'Cancel order')}
            bgColor="transparent"
            borderColor="transparent"
            style={{ paddingEnd: 0 }}
            textStyle={{ color: colors.primary, marginEnd: 0 }}
            onClick={handleClearProducts}
          />
        )}
      />

      <OrderTypeWrapper
        style={{ height: windowHeight * 0.08 }}
      >
        <OText
          weight="500"
          size={21}
          color={colors.black}
        >
          {t('THIS_ORDER_IS_TO', 'This order is to')}
          {' '}
          {selectedOrderType === 2 && t('TAKE_OUT', 'Take out')}
          {selectedOrderType === 3 && t('EAT_IN', 'Eat in')}
        </OText>

        <OButton
          text={t('I_CHANGED_MY_MIND', 'I changed my mind')}
          bgColor="transparent"
          borderColor="transparent"
          style={{ paddingEnd: 0 }}
          textStyle={{ color: colors.primary, marginEnd: 0 }}
          onClick={handleChangeOrderType}
        />
      </OrderTypeWrapper>

      <ScrollView
        style={{
          height: windowHeight * 0.58
        }}
      >
        {cart?.products?.length > 0 && cart?.products.map((product: any) => (
          <CartItem
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
      </ScrollView>

      <Actions
        style={{
          height: windowHeight * 0.17
        }}
      >
        {cart?.valid_products && (
          <OSBill>
            {cart?.discount > 0 && cart?.total >= 0 && (
              <OSTable
                style={{
                  backgroundColor: colors.success,
                  borderRadius: 6,
                  maxHeight: 60,
                  padding: 10
                }}
              >
                <View
                  style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}
                >
                  <OIcon
                    src={IMAGES.check_decagram}
                  />

                  {cart?.discount_type === 1 ? (
                    <OText
                      mLeft={15}
                    >
                      <OText color={colors.green} size={16}>{`${t('VALID_CODE', 'Valid code')}! ${t('YOU_GOT', 'you got')} `}</OText>
                      <OText color={colors.green} size={16} weight="700">{`${verifyDecimals(cart?.discount_rate, parsePrice)}% `}</OText>
                      <OText color={colors.green} size={16}>{`${t('OFF', 'off')}`}</OText>
                    </OText>
                  ) : (
                    <OText
                      size={16}
                      mLeft={15}
                      color={colors.green}
                    >
                      {`${t('VALID_CODE', 'Valid code')}! `}
                    </OText>
                  )}
                </View>
                

                <OText
                  size={16}
                  color={colors.green}
                  weight="700"
                >- {parsePrice(cart?.discount || 0)}</OText>
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
            {selectedOrderType === 1 && cart?.delivery_price > 0 && (
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
                    !!!parseInt(configs?.driver_tip_use_custom?.value, 10) &&
                  (
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
                  {`(${verifyDecimals(cart?.business?.service_fee, parseNumber)}%)`}
                </OText>
                <OText>{parsePrice(cart?.service_fee)}</OText>
              </OSTable>
            )}
            {/* {isCouponEnabled && !isCartPending && (
              <OSTable>
                <OSCoupon>
                  <CouponControl
                    businessId={cart.business_id}
                    price={cart.total}
                  />
                </OSCoupon>
              </OSTable>
            )} */}
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
              !openUpselling !== canOpenUpselling ? `${t('CONFIRM_THIS', 'Confirm this')} $${cart?.total} ${t('ORDER', 'order')}`: t('LOADING', 'Loading')
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
      </Actions>

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
    </KeyboardView>
  )
}

interface CartUIProps {
  cart: TypeCart,
  clearCart: any,
  changeQuantity: any,
  getProductMax: any,
  offsetDisabled: any,
  removeProduct: any,
  handleCartOpen: any,
  setIsCartsLoading: any,
  isFromCart: any,
  navigation: any,
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
