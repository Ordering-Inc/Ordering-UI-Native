import styled from 'styled-components/native'

export const AddressFormContainer = styled.View`
  flex: 1;
  padding: 5px 40px;
  background-color: ${(props: any) => props.theme.colors.backgroundPage};
  justify-content: space-between;
`

export const IconsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;
`

export const AutocompleteInput = styled.View`
  z-index: 1000;
`


export const GoogleMapContainer = styled.View`
  flex: 1;
  margin-bottom: 20px;
  max-height: 189px;
  min-height: 189px;
  border-radius: 7.6px;
  overflow: hidden;
`

export const FormInput = styled.View`
  display: flex;
  flex-direction: column;
`
