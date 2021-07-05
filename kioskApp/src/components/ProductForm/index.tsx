import React, { useState } from 'react'
import {
  ProductForm as ProductOptions,
  useSession,
  useLanguage,
  useOrder,
  useUtils
} from 'ordering-components/native'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { View, TouchableOpacity, StyleSheet, Animated, ScrollView } from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'

import { ProductIngredient } from '../ProductIngredient'
import { ProductOption } from '../ProductOption'
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
  ProductActions
} from './styles'
import { colors } from '../../theme.json'
import { OButton, OImage, OInput, OText } from '../shared'
import { ProductOptionSubOption } from '../ProductOptionSubOption'
import { NotFoundSource } from '../NotFoundSource'
import NavBar from '../NavBar'
import { IMAGES } from '../../config/constants'
import { LANDSCAPE, useDeviceOrientation } from '../../hooks/device_orientation_hook'

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
    isFromCheckout
  } = props;

  const [{ parsePrice }] = useUtils();
  const [, t] = useLanguage();
  const [orderState] = useOrder();
  const [{ auth }] = useSession();
  const [orientationState] = useDeviceOrientation();

  const { product, loading, error } = productObject;

  const HEADER_EXPANDED_HEIGHT =  orientationState?.dimensions?.height * 0.4;
  const HEADER_COLLAPSED_HEIGHT = orientationState?.dimensions?.height * 0.2;

  const isError = (id: number) => {
    let bgColor = colors.white
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
      handleSave && handleSave()
      return
    }
  }

  const handleRedirectLogin = () => {
    onClose && onClose()
    navigation?.navigate('Login')
  }

  const saveErrors = orderState.loading || maxProductQuantity === 0 || Object.keys(errors).length > 0

  const [scrollY] = useState(new Animated.Value(0));
  
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_EXPANDED_HEIGHT-HEADER_COLLAPSED_HEIGHT],
    outputRange: [HEADER_EXPANDED_HEIGHT, HEADER_COLLAPSED_HEIGHT],
    extrapolate: 'clamp'
  });
  const heroContainerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_EXPANDED_HEIGHT-HEADER_COLLAPSED_HEIGHT],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  });
  const heroTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_EXPANDED_HEIGHT-HEADER_COLLAPSED_HEIGHT],
    outputRange: [0, -(HEADER_EXPANDED_HEIGHT-HEADER_COLLAPSED_HEIGHT)],
    extrapolate: 'clamp'
  });
  const navBar1ContainerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_EXPANDED_HEIGHT-HEADER_COLLAPSED_HEIGHT],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  });
  const navBar2ContainerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_EXPANDED_HEIGHT-HEADER_COLLAPSED_HEIGHT],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });

  const collapsedBarContainerOpacity = scrollY.interpolate({
    inputRange: [HEADER_EXPANDED_HEIGHT-HEADER_COLLAPSED_HEIGHT - ((HEADER_EXPANDED_HEIGHT-HEADER_COLLAPSED_HEIGHT) * 0.08), HEADER_EXPANDED_HEIGHT-HEADER_COLLAPSED_HEIGHT],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });

  const goToBack = () => navigation?.goBack();

  const navBarProps = {
    style: { backgroundColor: 'transparent', width: orientationState?.dimensions?.width },
    paddingTop: 20,
    title: t('YOUR_DISH', 'Your dish'),
    btnStyle: { backgroundColor: 'transparent' },
    onActionLeft: onClose ? onClose : navigation ? goToBack : undefined,
  };

  const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      height: orientationState?.dimensions?.height,
      backgroundColor: colors.white,
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
      backgroundColor: colors.paleGray,
      paddingHorizontal: 4,
      borderColor: colors.mediumGray,
      borderWidth: 1,
      borderRadius: 6,
    },
    quantityControlButton: {
      color: colors.primary,
    },
    quantityControlButtonBorder: {
      borderRadius: 6,
      borderWidth: 2,
      borderColor: colors.primary,
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
      paddingTop: HEADER_EXPANDED_HEIGHT
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
      shadowOpacity:  0.4,
      shadowRadius: 3,
      elevation: 5,
    }
  });

  return (
    <>
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <Animated.View style={{ opacity: navBar1ContainerOpacity }}>
          <NavBar
            {...navBarProps}
            titleColor={colors.white}
            {...((navigation || onClose) && { leftImg: IMAGES.arrow_left_white })}
          />
        </Animated.View>
        <Animated.View style={{ opacity: navBar2ContainerOpacity, position: 'absolute' }}>
          <NavBar
            {...navBarProps}
            {...((navigation || onClose) && { leftImg: IMAGES.arrow_left })}
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
            }}
          >
            <OImage
              source={{uri: product?.images}}
              width={80}
              height={80}
              resizeMode="cover"
              borderRadius={6}
            />
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
          transform: [{translateY: heroTranslateY }],
        }}>
          <OImage
            source={{uri: product?.images}}
            width={orientationState?.dimensions?.width}
            height={HEADER_EXPANDED_HEIGHT}
            resizeMode="cover"
            style={{ position: 'absolute', zIndex: -100 }}
          />

          <View
            style={{
              width: orientationState?.dimensions?.width,
              height: HEADER_EXPANDED_HEIGHT,
              position: 'absolute',
              zIndex: 1,
              backgroundColor: 'rgba(24, 28, 50, 0.4)',
            }}
          />

          <Animated.View
            style={{
              transform: [{translateY: heroTranslateY }],
              width: orientationState?.dimensions?.width * 0.75,
              height: HEADER_EXPANDED_HEIGHT / 2,
              position: 'relative',
              top: HEADER_EXPANDED_HEIGHT / 3,
              zIndex: 100,
              padding: 20,
            }}
          >
            <OText
              color={colors.white}
              size={orientationState?.dimensions?.width * 0.05}
              weight="bold"
              mBottom={10}
              numberOfLines={2}
            >
              {product?.name || productCart?.name}
            </OText>

            <OText
              color={colors.white}
              numberOfLines={4}
            >
              {product?.description || productCart?.description}
            </OText>
          </Animated.View>
        </Animated.View>
      </Animated.View>

      <ScrollView
        style={styles.mainContainer}
        contentContainerStyle={styles.scrollContainer}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY }} }],
          {useNativeDriver: false})
        }
        scrollEventThrottle={16}
      >
        {!isFromCheckout && (
          <Spinner visible={loading} />
        )}
        {!loading && !error && product && (
          <View style={{ paddingTop: 20, paddingBottom: 80 }}> 
            <WrapContent>
              <ProductDescription>
                {(
                  (product?.sku && product?.sku !== '-1' && product?.sku !== '1') ||
                  (productCart?.sku && productCart?.sku !== '-1' && productCart?.sku !== '1')
                ) &&(
                  <>
                    <OText size={20}>{t('SKU', 'Sku')}</OText>
                    <OText>{product?.sku || productCart?.sku}</OText>
                  </>
                )}
              </ProductDescription>
              <ProductEditions>
                {product?.ingredients.length > 0 && (
                  <View style={styles.optionContainer}>
                    <SectionTitle>
                      <OText size={28} weight="bold">{t('INGREDIENTS', 'Ingredients')}</OText>
                    </SectionTitle>
                    <WrapperIngredients style={{ backgroundColor: isSoldOut || maxProductQuantity <= 0 ? 'hsl(0, 0%, 72%)' : colors.white }}>
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
                {product?.extras.map((extra: any) => extra.options.map((option: any) => {
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
                                  option.suboptions.map((suboption: any) => {
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
          <View style={{ width: isSoldOut || maxProductQuantity <= 0 ? '100%' : '70%' }}>
            {productCart && !isSoldOut && maxProductQuantity > 0 && auth && orderState.options?.address_id && (
              <OButton
                onClick={() => handleSaveProduct()}
                imgRightSrc=''
                text={`${orderState.loading ? t('LOADING', 'Loading') : editMode ? t('UPDATE', 'Update') : t('ADD_TO_CART', 'Add to Cart')} ${productCart.total ? parsePrice(productCart?.total) : ''}`}
                textStyle={{ color: saveErrors ? colors.primary : colors.white }}
                style={{
                  backgroundColor: saveErrors ? colors.white : colors.primary,
                  opacity: saveErrors ? 0.3 : 1
                }}
              />
            )}
            {auth && !orderState.options?.address_id && (
              orderState.loading ? (
                <OButton
                  isDisabled
                  text={t('LOADING', 'Loading')}
                  imgRightSrc=''
                />
              ) : (
                <OButton
                  onClick={navigation?.navigate('AddressList')}
                />
              )
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
