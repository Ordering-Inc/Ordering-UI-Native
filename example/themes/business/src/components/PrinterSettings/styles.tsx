import styled from "styled-components/native";

export const Container = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  padding: 5px 5px 5px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${(props: any) => props.theme.colors.lightGray};
`

export const EnabledAutoPrint = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px 10px;
`;
