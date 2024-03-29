import styled from 'styled-components/native'

export const CardContainer = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  position: relative;
  border-bottom-width: 1px;
  border-color: ${(props: any) => props.theme.colors.lightGray};
  marginBottom: 15px;
`
export const CardInfo = styled.View`
  padding-right: 10px;
  flex: 1;
  align-items: flex-start;
`
export const SoldOut = styled.View`
  position: absolute;
  background: ${(props: any) => props.theme.colors.lightGray} 0% 0% no-repeat padding-box;
  border-radius: 23px;
  padding: 5px 10px;
  top: 5px;
  right: 6px;
`
