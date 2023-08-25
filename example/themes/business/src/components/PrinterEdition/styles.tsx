import styled from "styled-components/native";

export const ContainerEdition = styled.View`
  margin-bottom: 50px;
`

export const BackArrowWrapper = styled.View`
  align-items: center;
  flex-direction: row;
  min-height: 33px;
`

export const BackArrow = styled.TouchableOpacity`
  border-width: 0;
  width: 32px;
  height: 32px;
  tint-color: ${(props: any) => props.theme.colors.textGray};
  background-color: ${(props: any) => props.theme.colors.clear};
  border-color: ${(props: any) => props.theme.colors.clear};
  shadow-color: ${(props: any) => props.theme.colors.clear};
  padding-left: 0;
  padding-right: 0;
`

export const WrapperHeader = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
`

export const WrapperIcons = styled.View`
  flex-direction: column;
  justify-content: flex-start;
  margin-top: 20px;
`

export const WrapperIcon = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: flex-start;
  padding: 8px;
  border-width: 1px;
  border-radius: 8px;
  margin-bottom: 10px;
`

export const ContainerList = styled.View`
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
  padding: 20px 0px 10px;
`;
