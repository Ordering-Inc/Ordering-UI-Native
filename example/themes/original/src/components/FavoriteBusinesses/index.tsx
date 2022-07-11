import React from 'react';
import { View } from 'react-native';
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
import { FavoriteParams } from '../../types';
import {
	FavoriteList,
	useOrder,
  useLanguage
} from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { Container, WrappButton } from './styles'
import { OButton } from '../shared';
import { BusinessController } from '../BusinessController';

const FavoriteBusinessesUI = (props: FavoriteParams) => {
	const {
    favoriteList,
    handleUpdateFavoriteList,
    pagination,
    getFavoriteList,
    navigation,
    onNavigationRedirect
	} = props

	const theme = useTheme();
  const [, t] = useLanguage()
  const [orderState] = useOrder();

  const handleBusinessClick = (business: any) => {
    onNavigationRedirect && onNavigationRedirect('Business', {
      store: business.slug,
      header: business.header,
      logo: business.logo,
    });
  }

	return (
		<Container>
      {favoriteList?.loading && (
        [...Array(5).keys()].map(i => (
          <Placeholder
            Animation={Fade}
            key={i}
            style={{ marginBottom: 20 }}>
            <View style={{ width: '100%' }}>
              <PlaceholderLine
                height={200}
                style={{ marginBottom: 20, borderRadius: 25 }}
              />
              <View style={{ paddingHorizontal: 10 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <PlaceholderLine
                    height={25}
                    width={40}
                    style={{ marginBottom: 10 }}
                  />
                  <PlaceholderLine
                    height={25}
                    width={20}
                    style={{ marginBottom: 10 }}
                  />
                </View>
                <PlaceholderLine
                  height={20}
                  width={30}
                  style={{ marginBottom: 10 }}
                />
                <PlaceholderLine
                  height={20}
                  width={80}
                  style={{ marginBottom: 10 }}
                />
              </View>
            </View>
          </Placeholder>
        ))
      )}
      {!favoriteList?.loading && favoriteList?.favorites?.length > 0 && (
        favoriteList.favorites.map((business: any, i:number) => (
          <BusinessController
            key={`${business.id}_` + i}
            business={business}
            isBusinessOpen={business.open}
            handleCustomClick={handleBusinessClick}
            orderType={orderState?.options?.type}
            navigation={navigation}
            businessHeader={business?.header}
            businessFeatured={business?.featured}
            businessLogo={business?.logo}
            businessReviews={business?.reviews}
            businessDeliveryPrice={business?.delivery_price}
            businessDeliveryTime={business?.delivery_time}
            businessPickupTime={business?.pickup_time}
            businessDistance={business?.distance}
            handleUpdateBusinessList={handleUpdateFavoriteList}
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

export const FavoriteBusinesses = (props: any) => {
  const [orderState] = useOrder()

  const favoriteBusinessesProps = {
    ...props,
    UIComponent: FavoriteBusinessesUI,
    favoriteURL: 'favorite_businesses',
    originalURL: 'business',
    location: `${orderState.options?.address?.location?.lat},${orderState.options?.address?.location?.lng}`,
    propsToFetch: ['id', 'name', 'header', 'logo', 'location', 'address', 'ribbon', 'timezone', 'schedule', 'open', 'delivery_price', 'distance', 'delivery_time', 'pickup_time', 'reviews', 'featured', 'offers', 'food', 'laundry', 'alcohol', 'groceries', 'slug']
  }
  return <FavoriteList {...favoriteBusinessesProps} />
}
