import React, {ReactNode} from "react";
import './Button.scss';
import styled from 'styled-components';

const StyledButton = styled.button`
      background: transparent;
      color: ${props => props.theme.neutral_color};
      &::after {
        background: linear-gradient(0deg, 
        ${props => props.theme.neutral_color},
        ${props => props.theme.neutral_color} 50%,
        ${props => props.theme.theme_color} 50%);
      }
      &:hover {
        color: ${props => props.theme.neutral_opposite};
      }
    `;
export default function Button(
    {children, onClick}: {children: ReactNode, onClick: () => void}
) {

    return (
        <StyledButton
            onClick={onClick}
            type="button"
            className="defaultButton"
        >
            {children}
        </StyledButton>
    );
}