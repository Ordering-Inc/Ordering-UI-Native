import React, { useState, useRef, useEffect } from 'react'
import { View, StyleSheet, Animated, Easing } from 'react-native'
import { useUtils, useLanguage, useOrder } from 'ordering-components/native'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import RNPickerSelect from 'react-native-picker-select'
import AntIcon from 'react-native-vector-icons/AntDesign'

import {
  Accordion,
  AccordionSection,
  ProductInfo,
  ProductQuantity,
  ContentInfo,
  ProductImage,
  AccordionContent,
  ProductOptionsList,
  ProductOption,
  ProductSubOption,
  ProductComment
} from './styles'
import { OIcon, OText, OAlert } from '../shared'

import { ProductItemAccordionParams } from '../../types'
import { colors } from '../../theme.json'
import Spinner from 'react-native-loading-spinner-overlay'
export const ProductItemAccordion = (props: ProductItemAccordionParams) => {

  const {
    isCartPending,
    isCartProduct,
    product,
    changeQuantity,
    getProductMax,
    onDeleteProduct,
    onEditProduct,
    isFromCheckout,
  } = props
  const [, t] = useLanguage()
  const [orderState] = useOrder()
  const [{ parsePrice }] = useUtils()

  const [isActive, setActiveState] = useState(false)
  const [setHeight, setHeightState] = useState({ height: new Animated.Value(0) })
  const [setRotate, setRotateState] = useState({ angle: new Animated.Value(0) })

  const productInfo = () => {
    if (isCartProduct) {
      const ingredients = JSON.parse(JSON.stringify(Object.values(product.ingredients ?? {})))
      let options = JSON.parse(JSON.stringify(Object.values(product.options ?? {})))

      options = options.map((option: any) => {
        option.suboptions = Object.values(option.suboptions ?? {})
        return option
      })
      return {
        ...productInfo,
        ingredients,
        options
      }
    }
    return product
  }

  /* const toggleAccordion = () => {
     if ((!product?.valid_menu && isCartProduct)) return
     if (isActive) {
       Animated.timing(setHeight.height, {
         toValue: 100,
         duration: 500,
         easing: Easing.linear,
         useNativeDriver: false,
       }).start()
     } else {
       setHeightState({height: new Animated.Value(0)})
     }
   }*/

  const handleChangeQuantity = (value: string) => {
    if (parseInt(value) === 0) {
      onDeleteProduct && onDeleteProduct(product)
    } else {
      changeQuantity && changeQuantity(product, parseInt(value))
    }
  }

  const getFormattedSubOptionName = ({ quantity, name, position, price }: { quantity: number, name: string, position: string, price: number }) => {
    const pos = position ? `(${position})` : ''
    return `${quantity} x ${name} ${pos} +${price}`
  }

  /*useEffect(() => {
    toggleAccordion()
  }, [isActive])*/

  const productOptions = getProductMax && [...Array(getProductMax(product) + 1),].map((_: any, opt: number) => {
    return {
      label: opt === 0 ? t('REMOVE', 'Remove') : opt.toString(),
      value: opt.toString()
    }
  })

  {/* <RNPickerSelect
    items={productOptions}
    onValueChange={handleChangeQuantity}
    value={product.quantity.toString()}
    style={pickerStyle}
    useNativeAndroidPickerStyle={false}
    placeholder={{}}
    Icon={() => <AntIcon name='caretdown' style={pickerStyle.icon} />}
    disabled={orderState.loading}
  /> */}

  return (
    <AccordionSection>
      <Accordion
        isValid={product?.valid ?? true}
        onPress={() => setActiveState(!isActive)}
      >
        <ProductInfo>
          {isCartProduct && !isCartPending && getProductMax ? (
            <OText>{product.quantity.toString()}</OText>
          ) : (
            <ProductQuantity>
              <OText>
                {product?.quantity}
              </OText>
            </ProductQuantity>
          )}
        </ProductInfo>
        <ContentInfo>
        {product?.images && (
          <ProductImage>
            <OIcon url={product?.images} style={styles.productImage} />
          </ProductImage>
        )}
          <View style={{flex: 0.8}}>
            <OText>{product.name}</OText>
          </View>
          <View style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'flex-end' }}>
            <View style={{ flexDirection: 'row' }}>
              <OText>{parsePrice(product.total || product.price)}</OText>
              {(productInfo().ingredients.length > 0 || productInfo().options.length > 0 || product.comment) && (
                <MaterialCommunityIcon name='chevron-down' size={18} />
              )}
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
              {onEditProduct && isCartProduct && !isCartPending && (
                <MaterialCommunityIcon
                  name='pencil-outline'
                  size={20}
                  color={colors.green}
                  onPress={() => onEditProduct(product)}
                />
              )}
              {onDeleteProduct && isCartProduct && !isCartPending && (
                <OAlert
                  title={t('DELETE_PRODUCT', 'Delete Product')}
                  message={t('QUESTION_DELETE_PRODUCT', 'Are you sure that you want to delete the product?')}
                  onAccept={() => onDeleteProduct(product)}
                >
                  <MaterialCommunityIcon
                    name='trash-can-outline'
                    size={20}
                    color={colors.red}
                  />
                </OAlert>
              )}
            </View>
          </View>
        </ContentInfo>
      </Accordion>
      <View style={{ display: isActive ? 'flex' : 'none' }}>
        <Animated.View>
          <AccordionContent>
            {productInfo().ingredients.length > 0 && productInfo().ingredients.some((ingredient: any) => !ingredient.selected) && (
              <ProductOptionsList>
                <OText>{t('INGREDIENTS', 'Ingredients')}</OText>
                {productInfo().ingredients.map((ingredient: any) => !ingredient.selected && (
                  <OText key={ingredient.id} style={{ marginLeft: 10 }}>{t('NO', 'No')} {ingredient.name}</OText>
                ))}
              </ProductOptionsList>
            )}
            {productInfo().options.length > 0 && (
              <ProductOptionsList>
                {productInfo().options.map((option: any) => (
                  <ProductOption key={option.id}>
                    <OText>{option.name}</OText>
                    {option.suboptions.map((suboption: any) => (
                      <ProductSubOption key={suboption.id}>
                        <OText>
                          {getFormattedSubOptionName({
                            quantity: suboption.quantity,
                            name: suboption.name,
                            position: (suboption.position !== 'whole') ? t(suboption.position.toUpperCase(), suboption.position) : '',
                            price: parsePrice(suboption.price)
                          })}
                        </OText>
                      </ProductSubOption>
                    ))}
                  </ProductOption>
                ))}
              </ProductOptionsList>
            )}
            {product.comment && (
              <ProductComment>
                <OText>{t('SPECIAL_COMMENT', 'Special Comment')}</OText>
                <OText>{product.comment}</OText>
              </ProductComment>
            )}
          </AccordionContent>
        </Animated.View>
      </View>
    </AccordionSection>
  )
}

const pickerStyle = StyleSheet.create({
  inputAndroid: {
    color: colors.secundaryContrast,
    width: 50,
  },
  icon: {
    width: 10,
    height: 10,
    top: 17,
    right: 10,
    position: 'absolute',
  },
  placeholder: {
    color: colors.secundaryContrast
  }
})

const styles = StyleSheet.create({
  productImage: {
    borderRadius: 10,
    width: 75,
    height: 75
  },
  test: {
    overflow: 'hidden',
  }
})
