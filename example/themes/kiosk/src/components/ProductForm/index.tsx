import React, { useState } from 'react'
import FastImage from 'react-native-fast-image'
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
  ImageBackground,
} from 'react-native'
import {
  ProductForm as ProductOptions,
  useSession,
  useLanguage,
  useOrder,
  useUtils
} from 'ordering-components/native'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useTheme } from 'styled-components/native'

import { ProductIngredient } from '../ProductIngredient'
import { ProductOption } from '../ProductOption'
import {
  WrapContent,
  ProductDescription,
  ProductEditions,
  SectionTitle,
  WrapperIngredients,
  WrapperSubOption,
  ProductComment,
  ProductActions
} from './styles'
import { OButton, OInput, OText } from '../shared'
import { ProductOptionSubOption } from '../ProductOptionSubOption'
import { NotFoundSource } from '../NotFoundSource'
import NavBar from '../NavBar'
import { useDeviceOrientation } from '../../../../../src/hooks/DeviceOrientation'

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
    isDrawer
  } = props;

  const theme = useTheme();
  const [{ parsePrice }] = useUtils();
  const [, t] = useLanguage();
  const [orderState] = useOrder();
  const [{ auth }] = useSession();
  const [orientationState] = useDeviceOrientation();

  const { product, loading, error } = productObject;

  const HEADER_EXPANDED_HEIGHT = orientationState?.dimensions?.height * 0.4;
  const HEADER_COLLAPSED_HEIGHT = orientationState?.dimensions?.height * 0.2;

  const isError = (id: number) => {
    let bgColor = theme.colors.white
    if (errors[`id:${id}`]) {
      bgColor = 'rgba(255, 0, 0, 0.05)'
    }
    if (isSoldOut || maxProductQuantity <= 0) {
      bgColor = 'hsl(0, 0%, 72%)'
    }
    return bgColor
  }

  const handleSaveProduct = () => {
    const isErrors = Object.values(errors).length > 0
    if (!isErrors) {
      props.onProductStateChange &&
      props.onProductStateChange(props.isEdit ? { product, productCart }: productCart)
      handleSave && handleSave()
      return
    }
  }

  const handleRedirectLogin = () => {
    onClose && onClose()
    navigation?.navigate('Login')
  }

  const saveErrors = orderState.loading || maxProductQuantity === 0 || Object.keys(errors)?.length > 0

  const [scrollY] = useState(new Animated.Value(0));

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
    outputRange: [HEADER_EXPANDED_HEIGHT, HEADER_COLLAPSED_HEIGHT],
    extrapolate: 'clamp'
  });
  const heroContainerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  });
  const heroTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
    outputRange: [0, -(HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT)],
    extrapolate: 'clamp'
  });
  const navBar1ContainerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  });
  const navBar2ContainerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });

  const collapsedBarContainerOpacity = scrollY.interpolate({
    inputRange: [HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT - ((HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT) * 0.08), HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });

  const goToBack = () => navigation?.goBack();

  const navBarProps = {
    style: { backgroundColor: 'transparent', width: orientationState?.dimensions?.width, borderBottomWidth: 0 },
    paddingTop: 20,
    onActionLeft: onClose ? onClose : navigation ? goToBack : undefined,
  };

  const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      height: orientationState?.dimensions?.height,
      backgroundColor: theme.colors.white,
    },
    headerItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 15,
      marginHorizontal: 20,
      zIndex: 1
    },
    optionContainer: {
      marginBottom: 20
    },
    comment: {
      borderWidth: 1,
      borderRadius: 0,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
      borderColor: '#DBDCDB',
      height: 100,
      alignItems: 'flex-start',
    },
    quantityControl: {
      flexDirection: 'row',
      width: '30%',
      justifyContent: 'space-between',
      alignItems: 'center',
      flex: 1,
      marginRight: 10,
      backgroundColor: theme.colors.paleGray,
      paddingHorizontal: 4,
      borderColor: theme.colors.mediumGray,
      borderWidth: 1,
      borderRadius: 6,
    },
    quantityControlButton: {
      color: theme.colors.primary,
    },
    quantityControlButtonBorder: {
      borderRadius: 6,
      borderWidth: 2,
      borderColor: theme.colors.primary,
      marginHorizontal: 10
    },
    quantityControlButtonDisabled: {
      opacity: 0.5,
    },
    btnBackArrow: {
      borderWidth: 0,
      color: '#FFF',
      backgroundColor: 'rgba(0,0,0,0.3)',
      borderRadius: 24,
      marginRight: 15,
    },
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    scrollContainer: {
      padding: 16,
    },
    header: {
      backgroundColor: '#fff',
      position: 'absolute',
      width: orientationState?.dimensions?.width,
      top: 0,
      left: 0,
      zIndex: 9999,
    },
    title: {
      marginVertical: 16,
      color: "black",
      fontWeight: "bold",
      fontSize: 24
    },
    shadow: {
      shadowColor: '#000',
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 0.4,
      shadowRadius: 3,
      elevation: 5,
    },
    imageStyle: {
      width: '100%',
      height: HEADER_EXPANDED_HEIGHT,
    }
  });

  return (
    <>
      <ScrollView
        style={styles.mainContainer}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false })
        }
        scrollEventThrottle={16}
      >
        {!isDrawer ? (
          <Animated.View style={[styles.header, { height: headerHeight }]}>
            {!isDrawer && (
              <Animated.View style={{ opacity: navBar1ContainerOpacity }}>
                <NavBar
                  {...navBarProps}
                  titleColor={theme.colors.white}
                  btnStyle={{
                    width: 55,
                    height: 55,
                    overflow: 'scroll',
                    backgroundColor: 'black',
                    borderRadius: 100,
                    color: 'white',
                    opacity: 0.8,
                    left: 20,
                  }}
                />
              </Animated.View>
            )}
            <Animated.View style={{ opacity: navBar2ContainerOpacity, position: 'absolute' }}>
              <NavBar
                {...navBarProps}
                btnStyle={{
                  width: 55,
                  height: 55,
                  backgroundColor: 'transparent',
                  borderRadius: 100,
                  left: 20,
                }}
              />
            </Animated.View>

            <Animated.View style={{
              backgroundColor: 'white',
              width: orientationState?.dimensions?.width,
              opacity: collapsedBarContainerOpacity,
            }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 20,
                  paddingTop: 0,
                  paddingBottom: 10
                }}
              >
                {product?.images ? (
                  <FastImage
                    style={{ height: 70, width: 70, borderRadius: 6 }}
                    source={{
                      uri: product?.images,
                      priority: FastImage.priority.normal,
                      // cache:FastImage.cacheControl.web
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                ) : (
                  <ImageBackground
                    style={{ height: 70, width: 70, borderRadius: 6 }}
                    source={theme.images.dummies.product}
                    imageStyle={{ borderRadius: 6 }}
                    resizeMode='cover'
                  />
                )}
                <OText
                  size={orientationState?.dimensions?.width * 0.025}
                  weight="bold"
                  mLeft={20}
                  numberOfLines={2}
                >
                  {product?.name}
                </OText>
              </View>
              <View
                style={{
                  position: 'absolute',
                  bottom: -2,
                  height: 1,
                  backgroundColor: 'white',
                  width: orientationState?.dimensions?.width,
                  ...styles.shadow,
                }}
              />
            </Animated.View>

            <Animated.View style={{
              opacity: heroContainerOpacity,
              position: 'absolute',
              zIndex: -100,
              transform: [{ translateY: heroTranslateY }],
            }}>
              <View
                style={{
                  width: orientationState?.dimensions?.width,
                  height: HEADER_EXPANDED_HEIGHT,
                  position: 'absolute',
                  zIndex: 1,
                  backgroundColor: 'rgba(24, 28, 50, 0.4)',
                }}
              >
                {product?.images ? (
                  <FastImage
                    style={{ flex: 1, justifyContent: 'center' }}
                    source={{
                      uri: product?.images,
                      priority: FastImage.priority.normal,
                      // cache:FastImage.cacheControl.web
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                ) : (
                  <ImageBackground
                    style={{ flex: 1, justifyContent: 'center' }}
                    source={theme.images.dummies.product}
                    resizeMode='cover'
                  />
                )}
              </View>
            </Animated.View>
          </Animated.View>
        ) : (
          <View style={{...styles.imageStyle}}>
            <Animated.View
              style={{
                ...styles.imageStyle,
                opacity: heroContainerOpacity,
                position: 'absolute',
                zIndex: -100,
                transform: [{ translateY: heroTranslateY }],
              }}
            >
              <View style={styles.imageStyle}>
                {product?.images ? (
                  <FastImage
                    style={{ flex: 1 }}
                    source={{
                      uri: product?.images,
                      priority: FastImage.priority.normal,
                      // cache:FastImage.cacheControl.web
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                ) : (
                  <ImageBackground
                    style={{ flex: 1, justifyContent: 'center' }}
                    source={theme.images.dummies.product}
                    resizeMode='cover'
                  />
                )}
              </View>
            </Animated.View>
          </View>
        )}


        {!loading && !error && product && (
          <View style={{ paddingTop: isDrawer ? 20 : HEADER_EXPANDED_HEIGHT, paddingBottom: 80, paddingHorizontal: 16 }}>
            <WrapContent isDrawer={isDrawer}>
              <OText
                style={{ marginTop: 20 }}
                size={orientationState?.dimensions?.width * 0.038}
                weight="bold"
                mBottom={10}
                numberOfLines={2}
              >
                {product?.name || productCart?.name}
              </OText>

              {(product?.description || productCart?.description) && (
                <OText
                  numberOfLines={4}
                >
                  {product?.description || productCart?.description}
                </OText>
              )}

              {((product?.sku && product?.sku !== '-1' && product?.sku !== '1') ||
                (productCart?.sku && productCart?.sku !== '-1' && productCart?.sku !== '1')
              ) && (
                <ProductDescription>
                  <OText size={20}>{t('SKU', 'Sku')}</OText>
                  <OText>{product?.sku || productCart?.sku}</OText>
                </ProductDescription>
              )}

              <ProductEditions>
                {product?.ingredients.length > 0 && (
                  <View style={styles.optionContainer}>
                    <SectionTitle>
                      <OText size={28} weight="bold">{t('INGREDIENTS', 'Ingredients')}</OText>
                    </SectionTitle>
                    <WrapperIngredients style={{ backgroundColor: isSoldOut || maxProductQuantity <= 0 ? 'hsl(0, 0%, 72%)' : theme.colors.white }}>
                      {product?.ingredients.map((ingredient: any) => (
                        <ProductIngredient
                          key={ingredient.id}
                          ingredient={ingredient}
                          state={productCart?.ingredients[`id:${ingredient.id}`]}
                          onChange={handleChangeIngredientState}
                        />
                      ))}
                    </WrapperIngredients>
                  </View>
                )}
                {product?.extras.sort((a: any, b: any) => a.rank - b.rank).map((extra: any) => extra.options.sort((a: any, b: any) => a.rank - b.rank).map((option: any) => {
                  const currentState = productCart.options[`id:${option.id}`] || {}
                  return (
                    <React.Fragment key={option.id}>
                      {
                        showOption(option) && (
                          <View style={styles.optionContainer}>
                            <ProductOption
                              option={option}
                              currentState={currentState}
                              error={errors[`id:${option.id}`]}
                            >
                              <WrapperSubOption style={{ backgroundColor: isError(option.id) }}>
                                {
                                  option.suboptions.sort((a: any, b: any) => a.rank - b.rank).map((suboption: any) => {
                                    const currentState = productCart.options[`id:${option.id}`]?.suboptions[`id:${suboption.id}`] || {}
                                    const balance = productCart.options[`id:${option.id}`]?.balance || 0
                                    return (
                                      <ProductOptionSubOption
                                        key={suboption.id}
                                        onChange={handleChangeSuboptionState}
                                        balance={balance}
                                        option={option}
                                        suboption={suboption}
                                        state={currentState}
                                        disabled={isSoldOut || maxProductQuantity <= 0}
                                      />
                                    )
                                  })
                                }
                              </WrapperSubOption>
                            </ProductOption>
                          </View>
                        )
                      }
                    </React.Fragment>
                  )
                }))}
                {!product?.hide_special_instructions && (
                  <ProductComment>
                    <SectionTitle>
                      <OText size={28} weight="bold">{t('SPECIAL_COMMENT', 'Special comment')}</OText>
                    </SectionTitle>
                    <OInput
                      multiline
                      placeholder={t('SPECIAL_COMMENT', 'Special comment')}
                      value={productCart.comment}
                      onChange={(val: string) => handleChangeCommentState({ target: { value: val } })}
                      isDisabled={!(productCart && !isSoldOut && maxProductQuantity)}
                      style={styles.comment}
                    />
                  </ProductComment>
                )}
              </ProductEditions>
            </WrapContent>
          </View>
        )}

        {error && error.length > 0 && (
          <NotFoundSource
            content={error[0]?.message || error[0]}
          />
        )}
      </ScrollView>

      {!loading && !error && product && (
        <ProductActions>
          {productCart && !isSoldOut && maxProductQuantity > 0 && (
            <View style={styles.quantityControl}>
              <TouchableOpacity
                onPress={decrement}
                disabled={productCart.quantity === 1 || isSoldOut}
                style={[
                  styles.quantityControlButtonBorder,
                  (productCart.quantity === 1 || isSoldOut) && styles.quantityControlButtonDisabled,
                ]}
              >
                <MaterialCommunityIcon
                  name='minus'
                  size={32}
                  style={[
                    styles.quantityControlButton,
                    (productCart.quantity === 1 || isSoldOut) && styles.quantityControlButtonDisabled,
                  ]}
                />
              </TouchableOpacity>
              <OText size={20}>{productCart.quantity}</OText>
              <TouchableOpacity
                onPress={increment}
                disabled={maxProductQuantity <= 0 || productCart.quantity >= maxProductQuantity || isSoldOut}
                style={[
                  styles.quantityControlButtonBorder,
                  (maxProductQuantity <= 0 || productCart.quantity >= maxProductQuantity || isSoldOut) && styles.quantityControlButtonDisabled,
                ]}
              >
                <MaterialCommunityIcon
                  name='plus'
                  size={32}
                  style={[
                    styles.quantityControlButton,
                    (maxProductQuantity <= 0 || productCart.quantity >= maxProductQuantity || isSoldOut) && styles.quantityControlButtonDisabled,
                  ]}
                />
              </TouchableOpacity>
            </View>
          )}
          <View style={{ width: isSoldOut || maxProductQuantity <= 0 ? '100%' : isDrawer ? '70%' : '80%' }}>
            {productCart && !isSoldOut && maxProductQuantity > 0 && auth && (
              <OButton
                onClick={() => handleSaveProduct()}
                imgRightSrc=''
                text={`${orderState.loading ? t('LOADING', 'Loading') : editMode ? t('UPDATE', 'Update') : t('ADD_TO_CART', 'Add to Cart')} ${productCart.total ? parsePrice(productCart?.total) : ''}`}
                textStyle={{ color: saveErrors ? theme.colors.primary : theme.colors.white }}
                style={{
                  backgroundColor: saveErrors ? theme.colors.white : theme.colors.primary,
                  opacity: saveErrors ? 0.3 : 1,
                  height: 60
                }}
              />
            )}
            {(!auth || isSoldOut || maxProductQuantity <= 0) && (
              <OButton
                isDisabled={isSoldOut || maxProductQuantity <= 0}
                onClick={() => handleRedirectLogin()}
                text={isSoldOut || maxProductQuantity <= 0 ? t('SOLD_OUT', 'Sold out') : t('LOGIN_SIGNUP', 'Login / Sign Up')}
                imgRightSrc=''
              />
            )}
          </View>
        </ProductActions>
      )}
    </>
  );
}

export const ProductForm = (props: any) => {
  const productOptionsProps = {
    ...props,
    UIComponent: ProductOptionsUI
  }

  return <ProductOptions {...productOptionsProps} />
}
