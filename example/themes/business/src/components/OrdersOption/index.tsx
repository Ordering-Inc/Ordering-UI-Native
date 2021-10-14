import React, { useEffect, useState, useRef } from 'react';
import { View, Pressable, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useLanguage, OrderListGroups } from 'ordering-components/native';
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { DeviceOrientationMethods } from '../../../../../src/hooks/DeviceOrientation'

import { useTheme } from 'styled-components/native';
import { OText, OButton } from '../shared';
import { NotFoundSource } from '../NotFoundSource';
import { FiltersTab, TabsContainer, Tag } from './styles';
import { PreviousOrders } from '../PreviousOrders';
import { OrdersOptionParams } from '../../types';

// import GestureRecognizer from 'react-native-swipe-gestures';

const tabsList: any = {
  pending: 1,
  inProgress: 2,
  completed: 3,
  cancelled: 4
};

const tabsListText: any = {
  1: 'pending',
  2: 'inProgress',
  3: 'completed',
  4: 'cancelled'
};

const swipeConfig = {
  velocityThreshold: 0.3,
  directionalOffsetThreshold: 80
};

const { useDeviceOrientation, PORTRAIT } = DeviceOrientationMethods

const OrdersOptionUI = (props: OrdersOptionParams) => {
  const {
    setCurrentFilters,
    tabs,
    currentTabSelected,
    setCurrentTabSelected,
    ordersGroup,
    setOrdersGroup,
    orderStatus,
    loadOrders,
    loadMoreOrders,
    onNavigationRedirect,
  } = props;

  const theme = useTheme();
  const [, t] = useLanguage();
  const [orientationState] = useDeviceOrientation();

  const WIDTH_SCREEN = orientationState?.dimensions?.width

  const IS_PORTRAIT = orientationState.orientation === PORTRAIT

  const styles = StyleSheet.create({
    header: {
      marginBottom: 25,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
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
      paddingBottom: 10,
      marginBottom: -1,
      zIndex: 100,
      borderColor: theme.colors.textGray,
    },
    tagsContainer: {
      marginBottom: 20,
    },
    tag: {
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: 14,
    },
    pressable: {
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

  const scrollRef = useRef() as React.MutableRefObject<ScrollView>;
  const scrollListRef = useRef() as React.MutableRefObject<ScrollView>;
  const scrollRefTab = useRef() as React.MutableRefObject<ScrollView>;

  const [refreshing] = useState(false);

  const [tagsState, setTags] = useState<any>({ values: [] })

  const tagsList = ordersGroup[currentTabSelected].defaultFilter ?? []
  const currentOrdersGroup = ordersGroup[currentTabSelected]

  const isEqual = (array1: any, array2: any) => {
    return array1.every((item: any) => array2.includes(item)) && array2.every((item: any) => array1.includes(item))
  }

  const handleLoadMore = () => {
    loadMoreOrders && loadMoreOrders();
  };

  const getOrderStatus = (key: number) => {
    return orderStatus.find((status: any) => status.key === key)?.text;
  };

  const handleTagSelected = (tag: any) => {
    const tags = tagsState?.values.includes(tag)
      ? tagsState?.values.filter((t: any) => t !== tag)
      : [...tagsState?.values, tag]

    setCurrentFilters(!tags.length ? tagsList : tags)
    setTags({ values: isEqual(tags, tagsList) ? [] : tags })

    setOrdersGroup({
      ...ordersGroup,
      [currentTabSelected]: {
        ...ordersGroup[currentTabSelected],
        currentFilter: !tags.length ? tagsList : tags
      }
    })
  }

  const handleAllSelect = () => {
    setCurrentFilters(tagsList)
    setTags({ values: [] })
    setOrdersGroup({
      ...ordersGroup,
      [currentTabSelected]: {
        ...ordersGroup[currentTabSelected],
        currentFilter: tagsList
      }
    })
  }

  const onSwipeLeft = () => {
    let currentTab = tabsList[currentTabSelected]
    currentTab = currentTab >= 4 ? null : currentTab + 1

    if (!currentTab) return

    const nextTab = tabsListText[currentTab]
    nextTab && setCurrentTabSelected(nextTab)
  }

  const onSwipeRight = () => {
    let currentTab = tabsList[currentTabSelected]
    currentTab = currentTab <= 1 ? null : currentTab - 1

    if (!currentTab) return

    const nextTab = tabsListText[currentTab]
    nextTab && setCurrentTabSelected(nextTab)
  }

  useEffect(() => {
    setCurrentFilters(null)
    scrollRefTab.current?.scrollTo({ animated: true });
    scrollListRef.current?.scrollTo({ animated: true });
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  }, [currentTabSelected])

  return (
    <>
      <View style={styles.header}>
        <OText style={styles.title}>{t('MY_ORDERS', 'My orders')}</OText>
        <FeatherIcon
          name='refresh-cw'
          color={theme.colors.backgroundDark}
          size={24}
          onPress={() => loadOrders && loadOrders({ newFetch: true })}
        />
      </View>

      <FiltersTab>
        <ScrollView
          ref={scrollRefTab}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          horizontal
          nestedScrollEnabled={true}
        >
          <TabsContainer width={WIDTH_SCREEN}>
            {tabs.map((tab: any) => (
              <Pressable
                key={tab.key}
                style={styles.pressable}
                onPress={() => setCurrentTabSelected(tab?.title)}>
                <OText
                  style={{
                    ...styles.tab,
                    fontSize: tab.title === currentTabSelected ? 16 : 14,
                    borderBottomWidth: tab.title === currentTabSelected ? 1 : 0,
                  }}
                  color={
                    tab.title === currentTabSelected
                      ? theme.colors.textGray
                      : theme.colors.unselectText
                  }
                  weight={tab.title === currentTabSelected ? '600' : 'normal'}
                >
                  {tab.text}
                </OText>
              </Pressable>
            ))}
          </TabsContainer>
        </ScrollView>
      </FiltersTab>

      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignContent: 'center',
          alignItems: 'center',
        }}
      >
        {tagsList && tagsList?.length > 1 && (
          <View style={{ marginBottom: 20 }}>
            <Tag
              onPress={() => handleAllSelect()}
              isSelected={
                isEqual(currentOrdersGroup.currentFilter, tagsList)
                  ? theme.colors.primary
                  : theme.colors.tabBar
              }>
              <OText
                style={styles.tag}
                color={
                  isEqual(currentOrdersGroup.currentFilter, tagsList)
                    ? theme.colors.white
                    : theme.colors.black
                }>
                {t('All', 'All')}
              </OText>
            </Tag>
          </View>
        )}
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tagsContainer}
          horizontal
        >
          {tagsList && tagsList.map((key: number) => (
            <Tag
              key={key}
              onPress={() => !currentOrdersGroup.loading && handleTagSelected(key)}
              isSelected={
                currentOrdersGroup.currentFilter.includes(key) &&
                !isEqual(currentOrdersGroup.currentFilter, tagsList)
                  ? theme.colors.primary
                  : theme.colors.tabBar
              }>
              <OText
                style={styles.tag}
                color={
                  currentOrdersGroup.currentFilter.includes(key) &&
                  !isEqual(currentOrdersGroup.currentFilter, tagsList)
                    ? theme.colors.white
                    : theme.colors.black
                }>
                {getOrderStatus(key)}
                {
                  currentOrdersGroup.currentFilter.includes(key) &&
                  !isEqual(currentOrdersGroup.currentFilter, tagsList) &&
                  ' X'
                }
              </OText>
            </Tag>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        ref={scrollListRef}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        nestedScrollEnabled={true}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadOrders && loadOrders({ newFetch: true })}
          />
        }
      >
        {!currentOrdersGroup.error?.length &&
          !!currentOrdersGroup.orders?.length &&
        (
          <PreviousOrders
            orders={currentOrdersGroup.orders}
            onNavigationRedirect={onNavigationRedirect}
            getOrderStatus={getOrderStatus}
          />
        )}

        {(currentOrdersGroup.loading ||
          currentOrdersGroup.pagination.total === null) &&
        (
          <>
            <View>
              {[...Array(5)].map((_, i) => (
                <Placeholder key={i} Animation={Fade}>
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      marginBottom: 10,
                    }}>
                    <PlaceholderLine
                      width={IS_PORTRAIT ? 22 : 11}
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

        {!currentOrdersGroup.error?.length &&
          !currentOrdersGroup.loading &&
          currentOrdersGroup.pagination.totalPages &&
          currentOrdersGroup.pagination.currentPage < currentOrdersGroup.pagination.totalPages &&
          currentOrdersGroup.orders.length &&
        (
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

        {!currentOrdersGroup.loading &&
          (currentOrdersGroup.error?.length ||
          !currentOrdersGroup.orders?.length) &&
        (
          <NotFoundSource
            content={
              !currentOrdersGroup.error?.length
                ? t('NO_RESULTS_FOUND', 'Sorry, no results found')
                : currentOrdersGroup?.error[0]?.message ||
                  currentOrdersGroup?.error[0] ||
                  t('NETWORK_ERROR', 'Network Error')
            }
            image={theme.images.general.notFound}
            conditioned={false}
          />
        )}
      </ScrollView>
    </>
  );
};

export const OrdersOption = (props: OrdersOptionParams) => {
  const [, t] = useLanguage();

  const ordersProps = {
    ...props,
    UIComponent: OrdersOptionUI,
    useDefualtSessionManager: true,
    asDashboard: true,
    orderStatus: [
      { key: 0, text: t('PENDING', 'Pending') },
      { key: 1, text: t('COMPLETED', 'Completed') },
      { key: 2, text: t('REJECTED', 'Rejected') },
      { key: 3, text: t('DRIVER_IN_BUSINESS', 'Driver in business') },
      { key: 4, text: t('READY_FOR_PICKUP', 'Ready for pickup') },
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
    ],
    tabs: [
      {
        key: 0,
        text: t('PENDING', 'Pending'),
        tags: [0, 13],
        title: 'pending'
      },
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
    ]
  };

  return <OrderListGroups {...ordersProps} />;
};
