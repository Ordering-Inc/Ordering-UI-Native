import styled from 'styled-components/native'
import { borderColors } from '../../globalStyles'

const Wrapper = styled.TouchableOpacity`
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 0 2px #00000020;
    border-left-width: 5px;
    padding: 10px;
    margin-bottom: 12px;
    margin-left: 3px;
    margin-right: 3px;
    margin-top: 3px;
`
const InnerWrapper = styled.View`
    flex: 1;    
    flex-direction: row;    
`
const InfoWrapper = styled.View`
    flex-grow: 1;
`
const Avatar = styled.Image`
    width: 80px;
    height: 80px;
    resize-mode: contain;
    margin-top: 8px;
    margin-right: 8px;
    border-radius: 10px;
    border: 1px solid #e5e5e5;
`
const Status = styled.View`
    flex: 1;
    align-items: center;
    justify-content: space-between;
    margin-top: 12px;
    flex-direction: row;
`
const Address = styled.View`
    flex: 1;
    flex-direction: row;
    align-items: center;
`
const OrderNumber = styled.View`
    flex: 1;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`
const StatusAction = styled.View`
    flex-grow: 1;
    flex-basis: 0;
    border: 1px solid ${borderColors.lightGray}
    height: 42px;
    border-radius: 10px;
    align-items: center;
    justify-content: center;
`

export { Wrapper, StatusAction, OrderNumber, Address, Status, Avatar, InfoWrapper, InnerWrapper }