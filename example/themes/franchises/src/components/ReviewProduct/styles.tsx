import styled from 'styled-components/native'

export const ReviewOrderContainer = styled.View`
  width: 100%;
  flex: 1;
`
export const ReviewOrderTitle = styled.View`

`

export const BusinessLogo = styled.View`
  margin-vertical: 5px;
  align-items: center;
  box-shadow: 0 1px 2px #ddd;
  border-radius: 7.6px;
  margin-bottom: 20px;
`

export const FormReviews = styled.View`
  flex: 1;
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
export const HWrapper = styled.View`
  flex-direction: row;
  align-items: center;
`

export const BlockWrap = styled.View`
  margin-vertical: 16px;
  padding-bottom: 20px;
`;

export const CommentItem = styled.TouchableOpacity`
  padding: 3px 10px;
  border-radius: 20px;
  min-height: 24px;
`;
export const IconBtn = styled.TouchableOpacity`
  padding-horizontal: 7px;
`;