
import * as React from 'react'
import styled from 'styled-components/native'
import { getOrderStatus } from '../providers/Utilities';
import { ODropDown, OSegment, OText } from './shared';

import OrderItem from './OrderItem';
import { StackActions } from '@react-navigation/native';

const Wrapper = styled.View`
flex: 1;
    background-color: white;
    padding-horizontal: 12px;
    padding-top: 110px;
    padding-bottom: 20px;
`
const FilterWrapper = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-vertical: 10px;
    z-index: 10;
`
const OrdersWrapper = styled.ScrollView`
    
`
const orderStatus = [
    ['Group', getOrderStatus(0), getOrderStatus(4), getOrderStatus(7)],      // pending
    ['Group', getOrderStatus(3), getOrderStatus(8)],         // inprogress
    ['Group', getOrderStatus(1), getOrderStatus(9), getOrderStatus(11)],     // completed
    ['Group', getOrderStatus(2), getOrderStatus(5), getOrderStatus(6), getOrderStatus(10), getOrderStatus(12)]   // canceled
];

const dateFilters = [ 'Today', 'Last Week', 'Older' ];

interface Props {
    orders: Array<any>,
    isOnline: boolean,
    navigation: any
}

const OrderList = (props: Props) => {
    let items = [
        {
            text: 'Pending',
            image: require('../assets/icons/pending.png')
        },
        {
            text: 'InProgress',
            image: require('../assets/icons/inprogress.png')
        },
        {
            text: 'Completed',
            image: require('../assets/icons/completed.png')
        },
        {
            text: 'Canceled',
            image: require('../assets/icons/canceled.png')
        }
    ];
    
    // Events -----------

    const [statusFilters, getFilterTypes] = React.useState(orderStatus[0]);
    var [curTab, onChangeStatus] = React.useState(0);
    const [online, updateOnline] = React.useState(props.isOnline);

    React.useEffect(() => {
        updateOnline(props.isOnline);
    },[props.isOnline]);

    const onChangeTabs = (idx: number) => {
        // alert(`Selectd Order Status : ${items[idx].text}`);
        onChangeStatus(idx);
        getFilterTypes(orderStatus[idx]);

    }
    const filterOrders = (orders: Array<any>, tab: number) : Array<any> => {
        var ary = [];
        if (tab == 0) {
            ary = orders.filter(item => item.status == 0 || item.status == 4 || item.status == 7)
        } else if (tab == 1) {
            ary = orders.filter(item => item.status == 3 || item.status == 8)
        } else if (tab == 2) {
            ary = orders.filter(item => item.status == 1 || item.status == 9 || item.status == 11)
        } else if (tab == 3) {
            ary = orders.filter(item => item.status == 2 || item.status == 5 || item.status == 6 || item.status == 10 || item.status == 12)
        }
        return ary
    }
    const filterByGroup = (idx: number) => {
        // alert( `Groupd : ${statusFilters[idx]}`);
    }
    const filterByDate = (idx: number) => {
        // alert( `Date : ${dateFilters[idx]}`);
    }
    const onClickOrder = (data: any) => {
        // alert(data.business.name);
        if (curTab == 0 && !online) {
            alert('You are offline.')
            return;
        }
        let detailStack = StackActions.push('OrderDetail', {order: data, status: curTab});
        props.navigation.dispatch(detailStack);
        // props.navigation.navigate('OrderDetail', {order: data, status: curTab});

    }

    return (
        <Wrapper>
            <OSegment 
                items={items} 
                selectedIdx={curTab} 
                onSelectItem={onChangeTabs} 
            />
            <FilterWrapper>
                <ODropDown 
                    items={statusFilters} 
                    placeholder={'Group'} 
                    kindImage={require('../assets/icons/group.png')}
                    selectedIndex={0}
                    onSelect={filterByGroup}
                />
                {curTab > 0 ? (<OText style={{ minWidth: 10 }}>{''}</OText>):null}
                {curTab > 0 ? (
                    <ODropDown 
                        items={dateFilters} 
                        placeholder={'Today'} 
                        kindImage={require('../assets/icons/calendar.png')}
                        selectedIndex={0}
                        onSelect={filterByDate}
                    />
                ) : null}
            </FilterWrapper>
            <OrdersWrapper>
                {filterOrders(props.orders, curTab).map((item, index) => (
                    <OrderItem key={index} isOnline={online} data={item} canAccept={curTab == 0 ? true : false} onClick={onClickOrder}></OrderItem>
                ))}
            </OrdersWrapper>
        </Wrapper>
    );
}

export default OrderList