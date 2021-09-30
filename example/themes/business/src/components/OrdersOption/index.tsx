// React & React Native
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  ScrollView,
  Dimensions,
  RefreshControl,
} from 'react-native';

// Ordering
import { useLanguage, CumulativeOrders } from 'ordering-components/native';
import { useTheme } from 'styled-components/native';

// Third-party
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder';

// Own
import { FiltersTab, TabsContainer, Tag } from './styles';
import { PreviousOrders } from '../PreviousOrders';
import { OText, OIconButton } from '../shared';
import { OrdersOptionParams } from '../../types';

// Interfaces
interface Tab {
  key: number;
  text: any;
  tags: number[];
  title: string;
}

const OrdersOptionUI = (props: OrdersOptionParams) => {
  const {
    pending,
    inProgress,
    completed,
    cancelled,
    loadOrders,
    onNavigationRedirect,
  } = props;

  // Hooks
  const theme = useTheme();
  const [, t] = useLanguage();

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

  // Refs
  const scrollRefTag = useRef() as React.MutableRefObject<ScrollView>;
  const scrollRefTab = useRef() as React.MutableRefObject<ScrollView>;

  // States
  const [activeTab, setActiveTab] = useState<Tab>(tabs[0]);
  const [activeTags, setActiveTags] = useState<number[]>(
    tabs.reduce((total: any, tab: any) => total.concat(tab.tags), []),
  );
  const [tagsStatus, setTagsStatus] = useState<number[]>(tabs[0].tags);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [reload, setReload] = useState<boolean>(false);
  const [orientation, setOrientation] = useState<string>(
    Dimensions.get('window').width < Dimensions.get('window').height
      ? 'Portrait'
      : 'Landscape',
  );
  const [windowsWidth, setWindowsWidth] = useState<number>(
    parseInt(parseFloat(String(Dimensions.get('window').width)).toFixed(0)),
  );

  // Handles
  const handleChangeTab = async (tab: Tab) => {
    if (tab.key === activeTab.key) {
      return;
    }

    if (tab.key === tabs[3].key) {
      scrollRefTab.current?.scrollToEnd({ animated: true });
    }

    if (tab.key === tabs[0].key) {
      scrollRefTab.current?.scrollTo({ animated: true });
    }

    scrollRefTag.current?.scrollTo({
      y: 0,
      animated: true,
    });

    setActiveTab(tab);
    setTagsStatus(tab.tags);
    loadOrders?.(tab.title, false);
  };

  const handleChangeTag = (key: number) => {
    if (activeTags.includes(key)) {
      setActiveTags(activeTags.filter((tag: number) => tag !== key));
    } else {
      setActiveTags(activeTags.concat(key));
    }
  };

  const handleRefreshAndReload = (loadType: string) => {
    if (loadType === 'refresh') {
      setIsRefreshing(true);
    } else {
      setReload(true);
    }

    loadOrders?.(activeTab.title, false, true);
  };

  const getOrderStatus = (key: number) => {
    return orderStatus.find(status => status.key === key)?.text;
  };

  // Events
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

  // Effects
  useEffect(() => {
    if (
      !pending?.loading ||
      !inProgress?.loading ||
      !completed?.loading ||
      !cancelled?.loading
    ) {
      setIsRefreshing(false);
      setReload(false);
    }
  }, [
    pending?.loading,
    inProgress?.loading,
    completed?.loading,
    cancelled?.loading,
  ]);

  // Styles
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

        <View style={styles.icons}>
          <OIconButton
            icon={theme.images.general.reload}
            borderColor={theme.colors.clear}
            iconStyle={{ width: 25, height: 25 }}
            style={{ maxWidth: 40, height: 35 }}
            onClick={() => handleRefreshAndReload('reload')}
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
                onPress={() => handleChangeTab(tab)}>
                <OText
                  style={styles.tab}
                  color={
                    tab.key === activeTab.key
                      ? theme.colors.textGray
                      : theme.colors.unselectText
                  }
                  weight={tab.key === activeTab.key ? '600' : 'normal'}>
                  {tab.text}
                </OText>

                <View
                  style={{
                    width: '100%',
                    borderBottomColor:
                      tab.key === activeTab.key
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
          ref={scrollRefTag}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tagsContainer}
          horizontal>
          {tagsStatus.map((key: number) => (
            <Tag
              key={key}
              onPress={() => handleChangeTag(key)}
              isSelected={
                activeTags.includes(key)
                  ? theme.colors.primary
                  : theme.colors.tabBar
              }>
              <OText
                style={styles.tag}
                color={
                  activeTags.includes(key)
                    ? theme.colors.white
                    : theme.colors.black
                }>
                {getOrderStatus(key)}
              </OText>
            </Tag>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => handleRefreshAndReload('refresh')}
          />
        }>
        {activeTab.key === tabs[0].key &&
          !(reload && pending?.loading) &&
          !pending?.error &&
          pending?.orders?.length > 0 && (
            <PreviousOrders
              data={pending}
              tab={tabs[0].title}
              loadOrders={loadOrders}
              isRefreshing={isRefreshing}
              tagsFilter={activeTags.filter((key: number) =>
                tagsStatus.includes(key),
              )}
              onNavigationRedirect={onNavigationRedirect}
              getOrderStatus={getOrderStatus}
            />
          )}

        {activeTab.key === tabs[1].key &&
          !(reload && inProgress?.loading) &&
          !inProgress?.error &&
          inProgress?.orders?.length > 0 && (
            <PreviousOrders
              data={inProgress}
              tab={tabs[1].title}
              loadOrders={loadOrders}
              isRefreshing={isRefreshing}
              tagsFilter={activeTags.filter((key: number) =>
                tagsStatus.includes(key),
              )}
              onNavigationRedirect={onNavigationRedirect}
              getOrderStatus={getOrderStatus}
            />
          )}

        {activeTab.key === tabs[2].key &&
          !(reload && completed?.loading) &&
          !completed?.error &&
          completed?.orders?.length > 0 && (
            <PreviousOrders
              data={completed}
              tab={tabs[2].title}
              loadOrders={loadOrders}
              isRefreshing={isRefreshing}
              tagsFilter={activeTags.filter((key: number) =>
                tagsStatus.includes(key),
              )}
              onNavigationRedirect={onNavigationRedirect}
              getOrderStatus={getOrderStatus}
            />
          )}

        {activeTab.key === tabs[3].key &&
          !(reload && cancelled?.loading) &&
          !cancelled?.error &&
          cancelled?.orders?.length > 0 && (
            <PreviousOrders
              data={cancelled}
              tab={tabs[3].title}
              loadOrders={loadOrders}
              isRefreshing={isRefreshing}
              tagsFilter={activeTags.filter((key: number) =>
                tagsStatus.includes(key),
              )}
              onNavigationRedirect={onNavigationRedirect}
              getOrderStatus={getOrderStatus}
            />
          )}

        {(pending?.loading ||
          inProgress?.loading ||
          completed?.loading ||
          cancelled?.loading ||
          reload) && (
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
      </ScrollView>
    </>
  );
};

export const OrdersOption = (props: OrdersOptionParams) => {
  const MyOrdersProps = {
    ...props,
    UIComponent: OrdersOptionUI,
  };

  return <CumulativeOrders {...MyOrdersProps} />;
};
