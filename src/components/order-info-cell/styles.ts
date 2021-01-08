import styled from 'styled-components/native'

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

export { KindItems, KInfoWrap, KInner, KActions }