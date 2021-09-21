import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { OrderList, useLanguage } from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder';
import { OText, OIconButton, OButton } from '../shared';
import { PreviousOrders } from '../PreviousOrders';
import { NotFoundSource } from '../NotFoundSource';
import { FiltersTab, TabsContainer, Tag } from './styles';
import { OrdersOptionParams } from '../../types';

const OrdersOptionUI = (props: OrdersOptionParams) => {
  const {
    orderList,
    pagination,
    customArray,
    navigation,
    loadMoreOrders,
    rememberOrderStatus,
    setRememberOrderStatus,
    setUpdateOtherStatus,
    loadOrders,
    onNavigationRedirect,
  } = props;

  const theme = useTheme();
  const [, t] = useLanguage();

  const { loading, error, orders: values } = orderList;
  const orders = customArray || values || [];

  const orderStatus = [
    { key: 0, text: t('PENDING', 'Pending') },
    { key: 1, text: t('COMPLETED', 'Completed') },
    { key: 2, text: t('REJECTED', 'Rejected') },
    { key: 3, text: t('DRIVER_IN_BUSINESS', 'Driver in business') },
    { key: 4, text: t('PREPARATION_COMPLETED', 'Preparation Completed') },
    { key: 5, text: t('REJECTED_BY_BUSINESS', 'Rejected by business') },
    { key: 6, text: t('REJECTED_BY_DRIVER', 'Rejected by Driver') },
    { key: 7, text: t('ACCEPTED_BY_BUSINESS', 'Accepted by business') },
    { key: 8, text: t('ACCEPTED_BY_DRIVER', 'Accepted by driver') },
    {
      key: 9,
      text: t('PICK_UP_COMPLETED_BY_DRIVER', 'Pick up completed by driver'),
    },
    {
      key: 10,
      text: t('PICK_UP_FAILED_BY_DRIVER', 'Pick up Failed by driver'),
    },
    {
      key: 11,
      text: t('DELIVERY_COMPLETED_BY_DRIVER', 'Delivery completed by driver'),
    },
    {
      key: 12,
      text: t('DELIVERY_FAILED_BY_DRIVER', 'Delivery Failed by driver'),
    },
    { key: 13, text: t('PREORDER', 'Preorder') },
    { key: 14, text: t('ORDER_NOT_READY', 'Order not ready') },
    {
      key: 15,
      text: t(
        'ORDER_PICKEDUP_COMPLETED_BY_CUSTOMER',
        'Order picked up completed by customer',
      ),
    },
    { key: 16, text: t('CANCELLED_BY_CUSTOMER', 'Cancelled by customer') },
    {
      key: 17,
      text: t(
        'ORDER_NOT_PICKEDUP_BY_CUSTOMER',
        'Order not picked up by customer',
      ),
    },
    {
      key: 18,
      text: t(
        'DRIVER_ALMOST_ARRIVED_TO_BUSINESS',
        'Driver almost arrived to business',
      ),
    },
    {
      key: 19,
      text: t(
        'DRIVER_ALMOST_ARRIVED_TO_CUSTOMER',
        'Driver almost arrived to customer',
      ),
    },
    {
      key: 20,
      text: t(
        'ORDER_CUSTOMER_ALMOST_ARRIVED_BUSINESS',
        'Customer almost arrived to business',
      ),
    },
    {
      key: 21,
      text: t(
        'ORDER_CUSTOMER_ARRIVED_BUSINESS',
        'Customer arrived to business',
      ),
    },
  ];

  const tabs = [
    { key: 0, text: t('PENDING', 'Pending'), tags: [0, 13], title: 'pending' },
    {
      key: 1,
      text: t('IN_PROGRESS', 'In Progress'),
      tags: [3, 4, 7, 8, 9, 14, 18, 19, 20, 21],
      title: 'inProgress',
    },
    {
      key: 2,
      text: t('COMPLETED', 'Completed'),
      tags: [1, 11, 15],
      title: 'completed',
    },
    {
      key: 3,
      text: t('CANCELLED', 'Cancelled'),
      tags: [2, 5, 6, 10, 12, 16, 17],
      title: 'cancelled',
    },
  ];

  const scrollRef = useRef() as React.MutableRefObject<ScrollView>;
  const scrollRefTab = useRef() as React.MutableRefObject<ScrollView>;

  const [ordersToShow, setOrdersToShow] = useState([]);
  const [tabsFilter, setTabsFilter] = useState(tabs[0].tags);
  const [tagsFilter, setTagsFilter] = useState(tabs[0].tags);
  const [loadingTag, setLoadingTag] = useState(false);
  const [isLoadedOrders, setIsLoadedOrders] = useState<any>({
    pending: { isFetched: true, hasMorePagination: false },
    inProgress: { isFetched: false, hasMorePagination: false },
    completed: { isFetched: false, hasMorePagination: false },
    cancelled: { isFetched: false, hasMorePagination: false },
  });
  const [currentTab, setCurrentTab] = useState(tabs[0].title);
  const [reload, setReload] = useState(false);
  const [orientation, setOrientation] = useState(
    Dimensions.get('window').width < Dimensions.get('window').height
      ? 'Portrait'
      : 'Landscape',
  );
  const [windowsWidth, setWindowsWidth] = useState(
    parseInt(parseFloat(String(Dimensions.get('window').width)).toFixed(0)),
  );

  const handleChangeTab = (tags: number[], tabTitle: string) => {
    setTabsFilter(tags);
    setRememberOrderStatus(tags);
    setUpdateOtherStatus(tags);
    if (!isLoadedOrders[tabTitle].isFetched) {
      loadOrders && loadOrders(true, tags);
      setIsLoadedOrders({
        ...isLoadedOrders,
        [tabTitle]: { isFetched: true, hasMorePagination: false },
      });
    }
    setTagsFilter(tags);

    const ordersTab = values.filter((order: any) =>
      tags.some(tag => tag === order.status),
    );

    if (JSON.stringify(tags) === JSON.stringify(tabs[3].tags)) {
      scrollRefTab.current?.scrollToEnd({ animated: true });
    }

    if (JSON.stringify(tags) === JSON.stringify(tabs[0].tags)) {
      scrollRefTab.current?.scrollTo({ animated: true });
    }

    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });

    setOrdersToShow(ordersTab);
    setCurrentTab(tabTitle);
  };

  const handleChangeTag = (key: number) => {
    const updateTags: number[] = [];

    if (tagsFilter.includes(key)) {
      updateTags.push(...tagsFilter.filter(tag => tag !== key));
    } else {
      updateTags.push(...tagsFilter.concat(key));
    }
    const arr = ordersToShow.filter(
      (order: any) =>
        tabsFilter.includes(order.status) && tagsFilter.includes(order.status),
    );
    setRememberOrderStatus(updateTags);
    setTagsFilter(updateTags);
    setUpdateOtherStatus(updateTags);
  };

  const handleReload = () => {
    setReload(true);
    setOrdersToShow([]);
    loadOrders &&
      loadOrders(
        true,
        tagsFilter,
        pagination.pageSize * pagination.currentPage <= 50,
      );
  };

  const handleLoadMore = () => {
    if (ordersToShow.length <= 3) {
      handleReload();
    } else {
      loadMoreOrders && loadMoreOrders(tagsFilter);
    }
  };

  const getOrderStatus = (key: number) => {
    return orderStatus.find(status => status.key === key)?.text;
  };

  useEffect(() => {
    let ordersTab = values?.filter((order: any) =>
      tagsFilter.some(tag => tag === order.status),
    );
    let hash: any = {};
    ordersTab = ordersTab.filter((order: any) =>
      hash[order.id] ? false : (hash[order.id] = true),
    );

    setOrdersToShow(ordersTab);
  }, [values]);

  useEffect(() => {
    if (reload && !loading) setReload(!reload);
    if (loadingTag) setLoadingTag(false);
  }, [loading]);

  useEffect(() => {
    setOrdersToShow(
      values.filter((order: any) => tagsFilter.includes(order.status)),
    );
  }, [tagsFilter]);

  useEffect(() => {
    if (!loading) {
      setIsLoadedOrders({
        ...isLoadedOrders,
        [currentTab]: {
          isFetched: true,
          hasMorePagination: pagination.currentPage < pagination.totalPages,
        },
      });
    }
  }, [pagination.totalPages]);

  Dimensions.addEventListener('change', ({ window: { width, height } }) => {
    setWindowsWidth(
      parseInt(parseFloat(String(Dimensions.get('window').width)).toFixed(0)),
    );

    if (width < height) {
      setOrientation('Portrait');
    } else {
      setOrientation('Landscape');
    }
  });

  const styles = StyleSheet.create({
    header: {
      marginBottom: 25,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    title: {
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: '600',
      fontSize: 26,
      color: theme.colors.textGray,
    },
    icons: {
      flexDirection: 'row',
    },
    tab: {
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontSize: 14,
      marginBottom: 10,
      paddingLeft: 8,
      paddingRight: 8,
    },
    tagsContainer: {
      marginBottom: 10,
    },
    tag: {
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: 14,
    },
    pressable: {
      flex: 1,
      minWidth: 88,
      alignItems: 'center',
    },
    loadButton: {
      borderRadius: 7.6,
      height: 44,
      marginRight: 10,
      marginBottom: 10,
      marginTop: 5,
    },
    loadButtonText: {
      color: theme.colors.inputTextColor,
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: 18,
    },
  });

  return (
    <>
      <View style={styles.header}>
        <OText style={styles.title}>{t('MY_ORDERS', 'My orders')}</OText>
      </View>

      <FiltersTab>
        <ScrollView
          ref={scrollRefTab}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          horizontal>
          <TabsContainer width={windowsWidth - 42}>
            {tabs.map(tab => (
              <Pressable
                key={tab.key}
                style={styles.pressable}
                onPress={() => handleChangeTab(tab.tags, tab.title)}>
                <OText
                  style={styles.tab}
                  color={
                    JSON.stringify(tabsFilter) === JSON.stringify(tab.tags)
                      ? theme.colors.textGray
                      : theme.colors.unselectText
                  }
                  weight={
                    JSON.stringify(tabsFilter) === JSON.stringify(tab.tags)
                      ? '600'
                      : 'normal'
                  }>
                  {tab.text}
                </OText>

                <View
                  style={{
                    width: '100%',
                    borderBottomColor:
                      JSON.stringify(tabsFilter) === JSON.stringify(tab.tags)
                        ? theme.colors.textGray
                        : theme.colors.tabBar,
                    borderBottomWidth: 2,
                  }}
                />
              </Pressable>
            ))}
          </TabsContainer>
        </ScrollView>
      </FiltersTab>

      <View>
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tagsContainer}
          horizontal>
          {tabsFilter.map((key: number) => (
            <Tag
              key={key}
              onPress={() => handleChangeTag(key)}
              isSelected={
                tagsFilter.includes(key)
                  ? theme.colors.primary
                  : theme.colors.tabBar
              }>
              <OText
                style={styles.tag}
                color={
                  tagsFilter.includes(key)
                    ? theme.colors.white
                    : theme.colors.black
                }>
                {getOrderStatus(key)}
              </OText>
            </Tag>
          ))}
        </ScrollView>
      </View>

      {!loading &&
        (!tagsFilter.length || orderList.error || !ordersToShow.length) && (
          <NotFoundSource
            content={
              !orderList.error
                ? t('NO_RESULTS_FOUND', 'Sorry, no results found')
                : orderList?.error[0]?.message ||
                  orderList?.error[0] ||
                  t('NETWORK_ERROR', 'Network Error')
            }
            image={theme.images.general.notFound}
            conditioned={false}
          />
        )}

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        {!reload && !error && orders.length > 0 && !loadingTag && (
          <PreviousOrders
            orders={ordersToShow}
            onNavigationRedirect={onNavigationRedirect}
            getOrderStatus={getOrderStatus}
            tabsFilter={tabsFilter}
          />
        )}

        {loading && (
          <>
            <View>
              {[...Array(5)].map((item, i) => (
                <Placeholder key={i} Animation={Fade}>
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      marginBottom: 10,
                    }}>
                    <PlaceholderLine
                      width={orientation === 'Portrait' ? 22 : 11}
                      height={74}
                      style={{
                        marginRight: 20,
                        marginBottom: 20,
                        borderRadius: 7.6,
                      }}
                    />
                    <Placeholder>
                      <PlaceholderLine width={30} style={{ marginTop: 5 }} />
                      <PlaceholderLine width={50} />
                      <PlaceholderLine width={20} />
                    </Placeholder>
                  </View>
                </Placeholder>
              ))}
            </View>
          </>
        )}

        {!!tagsFilter.length &&
          !orderList.error &&
          pagination.totalPages &&
          !loading &&
          !!orders.length &&
          pagination.currentPage < pagination.totalPages &&
          isLoadedOrders[currentTab].hasMorePagination && (
            <OButton
              onClick={handleLoadMore}
              text={t('LOAD_MORE_ORDERS', 'Load more orders')}
              imgRightSrc={null}
              textStyle={styles.loadButtonText}
              style={styles.loadButton}
              bgColor={theme.colors.primary}
              borderColor={theme.colors.primary}
            />
          )}
      </ScrollView>
    </>
  );
};

export const OrdersOption = (props: OrdersOptionParams) => {
  const MyOrdersProps = {
    ...props,
    UIComponent: OrdersOptionUI,
  };

  return <OrderList {...MyOrdersProps} />;
};
