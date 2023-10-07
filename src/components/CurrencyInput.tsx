import React, {useContext, useEffect, useRef, useState} from "react";
import IntlCurrencyInput from "intl-currency-input";
import {FormatterInitializer} from "moneydew";
import Input from "./Input";
import {CurrencyContext, LanguageContext} from "./misc/Contexts";

export default function CurrencyInput({value, setValue, customFormat, noStrictMode, min}: {
    value: string,
    setValue: (value: string) => void,
    customFormat?: FormatterInitializer,
    noStrictMode?: boolean,
    min?: string
}) {
    const language = useContext(LanguageContext);
    const currency = useContext(CurrencyContext);
    const currencyInputElement = useRef<HTMLInputElement | null>(null);
    const [currencyInput, setCurrencyInput] = useState<IntlCurrencyInput | null>(null);
    const [valueState, setValueState] = useState(value);

    useEffect(() => {
        const input = currencyInputElement.current;
        if (input && !currencyInput) {
            const newInput = new IntlCurrencyInput(input, value, customFormat || {
                ...language.format,
                currencyName: currency.symbol === currency.name ? '' : currency.name,
                currencySymbol: currency.symbol
            });
            if (!noStrictMode)
                newInput.enableStrictMode();
            if (min)
                newInput.setMin(min);
            newInput.validCallback(() => setValueState(newInput.getValue()));
            setCurrencyInput(newInput);
            return () => {
                newInput.unmount();
            }
        }

    }, []);
    useEffect(() => {
        if (!customFormat) {
            currencyInput?.format({
                ...language.format,
                currencyName: currency.symbol === currency.name ? '' : currency.name,
                currencySymbol: currency.symbol
            });
        }
    }, [language, currency]);
    useEffect(() => {
        if (customFormat) {
            currencyInput?.format(customFormat);
        }
    }, [customFormat]);
    useEffect(() => {
        const input = currencyInputElement.current;
        if (input && currencyInput)
            currencyInput.remount(input);
    }, [currencyInputElement]);
    useEffect(() => {
        setValue(valueState);
    }, [valueState]);
    useEffect(() => {
        if (currencyInput && value && valueState !== value) {
            currencyInput.setValue(value);
            setValueState(value);
        }
    }, [value]);
    return (
        <Input ref={currencyInputElement} name="amount"/>
    );
}