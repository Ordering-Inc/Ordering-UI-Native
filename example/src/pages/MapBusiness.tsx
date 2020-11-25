import * as React from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled from 'styled-components/native'
import BottomWrapper from '../components/BottomWrapper'
import OrderMap from '../components/OrderMap'
import { OButton, OIcon, OText } from '../components/shared'
import { colors } from '../theme'

const Wrapper = styled.View`
    flex: 1;
    flex-direction: column;
    justify-content: space-around;
`
const ContentWrap = styled.View`
    flex: 1;
`
const TopActions = styled.View`
    position: absolute;
    width: 100%;
    min-height: 80px;
    background-color: transparent;
    padding: 40px 16px 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    top: 0;
    z-index: 5;
`
const InfoWrapper = styled.View`
    flex: 1;
    border-radius: 10px;
    background-color: white;
    box-shadow: 1px 1px 2px #00000020;
    padding: 10px;
    flex-direction: row;
`
const DistanceView = styled.View`
    align-items: center;
    margin-right: 10px;
`
const TimeInfoWrapper = styled.View`
    border: 1px solid transparent;
    border-bottom-color: ${colors.whiteGray};
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding-bottom: 7px;
    margin-bottom: 16px;
`
const CircleMark = styled.View`
    width: 16px;
    height: 16px;
    margin-horizontal: 10px;
    border-radius: 8px;
    background-color: ${colors.primary};
`
const InnerWrapper = styled.View`
    flex-direction: row;    
`
const InfoWrap = styled.View`
    flex-grow: 1;
`
const DetailBtn = styled.TouchableOpacity`
    align-items: center;
    justify-content: center;
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

interface Props {
    navigation: any,
    route: any
}

const MapBusiness = (props: Props) => {
    const safeAreaInset = useSafeAreaInsets();

    const [order, getOrder] = React.useState(props.route.params.order);

    const goOrders = () => {
        props.navigation.navigate('MapOrders', { is_online: true, order_view: true });
    }
    const onClickOrder = () => {
        // props.navigation.navigate('OrderDetail', {order: order, status: 1});
        props.navigation.goBack();
    }

    return (
        <>
        <Wrapper>
            <ContentWrap>
                <TopActions style={{paddingTop: safeAreaInset.top || 16}}>
                    <InfoWrapper>
                        <DistanceView>
                            <OIcon src={require('../assets/icons/upload.png')} width={28} height={28} />
                            <OText style={{marginTop: 5}}>{'128ft'}</OText>
                        </DistanceView>
                        <OText isWrap={true}>{'Qingnian Street Wenan Load No.22'}</OText>
                    </InfoWrapper>
                    <OText style={{width: 15}}>{''}</OText>
                    <OButton
                        isCircle={true}
                        onClick={goOrders}
                        imgRightSrc={null}
                        imgLeftSrc={require('../assets/icons/lunch.png')} 
                    />
                </TopActions>
                <OrderMap       
                        region={{
                            latitude: 37.78825,
                            longitude: -122.4324,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                        markers={[]}
                    /> 
            </ContentWrap>
            <BottomWrapper>
                <TimeInfoWrapper>
                    <OText size={19}>{'19min'}</OText>
                    <CircleMark />
                    <OText size={19}>{'6.0mi'}</OText>
                </TimeInfoWrapper>
                {order ? (
                    <InnerWrapper>
                        <OIcon 
                            url={order.business.logo}
                            width={80}
                            height={80}
                            style={{borderRadius: 10, borderColor: '#e5e5e5', borderWidth: 1, marginRight: 10}}
                        />
                        <InfoWrap>
                            <OrderNumber>
                                <OText size={22} weight={'600'}>
                                    {`#${order.id}`}
                                </OText>
                                <DetailBtn onPress={onClickOrder}>
                                    <OText color={colors.primary} weight={'300'} style={{textTransform: 'uppercase'}}>
                                        {'See Details'}
                                    </OText>
                                </DetailBtn>
                            </OrderNumber>
                            <OText size={18} weight={'500'} style={{marginTop: -6}}>{order.business.name}</OText>
                            <Address>
                                <OIcon src={require('../assets/icons/pin_outline.png')} width={15} style={{marginRight: 4}} />
                                <OText isWrap={true} weight={'300'} size={12.5}>
                                    {order.business.address}
                                </OText>
                            </Address>
                        </InfoWrap>
                    </InnerWrapper>
                ) : null}
            </BottomWrapper>
        </Wrapper>
        </>
    )
}

export default MapBusiness;