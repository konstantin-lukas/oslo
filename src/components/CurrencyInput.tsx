import React, {useEffect, useRef, useState} from "react";
import IntlCurrencyInput from "intl-currency-input";
import {DisplayOrder} from "moneydew";
import Input from "./Input";

export default function CurrencyInput({value, setValue}: {
    value: string,
    setValue: (value: string) => void
}) {
    const currencyInputElement = useRef<HTMLInputElement | null>(null);
    const [currencyInput, setCurrencyInput] = useState<IntlCurrencyInput | null>(null);
    const [valueState, setValueState] = useState(value);
    let mounted = false;
    useEffect(() => {
        const input = currencyInputElement.current;
        if (input && !currencyInput && !mounted) {
            mounted = true;
            const newInput = new IntlCurrencyInput(input, value, {
                currencyName: 'EUR',
                currencySymbol: '€',
                groupSeparator: ' ',
                decimalSeparator: ',',
                displayOrder: DisplayOrder.NAME_SIGN_NUMBER_SYMBOL,
            });
            newInput.enableStrictMode();
            newInput.validCallback(() => setValueState(newInput.getValue()));
            setCurrencyInput(newInput);
        }
    }, []);
    useEffect(() => {
        const input = currencyInputElement.current;
        if (input && currencyInput)
            currencyInput.remount(input);
    }, [currencyInputElement]);
    useEffect(() => {
        setValue(valueState);
    }, [valueState]);
    useEffect(() => {
        if (currencyInput && valueState !== value) {
            currencyInput.setValue(value);
        }
    }, [value]);
    return (
        <Input ref={currencyInputElement} name="amount"/>
    );
}