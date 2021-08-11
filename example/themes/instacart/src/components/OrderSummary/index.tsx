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
	OSTable
} from './styles';

import { ProductItemAccordion } from '../ProductItemAccordion';
import { CouponControl } from '../CouponControl';
import { OIcon, OModal, OText } from '../shared';
import { ProductForm } from '../ProductForm';
import { verifyDecimals } from '../../utils';
import { useTheme } from 'styled-components/native';
import { DriverTips } from '../DriverTips';

const OrderSummaryUI = (props: any) => {
	const {
		cart,
		changeQuantity,
		getProductMax,
		offsetDisabled,
		removeProduct,
		isCartPending,
		isFromCheckout,
		isDriverTips
	} = props;

	const theme = useTheme();
	const [, t] = useLanguage();
	const [{ configs }] = useConfig();
	const [orderState] = useOrder();
	const [{ parsePrice, parseNumber }] = useUtils();
	const [validationFields] = useValidationFields();
	const [openProduct, setModalIsOpen] = useState(false)
	const [curProduct, setCurProduct] = useState<any>(null)

	const isCouponEnabled = validationFields?.fields?.checkout?.coupon?.enabled;

	const driverTipsOptions = typeof configs?.driver_tip_options?.value === 'string'
		? JSON.parse(configs?.driver_tip_options?.value) || []
		: configs?.driver_tip_options?.value || []

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
								isExpanded
							/>
						))}
					</OSProductList>
					{isDriverTips && driverTipsOptions && driverTipsOptions?.length > 0 && (
						<View style={{ flexDirection: 'column', paddingVertical: 10, paddingBottom: 17, borderBottomWidth: 1, borderBottomColor: theme.colors.border }}>
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<OIcon src={theme.images.general.bicycle} color={theme.colors.primary} width={16} style={{ marginEnd: 7 }} />
								<OText style={{ ...theme.labels.middle, fontWeight: '600', marginBottom: 3 }}>
									{t('DRIVER_TIPS', 'Driver Tips')}
								</OText>
							</View>
							<DriverTips
								businessId={cart?.business_id}
								driverTipsOptions={driverTipsOptions}
								isFixedPrice={parseInt(configs?.driver_tip_type?.value, 10) === 1 || !!parseInt(configs?.driver_tip_use_custom?.value, 10)}
								isDriverTipUseCustom={!!parseInt(configs?.driver_tip_use_custom?.value, 10)}
								driverTip={parseInt(configs?.driver_tip_type?.value, 10) === 1 || !!parseInt(configs?.driver_tip_use_custom?.value, 10)
									? cart?.driver_tip
									: cart?.driver_tip_rate}
								useOrderContext
								wrapStyle={{ alignSelf: 'stretch' }}
							/>
						</View>
					)}

					{cart?.valid && (
						<OSBill>
							<OSTable>
								<OText style={theme.labels.normal} color={theme.colors.textPrimary}>{t('SUBTOTAL', 'Subtotal')}</OText>
								<OText style={theme.labels.normal} color={theme.colors.textPrimary}>{cart.business.tax_type === 1
									? parsePrice((cart?.subtotal + cart?.tax) || 0)
									: parsePrice(cart?.subtotal || 0)}</OText>
							</OSTable>
							{cart?.discount > 0 && cart?.total >= 0 && (
								<OSTable>
									{cart?.discount_type === 1 ? (
										<OText style={theme.labels.normal} color={theme.colors.textPrimary}>
											{t('DISCOUNT', 'Discount')}
											<OText style={theme.labels.normal} color={theme.colors.textPrimary}>{`(${verifyDecimals(cart?.discount_rate, parsePrice)}%)`}</OText>
										</OText>
									) : (
										<OText style={theme.labels.normal} color={theme.colors.textPrimary}>{t('DISCOUNT', 'Discount')}</OText>
									)}
									<OText style={theme.labels.normal} color={theme.colors.textPrimary}>- {parsePrice(cart?.discount || 0)}</OText>
								</OSTable>
							)}
							{cart.business.tax_type !== 1 && (
								<OSTable>
									<OText style={theme.labels.normal} color={theme.colors.textPrimary}>
										{t('TAX', 'Tax')}
										{`(${verifyDecimals(cart?.business?.tax, parseNumber)}%)`}
									</OText>
									<OText style={theme.labels.normal} color={theme.colors.textPrimary}>{parsePrice(cart?.tax || 0)}</OText>
								</OSTable>
							)}
							{orderState?.options?.type === 1 && cart?.delivery_price > 0 && (
								<OSTable>
									<OText style={theme.labels.normal} color={theme.colors.textPrimary}>{t('DELIVERY_FEE', 'Delivery Fee')}</OText>
									<OText style={theme.labels.normal} color={theme.colors.textPrimary}>{parsePrice(cart?.delivery_price)}</OText>
								</OSTable>
							)}
							{cart?.driver_tip > 0 && (
								<OSTable>
									<OText style={theme.labels.normal} color={theme.colors.textPrimary}>
										{t('DRIVER_TIP', 'Driver tip')}
										{cart?.driver_tip_rate > 0 &&
											parseInt(configs?.driver_tip_type?.value, 10) === 2 &&
											!parseInt(configs?.driver_tip_use_custom?.value, 10) &&
											(
												`(${verifyDecimals(cart?.driver_tip_rate, parseNumber)}%)`
											)}
									</OText>
									<OText style={theme.labels.normal} color={theme.colors.textPrimary}>{parsePrice(cart?.driver_tip)}</OText>
								</OSTable>
							)}
							{cart?.service_fee > 0 && (
								<OSTable>
									<OText style={theme.labels.normal} color={theme.colors.textPrimary}>
										{t('SERVICE_FEE', 'Service Fee')}
										{`(${verifyDecimals(cart?.business?.service_fee, parseNumber)}%)`}
									</OText>
									<OText style={theme.labels.normal} color={theme.colors.textPrimary}>{parsePrice(cart?.service_fee)}</OText>
								</OSTable>
							)}
							{cart?.total >= 1 && (
								<View style={{}}>
									<OSTable>
										<OText size={12} lineHeight={18} weight={'600'} color={theme.colors.textPrimary}>
											{t('TOTAL', 'Total')}
										</OText>
										<OText size={12} lineHeight={18} weight={'600'} color={theme.colors.textPrimary}>
											{parsePrice(cart?.total)}
										</OText>
									</OSTable>
								</View>
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

						</OSBill>
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
