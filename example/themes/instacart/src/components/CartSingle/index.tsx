import React, { useState } from 'react';
import {
	Cart as CartController,
	useOrder,
	useLanguage,
	useConfig,
	useUtils,
	useValidationFields,
} from 'ordering-components/native';

import { BusinessInfoView, CContainer, CheckoutAction, HeaderNav, ProductsScroll } from './styles';

import { OSBill, OSTable, OSCoupon, OSTotal } from '../OrderSummary/styles';

import { ProductItemAccordion } from '../ProductItemAccordion';
import { BusinessItemAccordion } from '../BusinessItemAccordion';
import { CouponControl } from '../CouponControl';

import { OButton, OIcon, OModal, OText } from '../shared';
import { ProductForm } from '../ProductForm';
import { UpsellingProducts } from '../UpsellingProducts';
import { verifyDecimals } from '../../utils';
import { useTheme } from 'styled-components/native';
import { OrderSummary } from '../OrderSummary';
import { TouchableOpacity, View } from 'react-native';
import { FloatingButton } from '../FloatingButton';

const CartSingleUI = (props: any) => {
	const {
		navigation,
		route,
		cart,
		clearCart,
		changeQuantity,
		getProductMax,
		offsetDisabled,
		removeProduct,
		handleCartOpen,
		setIsCartsLoading,
		isExpanded
	} = props

	const theme = useTheme()
	const [, t] = useLanguage()
	const [orderState] = useOrder()
	const [{ configs }] = useConfig();
	const [{ parsePrice, parseNumber, parseDate, optimizeImage }] = useUtils()
	const [validationFields] = useValidationFields()

	const [openProduct, setModalIsOpen] = useState(false)
	const [curProduct, setCurProduct] = useState<any>(null)
	const [openUpselling, setOpenUpselling] = useState(false)
	const [canOpenUpselling, setCanOpenUpselling] = useState(false)

	const isCartPending = cart?.status === 2
	const isCouponEnabled = validationFields?.fields?.checkout?.coupon?.enabled

	const momentFormatted = !orderState?.option?.moment
		? t('RIGHT_NOW', 'Right Now')
		: parseDate(orderState?.option?.moment, { outputFormat: 'YYYY-MM-DD HH:mm' })

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

	const handleClearProducts = async () => {
		try {
			setIsCartsLoading && setIsCartsLoading(true)
			const result = await clearCart(cart?.uuid)
			setIsCartsLoading && setIsCartsLoading(false)
		} catch (error) {
			setIsCartsLoading && setIsCartsLoading(false)
		}
	}

	const handleUpsellingPage = () => {
		setOpenUpselling(false)
		setCanOpenUpselling(false)
		props.onNavigationRedirect('CheckoutNavigator', {
			screen: 'CheckoutPage',
			cartUuid: cart?.uuid,
			businessLogo: cart?.business?.logo,
			businessName: cart?.business?.name,
			cartTotal: cart?.total
		})
	}

	return (
		<CContainer>
			<HeaderNav>
				<TouchableOpacity onPress={() => navigation.canGoBack() && navigation.goBack()}>
					<OIcon src={theme.images.general.arrow_left} width={16} color={theme.colors.primary} />
				</TouchableOpacity>
				<OText size={14} lineHeight={21} weight={'600'} style={{ textAlign: 'center', flexGrow: 1 }}>{t('PERSONAL_CART', 'Personal cart')}</OText>
			</HeaderNav>
			<ProductsScroll showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 40, paddingBottom: 20 }}>
				<BusinessInfoView>
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<OIcon style={{ width: 42, height: 42, borderRadius: 25, borderWidth: 1, borderColor: theme.colors.border, }} url={optimizeImage(cart?.business?.logo, 'h_200,c_limit')} />
						<OText size={14} style={{ marginStart: 14 }}>
							{cart?.business?.name}
						</OText>
					</View>
					<OText size={14} lineHeight={21} weight={'600'}>{parsePrice(cart?.business?.minimum)}</OText>
				</BusinessInfoView>
				<OrderSummary
					cart={cart}
					isCartPending={cart?.status === 2}
					isFromCheckout
				/>
			</ProductsScroll>
			{cart?.valid_products && (
				<FloatingButton
					btnText={(cart?.subtotal >= cart?.minimum || !cart?.minimum) && cart?.valid_address ? (
						!openUpselling !== canOpenUpselling ? t('GO_TO_CHECKOUT', 'Go to checkout') : t('LOADING', 'Loading')
					) : !cart?.valid_address ? (
						`${t('OUT_OF_COVERAGE', 'Out of Coverage')}`
					) : (
						`${t('MINIMUN_SUBTOTAL_ORDER', 'Minimum subtotal order:')} ${parsePrice(cart?.minimum)}`
					)}
					isSecondaryBtn={(cart?.subtotal < cart?.minimum || !cart?.valid_address)}
					btnLeftValueShow={true}
					btnRightValueShow={cart?.total > 0}
					btnRightValue={parsePrice(cart?.total)}
					disabled={(openUpselling && !canOpenUpselling) || cart?.subtotal < cart?.minimum || !cart?.valid_address}
					handleClick={() => setOpenUpselling(true)}
					inSafeArea
				/>
			)}
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
					businessId={cart?.business_id}
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
		</CContainer>
	)
}

export const CartSingle = (props: any) => {
	const cartProps = {
		...props,
		UIComponent: CartSingleUI
	}

	return (
		<CartController {...cartProps} />
	)
}
