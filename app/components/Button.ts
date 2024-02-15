import { styled } from 'styled-components';

export const Button = styled.button<{ $variant?: 'neutral' | 'success' | 'warn' }>`
  background-color: ${({ $variant = 'neutral' }) => {
    switch ($variant) {
      case 'neutral':
        return '#008CBA';
      case 'success':
        return '#4CAF50';
      case 'warn':
        return '#f44336';
    }
  }};
  border: none;
  color: white;
  padding: 1rem;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  cursor: pointer;

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;
