import * as React from 'react'
import styled from 'styled-components/native'
import { ORDER_STATUS } from '../config/constants'
import { getOrderStatus, getStatusColor } from '../providers/Utilities'
import { colors, light } from '../theme'
import { OText, OIcon, OButton } from './shared'

interface Props {
    data: any,
    canAccept?: boolean,
    onClick?: any
}

const Wrapper = styled.TouchableOpacity`
    flex: 1;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 0 2px #00000020;
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
    margin-right: 8px;
    border-radius: 10px;
    border: 1px solid #e5e5e5;
`
const Status = styled.View`
    flex: 1;
    align-items: center;
    justify-content: space-between;
    margin-top: 12px;
    flex-direction: row;
`
const Address = styled.View`
    flex: 1;
    flex-direction: row;
    align-items: center;
`
const OrderNumber = styled.View`
    flex: 1;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`
const StatusAction = styled.TouchableOpacity`
    flex-grow: 1;
    flex-basis: 0;
    border: 1px solid ${({theme}): string => theme.borderColor}
    padding: 10px;
    border-radius: 10px;
    align-items: center;
    justify-content: center;
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
                <Avatar resizeMode={'cover'} source={{uri: props.data.business.logo}}></Avatar>
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
                <StatusAction>
                    <OText color={colors.primary}>{getOrderStatus(props.data.status)}</OText>
                </StatusAction>
                {props.data.status == ORDER_STATUS.PENDING ? (
                    <>
                        <OText style={{width: 10}}>{''}</OText>
                        <StatusAction style={{backgroundColor: light.btnDisabled}}>
                            <OText>{'Accept'}</OText>
                        </StatusAction>
                    </>
                ) : null}
            </Status>
        </Wrapper>
    )
}

OrderItem.defaultProps = {

}

export default OrderItem