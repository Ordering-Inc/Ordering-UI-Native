import React, { useState } from 'react'
import { StyleSheet, FlatList, View, ScrollView, TouchableOpacity } from 'react-native'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder'
import { BusinessTypeFilter as BusinessTypeFilterController, useLanguage } from 'ordering-components/native'

import { BusinessCategories, Category, BCContainer } from './styles'
import { OIcon, OText } from '../shared'
import { OModal } from '../../../../../src/components/shared'
import { useTheme } from 'styled-components/native'
import { BusinessTypeFilterParams } from '../../types'
import { useWindowDimensions } from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'

export const BusinessTypeFilterUI = (props: BusinessTypeFilterParams) => {
	const {
		typesState,
		currentTypeSelected,
		handleChangeBusinessType,
	} = props;

	const theme = useTheme();
	const [, t] = useLanguage();
	const { width, height } = useWindowDimensions();
  const [isOpenAllCategories, setIsOpenAllCategories] = useState(false);

	const styles = StyleSheet.create({
		icons: {
			padding: 10
		},
		logo: {
      width: isOpenAllCategories ? width / 3 - 27 : width / 4 - 30,
      height: isOpenAllCategories ? width / 3 - 27 : width / 4 - 30,
      marginBottom: 15,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
		categoryStyle: {
      width: isOpenAllCategories ? width / 3 - 27 : width / 4 - 30,
      height: 120,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: isOpenAllCategories ? 10 : 0,
      marginBottom: isOpenAllCategories ? 40 : 0
    },
		allCategoriesContainer : {
      paddingHorizontal: 10,
      paddingVertical: 30,
			height: height,
			backgroundColor: 'white',
			flex: 1
    },
    allCategoriesWrapper: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    }
	})

	const RenderTypes = ({ item }: any) => {
		return (
			<TouchableOpacity
				key={item.id}
				style={styles.categoryStyle}
				onPress={() => {
					handleChangeBusinessType(item.id)
					isOpenAllCategories && setIsOpenAllCategories(false)
				}}
			>
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
				<OText
					style={{ textAlign: 'center' }}
					size={12}
					weight={'400'}
					color={currentTypeSelected === item.id ? theme.colors.textPrimary : theme.colors.textSecondary}
					numberOfLines={1}
				>
					{t(`BUSINESS_TYPE_${item.name.replace(/\s/g, '_').toUpperCase()}`, item.name)}
				</OText>
			</TouchableOpacity>
		)
	}

	return (
		<>
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
									<View key={i} style={{ width: 80, borderRadius: 8, marginRight: 15 }}>
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
						<BusinessCategories>
							{typesState?.types.slice(0, 3).map((type: any) => (
								<RenderTypes
									key={type.id}
									item={type}
								/>
							))}
							{typesState?.types.length > 3 && (
								<TouchableOpacity
									style={styles.categoryStyle}
									onPress={() => setIsOpenAllCategories(true)}
								>
									<View
										style={{ ...styles.logo, backgroundColor: theme.colors.lightGray }}
									>
										<MaterialIcon
											name='dots-horizontal'
											size={32}
											color={theme.colors.black}
										/>
									</View>
									<OText
										style={{ textAlign: 'center' }}
										size={12}
										color={theme.colors.textSecondary}
										numberOfLines={1}
										ellipsizeMode='tail'
									>
										{t('SEE_ALL', 'See All')}
									</OText>
								</TouchableOpacity>
							)}
					</BusinessCategories>
				</>
			)}
			</BCContainer>
			<OModal
				open={isOpenAllCategories}
				onClose={() => setIsOpenAllCategories(false)}
				entireModal
			>
				<ScrollView style={styles.allCategoriesContainer}>
					<OText
						size={20}
						mBottom={30}
						color={theme.colors.textSecondary}
						style={{ paddingHorizontal: 10 }}
					>
						{t('ALL_CATEGORIES', 'All categories')}
					</OText>
					<View style={styles.allCategoriesWrapper}>
						{typesState?.types.map((type: any) => (
							<RenderTypes
								key={type.id}
								item={type}
							/>
						))}
					</View>
				</ScrollView>
			</OModal>
		</>
	)
}

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
