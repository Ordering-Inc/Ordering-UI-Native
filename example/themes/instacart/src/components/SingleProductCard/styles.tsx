import styled from 'styled-components/native'

export const CardContainer = styled.TouchableOpacity`
  flex: 1;
  align-items: flex-start;
  padding: 10px;
  position: relative;
  max-width: 150px;
  width: 150px;
  margin-end: 10px;
  border-radius: 3px;
`
export const CardInfo = styled.View`
  flex: 1;
  align-items: flex-start;
`
export const SoldOut = styled.View`
  position: absolute;
  background: ${(props: any) => props.theme.colors.lightGray} 0% 0% no-repeat padding-box;
  border-radius: 23px;
  padding: 5px 10px;
  top: 7px;
  right: 6px;
`
