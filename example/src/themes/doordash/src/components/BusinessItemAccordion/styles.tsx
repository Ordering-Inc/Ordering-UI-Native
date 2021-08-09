import React from 'react';
import styled, { css } from 'styled-components/native';
import { colors } from '../../theme.json';

export const BIContainer = styled.View`
  display: flex;
  flex-direction: column;
  width: 100%;
  opacity: 1;

  ${(props: any) => props.isClosed && css`
    background-color: rgba(0, 0, 0, 0.1);
  `}
`

export const BIHeader = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  position: relative;
  padding: 10px;
  border: 1px solid ${colors.border};
  border-radius: 3px;
  overflow: hidden;

  ${(props: any) => props.isClosed && css`
    background-color: rgba(0, 0, 0, 0.1);
  `}
`

export const BIInfo = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 55%;
`

export const BIContent = styled.View`
`

export const BIContentInfo = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  text-transform: capitalize;
  margin-left: 10px;
  max-width: 65%;
`

export const BITotal = styled.View`
  display: flex;
  align-items: center;
  flex-direction: row;
`

export const BIActions = styled.View`
  max-width: 30%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`
