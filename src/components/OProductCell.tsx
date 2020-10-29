import * as React from 'react'
import styled from 'styled-components/native'
import { parsePrice } from '../providers/Utilities'
import { colors } from '../theme'
import { OText, OIconText, OIcon, OIconButton } from './shared'

const Wrapper = styled.View`
    flex: 1;
    padding-vertical: 10px;
    flex-direction: row;
    align-items: center;
`
const PInner = styled.View`
    flex: 1;
    flex-grow: 1;
`
const Price = styled.View`
    align-items: flex-start;
`
interface Props {
    data?: any,

    onChat?: any,
    onCall?: any
}

const OProductCell = (props: Props) => {

    return (
        <Wrapper>
            <OText style={{marginVertical: 10}} size={14} weight={'500'}>{props.data.quantity || '1'}</OText>
            <OIcon 
                url={props.data.image}
                style={{borderRadius: 12}}
                width={100} height={100}></OIcon>
            <PInner>
                <OText size={18} weight={'500'}>{props.data.name || 'Pepperoni Pizza'}</OText>
                <OText size={14} weight={'300'}>{props.data.extra || 'with extra cheese \n Large \nSize \n small'}</OText>
            </PInner>
            <Price>
                <OText>{`${parsePrice(props.data.price)}` || '$30.00'}</OText>
            </Price>
        </Wrapper>
    )
}

OProductCell.defaultProps = {

}

export default OProductCell;