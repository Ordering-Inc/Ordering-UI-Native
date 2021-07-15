import styled from 'styled-components/native'

export const BusinessReviewsContainer = styled.View``

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
`
export const BusinessReviewContent = styled.ScrollView`
  display: flex;
  flex-direction: column;
  padding: 20px;
  margin-top: 40px;
`
export const WrapCustomerReview = styled.View`
  padding: 20px 0;
  border-bottom-width: 1px;
  border-color: ${(props: any) => props.theme.colors.lightGray};
`
export const WrapCustomerReviewTotal = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`
