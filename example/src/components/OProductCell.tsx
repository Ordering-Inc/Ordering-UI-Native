import * as React from 'react'
import styled from 'styled-components/native'
import { parsePrice } from '../providers/Utilities'
import { colors } from '../theme'
import { OText, OIcon } from './shared'

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

OProductCell.defaultProps = {

}

export default OProductCell;