import styled from 'styled-components/native'

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

export { Wrapper, PInner, Price }