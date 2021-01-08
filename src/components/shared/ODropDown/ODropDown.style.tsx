import styled from 'styled-components/native'
import { colors } from '../../../globalStyles'

const DropWrapper = styled.View`
    background-color: white;
    padding: 10px 14px;
    border-radius: 20px;
    border-width: 1px;
    border-color: ${colors.primary}
    flex-grow: 1;
    flex-basis: 0;
    align-items: center;
    justify-content: center;
`
const InnerWrapper = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`
const SelLabel = styled.Text`
    flex: 1;
    font-family: 'Poppins-Regular';
    color: grey;
    flex-grow: 1;
    margin: 0 10px;
`
const DropIcon = styled.Image`
    tint-color: ${colors.primary};
    resize-mode: contain;
    width: 7px;
    height: 7px;
`
const KindIcon = styled.Image`
    tint-color: ${colors.primary};
    resize-mode: contain;
    width: 14px;
    height: 14px;
`
const DropView = styled.View`
    position: absolute;
    box-shadow: 0 4px 3px #00000022;
    background-color: white;
    top: 42px;
    left: 20px;
    width: 100%;
    padding: 4px 5px;
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
`
const DropItems = styled.Text`
    padding: 9px 5px;
    border-bottom-width: 1px;
    border-bottom-color: red;
    margin-bottom: 2px;
`

export { DropWrapper, InnerWrapper, SelLabel, DropIcon, KindIcon, DropView, DropItems }