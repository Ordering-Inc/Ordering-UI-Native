import React from 'react'
import { ProductIngredient as ProductIngredientController } from 'ordering-components/native'
import { useTheme } from 'styled-components/native';
import { Container } from './styles'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { View } from 'react-native'
import { OText } from '../shared'

const ProductIngredientUI = (props: any) => {
	const {
		state,
		ingredient,
		toggleSelect,
		isSoldOut
	} = props

	const theme = useTheme();

	return (
		<Container disabled={isSoldOut} onPress={() => toggleSelect()}>
			<View>
				{state?.selected && !isSoldOut ? (
					<MaterialCommunityIcon name='checkbox-marked' color={theme.colors.primary} size={24} />
				) : (
					<MaterialCommunityIcon name='checkbox-blank-outline' color='#cbcbcb' size={24} />
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
