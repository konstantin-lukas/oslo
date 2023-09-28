import React, {ReactNode} from "react";
import './Button.scss';
import {styled} from 'styled-components';

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

const AltButton = styled.button`
      background: transparent;
      color: ${props => props.theme.neutral_color};
      &::after {
        background: linear-gradient(0deg, 
        ${props => props.theme.other_opposite},
        ${props => props.theme.other_opposite} 50%,
        ${props => props.theme.theme_color} 50%);
      }
      &:hover {
        color: ${props => props.theme.neutral_opposite};
      }
    `;
export default function Button({children, onClick, altColors, style}: {
    children: ReactNode,
    onClick: () => void,
    altColors?: boolean,
    style?: React.CSSProperties
}
) {
    if (altColors)
        return (
            <AltButton
                onClick={onClick}
                type="button"
                className="defaultButton"
                style={style}
            >
                {children}
            </AltButton>
        );

    return (
        <StyledButton
            onClick={onClick}
            type="button"
            className="defaultButton"
            style={style}
        >
            {children}
        </StyledButton>
    );
}