import React, {FormEventHandler} from "react";
import styled from "styled-components";
import { forwardRef } from 'react';
const StyledInput = styled.input`
    &::selection {
      color: ${props => props.theme.neutral_color};
      background: rgba(${props => props.theme.theme_color.r},${props => props.theme.theme_color.g},${props => props.theme.theme_color.b},0.99);
    }
`;
export default forwardRef(function Input({id, className, name, defaultValue, onInput} : {
    id?: string,
    className?: string,
    name?: string,
    defaultValue?: string,
    onInput?: FormEventHandler<HTMLInputElement>
}, ref: React.Ref<HTMLInputElement>) {
    return <StyledInput
        type="text"
        id={id}
        autoCorrect="off"
        autoComplete="off"
        spellCheck={false}
        className={className}
        name={name}
        ref={ref}
        defaultValue={defaultValue}
        onInput={onInput}
    />
});