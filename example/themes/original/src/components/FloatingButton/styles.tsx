import styled from 'styled-components/native'

export const Container = styled.View`
  position: absolute;
  bottom: 0px;
  left: 0;
  right: 0;
  padding: 12px 20px;
  flex-direction: row;
  border-top-width: 1px;
  border-color: ${(props: any) => props.theme.colors.border};
  width: 100%;
  justify-content: space-between;
  background-color: #FFF;
  z-index: 20001;
  justify-content: space-between;
`

export const Button = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  border-radius: 7.6px;
  height: 44px;
  max-height: 44px;
  padding-horizontal: 20px;
`
