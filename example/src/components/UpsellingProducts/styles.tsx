import styled from 'styled-components/native'

export const Container = styled.View`
  margin: 20px 0;
`
export const UpsellingContainer = styled.ScrollView`
  max-height: 220px;
`
export const Item = styled.View`
  border-width: 1px;
  border-color: ${({ colors }: any) => colors.lightGray};
  border-radius: 10px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 15px;
  margin-right: 15px;
`
export const Details = styled.View`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 15px 0 10px 0;
  max-width: 120px;
`
export const AddButton = styled.TouchableOpacity`
`
export const CloseUpselling = styled.View`
  margin-vertical: 10px;
  width: 100%;
`
