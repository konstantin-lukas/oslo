import React from "react";
import styled from "styled-components";
import { forwardRef } from 'react';
const StyledInput = styled.input`
    &::selection {
      color: ${props => props.theme.neutral_color};
      background: rgba(${props => props.theme.theme_color.r},${props => props.theme.theme_color.g},${props => props.theme.theme_color.b},0.99);
    }
`;
export default forwardRef(function Input({id, className, name} : {
    id?: string,
    className?: string,
    name?: string
}, ref: React.Ref<HTMLInputElement>) {
    return <StyledInput
        type="text"
        id={id}
        autoCorrect="off"
        autoComplete="off"
        className={className}
        name={name}
        ref={ref}
    />
});