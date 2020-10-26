import * as React from 'react'
import { Text } from 'react-native'
import styled from 'styled-components/native'
import { getOrderStatus, getStatusColor } from '../providers/Utilities'
import { Theme } from '../theme'
import { OText, OIcon } from './shared'

interface Props {
    data: any,
    onClick?: any
}

const Wrapper = styled.TouchableOpacity`
    flex: 1;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 0 1px #00000030;
    border-left-width: 5px;
    padding: 10px;
    margin-bottom: 12px;
    margin-left: 3px;
    margin-right: 3px;
    margin-top: 3px;
`
const InnerWrapper = styled.View`
    flex: 1;    
    flex-direction: row;    
`
const InfoWrapper = styled.View`
    flex-grow: 1;
`
const Avatar = styled.Image`
    width: 80px;
    height: 80px;
    resize-mode: contain;
    margin-top: 8px;
    margin-right: 5px;
`
const Status = styled.View`
    border: 1px solid ${({theme}) => theme.borderColor}
    border-radius: 10px;
    padding: 8px 15px;
    align-items: center;
    justify-content: center;
    margin-top: 6px;
`
const Address = styled.View`
    flex: 1;
    flex-direction: row;
    align-items: center;
`
const Icon = styled.Image`
    resize-mode: contain;
    width: 24px;
    height: 24px;
`
const OrderNumber = styled.View`
    flex: 1;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`

const OrderItem = (props: Props) => {
    var [curItem, onSelectItem] = React.useState(null)

    let onClickItem = (item: any) => {
        props.onClick(item)
        onSelectItem(item)
    }

    return (
        <Wrapper onPress={() => onClickItem(props.data)} style={{borderLeftColor: getStatusColor(props.data.status)}}>
            <InnerWrapper>
                <Avatar source={{uri: 'https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_scale/v1312461204/sample.jpg'}}></Avatar>
                <InfoWrapper>
                    <OrderNumber>
                        <OText size={22} weight={'600'}>
                            {`#${props.data.id}`}
                        </OText>
                        <OText color={'grey'}>
                            {props.data.date}
                        </OText>
                    </OrderNumber>
                    <OText size={18} weight={'500'} style={{marginTop: -6}}>{props.data.business.name}</OText>
                    <Address>
                        <OIcon src={require('../assets/icons/pin_outline.png')} width={15} style={{marginRight: 4}} />
                        <OText isWrap={true} weight={'300'} size={12.5}>
                            {props.data.business.address}
                        </OText>
                    </Address>
                </InfoWrapper>
            </InnerWrapper>
            <Status>
                <OText>{getOrderStatus(props.data.status)}</OText>
            </Status>
        </Wrapper>
    )
}

OrderItem.defaultProps = {

}

export default OrderItem