import React, {ChangeEventHandler, useContext} from "react";
import {TextContext} from "./misc/Contexts";
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
export default function Checkbox({onChange, checked}: {
    onChange?: ChangeEventHandler<HTMLInputElement>
    checked: boolean
}) {
    const text = useContext(TextContext);
    return (
        <label className="container"><span id="negative_span">{text?.allow_overdrawing_}</span>
            <input type="checkbox" name="negative_values" onChange={onChange} checked={checked}/>
            <StyledSpan className="toggle_checkbox"></StyledSpan>
        </label>
    );
}