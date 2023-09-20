import React, {useState} from "react";
import './AccountHeader.scss';
import DatePicker, {registerLocale} from 'react-datepicker';
import { add, sub } from 'date-fns';
import es from 'date-fns/locale/es';
registerLocale('es', es);


// TODO: LOCALE BASED ON LANGUAGE
export default function AccountHeader({heading, date, setDate}: {
    heading: string,
    date: {from: Date, until: Date},
    setDate: (date: {from: Date, until: Date}) => void
}) {

    const [datePickerOpen, setDatePickerOpen] =
        useState<{from: boolean, until: boolean}>(
        {
            from: true,
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
        let datePicker;
        if (datePickerOpen.from && !datePickerOpen.until) {
            datePicker = (
                <div id="dateTimePickerContainer">
                    <DatePicker
                        onChange={() => {
                        }}
                        onSelect={(pickedDate) => {
                            setDate({
                                ...date,
                                from: pickedDate
                            });
                            closeDatePicker();
                        }}
                        onClickOutside={closeDatePicker}
                        locale="es"
                        maxDate={sub(new Date(date.until), {days: 1})}
                        selected={date.from}
                        inline/>
                </div>
            );
        } else if (!datePickerOpen.from && datePickerOpen.until) {
            datePicker = (
                <div id="dateTimePickerContainer">
                    <DatePicker
                        onChange={() => {
                        }}
                        onSelect={(pickedDate) => {
                            setDate({
                                ...date,
                                until: pickedDate
                            });
                            closeDatePicker();
                        }}
                        onClickOutside={closeDatePicker}
                        locale="es"
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
                <h1>{heading}</h1>
                {datePicker}
                <div id="time_span">
                    <span
                        id="from_date"
                        onClick={() => {
                            setDatePickerOpen({from: true, until: false});
                        }}
                    >
                        {date.from.toLocaleDateString('de', localeOptions)}
                    </span>
                    <span
                        id="until_date"
                        onClick={() => {
                            setDatePickerOpen({from: false, until: true});
                        }}
                    >
                        {date.until.toLocaleDateString('de', localeOptions)}
                    </span>
                </div>
            </div>
        );
    } else {
        //TODO: LOADING SYMBOL
        return (
            <div id="main_header">
                <h1>Loading</h1>
            </div>
        );
    }
}