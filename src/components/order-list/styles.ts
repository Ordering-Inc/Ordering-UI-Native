import styled from 'styled-components/native'

const Wrapper = styled.View`
    flex: 1;
    background-color: white;
    padding-horizontal: 12px;
    padding-top: 110px;
    padding-bottom: 20px;
    position: relative;
`
const FilterWrapper = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-vertical: 10px;
    z-index: 10;
`

export { Wrapper, FilterWrapper }