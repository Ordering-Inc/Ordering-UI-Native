import styled from 'styled-components/native'

export const Container = styled.View`
  display: flex;
  flex-direction: column;
`
export const ModalContainer = styled.ScrollView`
  padding: 0px 30px;
`
export const ModalTitle = styled.Text`
  font-family: Poppins;
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  color: ${(props: any) => props.theme.colors.textGray};
  margin-bottom: 10px;
`
export const StatusItemWrapper = styled.View`
  flex-direction: row;
  margin-bottom: 16px;
`
export const StatusText = styled.Text`
  font-family: Poppins;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  color: ${(props: any) => props.theme.colors.textGray};
`
