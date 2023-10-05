import React, {useEffect, useMemo, useRef, useState} from "react";
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
                    setIsOpen(false);
                }}
            >{label}</span>
        )
    ), [labels, values, selection]);
    useEffect(() => {
        returnValue(selection.value);
    }, [selection]);
    const ref = useRef(null);
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                ref.current &&
                e.target instanceof HTMLElement &&
                !ref.current.contains(e.target)
            ) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref]);
    return (
        <span ref={ref} className={"custom-select-container limited_height" + (isOpen ? ' open' : '') + (compact ? ' compact' : '')} >
            <span onClick={() => setIsOpen(!isOpen)} className="selected">{selection.label}</span>
            <span className="custom-select">
                <span className="scroll-anchor hide_scrollbar">
                    {spans}
                </span>
            </span>
        </span>
    );
}