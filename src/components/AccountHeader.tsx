import React, {useContext, useState} from "react";
import './AccountHeader.scss';
import DatePicker from 'react-datepicker';
import { add, sub } from 'date-fns';
import {LanguageContext} from "./misc/Contexts";
import registerLocales from './misc/Locales';
import {useTheme} from "styled-components";
registerLocales();

export default function AccountHeader({heading, date, setDate}: {
    heading: string,
    date: {from: Date, until: Date},
    setDate: (date: {from: Date, until: Date}) => void
}) {

    const theme = useTheme();
    const language = useContext(LanguageContext);
    const [datePickerOpen, setDatePickerOpen] =
        useState<{from: boolean, until: boolean}>(
        {
            from: false,
            until: false
        }
    );

    const closeDatePicker = () => {
        setDatePickerOpen({from: false, until: false});
    }



    if (heading && date && setDate) {
        const localeOptions: Intl.DateTimeFormatOptions = {
            month: "2-digit",
            day: "2-digit",
            year: "numeric"
        }

        const datePickerStyle = (
            <style>
                {`
                    .react-datepicker__header, .react-datepicker__day--selected {
                        background: rgb(${theme.theme_color.r},${theme.theme_color.g},${theme.theme_color.b});
                        color: ${theme.neutral_color};
                    }
                    .react-datepicker__navigation:hover .react-datepicker__navigation-icon::before, .react-datepicker__navigation-icon::before {
                        border-color: ${theme.neutral_color};
                    }
                    .react-datepicker__day:hover {
                        background: ${theme.neutral_color};
                        color: rgb(${theme.theme_color.r},${theme.theme_color.g},${theme.theme_color.b});
                    }
                `}
            </style>
        );
        let datePicker;
        if (datePickerOpen.from && !datePickerOpen.until) {
            datePicker = (
                <div id="dateTimePickerContainer">
                    {datePickerStyle}
                    <DatePicker
                        onChange={() => {}}
                        onSelect={(pickedDate) => {
                            setDate({
                                ...date,
                                from: pickedDate
                            });
                            closeDatePicker();
                        }}
                        onClickOutside={closeDatePicker}
                        locale={language}
                        maxDate={sub(new Date(date.until), {days: 1})}
                        selected={date.from}
                        inline/>
                </div>
            );
        } else if (!datePickerOpen.from && datePickerOpen.until) {
            datePicker = (
                <div id="dateTimePickerContainer">
                    {datePickerStyle}
                    <DatePicker
                        onChange={() => {}}
                        onSelect={(pickedDate) => {
                            setDate({
                                ...date,
                                until: pickedDate
                            });
                            closeDatePicker();
                        }}
                        onClickOutside={closeDatePicker}
                        locale={language}
                        minDate={add(new Date(date.from), {days: 1})}
                        selected={date.until}
                        inline/>
                </div>
            );
        } else {
            datePicker = <></>;
        }
        return (
            <div id="main_header">
                <h1 title={heading}>{heading}</h1>
                {datePicker}
                <div id="time_span">
                    <span
                        id="from_date"
                        onClick={() => {
                            setDatePickerOpen({from: true, until: false});
                        }}
                    >
                        {date.from.toLocaleDateString(language, localeOptions)}
                    </span>
                    <span
                        id="until_date"
                        onClick={() => {
                            setDatePickerOpen({from: false, until: true});
                        }}
                    >
                        {date.until.toLocaleDateString(language, localeOptions)}
                    </span>
                </div>
            </div>
        );
    } else {
        return <></>;
    }
}