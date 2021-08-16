import React, { useState, useEffect } from 'react';
import { View, Pressable, StyleSheet, Dimensions } from 'react-native';
import { OrderList, useLanguage } from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder';
import { OText, OButton } from '../shared';
import { NotFoundSource } from '../NotFoundSource';
import { PreviousMessages } from '../PreviousMessages';
import { FiltersTab, TabsContainer, TagsContainer, Tag } from './styles';
import { MessagesOptionParams } from '../../types';

const MessagesOptionUI = (props: MessagesOptionParams) => {
  const {
    activeOrders,
    orderList,
    pagination,
    customArray,
    messages,
    setMessages,
    loadMoreOrders,
    loadMessages,
    onNavigationRedirect,
    setSortBy,
  } = props;

  const theme = useTheme();
  const [, t] = useLanguage();

  const { loading, error, orders: values } = orderList;

  const orders = customArray || values || [];

  const tabs = [
    { key: 0, text: t('ORDERS', 'Orders'), tags: [0, 1] },
    // { key: 1, text: t('CONTACTS', 'Contacts'), tags: [2, 3, 4] },
  ];

  const tags = [
    {
      key: 0,
      text: t('NEWEST', 'Newest'),
      sortBy: { param: 'last_direct_message_at', direction: 'asc' },
    },
    {
      key: 1,
      text: t('ORDER_NUMBER', 'Order number'),
      sortBy: { param: 'id', direction: 'desc' },
    },
    { key: 2, text: t('DRIVERS', 'Drivers') },
    { key: 3, text: t('BUSINESS', 'Business') },
    { key: 4, text: t('CUSTOMERS', 'Customers') },
  ];

  const [tabsFilter, setTabsFilter] = useState(tabs[0].tags);
  const [activeTag, setActiveTag] = useState(tags[0].key);
  const [reload, setReload] = useState(false);

  const [orientation, setOrientation] = useState(
    Dimensions.get('window').width < Dimensions.get('window').height
      ? 'Portrait'
      : 'Landscape',
  );

  const getTagFilter = (key: number) => {
    return tags.find(value => value.key === key)?.text;
  };

  const handleChangeTab = (tags: number[]) => {
    setTabsFilter(tags);

    const key = tags[0];
    setActiveTag(key);

    if (tabs[0].tags.includes(key)) {
      setSortBy({ param: 'last_direct_message_at', direction: 'asc' });
      setReload(true);
    }
  };

  const handleChangeTag = (key: number) => {
    if (activeTag !== key) {
      const tag = tags.find(tag => tag.key === key);
      setActiveTag(key);

      if (tabs[0].tags.includes(key)) {
        setSortBy(tag?.sortBy);
        setReload(true);
      }
    }
  };

  useEffect(() => {
    if (reload && !loading) {
      setReload(!reload);
    }
  }, [loading]);

  Dimensions.addEventListener('change', ({ window: { width, height } }) => {
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
      fontWeight: '600',
      fontSize: 14,
      marginBottom: 10,
    },
    tagsContainer: {
      alignItems: 'center',
    },
    tag: {
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: 14,
    },
    pressable: {
      flex: 0.5,
      alignItems: 'center',
    },
    loadButton: {
      borderRadius: 7.6,
      height: 44,
      marginBottom: 40,
      marginTop: 5,
    },
    loadButtonText: {
      color: theme.colors.white,
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: 18,
    },
  });

  return (
    <>
      <View style={styles.header}>
        <OText style={styles.title}>{t('MESSAGES', 'Messages')}</OText>
      </View>

      <FiltersTab>
        <TabsContainer>
          {tabs.map((tab: any) => (
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
                {tab.text +
                  ` (${
                    tab.key === 0
                      ? orders?.reduce(
                          (total: number, order: any) =>
                            total + order.unread_count,
                          0,
                        )
                      : 0
                  })`}
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
        <TagsContainer
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tagsContainer}
          horizontal>
          {tabsFilter.map((key: number) => (
            <Tag
              key={key}
              onPress={() => handleChangeTag(key)}
              isSelected={
                activeTag === key ? theme.colors.primary : theme.colors.tabBar
              }>
              <OText
                style={styles.tag}
                color={
                  activeTag === key ? theme.colors.white : theme.colors.black
                }>
                {getTagFilter(key)}
              </OText>
            </Tag>
          ))}
        </TagsContainer>
      </View>

      {!loading && orders.length === 0 && (
        <NotFoundSource
          content={t('NO_RESULTS_FOUND', 'Sorry, no results found')}
          image={theme.images.general.notFound}
          conditioned={false}
        />
      )}

      {!reload && !error && orders.length > 0 && (
        <PreviousMessages
          orders={values}
          messages={messages}
          setMessages={setMessages}
          loadMessages={loadMessages}
          onNavigationRedirect={onNavigationRedirect}
        />
      )}

      {(loading || reload) && (
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

      {pagination?.totalPages &&
        !loading &&
        !reload &&
        pagination?.currentPage < pagination?.totalPages && (
          <OButton
            onClick={loadMoreOrders}
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

export const MessagesOption = (props: MessagesOptionParams) => {
  const MyOrdersProps = {
    ...props,
    asDashboard: true,
    orderStatus: props.activeOrders
      ? [
          0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
          20, 21,
        ]
      : [
          0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
          20, 21,
        ],
    useDefualtSessionManager: true,
    paginationSettings: {
      initialPage: 1,
      pageSize: 6,
      controlType: 'infinity',
    },
    orderBy: 'last_direct_message_at',
    orderDirection: 'asc',
    UIComponent: MessagesOptionUI,
  };

  return <OrderList {...MyOrdersProps} />;
};
