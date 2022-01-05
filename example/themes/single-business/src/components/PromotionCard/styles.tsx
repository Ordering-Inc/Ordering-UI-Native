import styled from 'styled-components/native'

export const CardContainer = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  border-radius: 10px;
  position: relative;
  margin-bottom: 20px;
  padding: 10px 0 0;
  align-self: flex-start;
`

export const LineDivider = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: ${(props: any) => props.theme.colors.backgroundGray200};
  margin-bottom: 10px;
`

export const WrapImage = styled.View`
  width: 75px;
  height: 75px;
`

export const WrapContent = styled.View`
  display: flex;
  flex-direction: column;
  width: 70%;
`
