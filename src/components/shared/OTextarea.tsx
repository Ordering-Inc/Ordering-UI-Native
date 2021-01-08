import * as React from 'react'
import styled from 'styled-components/native'
import { colors } from '../../globalStyles'

const Wrapper = styled.View`
    padding: 10px;
    border-radius: 10px;
    border: 1px solid ${colors.lightGray};
`
const Inner = styled.TextInput`
    height: 150px;
`

export interface OTextAreaProps {
    lines?: number,
    value?: string,
    placeholder?: string
}

const OTextarea = (props: OTextAreaProps) => {
    return (
        <Wrapper>
            <Inner
                placeholder={props.placeholder}
                placeholderTextColor={colors.lightGray}
                numberOfLines={props.lines}
                underlineColorAndroid={'transparent'}
                value={props.value}
                multiline={true}
            />
        </Wrapper>
    )
}

export default OTextarea;