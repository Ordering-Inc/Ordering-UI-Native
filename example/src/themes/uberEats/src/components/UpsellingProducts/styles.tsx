import styled from 'styled-components/native'

export const Container = styled.ScrollView`
  flex: 1;
`

export const Item = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: ${(props: any) => props.theme.colors.mediumGray};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 15px;
  margin-bottom: 15px;
`

export const ItemContent = styled.View`
  flex-direction: row;
`

export const Details = styled.View`
  flex-direction: column;
  justify-content: center;
  max-width: 120px;
  margin-left: 10px;
`
export const AddButton = styled.TouchableOpacity`
  background-color: ${(props: any) => props.theme.colors?.mediumGray};
  flex-direction: row;
  align-items: center;
  border-radius: 30px;
  padding: 5px 10px;
`
export const CloseUpselling = styled.View`
  margin-vertical: 10px;
  margin: 0 20px;
`
