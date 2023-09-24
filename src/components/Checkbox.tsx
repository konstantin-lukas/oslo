import React, {ChangeEventHandler} from "react";
import './Checkbox.scss';
import styled from "styled-components";

const StyledSpan = styled.span`
      &::after {
        background: ${props => props.theme.theme_color};
      }
      input:checked + & {
        background: ${props => props.theme.theme_color};
      }
      input:checked + &::after {
        background: ${props => props.theme.other_opposite};
      }
    `;
export default function Checkbox({onChange, checked, label}: {
    onChange: ChangeEventHandler<HTMLInputElement>
    checked: boolean,
    label: string
}) {
    return (
        <label className="container"><span>{label}</span>
            <input type="checkbox" onChange={onChange} checked={checked}/>
            <StyledSpan className="toggle_checkbox"></StyledSpan>
        </label>
    );
}