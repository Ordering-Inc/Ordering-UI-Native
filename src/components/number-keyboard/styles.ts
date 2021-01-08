import styled from 'styled-components/native'

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

export { KeyWrapper, KeyRow, BtnDel }