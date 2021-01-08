import * as React from 'react'
import styled from 'styled-components/native'
import { DIRECTION } from '../../config/constants'
import { colors } from '../../globalStyles'
import OText from './OText'

const Wrapper = styled.View`
    flex: 1;
    border-radius: 35px;
    min-height: 50px;
    padding-horizontal: 25px;
    padding-vertical: 10px;
    max-width: 80%;
    margin-bottom: 14px;
`

interface Props {
    side?: string,
    bgColor?: string,
    textColor?: string,
    contents?: any,
    datetime?: string,
    data?: any
}

const OChatBubble = (props: Props) => {
    return (
        <Wrapper style={
            props.side == DIRECTION.RIGHT 
                ? {borderBottomRightRadius: 0, backgroundColor: props.bgColor ? props.bgColor : colors.primary, alignSelf: 'flex-end'} 
                : {borderBottomLeftRadius: 0, backgroundColor: props.bgColor ? props.bgColor : colors.backgroundGray, alignSelf: 'flex-start'}
            }>
            <OText color={props.textColor ? props.textColor : props.side == DIRECTION.RIGHT ? colors.white : 'black'}>{props.contents}</OText>
            <OText color={props.textColor ? props.textColor : props.side == DIRECTION.RIGHT ? colors.white : 'black'} style={{textAlign: 'right'}} size={9}>{props.datetime}</OText>
        </Wrapper>
    )
}

export default OChatBubble;