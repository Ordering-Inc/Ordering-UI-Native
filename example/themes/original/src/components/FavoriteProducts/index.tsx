import React from 'react';
import { View } from 'react-native';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
import { SingleProductCard } from '../SingleProductCard';
import { OButton } from '../shared';
import { FavoriteList, useLanguage } from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { Container, WrappButton } from './styles'
import { FavoriteParams } from '../../types';

const FavoriteProductsUI = (props: FavoriteParams) => {
	const {
    handleUpdateFavoriteList,
    favoriteList,
    pagination,
    getFavoriteList
	} = props

	const theme = useTheme();
  const [, t] = useLanguage()

	return (
		<Container>
      {favoriteList?.loading && (
        [...Array(5).keys()].map(i => (
          <Placeholder key={i} style={{ padding: 5 }} Animation={Fade}>
            <View style={{ flexDirection: 'row' }}>
              <PlaceholderLine
                width={24}
                height={70}
                style={{ marginRight: 10, marginBottom: 10 }}
              />
              <Placeholder style={{ paddingVertical: 10 }}>
                <PlaceholderLine width={60} style={{ marginBottom: 25 }} />
                <PlaceholderLine width={20} />
              </Placeholder>
            </View>
          </Placeholder>
        ))
      )}
      {!favoriteList?.loading && favoriteList?.favorites?.length > 0 && (
        favoriteList.favorites.map((product: any) => (
          <SingleProductCard
            key={product?.id}
            isSoldOut={product.inventoried && !product.quantity}
            product={product}
            onProductClick={() => {}}
            handleUpdateProducts={handleUpdateFavoriteList}
          />
        ))
      )}
      {!favoriteList?.loading && pagination.totalPages && pagination.currentPage < pagination.totalPages && (
				<WrappButton>
					<OButton
						onClick={() => getFavoriteList(pagination?.currentPage + 1)}
						text={t('LOAD_MORE_ORDERS', 'Load more orders')}
						imgRightSrc={null}
						textStyle={{ color: theme.colors.white }}
						style={{ borderRadius: 7.6, shadowOpacity: 0, marginTop: 20 }}
					/>
				</WrappButton>
			)}
    </Container>
	)
}

export const FavoriteProducts = (props: any) => {
  const favoriteBusinessesProps = {
    ...props,
    UIComponent: FavoriteProductsUI,
    favoriteURL: 'favorite_products',
    originalURL: 'products'
  }
  return <FavoriteList {...favoriteBusinessesProps} />
}
