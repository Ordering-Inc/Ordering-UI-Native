import styled from 'styled-components/native'

export const Container = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  width: 100%;
`

export const ItemListing = styled.ScrollView`
  padding: 0 20px;
  margin: 0 0 140px;
`

export const TopHeader = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  z-index: 1;
  padding: 0 20px;
`

export const HeaderItem = styled.TouchableOpacity`
  overflow: hidden;
  background-color: ${(props: any) => props.theme.colors.clear};
  width: 35px;
  margin: 18px 0;
`
