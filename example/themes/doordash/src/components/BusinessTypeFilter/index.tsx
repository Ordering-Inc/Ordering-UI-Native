import React from 'react'
import { StyleSheet, FlatList, View, ScrollView, TouchableOpacity } from 'react-native'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder'
import { BusinessTypeFilter as BusinessTypeFilterController, useLanguage } from 'ordering-components/native'

import { BusinessCategoriesTitle, BusinessCategories, Category, BCContainer } from './styles'
import { OIcon, OText } from '../shared'
import { colors, images } from '../../theme.json'
import { BusinessTypeFilterParams } from '../../types'
import { useWindowDimensions } from 'react-native'

export const BusinessTypeFilterUI = (props: BusinessTypeFilterParams) => {
	const {
		typesState,
		currentTypeSelected,
		handleChangeBusinessType,
	} = props;

	const [, t] = useLanguage();
	const { width } = useWindowDimensions();

	const renderTypes = ({ item }: any) => {
		return (
			<TouchableOpacity
				key={item.id}
				onPress={() => handleChangeBusinessType(item.id)}
			>
				<Category>
					{item.image ? (
						<OIcon
							url={item.image}
							style={styles.logo}
						/>
					) : (
						<OIcon
							src={images.categories.all}
							style={styles.logo}
						/>
					)}
					<OText
						style={{ textAlign: 'center' }}
						size={12}
						weight={'400'}
						color={currentTypeSelected === item.id ? colors.textPrimary : colors.textSecondary}
					>
						{t(`BUSINESS_TYPE_${item.name.replace(/\s/g, '_').toUpperCase()}`, item.name)}
					</OText>
				</Category>
			</TouchableOpacity>
		)
	}

	return (
		<BCContainer style={{marginStart: -40, width: width}}>
			{typesState?.loading && (
				<View>
					<Placeholder
						style={{ marginVertical: 10 }}
						Animation={Fade}
					>
						<ScrollView
							horizontal
							showsVerticalScrollIndicator={false}
							showsHorizontalScrollIndicator={false}
						>
							{[...Array(4)].map((_, i) => (
								<View key={i} style={{ width: 80, borderRadius: 10, marginRight: 15 }}>
									<PlaceholderLine
										height={80}
										noMargin
									/>
								</View>
							))}
						</ScrollView>
					</Placeholder>
				</View>
			)}
			{!typesState?.loading && !typesState?.error && typesState?.types && typesState?.types.length > 0 && (
				<>
					{/* <BusinessCategoriesTitle>
						<OText
							size={16}
							color={colors.textSecondary}
						>
							{t('BUSINESS_CATEGORIES', 'Business Categories')}
						</OText>
					</BusinessCategoriesTitle> */}
					<BusinessCategories>
						<FlatList
							horizontal
							showsHorizontalScrollIndicator={false}
							data={typesState?.types}
							renderItem={renderTypes}
							keyExtractor={type => type.name}
							contentContainerStyle={{paddingHorizontal: 40}}
						/>
					</BusinessCategories>
				</>
			)}
		</BCContainer>
	)
}

const styles = StyleSheet.create({
	icons: {
		padding: 10
	},
	logo: {
		width: 52,
		height: 52,
		marginBottom: 7,
		justifyContent: 'center',
		alignItems: 'center',
	},
})

export const BusinessTypeFilter = (props: BusinessTypeFilterParams) => {
	const businessTypeFilterProps = {
		...props,
		UIComponent: BusinessTypeFilterUI,
		businessTypes: props.businessTypes,
		defaultBusinessType: props.defaultBusinessType || null,
		onChangeBusinessType: props.handleChangeBusinessType
	}

	return (
		<BusinessTypeFilterController {...businessTypeFilterProps} />
	)
}
