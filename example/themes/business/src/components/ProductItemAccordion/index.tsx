import React, { useEffect, useState } from 'react';
import { View, Animated } from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useUtils, useLanguage } from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import {
  Accordion,
  AccordionSection,
  // ProductInfo,
  // ProductQuantity,
  ContentInfo,
  // ProductImage,
  AccordionContent,
  ProductOptionsList,
  ProductOption,
  ProductSubOption,
  ProductComment,
} from './styles';
import { OText, OAlert } from '../shared';
import { ProductItemAccordionParams } from '../../types';

export const ProductItemAccordion = (props: ProductItemAccordionParams) => {
  const {
    isClickableEvent,
    isCartPending,
    isCartProduct,
    product,
    getProductMax,
    onDeleteProduct,
    onEditProduct,
    currency
  } = props;

  const [, t] = useLanguage();
  const theme = useTheme();
  const [{ parsePrice }] = useUtils();

  const [isActive, setActiveState] = useState(false);

  const productInfo = () => {
    if (isCartProduct) {
      const ingredients = JSON.parse(
        JSON.stringify(Object.values(product.ingredients ?? {})),
      );
      let options = JSON.parse(
        JSON.stringify(Object.values(product.options ?? {})),
      );

      options = options.map((option: any) => {
        option.suboptions = Object.values(option.suboptions ?? {});
        return option;
      });
      return {
        ...productInfo,
        ingredients,
        options,
      };
    }

    return product;
  };

  const parseOptions = typeof productInfo().options === 'string' ? JSON.parse(productInfo().options) : productInfo().options

  const getProductPrice = (product: any) => {
    let subOptionPrice = 0;
    if (product?.options?.length > 0 && product?.options?.suboptions?.length > 0) {
      for (const option of product?.options) {
        for (const suboption of option?.suboptions) {
          subOptionPrice += suboption.quantity * suboption.price;
        }
      }
    }

    const price = product.quantity * (product.price + subOptionPrice);
    return parseFloat(price.toFixed(2));
  };

  const getFormattedSubOptionName = ({ quantity, name, position, price }: any) => {
    if (name !== 'No') {
      const pos = position ? `(${position})` : '';
      return `${quantity} x ${name} ${pos} +${price}`
    } else {
      return 'No';
    }
  };

  /*useEffect(() => {
    toggleAccordion()
  }, [isActive])*/

  const productOptions =
    getProductMax &&
    [...Array(getProductMax(product) + 1)].map((_: any, opt: number) => {
      return {
        label: opt === 0 ? t('REMOVE', 'Remove') : opt.toString(),
        value: opt.toString(),
      };
    });

  useEffect(() => {
    if (
      productInfo?.()?.ingredients?.length > 0 ||
      productInfo?.()?.options?.length > 0 ||
      product.comment !== ''
    ) {
      setActiveState(true);
    }
  }, []);

  return (
    <AccordionSection>
      <Accordion
        isValid={product?.valid ?? true}
        onPress={() =>
          (!product?.valid_menu && isCartProduct) || isClickableEvent ? {} : setActiveState(!isActive)
        }
        activeOpacity={1}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <ContentInfo>
            <View style={{ flexDirection: 'row' }}>
              <OText color={theme.colors.quantityProduct} space>
                {product?.quantity}
              </OText>

              <View style={{ width: 200 }}>
                <OText
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  size={12}
                  color={theme.colors.textGray}
                  style={{ marginLeft: 5 }}>
                  {product?.name}
                </OText>
              </View>
            </View>

            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                alignItems: 'flex-end',
              }}>
              <View style={{ flexDirection: 'row' }}>
                <OText size={12} color={theme.colors.textGray}>
                  {parsePrice(getProductPrice(product), { currency })}
                </OText>

                {(
                  productInfo?.()?.ingredients?.length > 0 ||
                  productInfo?.()?.options?.length > 0 ||
                  !!product.comment
                ) && !isClickableEvent && (
                    <MaterialCommunityIcon name="chevron-down" size={12} />
                  )}
              </View>

              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                }}>
                {onEditProduct &&
                  isCartProduct &&
                  !isCartPending &&
                  product?.valid_menu && (
                    <MaterialCommunityIcon
                      name="pencil-outline"
                      size={26}
                      color={theme.colors.green}
                      onPress={() => onEditProduct(product)}
                    />
                  )}

                {onDeleteProduct && isCartProduct && !isCartPending && (
                  <OAlert
                    title={t('DELETE_PRODUCT', 'Delete Product')}
                    message={t(
                      'QUESTION_DELETE_PRODUCT',
                      'Are you sure that you want to delete the product?',
                    )}
                    onAccept={() => onDeleteProduct(product)}>
                    <MaterialCommunityIcon
                      name="trash-can-outline"
                      size={26}
                      color={theme.ecolors.red}
                    />
                  </OAlert>
                )}
              </View>
            </View>
          </ContentInfo>
        </View>

        {((isCartProduct &&
          !isCartPending &&
          product?.valid_menu &&
          !product?.valid_quantity) ||
          (!product?.valid_menu && isCartProduct && !isCartPending)) && (
            <OText
              size={24}
              color={theme.colors.red}
              style={{ textAlign: 'center', marginTop: 10 }}>
              {t('NOT_AVAILABLE', 'Not available')}
            </OText>
          )}
      </Accordion>

      <View style={{ display: isActive ? 'flex' : 'none' }}>
        <Animated.View>
          <AccordionContent>
            {productInfo?.()?.ingredients?.length > 0 &&
              productInfo?.()?.ingredients?.some(
                (ingredient: any) => !ingredient.selected,
              ) && (
                <ProductOptionsList>
                  <OText
                    size={12}
                    weight="500"
                    color={theme.colors.unselectText}>
                    {t('INGREDIENTS', 'Ingredients')}:
                  </OText>

                  {productInfo?.()?.ingredients?.map(
                    (ingredient: any) =>
                      !ingredient.selected && (
                        <OText
                          size={12}
                          key={ingredient.id}
                          style={{ marginLeft: 10 }}
                          color={theme.colors.unselectText}>
                          {t('NO', 'No')} {ingredient.name}
                        </OText>
                      ),
                  )}
                </ProductOptionsList>
              )}

            {parseOptions?.length > 0 && (
              <ProductOptionsList>
                {parseOptions?.map((option: any, i: number) => (
                  <ProductOption key={option.id + i}>
                    <OText
                      size={12}
                      weight="500"
                      color={theme.colors.unselectText}>
                      {t(option?.name.toUpperCase(), option?.name)}
                    </OText>

                    {option.suboptions.map((suboption: any) => (
                      <ProductSubOption key={suboption.id}>
                        <OText
                          size={12}
                          mLeft={10}
                          color={theme.colors.unselectText}>
                          {getFormattedSubOptionName({
                            quantity: suboption.quantity,
                            name: suboption.name,
                            position:
                              suboption.position !== 'whole'
                                ? t(
                                  suboption.position.toUpperCase(),
                                  suboption.position,
                                )
                                : '',
                            price: parsePrice(suboption.price, { currency }),
                          })}
                        </OText>
                      </ProductSubOption>
                    ))}
                  </ProductOption>
                ))}
              </ProductOptionsList>
            )}

            {!!product.comment && (
              <ProductComment>
                <OText
                  size={12}
                  weight={600}
                  space
                  color={theme.colors.unselectText}>
                  {t('COMMENT', 'Comment')}
                </OText>
                <OText size={12} mLeft={10} style={{ width: '100%' }} color={theme.colors.unselectText}>
                  {product.comment}
                </OText>
              </ProductComment>
            )}
          </AccordionContent>
        </Animated.View>
      </View>
    </AccordionSection>
  );
};
