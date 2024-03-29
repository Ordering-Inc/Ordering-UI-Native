import React, { useState } from 'react'
import { View, Animated, StyleSheet, Platform, I18nManager } from 'react-native'
import { useUtils, useLanguage, useOrder } from 'ordering-components/native'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons'
import RNPickerSelect from 'react-native-picker-select'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

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
import { useTheme } from 'styled-components/native'

export const ProductItemAccordion = (props: ProductItemAccordionParams) => {
  const {
    isCartPending,
    isCartProduct,
    product,
    changeQuantity,
    getProductMax,
    onDeleteProduct,
    onEditProduct,
  } = props

  const theme = useTheme();

  const pickerStyle = StyleSheet.create({
    inputAndroid: {
      color: theme.colors.secundaryContrast,
      borderWidth: 1,
      borderColor: 'transparent',
      backgroundColor: theme.colors.inputDisabled,
      width: 50,
      textAlign: I18nManager.isRTL ? 'right' : 'left'
    },
    inputIOS: {
      color: theme.colors.secundaryContrast,
      paddingEnd: 20,
      height: 40,
      borderWidth: 1,
      borderColor: 'transparent',
      paddingHorizontal: 10,
      backgroundColor: theme.colors.inputDisabled,
      textAlign: I18nManager.isRTL ? 'right' : 'left'
    },
    icon: {
      top: Platform.OS === 'ios' ? 10 : 15,
      right: Platform.OS === 'ios' ? 0 : (I18nManager.isRTL ? 30 : 7),
      position: 'absolute',
      fontSize: 20
    },
    placeholder: {
      color: theme.colors.secundaryContrast,
    }
  })

  const [, t] = useLanguage()
  const [orderState] = useOrder()
  const [{ parsePrice }] = useUtils()

  const [isActive, setActiveState] = useState(false)

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

  const handleChangeQuantity = (value: string) => {
    if(!orderState.loading){
      if (parseInt(value) === 0) {
        onDeleteProduct && onDeleteProduct(product)
      } else {     
        changeQuantity && changeQuantity(product, parseInt(value))
      }
    }
  }

  const getFormattedSubOptionName = ({ quantity, name, position, price }: { quantity: number, name: string, position: string, price: number }) => {
    const pos = position ? `(${position})` : ''
    return `${quantity} x ${name} ${pos} +${price}`
  }

  const productOptions = getProductMax && [...Array(getProductMax(product) + 1),].map((_: any, opt: number) => {
    return {
      label: opt === 0 ? t('REMOVE', 'Remove') : opt.toString(),
      value: opt.toString()
    }
  })

  return (
    <AccordionSection>
      <Accordion
        isValid={product?.valid ?? true}
        onPress={() => (!product?.valid_menu && isCartProduct)
          ? {}
          : setActiveState(!isActive)}
        activeOpacity={1}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <ProductInfo>
            {isCartProduct && !isCartPending && getProductMax ? (
              <RNPickerSelect
                items={productOptions}
                onValueChange={handleChangeQuantity}
                value={product.quantity.toString()}
                style={pickerStyle}
                useNativeAndroidPickerStyle={false}
                placeholder={{}}
                Icon={() => <MaterialIcons name='keyboard-arrow-down' style={pickerStyle.icon} />}
                disabled={orderState.loading}
              />
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
                <OIcon
                  url={product?.images}
                  style={styles.productImage}
                />
              </ProductImage>
            )}
            <View style={{flex: 1, alignItems: 'flex-start'}}>
              <OText weight={500} style={{ textAlign: 'left' }}>{product.name}</OText>
            </View>
            <View style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'flex-end' }}>
              <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                <OText>{parsePrice(product.total || product.price)}</OText>
                {(productInfo().ingredients.length > 0 || productInfo().options.length > 0 || product.comment) && (
                  <MaterialCommunityIcon name='chevron-down' size={18} />
                )}
              </View>
              <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
                {onEditProduct && isCartProduct && !isCartPending && product?.valid_menu && (
                  <SimpleIcon
                    name='pencil'
                    size={20}
                    color={theme.colors.primary}
                    style={{ marginHorizontal: 10 }}
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
                      size={24}
                      color={theme.colors.primary}
                    />
                  </OAlert>
                )}
              </View>
            </View>
          </ContentInfo>
        </View>

        {((isCartProduct && !isCartPending && product?.valid_menu && !product?.valid_quantity) ||
          (!product?.valid_menu && isCartProduct && !isCartPending)) && (
          <OText size={24} color={theme.colors.red} style={{ textAlign: 'center', marginTop: 10 }}>
            {t('NOT_AVAILABLE', 'Not available')}
          </OText>
        )}
      </Accordion>

      <View style={{ display: isActive ? 'flex' : 'none' }}>
        <Animated.View>
          <AccordionContent>
            {productInfo().ingredients.length > 0 && productInfo().ingredients.some((ingredient: any) => !ingredient.selected) && (
              <ProductOptionsList>
                <OText color={theme.colors.gray} style={{ textAlign: 'left' }}>{t('INGREDIENTS', 'Ingredients')}</OText>
                {productInfo().ingredients.map((ingredient: any) => !ingredient.selected && (
                  <OText key={ingredient.id} color={theme.colors.gray} style={{ marginLeft: 10, textAlign: 'left' }}>{t('NO', 'No')} {ingredient.name}</OText>
                ))}
              </ProductOptionsList>
            )}
            {productInfo().options.length > 0 && (
              <ProductOptionsList>
                {productInfo().options.map((option: any, i: number) => (
                  <ProductOption key={option.id + i}>
                    <OText color={theme.colors.gray} style={{ textAlign: 'left' }}>{option.name}</OText>
                    {option.suboptions.map((suboption: any) => (
                      <ProductSubOption key={suboption.id}>
                        <OText color={theme.colors.gray} style={{ textAlign: 'left' }}>
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
                <OText color={theme.colors.gray} style={{ textAlign: 'left' }}>{t('SPECIAL_COMMENT', 'Special Comment')}</OText>
                <OText color={theme.colors.gray} style={{ textAlign: 'left', marginLeft: 10 }}>{product.comment}</OText>
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
    width: 60,
    height: 60,
    marginHorizontal: 5
  }
})
