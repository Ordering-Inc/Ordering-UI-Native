import React, { useState, useEffect } from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Contacts, useLanguage } from 'ordering-components/native';
import { useTheme } from 'styled-components/native';
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder';
import { OText, OButton } from '../shared';
import { NotFoundSource } from '../NotFoundSource';
import { PreviousMessages } from '../PreviousMessages';
// import { Contacts } from '../Contacts';
import { FiltersTab, TabsContainer, TagsContainer, Tag } from './styles';
import { MessagesOptionParams } from '../../types';
import {useDeviceOrientation} from '../../../../../src/hooks/DeviceOrientation'
const MessagesOptionUI = (props: MessagesOptionParams) => {
  const {
    orders,
    setOrders,
    loadMore,
    pagination,
    messages,
    onNavigationRedirect,
    setSortBy,
  } = props;

  const theme = useTheme();
  const [, t] = useLanguage();

  const { loading, error, data: values } = orders;
  const [{dimensions}] = useDeviceOrientation()
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
    { key: 2, text: t('BUSINESSES', 'Businesses') },
    { key: 3, text: t('CUSTOMERS', 'Customers') },
    { key: 4, text: t('DRIVERS', 'Drivers') },
  ];

  const [tabsFilter, setTabsFilter] = useState(tabs[0].tags);
  const [activeTag, setActiveTag] = useState(tags[0].key);
  const [reload, setReload] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(
    values?.reduce(
      (total: number, order: any) => total + order.unread_count,
      0,
    ),
  );

  const [orientation, setOrientation] = useState(
    Dimensions.get('window').width < Dimensions.get('window').height
      ? 'Portrait'
      : 'Landscape',
  );

  const getTagFilter = (key: number) => {
    return tags.find(value => value.key === key)?.text;
  };

  const handleChangeTab = (tags: number[]) => {
    const key = tags[0];

    setTabsFilter(tags);
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

  useEffect(() => {
    setUnreadMessages(
      values?.reduce(
        (total: number, order: any) => total + order.unread_count,
        0,
      ),
    );
  }, [orders]);

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
      fontSize: 16,
      paddingBottom: 5,
      marginBottom: -1,
      zIndex: 100,
      borderColor: theme.colors.textGray
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
        <TabsContainer width={dimensions.width - 42}>
          {tabs.map((tab: any) => (
            <Pressable
              key={tab.key}
              style={{
                ...styles.tab,
                borderBottomWidth: 1
              }}
              onPress={() => handleChangeTab(tab.tags)}>
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
                {` ${tab.key === 0 ? `(${unreadMessages || 0})` : ''}`}
              </OText>
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

      {!loading && (values.length === 0 || error) && (
        <NotFoundSource
          content={
            !error
              ? t('NO_RESULTS_FOUND', 'Sorry, no results found')
              : error[0]?.message ||
                error[0] ||
                t('NETWORK_ERROR', 'Network Error')
          }
          image={theme.images.general.notFound}
          conditioned={false}
        />
      )}

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        {!reload &&
          !error &&
          values.length > 0 &&
          JSON.stringify(tabsFilter) === JSON.stringify(tabs[0].tags) && (
            <PreviousMessages
              orders={values}
              setOrders={setOrders}
              messages={messages}
              onNavigationRedirect={onNavigationRedirect}
            />
          )}

        {/* {!reload &&
        !error &&
        orders.length > 0 &&
        JSON.stringify(tabsFilter) === JSON.stringify(tabs[1].tags) && (
          <Contacts
            orders={values}
            activeTag={activeTag}
            messages={messages}
            setMessages={setMessages}
            loadMessages={loadMessages}
            onNavigationRedirect={onNavigationRedirect}
          />
        )} */}

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
          JSON.stringify(tabsFilter) === JSON.stringify(tabs[0].tags) &&
          pagination?.currentPage < pagination?.totalPages && (
            <OButton
              onClick={() => loadMore && loadMore()}
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

export const MessagesOption = (props: MessagesOptionParams) => {
  const MyOrdersProps = {
    ...props,
    UIComponent: MessagesOptionUI,
  };

  return <Contacts {...MyOrdersProps} />;
};
