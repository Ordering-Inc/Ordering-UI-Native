import React, { useState } from 'react';
import { View, Animated, TouchableOpacity, ImageBackground } from 'react-native';
import { useLanguage, useUtils } from 'ordering-components/native';
import FastImage from 'react-native-fast-image'

import {
  StyledCartItem,
  AccordionContent,
  ProductOptionsList,
  ProductOption,
  ProductSubOption,
  ProductComment
} from './styles';
import { OButton, OImage, OText, OIconButton } from '../shared';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { Product } from '../../types';
import QuantityControl from '../QuantityControl';
import { LANDSCAPE, useDeviceOrientation } from '../../../../../src/hooks/DeviceOrientation';
import { useTheme } from 'styled-components/native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'

const CartItem = (props: CartItemProps) => {
  const theme = useTheme()
  const [, t] = useLanguage();
  const [orientationState] = useDeviceOrientation();
  const [{ parsePrice }] = useUtils();

  const [isActive, setActiveState] = useState(false);

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

  const productInfo = () => {
    if (isCartProduct) {
      const ingredients = JSON.parse(JSON.stringify(Object.values(product?.ingredients ?? {})))
      let options = JSON.parse(JSON.stringify(Object.values(product?.options ?? {})))

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
  const isProductIngredients = productInfo()?.ingredients.length > 0 || productInfo()?.options.length > 0 || product?.comment
  const getFormattedSubOptionName = ({ quantity, name, position, price }: { quantity: number, name: string, position: string, price: any }) => {
    const pos = position ? `(${position})` : ''
    const str = `${quantity} x ${name} ${pos}`
    return price ? `${str} ${price}` : str
  }

  return (
    <>
      <TouchableOpacity
        onPress={() => (!product?.valid_menu && isCartProduct)
          ? {}
          : setActiveState(!isActive)}
        activeOpacity={0.5}
      >
        <StyledCartItem>
          <View style={{ flexDirection: 'row' }}>
            {product?.images ? (
              <FastImage
                style={{ height: 60, width: 80, borderRadius: 6 }}
                source={{
                  uri: product?.images,
                  priority: FastImage.priority.normal,
                  // cache:FastImage.cacheControl.web
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
            ) : (
              <ImageBackground
                style={{ height: 60, width: 80, borderRadius: 6 }}
                source={theme.images.dummies.product}
                imageStyle={{ borderRadius: 6 }}
                resizeMode='cover'
              />
            )}

            <View style={{ flexDirection: 'column', justifyContent: 'space-evenly', marginHorizontal: 15, marginTop: 10 }}>
              <View>
                <OText
                  style={{
                    maxWidth: orientationState?.orientation === LANDSCAPE
                      ? orientationState.dimensions.width * 0.2
                      : orientationState.dimensions.width * 0.5
                  }}
                  numberOfLines={2}
                  size={18}
                  weight="700"
                >
                  {product?.name || ''}
                </OText>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                <OButton
                  bgColor="transparent"
                  borderColor="transparent"
                  text={t('EDIT', 'Edit')}
                  style={{ justifyContent: 'flex-start', paddingLeft: 0, maxWidth: 80 }}
                  textStyle={{
                    color: theme.colors.primary,
                    marginLeft: 6,
                  }}
                  onClick={() => { onEditProduct ? onEditProduct(product) : null }}
                  iconProps={{ name: 'edit' }}
                  IconCustom={() => <FontAwesomeIcon name='edit' size={24} color={theme.colors.primary} />}
                />
                <OIconButton
                  bgColor="transparent"
                  borderColor="transparent"
                  RenderIcon={isProductIngredients && (() =>
                    <EvilIcons
                      name={isActive ? 'chevron-up' : 'chevron-down'}
                      size={40}
                      color={theme.colors.primary}
                    />
                  )}
                  style={{ justifyContent: 'flex-start', right: 40 }}
                  onClick={() => (!product?.valid_menu && isCartProduct)
                    ? {}
                    : setActiveState(!isActive)}
                />
              </View>
            </View>
          </View>

          <View style={{ alignItems: "flex-end" }} >
            <OText
              size={18}
              weight="700"
              color={theme.colors.primary}
            >
              {parsePrice(product?.total || product?.price)}
            </OText>

            <QuantityControl
              val={product?.quantity || 0}
              onDecremet={(product?.quantity || 0 > 1)
                ? (() => { changeQuantity && changeQuantity(product, (product?.quantity || 0) - 1) })
                : undefined
              }
              onIncrement={changeQuantity && (() => { changeQuantity(product, (product?.quantity || 0) + 1) })}
              onDelete={onDeleteProduct && (() => { onDeleteProduct(product) })}
            />
          </View>
        </StyledCartItem>
      </TouchableOpacity>

      <View style={{ display: isActive ? 'flex' : 'none' }}>
        <Animated.View>
          <AccordionContent>
            {productInfo()?.ingredients.length > 0 && productInfo()?.ingredients.some((ingredient: any) => !ingredient.selected) && (
              <ProductOptionsList>
                <OText size={16}>{t('INGREDIENTS', 'Ingredients')}</OText>
                {productInfo()?.ingredients.map((ingredient: any) => !ingredient.selected && (
                  <OText size={16} key={ingredient.id} style={{ marginLeft: 10 }}>{t('NO', 'No')} {ingredient.name}</OText>
                ))}
              </ProductOptionsList>
            )}
            {productInfo()?.options.length > 0 && (
              <ProductOptionsList>
                {productInfo()?.options.map((option: any, i: number) => (
                  <ProductOption key={option.id + i}>
                    <OText size={16}>{option.name}</OText>
                    {option.suboptions.map((suboption: any) => (
                      <ProductSubOption key={suboption.id}>
                        <OText size={16}>
                          {getFormattedSubOptionName({
                            quantity: suboption.quantity,
                            name: suboption.name,
                            position: (suboption.position !== 'whole') ? t(suboption.position.toUpperCase(), suboption.position) : '',
                            price: suboption.price > 0 && `+${parsePrice(suboption.price)}`
                          })}
                        </OText>
                      </ProductSubOption>
                    ))}
                  </ProductOption>
                ))}
              </ProductOptionsList>
            )}
            {product && product?.comment && (
              <ProductComment>
                <OText size={16}>{t('SPECIAL_COMMENT', 'Special Comment')}</OText>
                <OText size={16}>{product.comment}</OText>
              </ProductComment>
            )}
          </AccordionContent>
        </Animated.View>
      </View>
    </>
  );
}

interface CartItemProps {
  isCartPending?: boolean,
  isCartProduct?: boolean,
  product?: Product,
  getProductMax?: any,
  changeQuantity: (product: any, quantity: number) => {},
  onDeleteProduct: (product: any) => void,
  onEditProduct: (product: any) => void,
  offsetDisabled?: any,
  isFromCheckout?: any
}

export default CartItem;
