import * as React from 'react'
import styled from 'styled-components/native'
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

const NumberKey = () => {

    const onChange = (val: number) => {

    }

    return (
        <KeyWrapper>
            <KeyRow>
                <OKeyButton title={'1'} onClick={() => onChange(1)} />
            </KeyRow>
        </KeyWrapper>
    )
}

export default NumberKey;