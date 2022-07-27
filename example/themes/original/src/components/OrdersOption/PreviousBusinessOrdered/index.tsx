import React, { useEffect } from 'react'
import { BusinessList as BusinessListController, useOrder } from 'ordering-components/native'
import { BusinessController } from '../../BusinessController'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';

import { ListWrapper } from './styles'
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions
} from 'react-native';
import { PreviousBusinessOrderedParams } from '../../../types';

export const PreviousBusinessOrderedUI = (props: PreviousBusinessOrderedParams) => {
  const {
    navigation,
    businessesList,
    setBusinessLoading,
    businessId,
    onNavigationRedirect,
    isBusinessesSearchList,
    businessLoading
  } = props

  const [orderState] = useOrder()
  const windowWidth = Dimensions.get('window').width;

  const onBusinessClick = (business: any) => {
    onNavigationRedirect('Business', { store: business.slug })
  }
  useEffect(() => {
    if (businessesList?.loading && businessesList?.businesses?.length === 0) {
      setBusinessLoading(true)
    } else {
      setBusinessLoading(false)
    }
  }, [businessesList?.loading])

  const styles = StyleSheet.create({
    container: {
      marginBottom: 0,
    },
  });

  const BusinessControllerList = ({ style }: any) => {
    return (
      <>
        {businessesList.businesses?.filter((business: any) => businessId?.includes(business?.id))?.map((business: any, i: number) => (
          <BusinessController
            key={`${business.id}_` + i}
            business={business}
            isBusinessOpen={business.open}
            handleCustomClick={() => onBusinessClick(business)}
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
            style={style}
          />
        ))}
      </>
    )
  }

  const BusinessSkeletons = () => {
    return (
      <>
        {[...Array(4).keys()].map((item, i) => (
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
        ))}
      </>
    )
  }

  return (
    <ScrollView horizontal={isBusinessesSearchList} style={styles.container} showsVerticalScrollIndicator={false}>
      {isBusinessesSearchList ? (
        <>
          {!businessLoading && (
            <BusinessControllerList
              style={{ width: windowWidth - 80, marginRight: 20 }}
            />
          )}
        </>
      ) : (
        <ListWrapper>
          <BusinessControllerList />
          {businessesList.loading && (
            <BusinessSkeletons />
          )}
        </ListWrapper>
      )}

    </ScrollView>
  )
}

export const PreviousBusinessOrdered = (props: PreviousBusinessOrderedParams) => {
  const previousBusinessOrderedController = {
    ...props,
    UIComponent: PreviousBusinessOrderedUI,
    paginationSettings: { initialPage: 1, pageSize: 50, controlType: 'infinity' }
  }

  return (
    <BusinessListController {...previousBusinessOrderedController} />
  )
}
