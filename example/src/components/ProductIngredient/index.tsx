import React from 'react'
import { ProductIngredient as ProductIngredientController } from 'ordering-components/native'

import { Container } from './styles'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { View } from 'react-native'
import { OText } from '../shared'
import { colors } from '../../theme.json'

const ProductIngredientUI = (props: any) => {
  const {
    state,
    ingredient,
    toggleSelect
  } = props

  return (
    <Container onPress={() => toggleSelect()}>
      <View>
        {state?.selected ? (
          <MaterialCommunityIcon name='checkbox-marked' color={colors.primary} size={24}/>
        ) : (
          <MaterialCommunityIcon name='checkbox-blank-outline' color={colors.backgroundDark} size={24}/>
        )}
      </View>
      <OText mLeft={10}>
        {ingredient.name}
      </OText>
    </Container>
  )
}

export const ProductIngredient = (props: any) => {
  const productIngredientProps = {
    ...props,
    UIComponent: ProductIngredientUI
  }

  return (
    <ProductIngredientController {...productIngredientProps} />
  )
}
