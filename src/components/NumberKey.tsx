import * as React from 'react'
import styled from 'styled-components/native'
import { OIcon } from './shared'
import OKeyButton from './shared/OKeyButton'

const KeyWrapper = styled.View`
    background-color: #F0F0F0C2;
    height: 280px;
    padding: 7px;
    margin-bottom: 64px;
`
const KeyRow = styled.View`
    flex-direction: row;
    justify-content: space-around;
    margin-bottom: 7px;
`
const BtnDel = styled.TouchableOpacity`
    flex: 0.32;
    height: 50px;
    align-items: center;
    justify-content: center;
`

export interface NumberKeyProps {
    onChangeValue: any
}

const NumberKey = (props : NumberKeyProps) => {

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
                    <OIcon src={require('../assets/icons/delete.png')} />
                </BtnDel>
            </KeyRow>
        </KeyWrapper>
    )
}

export default NumberKey;