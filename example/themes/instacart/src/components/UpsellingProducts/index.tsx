import React, { useState, useEffect } from 'react'
import { PanResponder, StyleSheet, useWindowDimensions, View } from 'react-native'
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import {
	UpsellingPage as UpsellingPageController,
	useUtils,
	useLanguage
} from 'ordering-components/native'
import { OText, OIcon, OModal, OBottomPopup, OButton } from '../shared'
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
import { useTheme } from 'styled-components/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import NavBar from '../NavBar'

const UpsellingProductsUI = (props: UpsellingProductsParams) => {
	const {
		isCustomMode,
		upsellingProducts,
		business,
		handleUpsellingPage,
		openUpselling,
		canOpenUpselling,
		setCanOpenUpselling
	} = props

	const { height, width } = useWindowDimensions();
	const { bottom, top } = useSafeAreaInsets();

	const theme = useTheme();

	const styles = StyleSheet.create({
		imageStyle: {
			width: ((width - 80) * 0.5) - 40,
			height: ((width - 80) * 0.5) - 40,
			resizeMode: 'cover',
			borderRadius: 3
		},
		closeUpsellingButton: {
			borderRadius: 3,
			borderColor: theme.colors.primary,
			backgroundColor: theme.colors.primary,
			height: 42,
		}
	})

	const [actualProduct, setActualProduct] = useState<any>(null)
	const [modalIsOpen, setModalIsOpen] = useState(false)
	const [productSorts, setSorts] = useState<any>([]);
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

	// useEffect(() => {
	// 	if (upsellingProducts?.products.length > 0) {
	// 		const ary = [];
	// 		while (upsellingProducts?.products.length > 0) {
	// 			ary.push(upsellingProducts?.products.splice(0, 2));
	// 		}
	// 		setSorts(ary);
	// 	}
	// }, [upsellingProducts?.products]);

	const UpsellingLayout = () => {
		return (
			<Container>
				<UpsellingContainer
					showsVerticalScrollIndicator={true}
					style={{ height: height - bottom - top - 180 }}
				>
					{
						!upsellingProducts.loading && (
							<>
								{
									!upsellingProducts.error ? upsellingProducts.products.map((product: any, idx: number) => (
										<React.Fragment key={`up-key-${idx}`}>
											{idx % 2 == 1 && (
												<View key={upsellingProducts.products[idx].id} style={{ flexDirection: 'row' }}>
													<Item activeOpacity={1}	onPress={() => handleFormProduct(upsellingProducts.products[idx - 1])}>
														<OIcon
															url={upsellingProducts.products[idx - 1].images}
															style={styles.imageStyle}
														/>
														<Details>
															<OText size={12} color={theme.colors.textPrimary}>{parsePrice(upsellingProducts.products[idx - 1].price)}</OText>
															<OText size={10} numberOfLines={2} ellipsizeMode='tail'>{upsellingProducts.products[idx - 1].name}</OText>
														</Details>
														<AddButton onPress={() => handleFormProduct(upsellingProducts.products[idx - 1])}>
															<OIcon src={theme.images.general.plus_circle} width={16} />
														</AddButton>
													</Item>

													<Item	activeOpacity={1} onPress={() => handleFormProduct(upsellingProducts.products[idx])}>
														<OIcon
															url={upsellingProducts.products[idx].images}
															style={styles.imageStyle}
														/>
														<Details>
															<OText size={12} color={theme.colors.textPrimary}>{parsePrice(upsellingProducts.products[idx].price)}</OText>
															<OText size={10} numberOfLines={2} ellipsizeMode='tail'>{upsellingProducts.products[idx].name}</OText>
														</Details>
														<AddButton onPress={() => handleFormProduct(upsellingProducts.products[idx])}>
															<OIcon src={theme.images.general.plus_circle} width={16} />
														</AddButton>
													</Item>
												</View>
											)}
											{upsellingProducts.products.length % 2 == 1 && upsellingProducts.products.length - idx === 1 && (
												<View key={idx} style={{ flexDirection: 'row' }}>
													<Item	key={upsellingProducts.products[upsellingProducts.products.length - 1].id} activeOpacity={1}
													 onPress={() => handleFormProduct(upsellingProducts.products[upsellingProducts.products.length - 1])}>
														<OIcon
															url={upsellingProducts.products[upsellingProducts.products.length - 1].images}
															style={styles.imageStyle}
														/>
														<Details>
															<OText size={12} numberOfLines={1} ellipsizeMode='tail'>{upsellingProducts.products[upsellingProducts.products.length - 1].name}</OText>
															<OText color={theme.colors.primary} weight='bold'>{parsePrice(upsellingProducts.products[upsellingProducts.products.length - 1].price)}</OText>
														</Details>
														<AddButton onPress={() => handleFormProduct(upsellingProducts.products[upsellingProducts.products.length - 1])}>
															<OIcon src={theme.images.general.plus_circle} width={16} />
														</AddButton>
													</Item>
												</View>
											)}
										</React.Fragment>
									)) : (
										<OText size={12}>
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
									open={openUpselling}
									onClose={() => handleUpsellingPage()}
									title={t('WANT_SOMETHING_ELSE', 'Do you want something else?')}
								>
									<UpsellingLayout />
									<CloseUpselling style={{ paddingBottom: bottom + 12 }}>
										<OButton
											imgRightSrc=''
											text={t('NO_THANKS', 'No Thanks')}
											style={styles.closeUpsellingButton}
											onClick={() => handleUpsellingPage()}
											textStyle={{ color: theme.colors.white, fontSize: 14, lineHeight: 21, fontWeight: '500' }}
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

export const UpsellingProducts = (props: UpsellingProductsParams) => {
	const upsellingProductsProps = {
		...props,
		UIComponent: UpsellingProductsUI
	}
	return (
		<UpsellingPageController {...upsellingProductsProps} />
	)
}
