import * as React from 'react'
import styled, { useTheme } from 'styled-components/native'

interface Props {
    lines?: number,
    value?: string,
    placeholder?: string
}

const Wrapper = styled.View`
    padding: 10px;
    border-radius: 10px;
    border: 1px solid ${(props: any) => props.theme.colors.lightGray};
`
const Inner = styled.TextInput`
    height: 150px;
`

const OTextarea = (props: Props) => {
    const theme = useTheme();
    return (
        <Wrapper>
            <Inner
                placeholder={props.placeholder}
                placeholderTextColor={theme.colors.lightGray}
                numberOfLines={props.lines}
                underlineColorAndroid={'transparent'}
                value={props.value}
                multiline={true}
            />
        </Wrapper>
    )
}

export default OTextarea;
