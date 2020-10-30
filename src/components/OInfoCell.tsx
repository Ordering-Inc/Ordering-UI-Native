import * as React from 'react'
import styled from 'styled-components/native'
import { colors } from '../theme'
import { OText, OIconText, OIcon, OIconButton } from './shared'

const KindItems = styled.View`
    flex: 1;
    padding-vertical: 10px;
`
const KInner = styled.View`
    flex: 1;    
    flex-direction: row;
`
const KInfoWrap = styled.View`
    flex: 1;
    padding-horizontal: 10px;
`
const KActions = styled.View`
    flex: 1;
    flex-direction: row;
    align-items: center;
    margin-top: 10px;
`

interface Props {
    title?: string,
    name?: string,
    logo?: any,
    address?: string,
    dummy?: any,

    onChat?: any,
    onCall?: any
}

const OInfoCell = (props: Props) => {

    return (
        <KindItems>
            <OText style={{textTransform: 'uppercase', marginVertical: 10}} size={15} weight={'500'}>{props.title}</OText>
            <KInner>
                <OIcon 
                    url={props.logo}
                    dummy={props.dummy}
                    style={{borderRadius: 12}}
                    width={100} height={100}></OIcon>
                <KInfoWrap>
                    <OText size={19} weight={'500'}>{props.name}</OText>
                    <OIconText 
                        icon={require('../assets/icons/pin_outline.png')}
                        text={props.address} />
                    <KActions>
                        <OIconButton
                            icon={require('../assets/icons/speech-bubble.png')}
                            title={'Chat'}
                            borderColor={colors.primary}
                            bgColor={'white'}
                            onClick={props.onChat}
                        />
                        <OIconButton
                            icon={require('../assets/icons/phone.png')}
                            title={'Call'}
                            borderColor={colors.primary}
                            bgColor={'white'}
                            style={{marginHorizontal: 10}}
                            onClick={props.onCall}
                        />
                    </KActions>
                </KInfoWrap>
            </KInner>
        </KindItems>
    )
}

OInfoCell.defaultProps = {

}

export default OInfoCell;