import React from 'react';
import styled from 'styled-components/native';
import Touchable from '@appandflow/touchable';

const Button = styled(Touchable).attrs({
  feedback: 'opacity',
  hitSlop: { top: 20, bottom: 20, right: 20, left: 20 }
})`
  margin-right: ${props => props.side === 'right' ? 15 : 0}
  margin-left: ${props => props.side === 'left' ? 15 : 0}
  justify-content: center;
  align-items: center;
`;

export default function ({ side, children, onPress, disabled }) {
  return (
    <Button onPress={onPress} disabled={disabled} side={side}>
      {children}
    </Button>
  )
}