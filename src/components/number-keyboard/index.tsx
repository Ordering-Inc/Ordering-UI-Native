import * as React from 'react'
import { COMP_ICONS } from '../index.conf'
import { OIcon } from '../shared'
import OKeyButton from '../shared/OKeyButton'
import { BtnDel, KeyRow, KeyWrapper } from './styles'

interface Props {
    onChangeValue: any
}

const NumberKeyBoard = (props : Props) => {

    const onChange = (val: number) => {
        props.onChangeValue(val);
    }

    return (
        <KeyWrapper>
            <KeyRow>
                <OKeyButton title={'1'} onClick={() => onChange(1)} style={{flex: 0.32}} />
                <OKeyButton title={'2'} onClick={() => onChange(2)} style={{flex: 0.32}} />
                <OKeyButton title={'3'} onClick={() => onChange(3)} style={{flex: 0.32}} />
            </KeyRow>
            <KeyRow>
                <OKeyButton title={'4'} onClick={() => onChange(4)} style={{flex: 0.32}} />
                <OKeyButton title={'5'} onClick={() => onChange(5)} style={{flex: 0.32}} />
                <OKeyButton title={'6'} onClick={() => onChange(6)} style={{flex: 0.32}} />
            </KeyRow>
            <KeyRow>
                <OKeyButton title={'7'} onClick={() => onChange(7)} style={{flex: 0.32}} />
                <OKeyButton title={'8'} onClick={() => onChange(8)} style={{flex: 0.32}} />
                <OKeyButton title={'9'} onClick={() => onChange(9)} style={{flex: 0.32}} />
            </KeyRow>
            <KeyRow>
                <OKeyButton style={{flex: 0.32, backgroundColor: 'transparent'}} />
                <OKeyButton title={'0'} onClick={() => onChange(0)} style={{flex: 0.32}} />
                <BtnDel onPress={() => onChange(-1)}>
                    <OIcon src={COMP_ICONS.delete} />
                </BtnDel>
            </KeyRow>
        </KeyWrapper>
    )
}

export default NumberKeyBoard;