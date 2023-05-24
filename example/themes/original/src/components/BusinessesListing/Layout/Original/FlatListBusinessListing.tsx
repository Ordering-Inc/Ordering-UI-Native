import React, { useState } from 'react'
import { FlatList, RefreshControl, View } from 'react-native'
import { FlatListBusinessListHeader } from './FlatListBusinessListHeader'
import { FlatListBusinessListFooter } from './FlatListBusinessListFooter'
import { BusinessController } from '../../../BusinessController'
import {
    useOrder
} from 'ordering-components/native';
import { useTheme } from 'styled-components/native'

export const FlatListBusinessListing = (props : any) => {
    const {
        handleScroll,
        businessesList,
        handleBusinessClick,
        navigation,
        handleUpdateBusinessList,
        favoriteIds,
        setFavoriteIds,
        handleOnRefresh,
        isChewLayout
    } = props

    const [orderState] = useOrder()
    const [refreshing] = useState(false);
    const theme = useTheme()
    return (
        <FlatList
            ListHeaderComponent={
                <FlatListBusinessListHeader
                    {...props}
                />
            }
            ListFooterComponent={
                <FlatListBusinessListFooter {...props} />
            }
            onScroll={(e : any) => handleScroll(e)}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => handleOnRefresh()}
                />
            }
            data={businessesList.businesses}
            keyExtractor={(business : any) => business?.id}
            renderItem={({ item: business } : any) =>
                <View style={{
                    paddingHorizontal: 20, 
                    backgroundColor: theme.colors.backgroundLight
                }}>
                    <BusinessController
                        // enableIntersection
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
                        handleUpdateBusinessList={handleUpdateBusinessList}
                        favoriteIds={favoriteIds}
                        setFavoriteIds={setFavoriteIds}
                    />
                </View>
            }
        />
    )
}

