import React, {FormEventHandler, forwardRef} from "react";
import {styled} from "styled-components";
import './Input.scss';
const StyledInput = styled.input`
    &::selection {
      color: ${props => props.theme.neutral_color};
      background: ${props => props.theme.theme_color};
    }
`;
export default forwardRef(function Input({id, className, name, defaultValue, onInput, readOnly} : {
    id?: string,
    className?: string,
    name?: string,
    defaultValue?: string,
    onInput?: FormEventHandler<HTMLInputElement>,
    readOnly?: boolean
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
        readOnly={readOnly}
    />
});