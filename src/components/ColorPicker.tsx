import React, {useContext, useEffect, useMemo, useRef, useState} from "react";
import Pickr from "@simonwep/pickr";
import './ColorPicker.scss';
import {useTheme} from "styled-components";
import {LightModeContext} from "./misc/Contexts";

export default function ColorPicker({onInput, accountId} : {onInput: (color: string) => void, accountId: number}) {
    const theme = useTheme();
    const [defaultColor, setDefaultColor] = useState<string>(theme.theme_color || 'ffffff');
    const pickerElement = useRef(null);
    const [picker, setPicker] = useState(null);
    const [selectedColor, setSelectedColor] = useState(defaultColor);
    const lightMode = useContext(LightModeContext);
    let mounted = false;
    useEffect(() => {
        if (pickerElement.current && selectedColor && !mounted) {
            mounted = true;
            if (picker)
                picker.destroyAndRemove();
            const pickr = Pickr.create({
                el: pickerElement.current,
                container: document.querySelector('#root > div main') as HTMLElement,
                theme: 'monolith',
                default: selectedColor,
                useAsButton: true,
                lockOpacity: true,
                defaultRepresentation: 'HEXA',
                appClass: 'custom-color-picker',
                swatches: [
                    '#FF33A3',
                    '#E233FF',
                    '#3F33FF',
                    '#33B6FF',
                    '#80FF33',
                    '#FFF833',
                    '#FF7C33',
                    '#FF3333'
                ],
                components: {
                    preview: true,
                    opacity: false,
                    hue: true,
                    interaction: {
                        input: true,
                        cancel: true,
                        save: true
                    }
                },
                i18n: {
                    'btn:save': 'Save',
                    'btn:cancel': 'Cancel'
                }
            })
            pickr.on('save', () => {
                pickr.hide();
                setSelectedColor(pickr.getColor().toHEXA().toString());
            });
            pickr.on('cancel', () => {
                pickr.hide();
            });
            setPicker(pickr);
        }
    }, []);

    useEffect(() => {
        setDefaultColor(theme.theme_color);
        setSelectedColor(defaultColor);
        if (picker)
            picker.setColor(theme.theme_color);
    }, [accountId, theme]);

    useEffect(() => {
        if (onInput)
            onInput(selectedColor);
    }, [selectedColor]);

    const lightModeStyle = useMemo(() => lightMode ? <style>
        {`.pcr-app .pcr-interaction .pcr-result {background: #eee;color: #1a1a1a;}`}
        {`.pcr-app .pcr-interaction .pcr-save, .pcr-app .pcr-interaction .pcr-cancel {background: #444;color: #fff;}`}
        {`.pcr-app .pcr-interaction .pcr-save:hover, .pcr-app .pcr-interaction .pcr-cancel:hover {background: #1a1a1a;}`}
        {`.custom-color-picker {background: #ffffff;box-shadow: rgba(0,0,0,.5) 0 0 10px}`}
    </style> : <></>, [lightMode]);

    return (
        <>
            {lightModeStyle}
            <span
                id="color_picker"
                style={{
                    background: selectedColor
                }}
                ref={pickerElement}
            ></span>
        </>
    );
}