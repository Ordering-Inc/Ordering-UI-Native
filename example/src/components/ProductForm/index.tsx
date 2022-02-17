import React from 'react'
import {
  ProductForm as ProductOptions,
  useSession,
  useLanguage,
  useOrder,
  useUtils
} from 'ordering-components/native'
import { ProductIngredient } from '../ProductIngredient'
import { ProductOption } from '../ProductOption'

import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { View, TouchableOpacity, StyleSheet, Dimensions, ScrollView, I18nManager } from 'react-native'
import Icon from 'react-native-vector-icons/Feather';

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
import { OButton, OInput, OText } from '../shared'
import { ProductOptionSubOption } from '../ProductOptionSubOption'
import { NotFoundSource } from '../NotFoundSource'
import { Placeholder,PlaceholderLine,Fade } from 'rn-placeholder'
import { useTheme } from 'styled-components/native'

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width

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
    businessSlug
  } = props

  const theme = useTheme();

  const [{ parsePrice }] = useUtils()
  const [, t] = useLanguage()
  const [orderState] = useOrder()
  const [{ auth }] = useSession()
  const { product, loading, error } = productObject

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
      handleSave && handleSave()
      return
    }
  }

  const handleRedirectLogin = (product : any) => {
    onClose()
    navigation.navigate('Login', {product: {businessId: product?.businessId, id: product?.id, categoryId: product?.categoryId, slug: businessSlug} })
  }

  const saveErrors = orderState.loading || maxProductQuantity === 0 || Object.keys(errors).length > 0

  return (
    <>
      <ScrollView style={styles.mainContainer}>
        {!error && (
          <View style={{ paddingBottom: 80 }}>
            <WrapHeader>
              {loading && !product ? (
                <View style={styles.productHeaderSkeleton}>
                  <Placeholder Animation={Fade} >
                    <PlaceholderLine height={260} style={{ borderRadius: 0 }} width={windowWidth} />
                  </Placeholder>
                </View>
              ) : (
                <>
                  <TopHeader>
                    <View style={styles.headerItem}>
                      <Icon
                        name="x"
                        size={35}
                        style={{ color: theme.colors.white, backgroundColor: 'rgba(0,0,0,0.3)' }}
                        onPress={onClose}
                      />
                    </View>
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
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <PlaceholderLine width={40} height={20} />
                      <PlaceholderLine width={30} height={20} />
                    </View>
                  </Placeholder>
                ) : (
                  <>
                    <View style={{ flexDirection: 'column', width: '100%' }}>
                      <OText size={20} style={{ flex: I18nManager.isRTL ? 0 : 1, marginBottom: 10 }}>{product?.name || productCart.name}</OText>
                      {(product?.estimated_person || (product?.sku && product?.sku !== '-1' && product?.sku !== '1')) && (
                        <OText size={14} style={{ flex: I18nManager.isRTL ? 1 : 0, marginBottom: 10 }} color={'#909BA9'}>
                          {
                            ((product?.sku && product?.sku !== '-1' && product?.sku !== '1') || (productCart?.sku && productCart?.sku !== '-1' && productCart?.sku !== '1'))
                            && <>{t('SKU', 'Sku')}{' '}{product?.sku || productCart?.sku}</>
                          }
                          {product?.sku && product?.sku !== '-1' && product?.sku !== '1' && product?.estimated_person && (
                            <>&nbsp;&#183;&nbsp;</>
                          )}
                          {product?.estimated_person
                            && <>{product?.estimated_person}{' '}{t('ESTIMATED_PERSONS', 'persons')}</>
                          }
                        </OText>
                      )}
                      <View style={{ flexDirection: 'row', marginBottom: 10}}>
                        <OText size={16} style={{ flex: I18nManager.isRTL ? 1 : 0 }} color={theme.colors.primary}>{productCart.price ? parsePrice(productCart.price) : ''}</OText>
                        {product?.offer_price && (
                          <OText style={styles.regularPriceStyle}>{parsePrice(product?.offer_price)}</OText>
                        )}
                      </View>
                    </View>
                  </>
                )}
              </ProductTitle>
              <ProductDescription>
                <OText>{product?.description || productCart?.description}</OText>
              </ProductDescription>
              {loading && !product ? (
                <>
                  {[...Array(2)].map((item,i) => (
                  <Placeholder key={i} style={{marginBottom: 20}} Animation={Fade}>
                    <PlaceholderLine height={40} style={{ flex: 1, marginTop: 10 }} />
                    {[...Array(3)].map((item,i) => (
                      <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <PlaceholderLine height={30} width={10} style={{marginBottom: 20}} />
                        <PlaceholderLine height={30} width={50} style={{marginBottom: 20}} />
                        <PlaceholderLine height={30} width={30} style={{marginBottom: 20}} />
                      </View>
                    ))}
                  </Placeholder>
                  ))}
                </>
              ) : (
                <ProductEditions>
                  {product?.ingredients?.length > 0 && (
                    <View style={styles.optionContainer}>
                      <SectionTitle>
                        <OText size={16}>{t('INGREDIENTS', 'Ingredients')}</OText>
                      </SectionTitle>
                      <WrapperIngredients style={{ backgroundColor: isSoldOut || maxProductQuantity <= 0 ? 'hsl(0, 0%, 72%)' : theme.colors.white }}>
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
                  {product?.extras?.map((extra: any) => extra.options.map((option: any) => {
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
                                      return suboption?.enabled ? (
                                        <ProductOptionSubOption
                                          key={suboption.id}
                                          onChange={handleChangeSuboptionState}
                                          balance={balance}
                                          option={option}
                                          suboption={suboption}
                                          state={currentState}
                                          disabled={isSoldOut || maxProductQuantity <= 0}
                                        />
                                      ): null
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
                  )}
                </ProductEditions>
              )}
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
                  color={productCart.quantity === 1 || isSoldOut ? theme.colors.backgroundGray : theme.colors.backgroundDark}
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
                  color={maxProductQuantity <= 0 || productCart.quantity >= maxProductQuantity || isSoldOut ? theme.colors.backgroundGray : theme.colors.backgroundDark}
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
                textStyle={{ color: saveErrors ? theme.colors.primary : theme.colors.white }}
                style={{
                  backgroundColor: saveErrors ? theme.colors.white : theme.colors.primary,
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
                onClick={() => handleRedirectLogin(productCart)}
                text={isSoldOut || maxProductQuantity <= 0 ? t('SOLD_OUT', 'Sold out') : t('LOGIN_SIGNUP', 'Login / Sign Up')}
                imgRightSrc=''
                textStyle={{ color: theme.colors.primary }}
                style={{ borderColor: theme.colors.primary, backgroundColor: theme.colors.white }}
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
    overflow: 'hidden',
    borderRadius: 50,
    backgroundColor: '#CCCCCC80',
    width: 35,
    margin: 15
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
  productHeaderSkeleton: {
    flexDirection: 'row',
    width: '100%',
    position: 'relative',
    maxHeight: 260,
    height: 260,
    resizeMode: 'cover',
    minHeight: 200,
    zIndex: 0
  },
  regularPriceStyle: {
    fontSize: 14,
    color: '#808080',
    textDecorationLine: 'line-through',
    marginLeft: 7,
    marginRight: 7
  }
})

export const ProductForm = (props: any) => {
  const productOptionsProps = {
    ...props,
    UIComponent: ProductOptionsUI
  }

  return <ProductOptions {...productOptionsProps} />
}
