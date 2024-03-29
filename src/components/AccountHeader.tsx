import React, {useCallback, useContext, useMemo, useState} from "react";
import './AccountHeader.scss';
import DatePicker from 'react-datepicker';
import { add, sub } from 'date-fns';
import {LanguageContext, LightModeContext} from "./misc/Contexts";
import registerLocales from './misc/Locales';
import {useTheme} from "styled-components";
import {formatDate} from "./misc/Format";

registerLocales();

export default function AccountHeader({heading, date, setDate}: {
    heading: string,
    date: {from: Date, until: Date},
    setDate: (date: {from: Date, until: Date}) => void
}) {

    const theme = useTheme();
    const language = useContext(LanguageContext);
    const lightMode = useContext(LightModeContext);
    const [datePickerOpen, setDatePickerOpen] =
        useState<{from: boolean, until: boolean}>(
        {
            from: false,
            until: false
        }
    );
    const pickerClass = useMemo(() => datePickerOpen.from && !datePickerOpen.until ? 'left_open' :
        (!datePickerOpen.from && datePickerOpen.until ? 'right_open' : ''), [datePickerOpen]);

    const closeDatePicker = useCallback(() => {
        setDatePickerOpen({from: false, until: false});
    }, []);

    const datePickerStyle = useMemo(() => {
        return <style>
            {`
                    .react-datepicker__header, .react-datepicker__day--selected {
                        background: ${theme.theme_color};
                        color: ${theme.neutral_color};
                    }
                    .react-datepicker__navigation:hover .react-datepicker__navigation-icon::before, .react-datepicker__navigation-icon::before {
                        border-color: ${theme.neutral_color};
                    }
                    .react-datepicker__day:hover {
                        background: ${lightMode ? theme.other_opposite : theme.neutral_color};
                        color: ${theme.theme_color};
                    }
                `}
        </style>
    }, [theme, lightMode]);

    if (heading && date && setDate) {
        return (
            <div id="main_header">
                <h1 title={heading}>{heading}</h1>
                <div className={pickerClass + ' dateTimePickerContainer'}>
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
                        onClickOutside={pickerClass === 'left_open' ? closeDatePicker : () => {}}
                        locale={language.code}
                        maxDate={sub(new Date(date.until), {days: 1})}
                        selected={date.from}
                        inline/>
                    <DatePicker
                        onChange={() => {}}
                        onSelect={(pickedDate) => {
                            setDate({
                                ...date,
                                until: pickedDate
                            });
                            closeDatePicker();
                        }}
                        onClickOutside={pickerClass === 'right_open' ? closeDatePicker : () => {}}
                        locale={language.code}
                        minDate={add(new Date(date.from), {days: 1})}
                        selected={date.until}
                        inline/>
                </div>
                <div id="time_span">
                    <span
                        id="from_date"
                        onClick={() => {
                            setDatePickerOpen({from: true, until: false});
                        }}
                    >
                        {formatDate(language.code, date.from)}
                    </span>
                    <span
                        id="until_date"
                        onClick={() => {
                            setDatePickerOpen({from: false, until: true});
                        }}
                    >
                        {formatDate(language.code, date.until)}
                    </span>
                </div>
            </div>
        );
    } else {
        return <></>;
    }
}