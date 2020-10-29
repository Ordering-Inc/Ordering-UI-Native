import * as React from 'react'
import styled from 'styled-components/native'
import BottomWrapper from '../components/BottomWrapper'
import NavBar from '../components/NavBar'
import OInfoCell from '../components/OInfoCell'
import OProductCell from '../components/OProductCell'
import { OIcon, OText, OIconText, OCheckbox, OButton, OIconButton } from '../components/shared'
import { colors } from '../theme'

const Wrapper = styled.ScrollView`
    background-color: white;
    padding: 20px 16px;
    margin-bottom: 100px;
`
const UnderLineWrap = styled.View`
    border-bottom-width: 1px;
    border-bottom-color: #e6e6e6;
    padding-vertical: 15px;
`
interface Props {

}

const OrderDetail = ({navigation, route} : any) => {

    const [orderData, getData] = React.useState(route.params);
    const products : Array<any> = orderData.products;
    
    const onBack = () => {
        navigation.navigate('RecieveOrder');
    }
    const onContact = () => {
        navigation.navigate('RecieveOrder');
    }
    const onCheckArrived = (checked: boolean) => {
        // alert(checked)
    }

    const bCall = () => {
        alert ('business calling!!')
    }
    const cCall = () => {
        alert ('customer calling!!')
    }

    const accptItem = (
        <OCheckbox 
            label={'Arrived at business'} 
            size={16} 
            checked={false} 
            onChange={onCheckArrived} />
    )
    const dateTime = (
        <OText>{orderData.date}</OText>
    )

    const isInProgress = (status: number) : boolean => {
        if (status == 3 || status == 8) return true
        else return false
    }

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
                />
                <OInfoCell 
                    title={'Customer'}
                    name={`${orderData.customer.name} ${orderData.customer.lastname}`}
                    address={orderData.customer.address}
                    logo={orderData.customer.photo}
                    onCall={cCall}
                />

                <UnderLineWrap>
                    <OText style={{textTransform: 'uppercase'}} weight={'500'}>{'Orders'}</OText>
                </UnderLineWrap>
                <UnderLineWrap>
                    <OText color={colors.primary} style={{marginBottom: 10}}>{'Paymethod'}</OText>
                    <OIconText
                        icon={require('../assets/icons/wallet.png')}
                        text={'Cash'}
                        imgStyle={{marginRight: 8}}
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

            </Wrapper>
            <BottomWrapper >
                
            </BottomWrapper>
        </>
    )
}

OrderDetail.defaultProps = {

}

export default OrderDetail