import React, {useState} from "react";
import './Dropdown.scss';

export default function Dropdown({options, selected}: {options: string[], selected: number}) {
    const [isOpen, setIsOpen] = useState(false);
    const spans = options.map((option, i) =>
        <span key={i} className={"option" + (i === selected ? " selected_options" : "")}>{option}</span>
    );


    return (
        <span className={"custom-select-container limited_height" + (isOpen ? ' open' : '')} onClick={() => {
            setIsOpen(!isOpen);
        }}>
            <span className="selected">{options[selected]}</span>
            <span className="custom-select">
                <span className="scroll-anchor hide_scrollbar">
                    {spans}
                </span>
            </span>
        </span>
    );
}