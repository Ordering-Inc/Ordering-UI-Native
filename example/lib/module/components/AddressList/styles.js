import styled, { css } from 'styled-components/native';
export const AddressListContainer = styled.View`
    flex: 1;
    margin-vertical: 20px;
`;
export const AddressItem = styled.TouchableOpacity`
    padding: 20px;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    ${props => props.isSelected && css`
        background-color: #F7F7F7;
    `}
`;
export const ContainerButtons = styled.View`
    margin-vertical: 50px
`;
//# sourceMappingURL=styles.js.map