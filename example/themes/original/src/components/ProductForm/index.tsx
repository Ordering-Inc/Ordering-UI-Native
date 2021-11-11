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
			borderRadius: 8,
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
		console.log('----- click handle ------')
		const isErrors = Object.values(errors).length > 0;
		if (!isErrors) {
			console.log('----- save handle ------')
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

	const ExtraOptions = ({ eID, options }: any) => (
			<>
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
					<React.Fragment key={`cont_key_${id}`}>
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
					</React.Fragment>
				))}
			</>
	);

	return (
		<>
			<TopHeader>
				<TouchableOpacity
					style={styles.headerItem}
					onPress={onClose}>
					<OIcon src={theme.images.general.close} width={16} />
				</TouchableOpacity>
			</TopHeader>
			<ScrollView>
				{!error && (
					<View style={{ paddingBottom: 80 }}>
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
									<ProductHeader
										source={{ uri: product?.images || productCart?.images }}
										style={{height: windowWidth}}
										resizeMode={'contain'}
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
									<ExtraOptionWrap
										horizontal
										showsHorizontalScrollIndicator={false}
										style={{ marginBottom: 20 }}
										contentContainerStyle={{ paddingHorizontal: 33 }}
									>
									<TouchableOpacity
										key={`eopt_all_0`}
										onPress={() => setSelectedOpt(0)}
										style={[
											styles.extraItem,
											{
												borderBottomColor: selOpt == 0 ? theme.colors.textNormal : theme.colors.border,
											},
										]}>
										<OText
											color={selOpt == 0 ? theme.colors.textNormal : theme.colors.textSecondary}
											size={selOpt == 0 ? 14 : 12}
											weight={selOpt == 0 ? '600' : 'normal'}>
											{t('ALL', 'All')}
										</OText>
									</TouchableOpacity>
									{product?.extras.map((extra: any) => 					
										<ExtraOptions key={extra.id} options={extra.options} />
									)}
									</ExtraOptionWrap>

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
														<React.Fragment key={`popt_${option.id}`}>
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
					</View>
				)}
				{error && error.length > 0 && (
					<NotFoundSource content={error[0]?.message || error[0]} />
				)}
			</ScrollView>
			{!loading && !error && product && (
				<ProductActions
					style={{
						paddingBottom: Platform.OS === 'ios' ? bottom + 30 : bottom + 80
					}}
				>
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
							width: isSoldOut || maxProductQuantity <= 0 ? '60%' : '40%',
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
										fontSize: orderState.loading || editMode ? 10 : 14
									}}
									style={{
										backgroundColor: saveErrors ? theme.colors.lightGray : theme.colors.primary,
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
									textStyle={{fontSize: 10}}
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
								textStyle={{ color: theme.colors.primary, fontSize: 14 }}
								style={{
									height: 44,
									borderColor: theme.colors.primary,
									backgroundColor: theme.colors.white,
								}}
							/>
						)}
					</View>
				</ProductActions>
			)}
		</>
	);
};


export const ProductForm = (props: any) => {
	const productOptionsProps = {
		...props,
		UIComponent: ProductOptionsUI,
	};

	return <ProductOptions {...productOptionsProps} />;
};
