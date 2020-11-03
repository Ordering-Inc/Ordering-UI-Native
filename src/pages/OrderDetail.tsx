import { StackActions } from '@react-navigation/native'
import * as React from 'react'
import { Linking } from 'react-native'
import styled from 'styled-components/native'
import BottomWrapper from '../components/BottomWrapper'
import NavBar from '../components/NavBar'
import OInfoCell from '../components/OInfoCell'
import OProductCell from '../components/OProductCell'
import { OIcon, OText, OIconText, OCheckbox, OIconButton } from '../components/shared'
import { USER_TYPE } from '../config/constants'
import { parsePrice } from '../providers/Utilities'
import { colors } from '../theme'
// import RNImmediatePhoneCall from 'react-native-immediate-phone-call';

const Wrapper = styled.ScrollView`
    background-color: white;
    padding: 0px 16px;
`
const UnderLineWrap = styled.View`
    border-bottom-width: 1px;
    border-bottom-color: #e6e6e6;
    padding-vertical: 15px;
`
const InlineWrapper = styled.View`
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
    padding-vertical: 4px;
`

const PayIcons: PayProps = {
    cash: require('../assets/icons/wallet.png'),
    paypal: require('../assets/icons/paypal.png'),
    card: require('../assets/icons/card.png'),
}
interface PayProps {
    cash: any,
    paypal: any,
    card: any
}

interface Props {
    status: number
}

const OrderDetail = ({ navigation, route }: any, props: Props) => {

    const [orderData, getData] = React.useState(route.params.order);
    const [curTab] = React.useState(route.params.status);
    const [hasArrived, onArrived] = React.useState(false);
    const products: Array<any> = orderData.products;

    const onBack = () => {
        let stack = StackActions.pop(1);
        navigation.dispatch(stack);
    }
    const onContact = () => {
        navigation.navigate('Contact');
    }
    const onCheckArrived = (checked: boolean) => {
        onArrived(checked);
    }
    const onReject = () => {
        navigation.navigate('Reject', orderData);
    }
    const onAccept = () => {
        navigation.navigate('Accept', orderData);
    }
    const onStartDelivery = () => {
        navigation.navigate('MapBusiness', {order: orderData});
    }

    const bCall = () => {
        Linking.openURL(`tel:${orderData.business.cellphone || orderData.business.phone}`);
    }
    const cCall = () => {
        Linking.openURL(`tel:${orderData.customer.cellphone || orderData.customer.phone}`);
    }
    const bChat = () => {
        navigation.navigate('Chat',{type: USER_TYPE.BUSINESS, data: orderData});
    }
    const cChat = () => {
        navigation.navigate('Chat',{type: USER_TYPE.CUSTOMER, data: orderData});
    }

    const accptItem = (
        <OCheckbox
            label={'Arrived at business'}
            size={16}
            checked={false}
            onChange={onCheckArrived} />
    )
    const dateTime = (
        <OText>{orderData.delivery_datetime}</OText>
    )

    const isInProgress = (status: number): boolean => {
        if (status == 3 || status == 8) return true
        else return false
    }

    // calculate prices ----------------------------------
    const subTotal = (products: Array<any>): number => {
        var total = 0;
        products.map(item => {
            total += item.price * item.quantity;
        })
        return total
    }
    const serviceFee = subTotal(orderData.products) * orderData.service_fee / 100
    const tax = orderData.tax_type == 1 ? orderData.tax : subTotal(orderData.products) * orderData.tax / 100
    const total = subTotal(orderData.products) + serviceFee + tax + orderData.delivery_zone_price

    return (
        <>
            <NavBar
                title={`# ${orderData.id}`}
                subTitle={isInProgress(orderData.status) ? accptItem : dateTime}
                titleAlign={'left'}
                onActionLeft={onBack}
                onRightAction={onContact}
                showCall={true}
            />
            <Wrapper>
                <OInfoCell
                    title={'Business'}
                    name={orderData.business.name}
                    address={orderData.business.address}
                    logo={orderData.business.logo}
                    onCall={bCall}
                    onChat={bChat}
                />
                <OInfoCell
                    title={'Customer'}
                    name={`${orderData.customer.name} ${orderData.customer.lastname}`}
                    address={orderData.customer.address}
                    logo={orderData.customer.photo}
                    dummy={require('../assets/images/customer.png')}
                    onCall={cCall}
                    onChat={cChat}
                />

                <UnderLineWrap>
                    <OText style={{ textTransform: 'uppercase' }} size={15} weight={'500'}>{'Orders'}</OText>
                </UnderLineWrap>
                <UnderLineWrap>
                    <OText color={colors.primary} style={{ marginBottom: 10 }}>{'Paymethod'}</OText>
                    <OIconText
                        icon={PayIcons[orderData.paymethod.gateway as keyof PayProps]
                            ? PayIcons[orderData.paymethod.gateway as keyof PayProps]
                            : PayIcons.card}
                        text={orderData.paymethod.name}
                        imgStyle={{ marginRight: 8 }}
                    />
                </UnderLineWrap>
                <UnderLineWrap>
                    {products && products.length > 0 ? products.map((item, index) =>
                        (
                            <OProductCell
                                key={index}
                                data={item}
                            />
                        )
                    ) : null}
                </UnderLineWrap>
                <UnderLineWrap>
                    <InlineWrapper>
                        <OText>{`Subtotal`}</OText>
                        <OText>{parsePrice(subTotal(orderData.products))}</OText>
                    </InlineWrapper>
                    <InlineWrapper>
                        <OText>{orderData.tax_type == 1 ? `Tax ${parsePrice(orderData.tax)}` : `Tax ${orderData.tax}%`}</OText>
                        <OText>{parsePrice(tax)}</OText>
                    </InlineWrapper>
                    {orderData.delivery_zone_price > 0 ? (
                        <InlineWrapper>
                            <OText>{`Delivery Fee`}</OText>
                            <OText>{parsePrice(orderData.delivery_zone_price)}</OText>
                        </InlineWrapper>
                    ) : null}
                    <InlineWrapper>
                        <OText>{`Service Fee (${orderData.service_fee}%)`}</OText>
                        <OText>{parsePrice(serviceFee)}</OText>
                    </InlineWrapper>
                </UnderLineWrap>
                <InlineWrapper style={{ marginBottom: 40 }}>
                    <OText weight={'500'} size={18}>{`Total`}</OText>
                    <OText weight={'500'} size={18} color={colors.primary}>{parsePrice(total)}</OText>
                </InlineWrapper>
            </Wrapper>
            <BottomWrapper style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                {curTab == 0 ? (
                    <>
                        <OIconButton 
                            style={{ flex: 0.3 }} 
                            height={46} 
                            onClick={onReject}
                            bgColor={colors.error} 
                            borderColor={colors.error} 
                            icon={require('../assets/icons/alert.png')} />
                        <OText 
                            style={{ width: 20 }}></OText>
                        <OIconButton 
                            title={'Accept Order'} 
                            onClick={onAccept}
                            style={{ flex: 1 }} 
                            height={46} 
                            color={colors.primary} 
                            textColor={colors.white} />
                    </>
                ) : curTab == 1 ? (
                    <>
                        <OIconButton
                            style={{ flex: 0.3 }}
                            onClick={onReject}
                            height={46}
                            bgColor={colors.error} 
                            borderColor={colors.error} 
                            icon={require('../assets/icons/alert.png')} />
                        <OText 
                            style={{ width: 20 }}></OText>
                        <OIconButton 
                            title={'Start delivery'} 
                            style={{ flex: 1 }} 
                            onClick={onStartDelivery}
                            height={46} 
                            disabled={!hasArrived}
                            color={colors.primary} 
                            textColor={colors.white} 
                            iconStyle={{width: 12, marginRight: 20}}
                            icon={require('../assets/icons/arrow_right.png')} />
                    </>
                ) : curTab == 2 ? (
                    <OIconText 
                        style={{justifyContent: 'center', alignItems: 'center'}} 
                        icon={require('../assets/icons/checkmark.png')} 
                        textStyle={{marginHorizontal: 10}} 
                        size={17} 
                        color={colors.primary} 
                        text={`Completed`} />
                ) : curTab == 3 ? (
                    <OIconText 
                        style={{justifyContent: 'center', alignItems: 'center'}} 
                        icon={require('../assets/icons/close.png')} 
                        color={colors.error} 
                        textStyle={{marginHorizontal: 10}} 
                        size={17} 
                        text={`Canceled`} />
                ) : null}
            </BottomWrapper>
        </>
    )
}

OrderDetail.defaultProps = {

}

export default OrderDetail