
import * as React from 'react'
import { getOrderStatus } from '../../providers/Utilities';
import { ODropDown, OSegment, OText } from '../shared';

import OrderItem from '../order-item';
import { StackActions } from '@react-navigation/native';
import ApiProvider from '../../providers/ApiProvider';
import { HTTP_CONF, IMAGES, STATUS_GROUP, ORDER_STATUS, TIME_FORMAT } from '../../config/constants';
import { FlatList } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment';
import { FilterWrapper, Wrapper } from './styles';

const orderStatus = [
    [
        'Group',
        ...STATUS_GROUP.PENDINGS.map(i => getOrderStatus(i))
    ],      // pending
    [
        'Group', 
        ...STATUS_GROUP.INPROGRESSES.map(i => getOrderStatus(i))
    ],      // inprogress
    [
        'Group', 
        ...STATUS_GROUP.COMPLETES.map(i => getOrderStatus(i))
    ],     // completed
    [
        'Group', 
        ...STATUS_GROUP.CANCELES.map(i => getOrderStatus(i))
    ]   // canceled
];

const dateFilters = [ 'Today', 'Last Week', 'Older' ];

const INIT_PAGE = [
    {
        tabId: 0,
        text: 'Pending',
        image: IMAGES.pending,
        items: [],
        statusGroup: STATUS_GROUP.PENDINGS,
        options: { 
            query: {
                orderBy: '-id',
                page: 1,
                page_size: HTTP_CONF.PAGE_SIZE,
                where: [
                    { 
                        attribute: 'status', 
                        value: STATUS_GROUP.PENDINGS 
                    }
                ]
            }
        },
        loadMore: false,
        isFiltering: false
    },
    {
        tabId: 1,
        text: 'InProgress',
        image: IMAGES.inprogress,
        items: [],
        statusGroup: STATUS_GROUP.INPROGRESSES,
        options: { 
            query: {
                orderBy: '-id',
                page: 1,
                page_size: HTTP_CONF.PAGE_SIZE,
                where: [
                    { 
                        attribute: 'status', 
                        value: STATUS_GROUP.INPROGRESSES 
                    }
                ]
            }
        },
        loadMore: false,
        isFiltering: false
    },
    {
        tabId: 2,
        text: 'Completed',
        image: IMAGES.completed,
        items: [],
        statusGroup: STATUS_GROUP.COMPLETES,
        options: { 
            query: {
                orderBy: '-id',
                page: 1,
                page_size: HTTP_CONF.PAGE_SIZE,
                where: [
                    { 
                        attribute: 'status', 
                        value: STATUS_GROUP.COMPLETES 
                    }
                ]
            }
        },
        loadMore: false,
        isFiltering: false
    },
    {
        tabId: 3,
        text: 'Canceled',
        image: IMAGES.canceled,
        items: [],
        statusGroup: STATUS_GROUP.CANCELES,
        options: { 
            query: {
                orderBy: '-id',
                page: 1,
                page_size: HTTP_CONF.PAGE_SIZE,
                where: [
                    { 
                        attribute: 'status', 
                        value: STATUS_GROUP.CANCELES 
                    }
                ]
            }
        },
        loadMore: false,
        isFiltering: false
    }
];

interface Props {
    orders: Array<any>,
    isOnline: boolean,
    navigation: any
}

const OrderList = (props: Props) => {
    const api = new ApiProvider();

    var listRef = React.useRef<FlatList>(null);
    // Events -----------

    const [mPage, setPageData] = React.useState(INIT_PAGE);
    const [statusFilters, getFilterTypes] = React.useState(orderStatus[0]);
    const [curTab, onChangeStatus] = React.useState(mPage[0].tabId);
    const [online, updateOnline] = React.useState(props.isOnline);
    const [curOrders, onUpdateOrders] = React.useState([]);
    const [filteredStatusIdx, setFilteredStatusIdx] = React.useState(0);
    const [filteredDate, setFilteredDate] = React.useState({});
    const [is_refreshing, setRefreshing] = React.useState(false);
    const [is_loading, setLoading] = React.useState(false);
    const [curOrderStatus, onChangeCurStatus] = React.useState(ORDER_STATUS.GROUPED)

    React.useEffect(() => {
        getFilterTypes(orderStatus[curTab]);
        onChangeCurStatus(ORDER_STATUS.GROUPED);
        if (listRef.current) {
            listRef.current.scrollToOffset({animated: true, offset: 0})
        }
        if (mPage[curTab].items.length > 0 && !mPage[curTab].isFiltering) {
            onUpdateOrders(mPage[curTab].items);
        } else {
            mPage[curTab].isFiltering = false;
            setPageData(mPage);
            fetchingOrders();
        }
    },[curTab]);

    React.useEffect(() => {
        console.log(statusFilters);
    },[statusFilters])

    React.useEffect(() => {
        updateOnline(props.isOnline);
    },[props.isOnline]);

    React.useEffect(() => {
        console.log(curOrders.length);
    },[curOrders]);

    React.useEffect(() => {
        mPage[curTab].isFiltering = curOrderStatus != -1 ? true : false;
        setPageData(mPage);
        fetchingOrders();
    },[curOrderStatus])

    React.useEffect(() => {
        mPage[curTab].isFiltering = true;
        setPageData(mPage);
        fetchingOrders()
    },[filteredDate]);

    React.useEffect(() => {
        _loadMore()
    },[])

    const onFilterByStatus = (index: number) => {
        setFilteredStatusIdx(index);
        const curStatus = index == 0 ? ORDER_STATUS.GROUPED : mPage[curTab].statusGroup[index - 1];
        onChangeCurStatus(curStatus);
    }

    const onFilterByDate = (index: number) => {
        let query = {
                attribute: 'delivery_datetime',
                value: {
                    condition: '<=',
                    value: moment().format(TIME_FORMAT)
                }
            }
        if (index == 0) {
            query.value = {
                condition: '=',
                value: moment().format(TIME_FORMAT)
            }
        } else if (index == 1) {
            query.value = {
                condition: '>=',
                value: moment().clone().subtract(7, 'days').format(TIME_FORMAT)
            }
        } else {
            query.value = {
                condition: '<=',
                value: moment().clone().subtract(7, 'days').format(TIME_FORMAT)
            }
        }
        setFilteredDate(query);
    }

    const _getWhere = (type: string) => {
        console.log('-------- getting where -------- : ' + type)
        if (curOrderStatus > -1) {
            if (curTab > 0) {
                mPage[curTab].options.query.where = [
                    {
                        attribute: 'status',
                        value: [curOrderStatus]
                    },
                    filteredDate
                ] as any
            } else {
                mPage[curTab].options.query.where = [
                    {
                        attribute: 'status',
                        value: [curOrderStatus]
                    }
                ]
            }
        } else {
            if (curTab > 0) { 
                mPage[curTab].options.query.where = [
                    {
                        attribute: 'status',
                        value: mPage[curTab].statusGroup
                    },
                    filteredDate
                ] as any
            } else {
                mPage[curTab].options.query.where = [
                    {
                        attribute: 'status',
                        value: mPage[curTab].statusGroup
                    }
                ]
            }
        }
        
        console.log(JSON.stringify(mPage[curTab].options))
        return mPage[curTab].options
    }

    const fetchingOrders = () => {
        if (mPage[curTab].items.length == 0 || mPage[curTab].isFiltering) {
            setLoading(true);
        }
        mPage[curTab].options.query.page = 0;
        api.getOrders(_getWhere('FETCHING'))
            .then(_handleResults)
            .catch(_handleErrors)
    }

    const _loadMore = () => {
        if (mPage[curTab].items.length == 0 || filteredStatusIdx != 0) return;
        console.log('-------- load more -------- : ')
        mPage[curTab].options.query.page = mPage[curTab].options.query.page + 1;
        api.getOrders(_getWhere('LOAD_MORE'))
            .then(_handleMoreResults)
            .catch(_handleErrors)
    }

    const _handleResults = (res: any) => {
        if (res.content.error) {
            console.log(res.content.error);
        } else {
            mPage[curTab].items = res.content.result;
            mPage[curTab].options.query.page = 1;
            mPage[curTab].loadMore = mPage[curTab].items.length >= res.content.pagination.total ? false : true;
            setPageData(mPage);
            onUpdateOrders([...mPage[curTab].items]);
            setLoading(false);

            console.log(`-- Infinit Status : ${mPage[curTab].loadMore} , -- Items : ${mPage[curTab].items.length} , -- Total : ${res.content.pagination.total}`);
        }
    }
    const _handleMoreResults = (res: any) => {
        if (res.content.error) {
            console.log(res.content.error);
        } else {
            let _tmp = mPage[curTab].items;
            mPage[curTab].items = _tmp.concat(res.content.result);
            mPage[curTab].options.query.page = res.content.result.length != 0 ? mPage[curTab].options.query.page : mPage[curTab].options.query.page - 1;
            mPage[curTab].loadMore = mPage[curTab].items.length >= res.content.pagination.total ? false : true;
            setPageData(mPage);
            onUpdateOrders([...mPage[curTab].items]);
            setLoading(false);

            console.log('------- Current Page ------- : ' + res.content.pagination.current_page)
        }
    }
    const _handleErrors = (err: any) => {
        setLoading(false);
        alert(err)
    }

    const onClickOrder = (data: any) => {
        if (curTab == 0 && !online) {
            alert('You are offline.')
            return;
        }
        let detailStack = StackActions.push('OrderDetail', {order: data, status: curTab});
        props.navigation.dispatch(detailStack);
    }

    const renderItem = ({item}: any) => {
        return (
            <OrderItem navigation={props.navigation} isOnline={online} data={item} canAccept={curTab == 0 ? true : false} onClick={onClickOrder}></OrderItem>
        )
    }

    return (
        <Wrapper>
            <Spinner 
                visible={is_loading}
            />
            <OSegment 
                items={mPage} 
                selectedIdx={curTab} 
                onSelectItem={onChangeStatus} 
            />
            <FilterWrapper>
                <ODropDown 
                    items={statusFilters} 
                    placeholder={'Group'} 
                    kindImage={IMAGES.group}
                    selectedIndex={filteredStatusIdx}
                    onSelect={onFilterByStatus}
                />
                {curTab > 0 ? (<OText style={{ minWidth: 10 }}>{''}</OText>):null}
                {curTab > 0 ? (
                    <ODropDown 
                        items={dateFilters} 
                        placeholder={'Today'} 
                        kindImage={IMAGES.calendar}
                        selectedIndex={0}
                        onSelect={onFilterByDate}
                    />
                ) : null}
            </FilterWrapper>
            <FlatList
                ref={listRef}
                data={curOrders}
                renderItem={renderItem}
                keyExtractor={(order: any) => order.id.toString()}
                onEndReachedThreshold={0.9}
                onEndReached={() => _loadMore()}
                onRefresh={() => fetchingOrders()}
                refreshing={is_refreshing}
            />
        </Wrapper>
    );
}

export default OrderList