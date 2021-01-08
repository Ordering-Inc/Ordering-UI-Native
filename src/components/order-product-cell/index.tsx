import * as React from 'react'
import { parsePrice } from '../../providers/Utilities'
import {  } from '../../globalStyles'
import { OText, OIcon } from '../shared'
import { PInner, Price, Wrapper } from './styles'

interface Props {
    data?: any,

    onChat?: any,
    onCall?: any
}

const OrderProductCell = (props: Props) => {

    const getExtras = (options: Array<any>) : string => {
        var str = '';
        options.map(opt => {
            str += opt.name + '\n';
            opt.suboptions.map((s: any) => {
                str += ' ' + s.name + '\n'
            })
        })
        return str
    }

    return (
        <Wrapper>
            <OText style={{marginVertical: 10, minWidth: 10}} size={14} weight={'500'}>{props.data.quantity || '1'}</OText>
            <OIcon 
                url={props.data.images}
                style={{borderRadius: 15, marginHorizontal: 10}}
                width={80} height={80}></OIcon>
            <PInner>
                <OText size={17} weight={'500'}>{props.data.name || 'Pepperoni Pizza'}</OText>
                {props.data.options.length > 0 ? (
                    <OText size={14} weight={'300'}>{getExtras(props.data.options as Array<any>) || ''}</OText>
                ) : null}
            </PInner>
            <Price>
                <OText>{`${parsePrice(props.data.price)}` || '$30.00'}</OText>
            </Price>
        </Wrapper>
    )
}

OrderProductCell.defaultProps = {

}

export default OrderProductCell;