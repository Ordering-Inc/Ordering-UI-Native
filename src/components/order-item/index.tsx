import * as React from 'react'
import { ORDER_STATUS } from '../../config/constants'
import { getOrderStatus, getStatusColor } from '../../providers/Utilities'
import { backgroundColors, borderColors, labelTheme } from '../../globalStyles'
import { OText, OIcon, OButton } from '../shared'
import { Address, InfoWrapper, InnerWrapper, OrderNumber, Status, StatusAction, Wrapper } from './styles'
import { COMP_ICONS } from '../index.conf'

interface Props {
    navigation?: any,
    data: any,
    canAccept?: boolean,
    onClick?: any,
    isOnline?: boolean
}

const OrderItem = (props: Props) => {
    const [curItem, onSelectItem] = React.useState(null);
    const [is_online, changOnline] = React.useState(props.isOnline);

    React.useEffect(() => {
        changOnline(props.isOnline);
    }, [props.isOnline]);

    const _onClickItem = (item: any) => {
        props.onClick(item)
        onSelectItem(item)
    }

    const _onAccept = () => {
        // let detailStack = StackActions.push('Accept', props.data);
        // props.navigation.dispatch(detailStack);
        props.navigation.navigate('Accept', props.data);
    }

    return (
        <Wrapper onPress={() => _onClickItem(props.data)} style={{borderLeftColor: getStatusColor(props.data.status)}}>
            <InnerWrapper>
                <OIcon 
                    url={props.data.business.logo}
                    width={80}
                    height={80}
                    style={{borderRadius: 10, borderColor: '#e5e5e5', borderWidth: 1, marginRight: 10}}
                />
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
                        <OIcon src={COMP_ICONS.pin_outline} width={15} style={{marginRight: 4}} />
                        <OText isWrap={true} weight={'300'} size={12.5}>
                            {props.data.business.address}
                        </OText>
                    </Address>
                </InfoWrapper>
            </InnerWrapper>
            <Status>
                <StatusAction>
                    <OText color={labelTheme.primary}>{getOrderStatus(props.data.status)}</OText>
                </StatusAction>
                {props.data.status == ORDER_STATUS.PENDING ? (
                    <>
                        <OText style={{width: 10}}>{''}</OText>
                        <OButton onClick={_onAccept} style={{shadowColor: 'transparent', height: 42, borderRadius: 10}} parentStyle={{flex: 1}} textStyle={{fontSize: 14, color: 'white'}} bgColor={backgroundColors.primary} borderColor={borderColors.primary} isDisabled={!is_online} text={'Accept'} imgRightSrc={null} />
                    </>
                ) : null}
            </Status>
        </Wrapper>
    )
}

OrderItem.defaultProps = {

}

export default OrderItem