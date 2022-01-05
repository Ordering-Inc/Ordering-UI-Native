import styled from 'styled-components/native'

export const CardContainer = styled.TouchableOpacity`
  flex: 1;
  align-items: flex-start;
  padding: 10px;
  position: relative;
  margin-end: 10px;
  border-radius: 3px;
`
export const CardInfo = styled.View`
  flex: 1;
  align-items: flex-start;
`
export const SoldOut = styled.View`
  position: absolute;
  background: ${(props: any) => props.theme.colors.black} 0% 0% no-repeat padding-box;
  padding: 3px 9px;
  top: 91px;
  left: 10px;
`
