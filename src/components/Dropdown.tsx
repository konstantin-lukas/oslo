import React, {useEffect, useState} from "react";
import './Dropdown.scss';

export default function Dropdown({options, defaultSelected, returnValue}: {
    options: string[],
    defaultSelected: number,
    returnValue: (value: number) => void
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(defaultSelected);
    const spans = options.map((option, i) =>
        (
            <span
                key={i}
                className={"option" + (i === selectedIndex ? " selected_options" : "")}
                data-value={i}
                onClick={e => {
                    setSelectedIndex(parseInt((e.target as HTMLSpanElement).getAttribute('data-value')));
                }}
            >{option}</span>
        )
    );
    useEffect(() => {
        returnValue(selectedIndex);
    }, [selectedIndex]);


    return (
        <span className={"custom-select-container limited_height" + (isOpen ? ' open' : '')} onClick={() => {
            setIsOpen(!isOpen);
        }}>
            <span className="selected">{options[selectedIndex]}</span>
            <span className="custom-select">
                <span className="scroll-anchor hide_scrollbar">
                    {spans}
                </span>
            </span>
        </span>
    );
}