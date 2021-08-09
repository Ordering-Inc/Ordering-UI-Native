import React, { useState, useEffect } from 'react'
import Spinner from 'react-native-loading-spinner-overlay';
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { I18nManager, StyleSheet, TextStyle, View } from 'react-native'
import {
	UpsellingPage as UpsellingPageController,
	useUtils,
	useLanguage
} from 'ordering-components/native'
import { OText, OIcon, OModal, OBottomPopup, OButton } from '../shared'
import { colors, labels } from '../../theme.json'
import { UpsellingProductsParams } from '../../types'
import {
	Container,
	UpsellingContainer,
	Item,
	Details,
	AddButton,
	CloseUpselling
} from './styles'
import { ProductForm } from '../ProductForm';
const UpsellingProductsUI = (props: UpsellingProductsParams) => {
	const {
		isCustomMode,
		upsellingProducts,
		business,
		handleUpsellingPage,
		openUpselling,
		canOpenUpselling,
		setCanOpenUpselling,
		scrollContainerStyle
	} = props
	const [actualProduct, setActualProduct] = useState<any>(null)
	const [modalIsOpen, setModalIsOpen] = useState(false)
	const [{ parsePrice }] = useUtils()
	const [, t] = useLanguage()

	useEffect(() => {
		if (!isCustomMode) {
			if (upsellingProducts?.products?.length && !upsellingProducts.loading) {
				setCanOpenUpselling && setCanOpenUpselling(true)
			}
			if ((!upsellingProducts?.products?.length && !upsellingProducts.loading && !canOpenUpselling && openUpselling) ||
				(!upsellingProducts?.products?.length && !upsellingProducts.loading && openUpselling)) {
				handleUpsellingPage && handleUpsellingPage()
			}
		}
	}, [upsellingProducts.loading, upsellingProducts?.products.length])

	const handleFormProduct = (product: any) => {
		setActualProduct(product)
		setModalIsOpen(true)
	}

	const handleSaveProduct = () => {
		setActualProduct(null)
		setModalIsOpen(false)
	}

	const UpsellingLayout = () => {
		return (
			<Container>
				<UpsellingContainer
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={scrollContainerStyle}
				>
					{
						!upsellingProducts.loading && (
							<>
								{
									!upsellingProducts.error ? upsellingProducts.products.map((product: any) => (
										<Item key={product.id}>
											<Details>
												<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
													<OText size={12} weight={'600'} numberOfLines={1} ellipsizeMode='tail' style={{flexBasis: '76%'}}>{product.name}</OText>
													<OText color={colors.textThird} style={labels.small as TextStyle}>{parsePrice(product.price)}</OText>
												</View>
												<AddButton onPress={() => handleFormProduct(product)}>
													<OText color={colors.white} size={10} weight={'600'}>{t('ADD', 'Add')}</OText>
												</AddButton>
											</Details>
											<OIcon url={product.images} style={styles.imageStyle} />
										</Item>
									)) : (
										<OText>
											{upsellingProducts.message}
										</OText>
									)
								}
							</>
						)
					}
				</UpsellingContainer>
			</Container>
		)
	}
	return (
		<>
			{isCustomMode ? (
				<UpsellingLayout />
			) : (
				<>
					{!canOpenUpselling || upsellingProducts?.products?.length === 0 ? null : (
						<>
							{!modalIsOpen && (
								<OBottomPopup
									title={t('WANT_SOMETHING_ELSE', 'Do you want something else?')}
									open={openUpselling}
									onClose={() => handleUpsellingPage()}
								>
									<UpsellingLayout />
									<CloseUpselling>
										<OButton
											imgRightSrc=''
											text={t('NO_THANKS', 'No Thanks')}
											style={styles.closeUpsellingButton}
											onClick={() => handleUpsellingPage()}
										/>
									</CloseUpselling>
								</OBottomPopup>
							)}
						</>
					)}
				</>
			)}
			<OModal
				open={modalIsOpen}
				onClose={() => setModalIsOpen(false)}
				entireModal
				customClose
			>
				{actualProduct && (
					<ProductForm
						product={actualProduct}
						businessId={actualProduct?.api?.businessId}
						businessSlug={business.slug}
						onSave={() => handleSaveProduct()}
						onClose={() => setModalIsOpen(false)}
					/>
				)}
			</OModal>
		</>
	)
}

const styles = StyleSheet.create({
	imageStyle: {
		width: 60,
		height: 60,
		resizeMode: 'cover',
		borderTopRightRadius: I18nManager.isRTL ? 0 : 7.6,
		borderBottomRightRadius: I18nManager.isRTL ? 0 : 7.6,
		borderTopLeftRadius: !I18nManager.isRTL ? 0 : 7.6,
		borderBottomLeftRadius: !I18nManager.isRTL ? 0 : 7.6,
	},
	closeUpsellingButton: {
		borderRadius: 25,
		borderColor: colors.primary,
		backgroundColor: colors.white,
		borderWidth: 1,
		height: 42,
		marginBottom: 10
	},
	upsellingModal: {
		height: '50%',
		top: 250
	}
})

export const UpsellingProducts = (props: UpsellingProductsParams) => {
	const upsellingProductsProps = {
		...props,
		UIComponent: UpsellingProductsUI
	}
	return (
		<UpsellingPageController {...upsellingProductsProps} />
	)
}
