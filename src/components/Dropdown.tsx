import React, {useEffect, useMemo, useState} from "react";
import './Dropdown.scss';

export default function Dropdown({labels, values, defaultSelected, returnValue, compact}: {
    labels: string[],
    values: string[],
    defaultSelected: string,
    returnValue: (value: string) => void
    compact?: boolean
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [selection, setSelection] = useState({
        label: labels.find((label, i) => defaultSelected === values[i]),
        value: defaultSelected
    })
    useEffect(() => {
        setSelection({
            label: labels.find((label, i) => defaultSelected === values[i]),
            value: defaultSelected
        })
    }, [labels, defaultSelected]);
    const spans = useMemo(() => labels.map((label, i) =>
        (
            <span
                key={i}
                className={"option" + (values[i] === selection.value ? " selected_option" : "")}
                onClick={() => {
                    setSelection({
                        label,
                        value: values[i]
                    });
                }}
            >{label}</span>
        )
    ), [labels, values, selection]);
    useEffect(() => {
        returnValue(selection.value);
    }, [selection]);
    return (
        <span className={"custom-select-container limited_height" + (isOpen ? ' open' : '') + (compact ? ' compact' : '')} onClick={() => {
            setIsOpen(!isOpen);
        }}>
            <span className="selected">{selection.label}</span>
            <span className="custom-select">
                <span className="scroll-anchor hide_scrollbar">
                    {spans}
                </span>
            </span>
        </span>
    );
}