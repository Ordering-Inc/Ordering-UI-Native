import React, { useState, useRef, useEffect } from 'react'
import { View, StyleSheet, Animated, Easing } from 'react-native'
import { useUtils, useLanguage, useOrder } from 'ordering-components/native'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
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
import { OIcon, OText } from '../shared'

import {ProductItemAccordionParams} from '../../types'
export const ProductItemAccordion = (props: ProductItemAccordionParams) => {

  const {
    isCartPending,
    isCartProduct,
    product,
    changeQuantity,
    getProductMax,
    onDeleteProduct,
    onEditProduct
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

  return (
    <AccordionSection>
      <Accordion
        isValid={product?.valid ?? true}
        onPress={() => setActiveState(!isActive)}
      >
        <ProductInfo>
          {isCartProduct && !isCartPending && getProductMax ? (
            <>
            </>
          ) : (
            <ProductQuantity>
              <OText>
                {product?.quantity}
              </OText>
            </ProductQuantity>
          )}
        </ProductInfo>
        {product?.images && (
          <ProductImage>
            <OIcon url={product?.images} style={styles.productImage} />
          </ProductImage>
        )}
        <ContentInfo>
          <View style={{ width: '70%' }}>
            <OText>{product.name}</OText>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <OText>{parsePrice(product.total || product.price)}</OText>
            {(productInfo().ingredients.length > 0 || productInfo().options.length > 0 || product.comment) && (
              <MaterialCommunityIcon name='chevron-down' size={18} />
            )}
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
