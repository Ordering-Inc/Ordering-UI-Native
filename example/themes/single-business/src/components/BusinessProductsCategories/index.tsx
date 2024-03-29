import React, { useEffect, useState, useRef } from 'react';
import { BusinessProductsCategories as ProductsCategories } from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { ScrollView, StyleSheet, View, Dimensions } from 'react-native';
import { Tab } from './styles';
import { OText } from '../shared';
import { BusinessProductsCategoriesParams } from '../../types';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';

const BusinessProductsCategoriesUI = (props: any) => {
	const {
		featured,
		categories,
		categorySelected,
		loading,
		scrollViewRef,
		productListLayout,
		categoriesLayout,
		selectedCategoryId,
    setSelectedCategoryId,
		handlerClickCategory,
		lazyLoadProductsRecommended
	} = props;

	const theme = useTheme();
	const windowWidth = Dimensions.get('window').width
	const [tabLayouts, setTabLayouts] = useState<any>({})
	const [scrollOffsetX, setScrollOffsetX] = useState<any>(0)
	const tabsRef = useRef<any>(null)

	const styles = StyleSheet.create({
		container: {
			paddingVertical: 5,
			borderColor: theme.colors.clear,
			backgroundColor: '#FFF'
		},
		featuredStyle: {
			display: 'none',
		},
	});

	const handleCategoryScroll = (category: any) => {
		if (!lazyLoadProductsRecommended) {
			if (category?.id || category.name === 'All') {
				scrollViewRef.current.scrollTo({
					y: categoriesLayout[`cat_${category?.id ?? category?.name}`]?.y + productListLayout?.y - 120,
					animated: true
				})
			} else {
				scrollViewRef.current.scrollTo({
					y: productListLayout?.y - 120,
					animated: true
				})
			}
		} else {
			handlerClickCategory(category)
		}
	}

	const handleOnLayout = (event: any, categoryId: any) => {
    const _tabLayouts = { ...tabLayouts }
    const categoryKey = 'cat_' + categoryId
    _tabLayouts[categoryKey] = event.nativeEvent.layout
    setTabLayouts(_tabLayouts)
  }

	useEffect(() => {
		if (!selectedCategoryId || Object.keys(tabLayouts).length === 0) return
		tabsRef.current.scrollTo({
			x: tabLayouts[selectedCategoryId]?.x - 40,
			animated: true
		})
	}, [selectedCategoryId, tabLayouts])

  const initialCategory = featured ? 0 : 1

	return (
		<ScrollView
			ref={tabsRef}
			horizontal
			style={{ ...styles.container, borderBottomWidth: loading ? 0 : 1 }}
			contentContainerStyle={{ paddingHorizontal: 40 }}
			showsHorizontalScrollIndicator={false}
			onScroll={(e: any) => setScrollOffsetX(e.nativeEvent.contentOffset.x)}
			scrollEventThrottle={16}
		>
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
				categories.map((category: any, i: number) => (
					<Tab
						key={category.name}
						onPress={() => handleCategoryScroll(category)}
						style={[
							category.id === 'featured' && !featured && styles.featuredStyle,
							{
								borderColor:
									(!lazyLoadProductsRecommended
										?	(selectedCategoryId === (`cat_${category.id}`) || (i === initialCategory && selectedCategoryId === null))
										:	(categorySelected?.id === category.id))
											? theme.colors.textNormal
											: theme.colors.border,
							},
						]}
						onLayout={(event: any) => handleOnLayout(event, category.id)}
					>
						<OText
							size={
								(!lazyLoadProductsRecommended
									?	(selectedCategoryId === (`cat_${category.id}`) || (i === initialCategory && selectedCategoryId === null))
									:	(categorySelected?.id === category.id))
										? 14
										: 12
							}
							weight={
								(!lazyLoadProductsRecommended
									?	(selectedCategoryId === (`cat_${category.id}`) || (i === initialCategory && selectedCategoryId === null))
									:	(categorySelected?.id === category.id))
										? '600'
										: '400'
							}
							color={
								(!lazyLoadProductsRecommended
									?	(selectedCategoryId === (`cat_${category.id}`) || (i === initialCategory && selectedCategoryId === null))
									:	(categorySelected?.id === category.id))
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
  const categoriesToSend = !props.lazyLoadProductsRecommended
    ? props.categories.filter((category: any) => category.id)
    : props.categories
	const businessProductsCategoriesProps = {
		...props,
    categories: categoriesToSend,
		UIComponent: BusinessProductsCategoriesUI,
	};

	return <ProductsCategories {...businessProductsCategoriesProps} />;
};
