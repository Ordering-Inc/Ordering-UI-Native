import styled from 'styled-components/native'

export const BCContainer = styled.View`
  display: flex;
  width: 100%;
  justify-content: flex-start;
  text-align: center;
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
  margin: ${(props: any) => props.mt ?? 10}px 0px 10px;
  width: 100%;
`
export const Category = styled.View`
  height: 150px;
  width: 100px;
  margin-right: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
