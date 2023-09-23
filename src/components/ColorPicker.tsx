import React, {useEffect, useRef, useState} from "react";
import Pickr from "@simonwep/pickr";
import './ColorPicker.scss';

export default function ColorPicker({defaultColor} : {defaultColor : string}) {
    const pickerElement = useRef(null);
    const [picker, setPicker] = useState(null);
    const [selectedColor, setSelectedColor] = useState(defaultColor);
    useEffect(() => {
        if (pickerElement.current && selectedColor) {
            if (picker)
                picker.destroyAndRemove();
            const pickr = Pickr.create({
                el: pickerElement.current,
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
        setSelectedColor(defaultColor);
        if (picker)
            picker.setColor(defaultColor);
    }, [defaultColor]);
    return (
        <span
            id="color_picker"
            style={{
                background: selectedColor
            }}
            ref={pickerElement}
        ></span>
    );
}