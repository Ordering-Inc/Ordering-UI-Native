import React, { useEffect, useState, useRef } from 'react';
import { View, Pressable, StyleSheet, ScrollView } from 'react-native';
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
    loadMoreOrders,
    setUpdateOtherStatus,
    loadOrders,
    onNavigationRedirect,
  } = props;

  const theme = useTheme();
  const scrollRef = useRef() as React.MutableRefObject<ScrollView>;
  const [, t] = useLanguage();

  const { loading, error, orders: values } = orderList;
  const [ordersToShow, setOrdersToShow] = useState([]);

  const orders = customArray || values || [];

  const tabs = [
    { key: 0, text: t('PENDING', 'Pending'), tags: [0, 13] },
    {
      key: 1,
      text: t('IN_PROGRESS', 'In Progress'),
      tags: [3, 4, 7, 8, 9, 14, 18, 19, 20, 21],
    },
    { key: 2, text: t('COMPLETED', 'Completed'), tags: [1, 11, 15] },
    {
      key: 3,
      text: t('CANCELLED', 'Cancelled'),
      tags: [2, 5, 6, 10, 12, 16, 17],
    },
  ];

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

  const [tabsFilter, setTabsFilter] = useState(tabs[0].tags);
  const [tagsToggle, setTagsToggle] = useState(tabs[0].tags);
  const [reload, setReload] = useState(false);

  const handleChangeTab = (tags: number[]) => {
    setTabsFilter(tags);
    setUpdateOtherStatus(tags);
    loadOrders && loadOrders(true, tags);
    setTagsToggle(tags);

    const ordersTab = values.filter((order: any) =>
      tags.some(tag => tag === order.status),
    );

    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });

    setOrdersToShow(ordersTab);
  };

  const handleChangeTag = (key: number) => {
    const isToRemove = tagsToggle.includes(key);

    if (isToRemove) {
      const updateTags = tagsToggle.filter(tabs => tabs !== key);
      setTagsToggle(updateTags);
      const updateOrdersToShow = values.filter((order: any) =>
        updateTags.some(tag => tag === order.status),
      );
      setOrdersToShow(updateOrdersToShow);
    }

    if (!isToRemove) {
      const updateTags = tagsToggle;
      updateTags.push(key);
      setTagsToggle(updateTags);
      const updateOrdersToShow = values.filter((order: any) =>
        updateTags.some(tag => tag === order.status),
      );
      setOrdersToShow(updateOrdersToShow);
    }
  };

  const handleReload = () => {
    setReload(true);
    loadOrders &&
      loadOrders(
        true,
        tabsFilter,
        pagination.pageSize * pagination.currentPage <= 50,
      );
  };

  const getOrderStatus = (key: number) => {
    return orderStatus.find(status => status.key === key)?.text;
  };

  useEffect(() => {
    const ordersTab = values?.filter((order: any) =>
      tagsToggle.some(tag => tag === order.status),
    );

    setOrdersToShow(ordersTab);
  }, [values]);

  useEffect(() => {
    if (reload && !loading) {
      setReload(!reload);
    }
  }, [loading]);

  const styles = StyleSheet.create({
    header: {
      marginBottom: 25,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    title: {
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 'bold',
      fontSize: 26,
      color: theme.colors.textGray,
    },
    icons: {
      flexDirection: 'row',
    },
    tab: {
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: 14,
      marginBottom: 10,
    },
    tagsContainer: {
      marginBottom: 25,
    },
    tag: {
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: 14,
    },
    pressable: {
      flex: 1,
      minWidth: 75,
      alignItems: 'center',
    },
    loadButton: {
      borderRadius: 7.6,
      height: 44,
      marginBottom: 40,
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

        <View style={styles.icons}>
          <OIconButton
            icon={theme.images.general.reload}
            borderColor={theme.colors.clear}
            iconStyle={{ width: 25, height: 25 }}
            style={{ maxWidth: 40, height: 35 }}
            onClick={handleReload}
          />

          {/* <OIconButton
            icon={theme.images.general.search}
            borderColor={theme.colors.clear}
            iconStyle={{ width: 25, height: 25 }}
            style={{ maxWidth: 40, height: 35 }}
            onClick={() => {}}
          /> */}
        </View>
      </View>

      <FiltersTab>
        <TabsContainer>
          {tabs.map(tab => (
            <Pressable
              key={tab.key}
              style={styles.pressable}
              onPress={() => handleChangeTab(tab.tags)}>
              <OText
                style={styles.tab}
                color={
                  JSON.stringify(tabsFilter) === JSON.stringify(tab.tags)
                    ? theme.colors.textGray
                    : theme.colors.unselectText
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
                }}></View>
            </Pressable>
          ))}
        </TabsContainer>
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
                tagsToggle.includes(key)
                  ? theme.colors.primary
                  : theme.colors.tabBar
              }>
              <OText
                style={styles.tag}
                color={
                  tagsToggle.includes(key)
                    ? theme.colors.white
                    : theme.colors.black
                }>
                {getOrderStatus(key)}
              </OText>
            </Tag>
          ))}
        </ScrollView>
      </View>

      {!loading && orders.length === 0 && (
        <NotFoundSource
          content={t('NO_RESULTS_FOUND', 'Sorry, no results found')}
          image={theme.images.general.notFound}
          conditioned={false}
        />
      )}

      {!reload && !error && orders.length > 0 && (
        <PreviousOrders
          orders={ordersToShow}
          onNavigationRedirect={onNavigationRedirect}
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
                    width={22}
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

      {pagination.totalPages &&
        pagination.currentPage < pagination.totalPages && (
          <OButton
            onClick={() => loadMoreOrders && loadMoreOrders(tabsFilter)}
            text={t('LOAD_MORE_ORDERS', 'Load more orders')}
            imgRightSrc={null}
            textStyle={styles.loadButtonText}
            style={styles.loadButton}
            bgColor={theme.colors.primary}
            borderColor={theme.colors.primary}
          />
        )}
    </>
  );
};

export const OrdersOption = (props: OrdersOptionParams) => {
  const MyOrdersProps = {
    ...props,
    asDashboard: true,
    orderStatus: props.activeOrders ? [0, 13] : [0, 13],
    useDefualtSessionManager: true,
    paginationSettings: {
      initialPage: 1,
      pageSize: 6,
      controlType: 'infinity',
    },

    UIComponent: OrdersOptionUI,
  };

  return <OrderList {...MyOrdersProps} />;
};
