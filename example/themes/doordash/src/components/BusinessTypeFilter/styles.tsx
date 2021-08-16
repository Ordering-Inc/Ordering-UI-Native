import styled from 'styled-components/native'

export const BCContainer = styled.View`
  display: flex;
  width: 100%;
  justify-content: flex-start;
  text-align: center;
  min-height: 140px;
`

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
  margin: 30px 0px;
  width: 100%;
`
export const Category = styled.View`
  min-width: 52px;
  margin-end: 22px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export const IconContainer = styled.View`
  border-width: 1px;
  display: flex;
  border-color: ${(props: any) => props.theme.colors.backgroundGray};
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  height: 60px;
`
