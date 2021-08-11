import React from 'react';
import {
	ProductForm as ProductOptions,
	useSession,
	useLanguage,
	useOrder,
	useUtils,
} from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { ProductIngredient } from '../ProductIngredient';
import { ProductOption } from '../ProductOption';

import { View, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';

import {
	ProductHeader,
	WrapHeader,
	TopHeader,
	WrapContent,
	ProductTitle,
	ProductDescription,
	ProductEditions,
	SectionTitle,
	WrapperIngredients,
	WrapperSubOption,
	ProductComment,
	ProductActions,
	ExtraOptionWrap,
} from './styles';
import { OButton, OIcon, OInput, OText } from '../shared';
import { ScrollView } from 'react-native-gesture-handler';
import { ProductOptionSubOption } from '../ProductOptionSubOption';
import { NotFoundSource } from '../NotFoundSource';
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useWindowDimensions } from 'react-native';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

export const ProductOptionsUI = (props: any) => {
	const {
		navigation,
		editMode,
		isSoldOut,
		productCart,
		increment,
		decrement,
		showOption,
		maxProductQuantity,
		errors,
		handleSave,
		handleChangeIngredientState,
		handleChangeSuboptionState,
		handleChangeCommentState,
		productObject,
		onClose,
		isFromCheckout,
	} = props;

	const theme = useTheme();


	const styles = StyleSheet.create({
		mainContainer: {

		},
		headerItem: {
			overflow: 'hidden',
			backgroundColor: theme.colors.clear,
			width: 35,
			marginVertical: 18,
		},
		optionContainer: {
			marginBottom: 20,
		},
		comment: {
			borderWidth: 1,
			borderRadius: 7.6,
			borderColor: theme.colors.border,
			height: 100,
			alignItems: 'flex-start',
		},
		quantityControl: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			marginRight: 10,
		},
		btnBackArrow: {
			borderWidth: 0,
			backgroundColor: 'rgba(0,0,0,0.3)',
			borderRadius: 24,
			marginRight: 15,
		},
		productHeaderSkeleton: {
			flexDirection: 'row',
			width: '100%',
			position: 'relative',
			maxHeight: 260,
			height: 260,
			resizeMode: 'cover',
			minHeight: 200,
			zIndex: 0,
		},
		extraItem: {
			paddingHorizontal: 7,
			paddingBottom: 10,
			borderBottomWidth: 1,
			borderBottomColor: theme.colors.border,
			justifyContent: 'center',
		},
	});

	const [{ parsePrice }] = useUtils();
	const [, t] = useLanguage();
	const [orderState] = useOrder();
	const [{ auth }] = useSession();
	const { product, loading, error } = productObject;

	const { top, bottom } = useSafeAreaInsets();
	const { height } = useWindowDimensions();
	const [selOpt, setSelectedOpt] = useState(0);

	const isError = (id: number) => {
		let bgColor = theme.colors.white;
		if (errors[`id:${id}`]) {
			bgColor = 'rgba(255, 0, 0, 0.05)';
		}
		if (isSoldOut || maxProductQuantity <= 0) {
			bgColor = 'hsl(0, 0%, 72%)';
		}
		return bgColor;
	};

	const handleSaveProduct = () => {
		const isErrors = Object.values(errors).length > 0;
		if (!isErrors) {
			handleSave && handleSave();
			return;
		}
	};

	const hasRespected = (options: Array<any>, respect_id: number) => {
		if (respect_id == null) return;
		const option: any = options.filter(({ id }: any) => id === selOpt);
		if (option == undefined) return false;
		if (option?.suboptions?.length == 0) return false;
		const sel = option[0]?.suboptions?.filter(
			({ id }: any) => id === respect_id,
		);
		return sel[0]?.id !== undefined;
	};

	const handleRedirectLogin = () => {
		onClose();
		navigation.navigate('Login');
	};

	const saveErrors =
		orderState.loading ||
		maxProductQuantity === 0 ||
		Object.keys(errors).length > 0;

	const ExtraOptions = ({ options }: any) => (
		<ExtraOptionWrap
			horizontal
			showsHorizontalScrollIndicator={false}
			style={{ marginBottom: 20 }}
			contentContainerStyle={{ paddingHorizontal: 33 }}>
			<>
				<TouchableOpacity
					key={`eopt_all_0`}
					onPress={() => setSelectedOpt(0)}
					style={[
						styles.extraItem,
						{
							borderBottomColor:
								selOpt == 0 ? theme.colors.textNormal : theme.colors.border,
						},
					]}>
					<OText
						color={selOpt == 0 ? theme.colors.textNormal : theme.colors.textSecondary}
						size={selOpt == 0 ? 14 : 12}
						weight={selOpt == 0 ? '600' : 'normal'}>
						{t('ALL', 'All')}
					</OText>
				</TouchableOpacity>
				{product?.ingredients.length > 0 && (
					<TouchableOpacity
						key={`eopt_all_00`}
						onPress={() => setSelectedOpt(-1)}
						style={[
							styles.extraItem,
							{
								borderBottomColor:
									selOpt == -1 ? theme.colors.textNormal : theme.colors.border,
							},
						]}>
						<OText
							color={selOpt == -1 ? theme.colors.textNormal : theme.colors.textSecondary}
							size={selOpt == -1 ? 14 : 12}
							weight={selOpt == -1 ? '600' : 'normal'}>
							{t('INGREDIENTS', 'Ingredients')}
						</OText>
					</TouchableOpacity>
				)}
				{options.map(({ id, name, respect_to }: any) => (
					<>
						{respect_to == null && (
							<TouchableOpacity
								key={`eopt_key_${id}`}
								onPress={() => setSelectedOpt(id)}
								style={[
									styles.extraItem,
									{
										borderBottomColor:
											selOpt == id ? theme.colors.textNormal : theme.colors.border,
									},
								]}>
								<OText
									color={
										selOpt == id ? theme.colors.textNormal : theme.colors.textSecondary
									}
									size={selOpt == id ? 14 : 12}
									weight={selOpt == id ? '600' : 'normal'}>
									{name}
								</OText>
							</TouchableOpacity>
						)}
					</>
				))}
			</>
		</ExtraOptionWrap>
	);

	return (
		<View style={{ height: height }}>
			<View style={{ height: height - top - bottom - (Platform.OS === 'android' ? 94 : 69) }}>
				<ScrollView>
					{!error && (
						<>
							<WrapHeader>
								{loading && !product ? (
									<View style={styles.productHeaderSkeleton}>
										<Placeholder Animation={Fade}>
											<PlaceholderLine
												height={258}
												style={{ borderRadius: 0 }}
												width={windowWidth}
											/>
										</Placeholder>
									</View>
								) : (
									<>
										<TopHeader>
											<TouchableOpacity
												style={styles.headerItem}
												onPress={onClose}>
												<OIcon src={theme.images.general.close} width={16} />
											</TouchableOpacity>
										</TopHeader>
										<ProductHeader
											source={{ uri: product?.images || productCart?.images }}
										/>
									</>
								)}
							</WrapHeader>
							<WrapContent>
								<ProductTitle>
									{loading && !product ? (
										<Placeholder Animation={Fade}>
											<View
												style={{
													flexDirection: 'row',
													justifyContent: 'space-between',
												}}>
												<PlaceholderLine width={40} height={20} />
												<PlaceholderLine width={30} height={20} />
											</View>
										</Placeholder>
									) : (
										<>
											<OText
												size={20}
												lineHeight={30}
												weight={'600'}
												style={{ flex: 1, marginBottom: 5 }}>
												{product?.name || productCart.name}
											</OText>
											<OText size={16} lineHeight={24} color={theme.colors.textNormal}>
												{productCart.price ? parsePrice(productCart.price) : ''}
											</OText>
										</>
									)}
								</ProductTitle>
								<ProductDescription>
									<OText color={theme.colors.textSecondary} size={12} lineHeight={18}>
										{product?.description || productCart?.description}
									</OText>
									{((product?.sku &&
										product?.sku !== '-1' &&
										product?.sku !== '1') ||
										(productCart?.sku &&
											productCart?.sku !== '-1' &&
											productCart?.sku !== '1')) && (
											<>
												<OText size={16}>{t('SKU', 'Sku')}</OText>
												<OText>{product?.sku || productCart?.sku}</OText>
											</>
										)}
								</ProductDescription>
								{loading && !product ? (
									<>
										{[...Array(2)].map((item, i) => (
											<Placeholder
												key={i}
												style={{ marginBottom: 20 }}
												Animation={Fade}>
												<PlaceholderLine
													height={40}
													style={{ flex: 1, marginTop: 10 }}
												/>
												{[...Array(3)].map((item, i) => (
													<View
														key={'place_key_' + i}
														style={{
															flexDirection: 'row',
															justifyContent: 'space-between',
														}}>
														<PlaceholderLine
															height={30}
															width={10}
															style={{ marginBottom: 20 }}
														/>
														<PlaceholderLine
															height={30}
															width={50}
															style={{ marginBottom: 20 }}
														/>
														<PlaceholderLine
															height={30}
															width={30}
															style={{ marginBottom: 20 }}
														/>
													</View>
												))}
											</Placeholder>
										))}
									</>
								) : (
									<ProductEditions>
										{product?.extras.map((extra: any) => (
											<ExtraOptions options={extra.options} />
										))}

										{selOpt == 0 ? (
											<>
												{product?.ingredients.length > 0 && (
													<View style={styles.optionContainer}>
														<SectionTitle>
															<OText size={16}>
																{t('INGREDIENTS', 'Ingredients')}
															</OText>
														</SectionTitle>
														<WrapperIngredients
															style={{
																backgroundColor:
																	isSoldOut || maxProductQuantity <= 0
																		? 'hsl(0, 0%, 72%)'
																		: theme.colors.white,
															}}>
															{product?.ingredients.map((ingredient: any) => (
																<ProductIngredient
																	key={ingredient.id}
																	ingredient={ingredient}
																	state={
																		productCart.ingredients[`id:${ingredient.id}`]
																	}
																	onChange={handleChangeIngredientState}
																/>
															))}
														</WrapperIngredients>
													</View>
												)}
												{product?.extras.map((extra: any) =>
													extra.options.map((option: any) => {
														const currentState =
															productCart.options[`id:${option.id}`] || {};
														return (
															<React.Fragment key={option.id}>
																{showOption(option) && (
																	<View style={styles.optionContainer}>
																		<ProductOption
																			option={option}
																			currentState={currentState}
																			error={errors[`id:${option.id}`]}>
																			<WrapperSubOption
																				style={{
																					backgroundColor: isError(option.id),
																				}}>
																				{option.suboptions.map(
																					(suboption: any) => {
																						const currentState =
																							productCart.options[
																								`id:${option.id}`
																							]?.suboptions[
																							`id:${suboption.id}`
																							] || {};
																						const balance =
																							productCart.options[
																								`id:${option.id}`
																							]?.balance || 0;
																						return (
																							<ProductOptionSubOption
																								key={suboption.id}
																								onChange={
																									handleChangeSuboptionState
																								}
																								balance={balance}
																								option={option}
																								suboption={suboption}
																								state={currentState}
																								disabled={
																									isSoldOut ||
																									maxProductQuantity <= 0
																								}
																							/>
																						);
																					},
																				)}
																			</WrapperSubOption>
																		</ProductOption>
																	</View>
																)}
															</React.Fragment>
														);
													}),
												)}
											</>
										) : (
											<>
												{selOpt == -1 ? (
													<View style={styles.optionContainer}>
														<SectionTitle>
															<OText size={16}>
																{t('INGREDIENTS', 'Ingredients')}
															</OText>
														</SectionTitle>
														<WrapperIngredients
															style={{
																backgroundColor:
																	isSoldOut || maxProductQuantity <= 0
																		? 'hsl(0, 0%, 72%)'
																		: theme.colors.white,
															}}>
															{product?.ingredients.map((ingredient: any) => (
																<ProductIngredient
																	key={ingredient.id}
																	ingredient={ingredient}
																	state={
																		productCart.ingredients[`id:${ingredient.id}`]
																	}
																	onChange={handleChangeIngredientState}
																/>
															))}
														</WrapperIngredients>
													</View>
												) : (
													<>
														{product?.extras.map((extra: any) =>
															extra.options.map((option: any) => {
																if (
																	option.id == selOpt ||
																	(hasRespected(
																		extra.options,
																		option.respect_to,
																	) &&
																		showOption(option))
																) {
																	const currentState =
																		productCart.options[`id:${option.id}`] || {};
																	return (
																		<React.Fragment key={option.id}>
																			{showOption(option) && (
																				<View style={styles.optionContainer}>
																					<ProductOption
																						option={option}
																						currentState={currentState}
																						error={errors[`id:${option.id}`]}>
																						<WrapperSubOption
																							style={{
																								backgroundColor: isError(
																									option.id,
																								),
																							}}>
																							{option.suboptions.map(
																								(suboption: any) => {
																									const currentState =
																										productCart.options[
																											`id:${option.id}`
																										]?.suboptions[
																										`id:${suboption.id}`
																										] || {};
																									const balance =
																										productCart.options[
																											`id:${option.id}`
																										]?.balance || 0;
																									return (
																										<ProductOptionSubOption
																											key={suboption.id}
																											onChange={
																												handleChangeSuboptionState
																											}
																											balance={balance}
																											option={option}
																											suboption={suboption}
																											state={currentState}
																											disabled={
																												isSoldOut ||
																												maxProductQuantity <= 0
																											}
																										/>
																									);
																								},
																							)}
																						</WrapperSubOption>
																					</ProductOption>
																				</View>
																			)}
																		</React.Fragment>
																	);
																}
															}),
														)}
													</>
												)}
											</>
										)}
										<ProductComment>
											<SectionTitle>
												<OText size={16} weight={'600'} lineHeight={24}>
													{t('SPECIAL_COMMENT', 'Special comment')}
												</OText>
											</SectionTitle>
											<OInput
												multiline
												placeholder={t('SPECIAL_COMMENT', 'Special comment')}
												value={productCart.comment}
												onChange={(val: string) =>
													handleChangeCommentState({ target: { value: val } })
												}
												isDisabled={
													!(productCart && !isSoldOut && maxProductQuantity)
												}
												style={styles.comment}
											/>
										</ProductComment>
									</ProductEditions>
								)}
							</WrapContent>
						</>
					)}
					{error && error.length > 0 && (
						<NotFoundSource content={error[0]?.message || error[0]} />
					)}
				</ScrollView>
			</View>
			{!loading && !error && product && (
				<ProductActions style={{ paddingBottom: bottom + 12 }}>
					<OText size={16} lineHeight={24} weight={'600'}>
						{productCart.total ? parsePrice(productCart?.total) : ''}
					</OText>
					{productCart && !isSoldOut && maxProductQuantity > 0 && (
						<View style={styles.quantityControl}>
							<TouchableOpacity
								onPress={decrement}
								disabled={productCart.quantity === 1 || isSoldOut}>
								<OIcon
									src={theme.images.general.minus}
									width={16}
									color={
										productCart.quantity === 1 || isSoldOut
											? theme.colors.backgroundGray
											: theme.colors.backgroundDark
									}
								/>
							</TouchableOpacity>
							<OText
								size={12}
								lineHeight={18}
								style={{ minWidth: 29, textAlign: 'center' }}>
								{productCart.quantity}
							</OText>
							<TouchableOpacity
								onPress={increment}
								disabled={
									maxProductQuantity <= 0 ||
									productCart.quantity >= maxProductQuantity ||
									isSoldOut
								}>
								<OIcon
									src={theme.images.general.plus}
									width={16}
									color={
										maxProductQuantity <= 0 ||
											productCart.quantity >= maxProductQuantity ||
											isSoldOut
											? theme.colors.backgroundGray
											: theme.colors.backgroundDark
									}
								/>
							</TouchableOpacity>
						</View>
					)}
					<View
						style={{
							width: isSoldOut || maxProductQuantity <= 0 ? '100%' : '40%',
						}}>
						{productCart &&
							!isSoldOut &&
							maxProductQuantity > 0 &&
							auth &&
							orderState.options?.address_id && (
								<OButton
									onClick={() => handleSaveProduct()}
									imgRightSrc=""
									text={`${orderState.loading
										? t('LOADING', 'Loading')
										: editMode
											? t('UPDATE', 'Update')
											: t('ADD', 'Add')
										}`}
									textStyle={{
										color: saveErrors ? theme.colors.primary : theme.colors.white,
									}}
									style={{
										backgroundColor: saveErrors ? theme.colors.white : theme.colors.primary,
										borderColor: saveErrors ? theme.colors.white : theme.colors.primary,
										opacity: saveErrors ? 0.3 : 1,
										borderRadius: 7.6,
										height: 44,
										shadowOpacity: 0,
										borderWidth: 1,
									}}
								/>
							)}
						{auth &&
							!orderState.options?.address_id &&
							(orderState.loading ? (
								<OButton
									isDisabled
									text={t('LOADING', 'Loading')}
									imgRightSrc=""
								/>
							) : (
								<OButton onClick={navigation.navigate('AddressList')} />
							))}
						{(!auth || isSoldOut || maxProductQuantity <= 0) && (
							<OButton
								isDisabled={isSoldOut || maxProductQuantity <= 0}
								onClick={() => handleRedirectLogin()}
								text={
									isSoldOut || maxProductQuantity <= 0
										? t('SOLD_OUT', 'Sold out')
										: t('LOGIN_SIGNUP', 'Login / Sign Up')
								}
								imgRightSrc=""
								textStyle={{ color: theme.colors.primary }}
								style={{
									borderColor: theme.colors.primary,
									backgroundColor: theme.colors.white,
								}}
							/>
						)}
					</View>
				</ProductActions>
			)}
		</View>
	);
};


export const ProductForm = (props: any) => {
	const productOptionsProps = {
		...props,
		UIComponent: ProductOptionsUI,
	};

	return <ProductOptions {...productOptionsProps} />;
};
