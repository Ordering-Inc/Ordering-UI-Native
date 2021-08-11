import React from 'react';
import { BusinessProductsCategories as ProductsCategories } from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Tab } from './styles';
import { OText } from '../shared';
import { BusinessProductsCategoriesParams } from '../../types';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';

const BusinessProductsCategoriesUI = (props: any) => {
	const {
		featured,
		categories,
		handlerClickCategory,
		categorySelected,
		loading,
	} = props;

	const theme = useTheme();
	const styles = StyleSheet.create({
		container: {
			paddingVertical: 14,
			borderColor: theme.colors.clear,
		},
		featuredStyle: {
			display: 'none',
		},
	});

	return (
		<ScrollView
			horizontal
			style={{ ...styles.container, borderBottomWidth: loading ? 0 : 1 }}
			contentContainerStyle={{ paddingHorizontal: 40 }}
			showsHorizontalScrollIndicator={false}>
			{loading && (
				<Placeholder Animation={Fade}>
					<View style={{ flexDirection: 'row' }}>
						{[...Array(4)].map((item, i) => (
							<PlaceholderLine key={i} width={10} style={{ marginRight: 5 }} />
						))}
					</View>
				</Placeholder>
			)}
			{!loading &&
				categories &&
				categories.length &&
				categories.map((category: any) => (
					<Tab
						key={category.name}
						onPress={() => handlerClickCategory(category)}
						style={[
							category.id === 'featured' && !featured && styles.featuredStyle,
							{
								borderColor:
									categorySelected?.id === category.id
										? theme.colors.textNormal
										: theme.colors.border,
							},
						]}>
						<OText
							size={categorySelected?.id === category.id ? 14 : 12}
							weight={categorySelected?.id === category.id ? '600' : '400'}
							color={
								categorySelected?.id === category.id
									? theme.colors.textNormal
									: theme.colors.textSecondary
							}
							style={{ alignSelf: 'center' }}>
							{category.name}
						</OText>
					</Tab>
				))}
		</ScrollView>
	);
};

export const BusinessProductsCategories = (
	props: BusinessProductsCategoriesParams,
) => {
	const businessProductsCategoriesProps = {
		...props,
		UIComponent: BusinessProductsCategoriesUI,
	};

	return <ProductsCategories {...businessProductsCategoriesProps} />;
};
