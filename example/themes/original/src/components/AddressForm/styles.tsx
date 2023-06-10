import styled from 'styled-components/native'

export const AddressFormContainer = styled.View`
    flex: 1;
    padding: 0px 20px 20px;
    background-color: ${(props: any) => props.theme.colors.backgroundPage};
    justify-content: space-between;
`

export const IconsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;
  margin-horizontal: -16px;
`

export const AutocompleteInput = styled.View`
  z-index: 1000;
`

export const GoogleMapContainer = styled.View`
  flex: 1;
`

export const FormInput = styled.View`
  display: flex;
  flex-direction: column;
`
