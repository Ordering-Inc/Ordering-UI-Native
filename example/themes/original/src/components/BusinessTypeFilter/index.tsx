import React, { useState } from 'react';
import {
	StyleSheet,
	FlatList,
	View,
	ScrollView,
	TouchableOpacity,
	Dimensions
} from 'react-native';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
import {
	BusinessTypeFilter as BusinessTypeFilterController,
	useLanguage,
} from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import {
	BusinessCategories,
	Category,
	BCContainer,
} from './styles';
import { OIcon, OText, OModal } from '../shared';
import { BusinessTypeFilterParams } from '../../types';

const windowWidth = Dimensions.get('window').width;

export const BusinessTypeFilterUI = (props: BusinessTypeFilterParams) => {
	const { typesState, currentTypeSelected, handleChangeBusinessType } = props;

	const [, t] = useLanguage();

	const theme = useTheme();
	const [isOpenAllCategories, setIsOpenAllCategories] = useState(false)

	const renderTypes = ({ item }: any) => {
		return (
			<TouchableOpacity
				key={item.id}
				onPress={() => handleChangeBusinessType(item.id)}
				style={{
					height: 34,
					justifyContent: 'center',
					borderBottomWidth: currentTypeSelected === item.id ? 1 : 0,
					borderBottomColor: currentTypeSelected === item.id ? theme.colors.textNormal : theme.colors.border,
				}}>
				<OText
					style={{ textAlign: 'center', paddingHorizontal: 5 }}
					size={currentTypeSelected === item.id ? 14 : 12}
					weight={currentTypeSelected === item.id ? 'bold' : 'normal'}
					color={
						currentTypeSelected === item.id
							? theme.colors.textNormal
							: theme.colors.textSecondary
					}>
					{t(
						`BUSINESS_TYPE_${item.name.replace(/\s/g, '_').toUpperCase()}`,
						item.name,
					)}
				</OText>
			</TouchableOpacity>
		);
	};

	return (
		<>
			<BCContainer>
				{typesState?.loading && (
					<View>
						<Placeholder style={{ marginVertical: 10 }} Animation={Fade}>
							<ScrollView
								horizontal
								showsVerticalScrollIndicator={false}
								showsHorizontalScrollIndicator={false}>
								{[...Array(4)].map((_, i) => (
									<View
										key={i}
										style={{ width: 80, borderRadius: 10, marginRight: 15 }}>
										<PlaceholderLine height={80} noMargin />
									</View>
								))}
							</ScrollView>
						</Placeholder>
					</View>
				)}
				{!typesState?.loading &&
					!typesState?.error &&
					typesState?.types &&
					typesState?.types.length > 0 && (
						<>
							<BusinessCategories>
								<FlatList
									horizontal
									showsHorizontalScrollIndicator={false}
									data={typesState?.types}
									renderItem={renderTypes}
									keyExtractor={(type) => type.name}
								/>
								<TouchableOpacity
									style={{ marginLeft: 15 }}
									onPress={() => setIsOpenAllCategories(true)}
								>
									<OText size={12} color={theme.colors.primary}>{t('SEE_ALL', 'See All')}</OText>
								</TouchableOpacity>
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
						{typesState?.types.map((item: any) => (
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
									size={14}
									color={currentTypeSelected === item.id ? theme.colors.primary : theme.colors.textSecondary}
									numberOfLines={1}
									ellipsizeMode='tail'
								>
									{t(`BUSINESS_TYPE_${item.name.replace(/\s/g, '_').toUpperCase()}`, item.name)}
								</OText>
							</TouchableOpacity>
						))}
					</View>
				</ScrollView>
			</OModal>
		</>
	);
};

const styles = StyleSheet.create({
	icons: {
		padding: 10,
	},
	logo: {
		width: windowWidth / 3 - 40,
		height: windowWidth / 3 - 40,
		marginBottom: 15,
		borderRadius: 8,
		justifyContent: 'center',
		alignItems: 'center',
	},
	categoryStyle: {
		width: windowWidth / 3 - 40,
		height: 150,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		marginHorizontal: 10,
		marginBottom: 40
	},
	allCategoriesContainer: {
		paddingHorizontal: 30,
		paddingVertical: 30
	},
	allCategoriesWrapper: {
		flexDirection: 'row',
		flexWrap: 'wrap',
	}
});

export const BusinessTypeFilter = (props: BusinessTypeFilterParams) => {
	const businessTypeFilterProps = {
		...props,
		UIComponent: BusinessTypeFilterUI,
		businessTypes: props.businessTypes,
		defaultBusinessType: props.defaultBusinessType || null,
		onChangeBusinessType: props.handleChangeBusinessType,
	};

	return <BusinessTypeFilterController {...businessTypeFilterProps} />;
};
