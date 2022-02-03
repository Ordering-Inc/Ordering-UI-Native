import React, { useState, useEffect } from 'react'
import { useLanguage } from 'ordering-components/native';
import { View, StyleSheet, Platform, I18nManager } from 'react-native';

import { OrdersOption } from '../OrdersOption'
import { OText } from '../shared'
import { ScrollView } from 'react-native-gesture-handler';

const PIXELS_TO_SCROLL = 1000;

export const MyOrders = (props: any) => {
  const [, t] = useLanguage();
  const [loadMore, setLoadMore] = useState(false)

  const [ordersLength, setOrdersLength] = useState({
    activeOrdersLength: 0,
    previousOrdersLength: 0,
  });

  const handleScroll = ({ nativeEvent }: any) => {
		const y = nativeEvent.contentOffset.y
		const height = nativeEvent.contentSize.height

    if (y + PIXELS_TO_SCROLL > height ) {
      setLoadMore(true)
    }
	}

  return (
    <ScrollView onScroll={(e: any) => handleScroll(e)}>
      <OText
        size={20}
        mBottom={15}
        style={{ marginTop: 25, paddingHorizontal: 40 }}>
        {t('MY_ORDERS', 'My Orders')}
      </OText>
      <View style={{ paddingLeft: 40, paddingRight: 40 }}>
        <OrdersOption
          {...props}
          activeOrders
          ordersLength={ordersLength}
          setOrdersLength={setOrdersLength}
          loadMoreStatus={loadMore}
          setLoadMoreStatus={setLoadMore}
        />
      </View>
      <View style={{ paddingLeft: 40, paddingRight: 40 }}>
        <OrdersOption
          {...props}
          ordersLength={ordersLength}
          setOrdersLength={setOrdersLength}
        />
      </View>
    </ScrollView>
  )
}
