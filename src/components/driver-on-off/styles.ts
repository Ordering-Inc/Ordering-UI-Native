import styled from 'styled-components/native';

const InnerWrapper = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`
const NameView = styled.View`
    flex-shrink: 1;
    align-items: flex-start;
`
const UserInfoView = styled.View`
    flex-direction: row;
    align-items: center;
    padding-right: 5px;
`
const Avatar = styled.Image`
    width: 60px;
    height: 60px; 
    margin-right: 6px;
    border-radius: 8px;
`
const FindingBtn = styled.TouchableOpacity`
    margin-top: 16px;
    margin-bottom: 10px;
    align-items: center;
`

export { InnerWrapper, NameView, UserInfoView, Avatar, FindingBtn }