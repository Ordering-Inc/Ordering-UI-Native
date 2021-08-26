import React, { useState } from 'react'
import { View, Animated, StyleSheet, Platform, I18nManager } from 'react-native'
import { useUtils, useLanguage, useOrder } from 'ordering-components/native'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
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
  const [alert, setAlert] = useState<any>({ show: false })

  const pickerStyle = StyleSheet.create({
    inputAndroid: {
      color: theme.colors.secundaryContrast,
      borderWidth: 1,
      borderColor: 'transparent',
      borderRadius: 15,
      backgroundColor: theme.colors.inputDisabled,
      width: 60,
      paddingHorizontal: 10,
    },
    inputIOS: {
      color: theme.colors.secundaryContrast,
      paddingEnd: 20,
      height: 40,
      borderWidth: 1,
      borderColor: 'transparent',
      borderRadius: 15,
      paddingHorizontal: 10,
      backgroundColor: theme.colors.inputDisabled
    },
    icon: {
      top: Platform.OS === 'ios' ? 10 : 15,
      right: Platform.OS === 'ios' ? 5 : (I18nManager.isRTL ? 30 : 0),
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

  const isProductUnavailable = (
    (isCartProduct && !isCartPending && product?.valid_menu && !product?.valid_quantity) ||
    (!product?.valid_menu && isCartProduct && !isCartPending)
  )

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
            {isCartProduct && !isCartPending && getProductMax && !isProductUnavailable ? (
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
              <OText>{product.name}</OText>
              {isProductUnavailable && (
                <OText size={14} color={theme.colors.red} style={{ marginRight: 5 }}>
                  {t('NOT_AVAILABLE', 'Not available')}
                </OText>
              )}
            </View>
            <View style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'flex-end' }}>
              {!isProductUnavailable && (
                <View style={{ flexDirection: 'row' }}>
                  <OText size={18}>{parsePrice(product.total || product.price)}</OText>
                  {(productInfo().ingredients.length > 0 || productInfo().options.length > 0 || product.comment) && (
                    <MaterialCommunityIcon name='chevron-down' size={18} />
                  )}
                </View>
              )}
              <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', marginRight: 5 }}>
                {onEditProduct && isCartProduct && !isCartPending && product?.valid_menu && (
                  <MaterialCommunityIcon
                    name='pencil-outline'
                    size={26}
                    color={theme.colors.green}
                    onPress={() => onEditProduct(product)}
                  />
                )}
                {onDeleteProduct && isCartProduct && !isCartPending && (
                  <MaterialCommunityIcon
                    name='trash-can-outline'
                    size={26}
                    color={theme.colors.red}
                    onPress={() => setAlert({
                      show: true,
                      title: t('DELETE_PRODUCT', 'Delete Product'),
                      onAccept: () => {
                        onDeleteProduct && onDeleteProduct(product)
                        setAlert({ show: false })
                      },
                      content: [t('QUESTION_DELETE_PRODUCT', 'Are you sure that you want to delete the product?')]
                    })}
                  />
                )}
              </View>
            </View>
          </ContentInfo>
        </View>
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
                {productInfo().options.map((option: any, i: number) => (
                  <ProductOption key={option.id + i}>
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
      <OAlert
        open={alert.show}
        title={alert.title}
        onAccept={alert.onAccept}
        onClose={() => setAlert({ show: false })}
        onCancel={() => setAlert({ show: false })}
        content={alert.content}
      />
    </AccordionSection>
  )
}

const styles = StyleSheet.create({
  productImage: {
    borderRadius: 10,
    width: 75,
    height: 75
  }
})
