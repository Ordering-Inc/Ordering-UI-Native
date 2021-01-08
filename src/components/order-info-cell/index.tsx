import * as React from 'react'
import { backgroundColors, borderColors } from '../../globalStyles'
import { COMP_ICONS } from '../index.conf'
import { OText, OIconText, OIcon, OIconButton } from '../shared'
import { KActions, KindItems, KInfoWrap, KInner } from './styles'

interface Props {
    title?: string,
    name?: string,
    logo?: any,
    address?: string,
    dummy?: any,

    onChat?: any,
    onCall?: any
}

const OrderInfoCell = (props: Props) => {

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
                        icon={COMP_ICONS.pin_outline}
                        text={props.address} />
                    <KActions>
                        <OIconButton
                            icon={COMP_ICONS.speech_bubble}
                            title={'Chat'}
                            borderColor={borderColors.primary}
                            bgColor={backgroundColors.light}
                            onClick={props.onChat}
                        />
                        <OIconButton
                            icon={COMP_ICONS.phone}
                            title={'Call'}
                            borderColor={borderColors.primary}
                            bgColor={backgroundColors.light}
                            style={{marginHorizontal: 10}}
                            onClick={props.onCall}
                        />
                    </KActions>
                </KInfoWrap>
            </KInner>
        </KindItems>
    )
}

OrderInfoCell.defaultProps = {

}

export default OrderInfoCell;