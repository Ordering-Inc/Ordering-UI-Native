import React, { useState } from 'react'
import {
  ProductForm as ProductOptions,
  useSession,
  useLanguage,
  useOrder,
  useUtils
} from 'ordering-components/native'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { View, TouchableOpacity, StyleSheet, Dimensions, Animated, ScrollView } from 'react-native'
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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("screen")

const HEADER_EXPANDED_HEIGHT = SCREEN_HEIGHT * 0.4;
const HEADER_COLLAPSED_HEIGHT = 215;

const windowHeight = Dimensions.get('window').height;
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
  } = props

  const [{ parsePrice }] = useUtils()
  const [, t] = useLanguage()
  const [orderState] = useOrder()
  const [{ auth }] = useSession()
  const { product, loading, error } = productObject

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
    onClose()
    navigation.navigate('Login')
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
    inputRange: [180, HEADER_EXPANDED_HEIGHT-HEADER_COLLAPSED_HEIGHT],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });

  const goToBack = () => navigation.goBack();

  const navBarProps = {
    style: { backgroundColor: 'transparent', width: SCREEN_WIDTH },
    paddingTop: 20,
    title: t('YOUR_DISH', 'Your dish'),
    btnStyle: { backgroundColor: 'transparent' },
    onActionLeft: goToBack
  };

  return (
    <>
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <Animated.View style={{ opacity: navBar1ContainerOpacity }}>
          <NavBar
            {...navBarProps}
            titleColor="white"
            leftImg={IMAGES.arrow_left_white}
          />
        </Animated.View>
        <Animated.View style={{ opacity: navBar2ContainerOpacity, position: 'absolute' }}>
          <NavBar {...navBarProps} />
        </Animated.View>

        <Animated.View style={{
          backgroundColor: 'white',
          width: SCREEN_WIDTH,
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
              source={{uri: product.images}}
              width={80}
              height={80}
              resizeMode="cover"
              borderRadius={6}
            />
            <OText
              size={SCREEN_WIDTH * 0.025}
              weight="bold"
              mLeft={20}
              numberOfLines={2}
            >
              {product.name}
            </OText>
          </View>
          <View
            style={{
              position: 'absolute',
              bottom: -2,
              height: 1,
              backgroundColor: 'white',
              width: SCREEN_WIDTH,
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
            source={{uri: product.images}}
            width={SCREEN_WIDTH}
            height={HEADER_EXPANDED_HEIGHT}
            resizeMode="cover"
            style={{ position: 'absolute', zIndex: -100 }}
          />

          <View
            style={{
              width: SCREEN_WIDTH,
              height: HEADER_EXPANDED_HEIGHT,
              position: 'absolute',
              zIndex: 1,
              backgroundColor: 'rgba(24, 28, 50, 0.4)',
            }}
          />

          <Animated.View
            style={{
              transform: [{translateY: heroTranslateY }],
              width: SCREEN_WIDTH * 0.75,
              height: HEADER_EXPANDED_HEIGHT / 2,
              position: 'relative',
              top: HEADER_EXPANDED_HEIGHT / 2,
              zIndex: 100,
              padding: 20,
            }}
          >
            <OText
              color="white"
              size={SCREEN_WIDTH * 0.05}
              weight="bold"
              mBottom={10}
              numberOfLines={2}
            >
              {product.name}
            </OText>

            <OText
              color="white"
              numberOfLines={4}
            >
              {product?.description}
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
          <View style={{ paddingVertical: 80 }}> 
            <WrapContent>
              <ProductTitle>
                <OText size={20} style={{ flex: 1 }}>{product?.name || productCart.name}</OText>
                <OText size={20} color={colors.primary}>{productCart.price ? parsePrice(productCart.price) : ''}</OText>
              </ProductTitle>
              <ProductDescription>
                <OText>{product?.description || productCart?.description}</OText>
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
                      <OText size={16}>{t('INGREDIENTS', 'Ingredients')}</OText>
                    </SectionTitle>
                    <WrapperIngredients style={{ backgroundColor: isSoldOut || maxProductQuantity <= 0 ? 'hsl(0, 0%, 72%)' : colors.white }}>
                      {product?.ingredients.map((ingredient: any) => (
                        <ProductIngredient
                          key={ingredient.id}
                          ingredient={ingredient}
                          state={productCart.ingredients[`id:${ingredient.id}`]}
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
                    <OText size={16}>{t('SPECIAL_COMMENT', 'Special comment')}</OText>
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
              >
                <MaterialCommunityIcon
                  name='minus-circle-outline'
                  size={32}
                  color={productCart.quantity === 1 || isSoldOut ? colors.backgroundGray : colors.backgroundDark}
                />
              </TouchableOpacity>
              <OText size={20}>{productCart.quantity}</OText>
              <TouchableOpacity
                onPress={increment}
                disabled={maxProductQuantity <= 0 || productCart.quantity >= maxProductQuantity || isSoldOut}
              >
                <MaterialCommunityIcon
                  name='plus-circle-outline'
                  size={32}
                  color={maxProductQuantity <= 0 || productCart.quantity >= maxProductQuantity || isSoldOut ? colors.backgroundGray : colors.backgroundDark}
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
                  onClick={navigation.navigate('AddressList')}
                />
              )
            )}
            {(!auth || isSoldOut || maxProductQuantity <= 0) && (
              <OButton
                isDisabled={isSoldOut || maxProductQuantity <= 0}
                onClick={() => handleRedirectLogin()}
                text={isSoldOut || maxProductQuantity <= 0 ? t('SOLD_OUT', 'Sold out') : t('LOGIN_SIGNUP', 'Login / Sign Up')}
                imgRightSrc=''
                textStyle={{ color: colors.primary }}
                style={{ borderColor: colors.primary, backgroundColor: colors.white }}
              />
            )}
          </View>
        </ProductActions>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    height: windowHeight
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
    marginRight: 10
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
    width: SCREEN_WIDTH,
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
})

export const ProductForm = (props: any) => {
  const productOptionsProps = {
    ...props,
    UIComponent: ProductOptionsUI
  }

  return <ProductOptions {...productOptionsProps} />
}
