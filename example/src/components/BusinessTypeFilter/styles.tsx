import styled from 'styled-components/native'
import { colors } from '../../theme'

export const BusinessCategoriesTitle = styled.View`
  flex: 1;
  margin-top: 10px;
  margin-bottom: 5px;
`

export const BusinessCategories = styled.View`
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 10px 0px;
  width: 100%;
`
export const Category = styled.View`
  flex-direction: column;
  align-content: stretch;
  width: 18%;
`

export const IconContainer = styled.View`
  border-width: 1px;
  display: flex;
  border-color: ${colors.backgroundGray};
  align-items: center;
  justify-content: center;
  border-radius: 10px;
`
