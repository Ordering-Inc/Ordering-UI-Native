import styled from 'styled-components/native'

export const ReviewOrderContainer = styled.View`
  width: 100%;
  flex: 1;
`
export const ReviewOrderTitle = styled.View``

export const BusinessLogo = styled.View`
  margin-vertical: 5px;
  align-items: center;
`

export const FormReviews = styled.View`
  flex: 1;
  height: 100%;
`

export const Category = styled.View`
  padding: 10px;
  border-width: 1px;
  border-color: ${(props: any) => props.theme.colors.secundaryContrast};
  flex-direction: row;
  justify-content: space-between;
  margin-vertical: 5px;
  border-radius: 10px;
`

export const Stars = styled.View`
  flex-direction: row;
`
