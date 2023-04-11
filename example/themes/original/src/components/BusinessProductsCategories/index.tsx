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
		handlerClickCategory,
		lazyLoadProductsRecommended,
		setCategoryClicked,
		setSelectedCategoryId
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
		tabStyle: {
			marginTop: 10,
			height: 4,
			borderTopStartRadius: 4,
			borderTopEndRadius: 4,
			backgroundColor: theme.colors.textPrimary,
		},
		tabDeactived: {
			marginTop: 10,
			height: 4
		}
	});

	const handleCategoryScroll = (category: any) => {
		setCategoryClicked(true);
		setSelectedCategoryId(`cat_${category?.id}`);

		if (!lazyLoadProductsRecommended) {
			if (category?.id) {
				scrollViewRef?.current?.scrollTo && scrollViewRef.current.scrollTo({
					y: categoriesLayout[`cat_${category?.id}`]?.y + productListLayout?.y - 70,
					animated: true
				})
			} else {
				scrollViewRef?.current?.scrollTo && scrollViewRef.current.scrollTo({
					y: productListLayout?.y - 70,
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
				categories.length > 0 &&
				categories.map((category: any) => (
					<Tab
						key={category.id}
						onPress={() => requestAnimationFrame(() => {
							handleCategoryScroll(category)
						})}
						style={[
							category.id === 'featured' && !featured && styles.featuredStyle,
							{
								borderColor:
									(!lazyLoadProductsRecommended
										? (selectedCategoryId === (category.id ? `cat_${category.id}` : null))
										: (categorySelected?.id === category.id))
										? theme.colors.textNormal
										: theme.colors.border,
							},
						]}
						onLayout={(event: any) => handleOnLayout(event, category.id)}
					>
						<OText
							color={selectedCategoryId === `cat_${category.id}` ? theme.colors.textPrimary : theme.colors.textSecondary}
						>
							{category.name}
						</OText>
						<View style={selectedCategoryId === `cat_${category.id}` ? styles.tabStyle : styles.tabDeactived} />
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
