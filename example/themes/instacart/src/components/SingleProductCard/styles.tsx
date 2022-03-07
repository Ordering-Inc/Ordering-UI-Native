import styled from 'styled-components/native'

export const CardContainer = styled.TouchableOpacity`
  flex-direction: column;
  padding: 10px;
  position: relative;
`
export const CardInfo = styled.View`
  flex: 1;
  align-items: flex-start;
`
export const SoldOut = styled.View`
  position: absolute;
  background: ${(props: any) => props.theme.colors.black} 0% 0% no-repeat padding-box;
  padding: 3px 9px;
  left: 0px;
  bottom: -5px;
  border-radius: 3px;
`
