import React, {useContext} from "react";
import {TextContext} from "./misc/Contexts";
import './Checkbox.scss';
import styled from "styled-components";

const StyledSpan = styled.span`
      &::after {
        background: rgb(${props => props.theme.theme_color.r},
        ${props => props.theme.theme_color.g},
        ${props => props.theme.theme_color.b});
      }
      input:checked + & {
        background: rgb(${props => props.theme.theme_color.r},
        ${props => props.theme.theme_color.g},
        ${props => props.theme.theme_color.b});
      }
      input:checked + &::after {
        background: ${props => props.theme.neutral_color};
      }
    `;
export default function Checkbox() {
    const text = useContext(TextContext);

    return (
        <label className="container"><span id="negative_span">{text?.allow_overdrawing_}</span>
            <input type="checkbox" name="negative_values"/>
            <StyledSpan className="toggle_checkbox"></StyledSpan>
        </label>
    );
}