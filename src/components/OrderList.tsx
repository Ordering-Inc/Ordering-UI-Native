
import * as React from 'react'
import { View } from 'react-native';
import styled from 'styled-components/native'
import { getStatusColor } from '../providers/Utilities';
import OrderItem from './OrderItem';
import { ODropDown, OSegment } from './shared';

const Wrapper = styled.View`
    background-color: white;
    height: 100%;
    padding-horizontal: 12px;
    padding-top: 110px;
    padding-bottom: 105px;
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

const OrderList = () => {
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
    ]
    let filterGroups = [
        'Driver Group',
        'Admin Group',
        'Student Group',
        'Worker Group',
        'Patners Group',
    ]
    let orders = [
        {
            id: 55,
            business: {
                name: 'Laundary Company',
                address: '500 5th Ave, New York, NY 10110, USA'
            },
            status: 2,
            date: '2020/10/26 11:48'
        },
        {
            id: 56,
            business: {
                name: 'MCBonalds',
                address: 'McDonald\'s, Strada Ștefan cel Mare 36-40, Constanța 900178, Romania'
            },
            status: 4,
            date: '2020/10/27 10:30'
        },
        {
            id: 57,
            business: {
                name: 'Star Buck',
                address: 'Calz. de Tlalpan, Toriello Guerra, Mexico City, CDMX, Mexico'
            },
            status: 5,
            date: '2020/10/27 16:40'
        },
        {
            id: 58,
            business: {
                name: 'Laundary Company',
                address: '500 5th Ave, New York, NY 10110, USA'
            },
            status: 7,
            date: '2020/10/28 17:10'
        },
        {
            id: 59,
            business: {
                name: 'Wine Bar',
                address: '5th avenue, Pafnuncio Padilla, Ciudad Satélite, Naucalpan de Juárez, State of Mexico, Mexico'
            },
            status: 11,
            date: '2020/10/29 10:59'
        },
    ]


    let onOrderStatus = (idx: number) => {
        alert(`Selectd Order Status : ${items[idx].text}`)
    }
    let filterByGroup = (idx: number) => {
        alert( `Groupd : ${filterGroups[idx]}`)
    }
    let onClickOrder = (data: any) => {
        alert(data.business.name)
    }
    return (
        <Wrapper>
            <OSegment 
                items={items} 
                selectedIdx={0} 
                onSelectItem={onOrderStatus} 
            />
            <FilterWrapper>
                <ODropDown 
                    items={filterGroups} 
                    placeholder={'Group'} 
                    kindImage={require('../assets/icons/group.png')}
                    selectedIndex={2}
                    onSelect={filterByGroup}
                />
            </FilterWrapper>
            <OrdersWrapper>
                {orders.map((item, index) => (
                    <OrderItem data={item} key={index} onClick={onClickOrder}></OrderItem>
                ))}
            </OrdersWrapper>
        </Wrapper>
    );
}

export default OrderList