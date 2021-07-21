import React, { useState } from 'react';
import { TextStyle, View } from 'react-native'
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
import { OModal, OText } from '../../../../components/shared';
import { colors, labels } from '../../theme.json';
import { ProductForm } from '../ProductForm';
import { verifyDecimals } from '../../../../utils';
import { UpsellingProducts } from '../UpsellingProducts';


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
					<OSProductList style={{ paddingHorizontal: paddingH }}>
						{title && <OText style={[labels.middle, { marginVertical: 12 }] as TextStyle}>{title}</OText>}
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
						<View style={{ marginVertical: 28, paddingBottom: 36, borderBottomWidth: 8, borderBottomColor: colors.inputDisabled }}>
							<OText style={[labels.middle, { paddingHorizontal: paddingH, marginBottom: 10 }] as TextStyle}>{t('WANT_SOMETHING_ELSE', 'Do you want something else?')}</OText>
							<View>
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
						</View>
					)}
					{cart?.valid && (
						<OSBill style={{ paddingHorizontal: paddingH }}>
							{!isMini ? (
								<View>
									{cart?.total >= 1 && (
										<View style={{ borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: 12, marginBottom: 4 }}>
											<OSTable>
												<OText style={labels.middle as TextStyle}>
													{t('TOTAL', 'Total')}
												</OText>
												<OText style={labels.middle as TextStyle}>
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
								<OText style={labels.normal as TextStyle}>{t('SUBTOTAL', 'Subtotal')}</OText>
								<OText style={labels.normal as TextStyle}>{cart.business.tax_type === 1
									? parsePrice((cart?.subtotal + cart?.tax) || 0)
									: parsePrice(cart?.subtotal || 0)}</OText>
							</OSTable>
							{cart?.discount > 0 && cart?.total >= 0 && (
								<OSTable>
									{cart?.discount_type === 1 ? (
										<OText style={labels.normal as TextStyle}>
											{t('DISCOUNT', 'Discount')}
											<OText style={labels.normal as TextStyle}>{`(${verifyDecimals(cart?.discount_rate, parsePrice)}%)`}</OText>
										</OText>
									) : (
										<OText style={labels.normal as TextStyle}>{t('DISCOUNT', 'Discount')}</OText>
									)}
									<OText style={labels.normal as TextStyle}>- {parsePrice(cart?.discount || 0)}</OText>
								</OSTable>
							)}
							{cart.business.tax_type !== 1 && (
								<OSTable>
									<OText style={labels.normal as TextStyle}>
										{t('TAX', 'Tax')}
										{`(${verifyDecimals(cart?.business?.tax, parseNumber)}%)`}
									</OText>
									<OText style={labels.normal as TextStyle}>{parsePrice(cart?.tax || 0)}</OText>
								</OSTable>
							)}
							{orderState?.options?.type === 1 && cart?.delivery_price > 0 && (
								<OSTable>
									<OText style={labels.normal as TextStyle}>{t('DELIVERY_FEE', 'Delivery Fee')}</OText>
									<OText style={labels.normal as TextStyle}>{parsePrice(cart?.delivery_price)}</OText>
								</OSTable>
							)}
							{cart?.driver_tip > 0 && (
								<OSTable>
									<OText style={labels.normal as TextStyle}>
										{t('DRIVER_TIP', 'Driver tip')}
										{cart?.driver_tip_rate > 0 &&
											parseInt(configs?.driver_tip_type?.value, 10) === 2 &&
											!parseInt(configs?.driver_tip_use_custom?.value, 10) &&
											(
												`(${verifyDecimals(cart?.driver_tip_rate, parseNumber)}%)`
											)}
									</OText>
									<OText style={labels.normal as TextStyle}>{parsePrice(cart?.driver_tip)}</OText>
								</OSTable>
							)}
							{cart?.service_fee > 0 && (
								<OSTable>
									<OText style={labels.normal as TextStyle}>
										{t('SERVICE_FEE', 'Service Fee')}
										{`(${verifyDecimals(cart?.business?.service_fee, parseNumber)}%)`}
									</OText>
									<OText style={labels.normal as TextStyle}>{parsePrice(cart?.service_fee)}</OText>
								</OSTable>
							)}

							{isMini ? (
								<View style={{marginTop: 10}}>
									{cart?.total >= 1 && (
										<View style={{ borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 12, marginBottom: 4 }}>
											<OSTable>
												<OText style={labels.middle as TextStyle}>
													{t('TOTAL', 'Total')}
												</OText>
												<OText style={labels.middle as TextStyle}>
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
