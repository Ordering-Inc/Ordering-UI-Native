import React from 'react'
import { useOrder } from 'ordering-components/native'
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

const BusinessControllerList = ({ businesses, onBusinessClick, navigation, orderState, handleCustomUpdate, style }: any) => {
  return (
    <>
      {businesses?.result?.map((business: any, i: number) => (
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
          handleCustomUpdate={handleCustomUpdate}
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

export const PreviousBusinessOrdered = (props: PreviousBusinessOrderedParams) => {
  const {
    navigation,
    businesses,
    onNavigationRedirect,
    isBusinessesSearchList,
    handleUpdateBusinesses,
  } = props

  const [orderState] = useOrder()
  const windowWidth = Dimensions.get('window').width;
  const onBusinessClick = (business: any) => {
    onNavigationRedirect('Business', { store: business.slug, logo: business.logo, header: business.header })
  }

  const styles = StyleSheet.create({
    container: {
      marginBottom: 0,
    },
  });

  return (
    <ScrollView horizontal={isBusinessesSearchList} style={styles.container} showsVerticalScrollIndicator={false}>
      {isBusinessesSearchList ? (
        <>
          {!businesses?.loading && (
            <BusinessControllerList
              style={{ width: windowWidth - 120, marginRight: 20 }}
              onBusinessClick={onBusinessClick}
              orderState={orderState}
              navigation={navigation}
              businesses={businesses}
              handleCustomUpdate={handleUpdateBusinesses}
            />
          )}
        </>
      ) : (
        <ListWrapper>
          {businesses?.loading ? (
            <BusinessSkeletons />
          ) : (
            <BusinessControllerList
              onBusinessClick={onBusinessClick}
              orderState={orderState}
              navigation={navigation}
              businesses={businesses}
              handleCustomUpdate={handleUpdateBusinesses}
            />
          )}
        </ListWrapper>
      )}

    </ScrollView>
  )
}
