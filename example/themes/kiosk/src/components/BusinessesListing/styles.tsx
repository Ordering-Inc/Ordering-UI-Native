import styled from 'styled-components/native'

export const ListWrapper = styled.View`
	background-color: ${(props: any) => props.theme.colors.backgroundLight};
	padding: 20px 5px 0;
`;

export const CardsContainer = styled.View`
  display: flex;
  width: 100%;
  justify-content: flex-start;
  text-align: center;
  flex-direction: row;
  flex-wrap: wrap;
`

export const WrapperList = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 20px;
`
