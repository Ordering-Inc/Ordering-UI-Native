import styled from 'styled-components/native';

export const BusinessReviewsContainer = styled.View`
  margin-top: 12px;
`;

export const ScoreView = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-width: 1px;
  border-color: ${(props: any) => props.theme.colors.lightGray};
  border-radius: 10px;
  padding: 10px;
  width: 170px;
  margin-right: 15px;
`;
export const BusinessReviewContent = styled.ScrollView`
  display: flex;
  flex-direction: column;
  margin-top: 24px;
`;
export const WrapCustomerReview = styled.View`
  padding: 20px 0;
  border-bottom-width: 1px;
  border-color: ${(props: any) => props.theme.colors.lightGray};
`;
export const WrapCustomerReviewTotal = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;
export const StarPointsView = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	padding-vertical: 4px;
`;
export const ReviewSearchView = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	padding-top: 10px;
	padding-bottom: 0px;
	border-bottom-width: 1px;
	border-bottom-color: ${(props: any) => props.theme.colors.border};
	margin-bottom: 12px;
`;
export const ReviewProgressView = styled.View`
	padding-top: 10px;
	padding-bottom: 0px;
	margin-bottom: 12px;
`;
export const PrincipalWrapView = styled.View`
	padding-vertical: 17px;
	margin-bottom: 12px;
`;
