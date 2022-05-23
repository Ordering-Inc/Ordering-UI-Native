import styled, { css } from 'styled-components/native'

export const PromotionsContainer = styled.View`
  width: 100%;
`

export const SingleOfferContainer = styled.View`
  flex-direction: row;
  width: 100%;
  height: 80px;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

`

export const OfferInformation = styled.View`
  justify-content: space-between;
  max-width: 75%;
`

export const SearchBarContainer = styled.View`
  display: flex;
  width: 100%;
  justify-content: flex-start;
  margin-bottom: 20px;
  .search-bar {
    justify-content: flex-start;
    input {
      width: 100%;
    }
  }
  .clear {
    right: 0;
  }
`

export const SingleBusinessOffer = styled.View`
  flex-direction: row;
`

export const AvailableBusinesses = styled.View`
  flex-direction: row;
  overflow: hidden;
`

export const OfferData = styled.View`
  display: flex;
  align-items: center;
  flex-direction: column;
  p{
    color: #909BA9;
    margin: 3px;
    font-size: 14px;
  }
`

export const Code = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
`

export const ValueOfOffer = styled.View`
  p{
    font-size: 16px;
  }
  span{
    font-size: 20px;
  }
`

export const BusinessInfo = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-left: 10px;
`
