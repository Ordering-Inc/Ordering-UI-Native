import React from 'react'
import { StyleSheet, FlatList, View, ScrollView, TouchableOpacity } from 'react-native'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder'
import { BusinessTypeFilter as BusinessTypeFilterController, useLanguage } from 'ordering-components/native'

import { BusinessCategoriesTitle, BusinessCategories, Category, BCContainer } from './styles'
import { OIcon, OText } from '../shared'
import { BusinessTypeFilterParams } from '../../types'
import { useTheme } from 'styled-components/native'

export const BusinessTypeFilterUI = (props: BusinessTypeFilterParams) => {
	const {
		typesState,
		currentTypeSelected,
		handleChangeBusinessType,
		noTitle,
		isMini
	} = props;

	const theme = useTheme();
	const [, t] = useLanguage();

	const renderTypes = ({ item }: any) => {
		return (
			<TouchableOpacity
				key={item.id}
				onPress={() => handleChangeBusinessType(item.id)}
			>
				<Category style={{height: isMini ? 40 : 150}}>
					{!isMini && (
						<>
							{item.image ? (
								<OIcon
									url={item.image}
									style={styles.logo}
								/>
							) : (
								<OIcon
									src={theme.images.categories.all}
									style={styles.logo}
								/>
							)}
						</>
					)}
					<OText
						style={{ textAlign: 'center' }}
						size={12}
						lineHeight={18}
						color={currentTypeSelected === item.id ? theme.colors.primary : theme.colors.textSecondary}
					>
						{t(`BUSINESS_TYPE_${item.name.replace(/\s/g, '_').toUpperCase()}`, item.name)}
					</OText>
				</Category>
			</TouchableOpacity>
		)
	}

	return (
		<BCContainer>
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
										height={20}
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
					{!noTitle && <BusinessCategoriesTitle>
						<OText
							size={14}
							weight={'500'}
							color={theme.colors.textPrimary}
						>
							{t('BUSINESS_CATEGORIES', 'Business Categories')}
						</OText>
					</BusinessCategoriesTitle>}
					<BusinessCategories>
						<FlatList
							horizontal
							showsHorizontalScrollIndicator={false}
							data={typesState?.types}
							renderItem={renderTypes}
							keyExtractor={(type: any) => type.name}
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
		width: 75,
		height: 75,
		marginBottom: 15,
		borderRadius: 25,
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
