import styled from 'styled-components/native';

export const Container = styled.View`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
  align-items: center;
  height: ${(props: any) =>
    props?.orientation === 'Portrait' && props?.height
      ? `${props.height}px`
      : 'auto'};
`;

export const LogoWrapper = styled.View`
  margin-top: 30px;
  margin-bottom: 50px;
  align-items: center;
  justify-content: center;
`;
