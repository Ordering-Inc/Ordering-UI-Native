import * as React from 'react'
import styled from 'styled-components/native'

const Wrapper = styled.View`
    border-top-right-radius: 25px;
    border-top-left-radius: 25px;
    box-shadow: 0 -1px 3px #00000010;
    background-color: white;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    min-height: 100px;
    padding: 25px;
`

const BottomWrapper = ({ children }: any) => {
    return (
        <Wrapper>{ children }</Wrapper>
    )
}

export default BottomWrapper