import styled from 'styled-components/native'
import { colors } from '../../theme';

export const AddressFormContainer = styled.View`
    flex: 1;
    padding: 20px;
    background-color: ${colors.backgroundPage};
`

export const IconsContainer = styled.View`
    flex-direction: row;
    justify-content: space-between;
    margin-vertical: 20px;
`

export const AutocompleteInput = styled.View`
    height: 100px;
    padding: 10px
`