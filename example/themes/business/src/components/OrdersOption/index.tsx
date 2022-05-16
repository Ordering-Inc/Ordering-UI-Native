import React, { useEffect, useState, useRef } from 'react';
import { View, Pressable, StyleSheet, ScrollView, RefreshControl, Linking, Platform, TextInput } from 'react-native';
import { useLanguage, useUtils, useToast, ToastType, OrderListGroups, useConfig } from 'ordering-components/native';
import SelectDropdown from 'react-native-select-dropdown'
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder';
import FeatherIcon from 'react-native-vector-icons/Feather';
import FontistoIcon from 'react-native-vector-icons/Fontisto'
import { useTheme } from 'styled-components/native';
import { DeviceOrientationMethods } from '../../../../../src/hooks/DeviceOrientation'
import { NewOrderNotification } from '../NewOrderNotification';

import { OText, OButton, OModal, OIconButton, OInput, OIcon } from '../shared';
import { NotFoundSource } from '../NotFoundSource';
import {
  FiltersTab,
  TabsContainer,
  Tag,
  IconWrapper,
  ModalContainer,
  ModalTitle,
  FilterBtnWrapper,
  TabPressable,
  OrderStatus,
  SlaOption,
  SearchModalContent,
  SlaSettingModalContent,
  DeliveryStatusWrapper,
  VerticalLine,
  StatusItems,
  ItemHeader,
  ItemStatus,
  ItemContent,
  TimerInputWrapper,
  OverLine,
  Actions
} from './styles';
import { PreviousOrders } from '../PreviousOrders';
import { OrdersOptionParams } from '../../types';

import { TouchableOpacity } from 'react-native-gesture-handler';
import GestureRecognizer from 'react-native-swipe-gestures';
import ODropDown from '../shared/ODropDown';
import { OrdersOptionStatus } from '../OrdersOptionStatus'
import { OrdersOptionCity } from '../OrdersOptionCity';
import { OrdersOptionBusiness } from '../OrdersOptionBusiness';
import { OrdersOptionDelivery } from '../OrdersOptionDelivery';
import { OrdersOptionPaymethod } from '../OrdersOptionPaymethod';
import { OrdersOptionDriver } from '../OrdersOptionDriver';
import { OrdersOptionDate } from '../OrdersOptionDate';

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
    filtered,
    onFiltered,
    handleClickOrder,
    isBusinessApp,
    handleClickLogisticOrder,
    logisticOrders,
    loadLogisticOrders,
    isLogisticActivated
  } = props;

  const defaultSearchList = {
    id: '',
    state: '',
    city: '',
    business: '',
    delivery_type: '',
    paymethod: '',
    driver: '',
    timeStatus: '',
    date: {
      from: '',
      to: '',
      type: ''
    }
  }

  const theme = useTheme();
  const [, t] = useLanguage();
  const [{ parseDate }] = useUtils()
  const [configState] = useConfig()
  const [orientationState] = useDeviceOrientation();
  const [, { showToast }] = useToast();
  const [openSearchModal, setOpenSearchModal] = useState(false)
  const [openSLASettingModal, setOpenSLASettingModal] = useState(false)
  const [slaSettingTime, setSlaSettingTime] = useState(6000)
  const [currentDeliveryType, setCurrentDeliveryType] = useState('Delivery')
  const [search, setSearch] = useState(defaultSearchList)
  const [selectedTabStatus, setSelectedTabStatus] = useState([])
  const [hour, setHour] = useState(0)
  const [minute, setMinute] = useState(0)

  const WIDTH_SCREEN = orientationState?.dimensions?.width
  const HEIGHT_SCREEN = orientationState?.dimensions?.height
  const IS_PORTRAIT = orientationState.orientation === PORTRAIT

  const preorderTypeList = [
    { key: null, name: t('SLA', 'SLA\'s') },
    { key: 'in_time', name: t('OK', 'Ok') },
    { key: 'at_risk', name: t('AT_RISK', 'At Risk') },
    { key: 'delayed', name: t('DELAYED', 'Delayed') }
  ]

  const defaultOrderTypes = [
    { key: 1, name: t('DELIVERY', 'Delivery') },
    { key: 2, name: t('PICKUP', 'Pickup') },
    { key: 3, name: t('EAT_IN', 'Eat in') },
    { key: 4, name: t('CURBSIDE', 'Curbside') },
    { key: 5, name: t('DRIVE_THRU', 'Drive thru') }
  ]

  const deliveryStatus = [
    {
      key: t('OK', 'Ok'),
      des: t('DELIVERY_OK_STATUS_DESC', 'Get delivery time from the businesses.'),
      timmer: false,
      icon: theme.images.general?.clock1,
      backColor: '#00D27A'
    },
    {
      key: t('AT_RISK', 'At risk'),
      des: t('DELIVERY_ATRISK_STATUS_DESC', 'Is the time between delivery time of busines and the delayed time.'),
      timmer: false,
      icon: theme.images.general?.clockRisk,
      backColor: '#FFC700'
    },
    {
      key: t('DELAYED', 'Delayed'),
      des: t('DELIVERY_DELAYED_STATUS_DESC', 'If this time is exceeded, the order will be delayed.'),
      timmer: true,
      icon: theme.images.general?.clockDelayed,
      backColor: '#E63757'
    }
  ]

  const styles = StyleSheet.create({
    header: {
      marginBottom: isBusinessApp ? 10 : 20,
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
      textTransform: 'capitalize'
    },
    icon: {
      paddingBottom: 10,
      zIndex: 100,
      marginBottom: 5,
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
    inputStyle: {
      width: '100%',
      borderWidth: 1,
      borderColor: '#DEE2E6',
      borderRadius: 7.6,
      marginBottom: 24
    },
    SLAwrapper: {
      flexDirection: 'row',
      marginBottom: 15
    },
    selectOption: {
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: 40,
      width: '100%',
      paddingHorizontal: 15,
      backgroundColor: theme.colors.inputChat,
      borderRadius: 7.6,
    },
    buttonTextStyle: {
      textAlign: 'left',
      marginHorizontal: 0,
      fontSize: 16,
      lineHeight: 24,
      color: '#748194'
    },
    dropdownStyle: {
      borderWidth: 1,
      borderRadius: 8,
      paddingTop: 5,
      backgroundColor: '#fff',
      borderColor: theme.colors.lightGray,
      overflow: 'hidden',
      minHeight: 155
    },
    rowStyle: {
      display: 'flex',
      borderBottomWidth: 0,
      height: 36,
      alignItems: 'center',
      paddingHorizontal: 10
    },
    acceptButtonStyle: {
      borderRadius: 7.6,
      width: 130,
      height: 42,
    },
    errorMessage: {
      marginBottom: 10,
      color: theme.colors.error,
    }
  });

  const scrollRef = useRef() as React.MutableRefObject<ScrollView>;
  const scrollListRef = useRef() as React.MutableRefObject<ScrollView>;
  const scrollRefTab = useRef() as React.MutableRefObject<ScrollView>;

  const [refreshing] = useState(false);

  const [tagsState, setTags] = useState<any>({ values: [] })

  const tagsList = ordersGroup[currentTabSelected]?.defaultFilter ?? []
  const currentOrdersGroup = ordersGroup[currentTabSelected]

  const isEqual = (array1: any, array2: any) => {
    return array1?.every((item: any) => array2.includes(item)) && array2?.every((item: any) => array1.includes(item))
  }

  const handleLoadMore = () => {
    loadMoreOrders && loadMoreOrders();
  };

  const getOrderStatus = (key: number) => {
    return orderStatus.find((status: any) => status?.key === key)?.text;
  };

  const applyFilters = () => {
    setOrdersGroup({
      ...ordersGroup,
      [currentTabSelected]: {
        ...ordersGroup[currentTabSelected],
        orders: []
      }
    })
    const dateRange = calculateDate(search.date.type, search.date.from, search.date.to)
    onFiltered && onFiltered({ ...search, date: { ...dateRange } })
    setOpenSearchModal(false)
  }

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

  const calculateDate = (type: any, from: any, to: any) => {
    switch (type) {
      case 'today':
        const date = parseDate(new Date(), { outputFormat: 'MM/DD/YYYY' })
        return { from: `${date} 00:00:00`, to: `${date} 23:59:59` }
      case 'yesterday':
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const start1 = parseDate(yesterday, { outputFormat: 'MM/DD/YYYY' })
        const end1 = parseDate(new Date(), { outputFormat: 'MM/DD/YYYY' })
        return { from: `${start1} 00:00:00`, to: `${end1} 23:59:59` }
      case 'last_7days':
        const last_7days = new Date()
        last_7days.setDate(last_7days.getDate() - 6)
        const start7 = parseDate(last_7days, { outputFormat: 'MM/DD/YYYY' })
        const end7 = parseDate(new Date(), { outputFormat: 'MM/DD/YYYY' })
        return { from: `${start7} 00:00:00`, to: `${end7} 23:59:59` }
      case 'last_30days':
        const last_30days = new Date()
        last_30days.setDate(last_30days.getDate() - 29)
        const start30 = parseDate(last_30days, { outputFormat: 'MM/DD/YYYY' })
        const end30 = parseDate(new Date(), { outputFormat: 'MM/DD/YYYY' })
        return { from: `${start30} 00:00:00`, to: `${end30} 23:59:59` }
      default:
        const start = from ? `${parseDate(from, { outputFormat: 'MM/DD/YYYY' })} 00:00:00` : ''
        const end = to ? `${parseDate(to, { outputFormat: 'MM/DD/YYYY' })} 23:59:59` : ''
        return { from: start, to: end }
    }
  }

  const onClickSetting = () => {
    setOpenSLASettingModal(true)
  }

  const handleClose = () => {
    setOpenSearchModal(false)
    setOpenSLASettingModal(false)
  }

  useEffect(() => {
    setCurrentFilters(null)
    onFiltered && onFiltered(null)
    setSearch(defaultSearchList)
    scrollRefTab.current?.scrollTo({ animated: true });
    scrollListRef.current?.scrollTo({ animated: true });
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  }, [currentTabSelected])

  useEffect(() => {
    setSelectedTabStatus(deliveryStatus)
  }, [])

  return (
    // <GestureRecognizer
    //   onSwipeLeft={onSwipeLeft}
    //   onSwipeRight={onSwipeRight}
    //   config={swipeConfig}
    //   style={{ flex: 1 }}
    // >
    <>
      <View style={styles.header}>
        <OText style={styles.title}>{t('MY_ORDERS', 'My orders')}</OText>
        <IconWrapper>
          <FeatherIcon
            name='refresh-cw'
            color={theme.colors.backgroundDark}
            size={24}
            onPress={() => { currentTabSelected === 'logisticOrders' ? loadLogisticOrders() : loadOrders && loadOrders({ newFetch: true }) }}
            style={{ marginRight: 20 }}
          />
          <FontistoIcon
            name='search'
            color={theme.colors.backgroundDark}
            size={24}
            onPress={() => setOpenSearchModal(true)}
          />
        </IconWrapper>
      </View>
      {configState?.configs?.order_deadlines_enabled?.value === '1' && (
        <View style={styles.SLAwrapper}>
          <View style={{ flex: 0.5 }}>
            <OButton
              text={t('SLA_SETTING', 'SLA’s Settings')}
              textStyle={{ color: theme.colors.backArrow }}
              imgRightSrc={null}
              style={{
                backgroundColor: theme.colors.inputChat,
                borderRadius: 7.6,
                zIndex: 10,
                borderWidth: 0,
                minHeight: 40
              }}
              onClick={onClickSetting}
            />
          </View>
          <View style={{ width: 10, height: '100%' }} />
          <View style={{ flex: 0.5, justifyContent: 'center' }}>
            <SelectDropdown
              defaultButtonText={t('SLA', 'SLA\'s')}
              data={preorderTypeList}
              onSelect={(selectedItem, index) => {
                onFiltered && onFiltered({ ...search, timeStatus: selectedItem?.key })
              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem.name
              }}
              rowTextForSelection={(item, index) => {
                return item.key
              }}
              buttonStyle={styles.selectOption}
              buttonTextStyle={styles.buttonTextStyle}
              renderDropdownIcon={isOpened => {
                return <FeatherIcon name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#444'} size={18} />;
              }}
              dropdownStyle={styles.dropdownStyle}
              dropdownOverlayColor='transparent'
              rowStyle={styles.rowStyle}
              renderCustomizedRowChild={(item, index) => {
                return (
                  <SlaOption>
                    {index !== 0 && <OrderStatus timeState={item?.key} />}
                    <View><OText size={14} color={'#748194'} >{item?.name}</OText></View>
                  </SlaOption>
                );
              }}
            />
          </View>
        </View>
      )}
      <FiltersTab>
        <ScrollView
          ref={scrollRefTab}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          horizontal
          nestedScrollEnabled={true}
        >
          <TabsContainer>
            {(isLogisticActivated && !isBusinessApp) && (
              <Pressable
                style={styles.pressable}
                onPress={() => setCurrentTabSelected('logisticOrders')}>
                <OIcon
                  src={theme.images?.general?.chronometer}
                  borderBottomWidth={currentTabSelected === 'logisticOrders' ? 1 : 0}
                  width={currentTabSelected === 'logisticOrders' ? 26 : 24}
                  height={currentTabSelected === 'logisticOrders' ? 26 : 24}
                  color={
                    currentTabSelected === 'logisticOrders'
                      ? theme.colors.textGray
                      : theme.colors.unselectText
                  }
                  style={styles.icon}
                />
              </Pressable>
            )}
            {tabs.map((tab: any) => (
              <TabPressable
                key={tab.key}
                onPress={() => setCurrentTabSelected(tab?.title)}
                isSelected={tab.title === currentTabSelected ? 1 : 0}
              >
                <OText
                  style={{
                    ...styles.tab,
                    fontSize: tab.title === currentTabSelected ? 16 : 14,
                    borderBottomWidth: Platform.OS === 'ios' && tab.title === currentTabSelected ? 1 : 0,
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
              </TabPressable>
            ))}
          </TabsContainer>
        </ScrollView>
      </FiltersTab>
      <View style={{ flex: 1, minHeight: HEIGHT_SCREEN - 450 }}>
        {currentTabSelected !== 'logisticOrders' && (
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
        )}
        <ScrollView
          ref={scrollListRef}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
          nestedScrollEnabled={true}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => { currentTabSelected === 'logisticOrders' ? loadLogisticOrders() : loadOrders && loadOrders({ newFetch: true }) }}
            />
          }
        >
          {!currentOrdersGroup?.error?.length &&
            currentOrdersGroup?.orders?.length > 0 &&
            currentTabSelected !== 'logisticOrders' &&
            (
              <PreviousOrders
                orders={currentOrdersGroup?.orders}
                onNavigationRedirect={onNavigationRedirect}
                getOrderStatus={getOrderStatus}
                handleClickOrder={handleClickOrder}
                slaSettingTime={slaSettingTime}
                currentTabSelected={currentTabSelected}
              />
            )}
          {!logisticOrders?.error?.length &&
            logisticOrders?.orders?.length > 0 &&
            currentTabSelected === 'logisticOrders' && (
              <PreviousOrders
                orders={logisticOrders?.orders?.filter((order: any) => !order?.expired).map((order: any) => ({ ...order, isLogistic: true }))}
                onNavigationRedirect={onNavigationRedirect}
                getOrderStatus={getOrderStatus}
                handleClickLogisticOrder={handleClickLogisticOrder}
                isLogisticOrder
              />
            )
          }
          {((currentOrdersGroup?.loading ||
            currentOrdersGroup?.pagination?.total === null) ||
            (logisticOrders?.loading)) &&
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

          {!currentOrdersGroup?.error?.length &&
            !currentOrdersGroup?.loading &&
            currentOrdersGroup?.pagination?.totalPages &&
            currentOrdersGroup?.pagination?.currentPage < currentOrdersGroup?.pagination?.totalPages &&
            currentOrdersGroup?.orders?.length > 0 &&
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

          {((!currentOrdersGroup?.loading &&
            (currentOrdersGroup?.error?.length ||
              currentOrdersGroup?.orders?.length === 0)) ||
            (currentTabSelected === 'logisticOrders' &&
              (logisticOrders?.error?.length > 0 || logisticOrders?.orders?.length === 0 || !logisticOrders?.orders?.some(order => !order?.expired)))
          ) &&
            (
              <NotFoundSource
                content={
                  ((currentTabSelected !== 'logisticOrders' && !currentOrdersGroup?.error?.length) ||
                    (currentTabSelected === 'logisticOrders' && (!logisticOrders?.error?.length || (logisticOrders?.orders?.length > 0 && !logisticOrders?.orders?.some(order => !order?.expired)))))
                    ? t('NO_RESULTS_FOUND', 'Sorry, no results found')
                    : currentOrdersGroup?.error?.[0]?.message ||
                    currentOrdersGroup?.error?.[0] ||
                    (currentTabSelected === 'logisticOrders' && logisticOrders?.error) ||
                    t('NETWORK_ERROR', 'Network Error')
                }
                image={theme.images.general.notFound}
                conditioned={false}
              />
            )}
        </ScrollView>
      </View>
      {/* </GestureRecognizer> */}

      <NewOrderNotification />
      {(openSearchModal || openSLASettingModal) && (
        <OModal open={openSearchModal || openSLASettingModal} entireModal customClose>
          <ModalContainer
            nestedScrollEnabled={true}
          >
            <OIconButton
              icon={theme.images.general.arrow_left}
              borderColor={theme.colors.clear}
              iconColor={theme.colors.backArrow}
              iconStyle={{ width: 20, height: 13 }}
              style={{
                maxWidth: 40,
                height: 35,
                justifyContent: 'flex-end',
                marginBottom: 30,
                marginTop: 30
              }}
              onClick={() => handleClose()}
            />
            {openSearchModal && (
              <SearchModalContent>
                <ModalTitle>{t('SEARCH_ORDERS', 'Search orders')}</ModalTitle>
                <OInput
                  value={search.id}
                  onChange={(value: any) => setSearch({ ...search, id: value })}
                  style={styles.inputStyle}
                  placeholder={t('ORDER_NUMBER', 'Order number')}
                  autoCorrect={false}
                />
                <OrdersOptionDate
                  {...props}
                  search={search}
                  onSearch={setSearch}
                />
                <OrdersOptionCity
                  {...props}
                  search={search}
                  onSearch={setSearch}
                />
                {isBusinessApp && (
                  <>
                    <OrdersOptionBusiness
                      {...props}
                      search={search}
                      onSearch={setSearch}
                    />
                    <OrdersOptionDelivery
                      {...props}
                      search={search}
                      onSearch={setSearch}
                    />
                    <OrdersOptionDriver
                      {...props}
                      search={search}
                      onSearch={setSearch}
                    />
                    <OrdersOptionPaymethod
                      {...props}
                      search={search}
                      onSearch={setSearch}
                    />
                  </>
                )}
                <OButton
                  text={t('SEARCH', 'Search')}
                  textStyle={{ color: theme.colors.white }}
                  imgRightSrc={null}
                  style={{
                    borderRadius: 7.6,
                    marginBottom: 70,
                    marginTop: 60,
                    zIndex: 12
                  }}
                  onClick={applyFilters}
                />

              </SearchModalContent>
            )}
            {openSLASettingModal && (
              <SlaSettingModalContent>
                <ModalTitle>{t('SLA_SETTINGS', 'SLA’s Settings')}</ModalTitle>
                <FiltersTab>
                  <ScrollView
                    ref={scrollRefTab}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    nestedScrollEnabled={true}
                  >
                    <TabsContainer>
                      {defaultOrderTypes && defaultOrderTypes.map(tab => (
                        <TabPressable
                          key={tab.key}
                          onPress={() => setCurrentDeliveryType(tab?.name)}
                          isSelected={tab.name.toUpperCase() === currentDeliveryType.toUpperCase() ? 1 : 0}
                        >
                          <OText
                            style={{
                              ...styles.tab,
                              fontSize: tab.name.toUpperCase() === currentDeliveryType.toUpperCase() ? 14 : 12,
                              borderBottomWidth: Platform.OS === 'ios' && tab.name.toUpperCase() === currentDeliveryType.toUpperCase() ? 1 : 0,
                            }}
                            color={
                              tab.name.toUpperCase() === currentDeliveryType.toUpperCase()
                                ? theme.colors.textGray
                                : theme.colors.unselectText
                            }
                            weight={tab.name.toUpperCase() === currentDeliveryType ? '600' : 'normal'}
                          >
                            {tab.name}
                          </OText>
                        </TabPressable>
                      ))}
                    </TabsContainer>
                  </ScrollView>
                </FiltersTab>
                <DeliveryStatusWrapper>
                  {selectedTabStatus && selectedTabStatus.length > 0 && selectedTabStatus.map((item, i) => (
                    <StatusBlock
                      key={i}
                      item={item}
                      last={i + 1 === selectedTabStatus.length}
                    />
                  ))}
                  <VerticalLine />
                </DeliveryStatusWrapper>
              </SlaSettingModalContent>
            )}
          </ModalContainer>
        </OModal>
      )}
    </>
  );
};

export const StatusBlock = (props: any) => {
  const { item, last } = props
  const [showTime, setShowTime] = useState(false)

  useEffect(() => {
    if (last) {
      setShowTime(true)
    }
  }, [last])

  return (
    <StatusItems>
      <Pressable style={{ marginBottom: 10 }}>
        <ItemHeader>
          <IconWrapper>
            <OIcon
              src={item?.icon}
              width={16}
              height={16}
              color={item?.backColor}
            />
          </IconWrapper>
          <ItemStatus backColor={item?.backColor} />
          <OText>{item?.key}</OText>
        </ItemHeader>
      </Pressable>
      <ItemContent>
        <OText>{item?.des}</OText>
      </ItemContent>
      {showTime && (
        <Timer />
      )}
      {last && (
        <OverLine />
      )}
    </StatusItems>
  )
}

export const Timer = () => {
  const [, t] = useLanguage()
  const theme = useTheme()
  const [{ configs }] = useConfig();

  const styles = StyleSheet.create({
    settingTime: {
      fontSize: 14,
      borderWidth: 1,
      borderRadius: 7.6,
      margin: 0,
      marginRight: 10,
      paddingHorizontal: 10,
      paddingTop: 5,
      borderColor: theme.colors.disabled
    }
  })

  return (
    <TimerInputWrapper>
      <OText style={styles.settingTime} color={theme.colors.disabled}>{configs?.order_deadlines_delayed_time?.value}</OText>
      <OText>{t('MIN', 'min')}</OText>
    </TimerInputWrapper>
  )
}

export const OrdersOption = (props: OrdersOptionParams) => {
  const [, t] = useLanguage();
  const [configState] = useConfig()
  const theme = useTheme()
  const ordersProps = {
    ...props,
    UIComponent: OrdersOptionUI,
    useDefualtSessionManager: true,
    asDashboard: true,
    isIos: Platform.OS === 'ios',
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
      {
        key: 22,
        text: t('ORDER_LOOKING_FOR_DRIVER', 'Looking for driver')
      },
      {
        key: 23,
        text: t('ORDER_DRIVER_ON_WAY', 'Driver on way')
      }
    ],
    tabs: [
      {
        key: 0,
        text: t('PENDING', 'Pending'),
        tags: props?.orderGroupStatusCustom?.pending ?? [0, 13],
        title: 'pending'
      },
      {
        key: 1,
        text: t('IN_PROGRESS', 'In Progress'),
        tags: props?.orderGroupStatusCustom?.inProgress ?? [3, 4, 7, 8, 9, 14, 18, 19, 20, 21, 22, 23],
        title: 'inProgress',
      },
      {
        key: 2,
        text: t('COMPLETED', 'Completed'),
        tags: props?.orderGroupStatusCustom?.completed ?? [1, 11, 15],
        title: 'completed',
      },
      {
        key: 3,
        text: t('CANCELLED', 'Cancelled'),
        tags: props?.orderGroupStatusCustom?.cancelled ?? [2, 5, 6, 10, 12, 16, 17],
        title: 'cancelled',
      },
    ]
  };

  return <OrderListGroups {...ordersProps} />;
};
