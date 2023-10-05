import {DisplayOrder, FormatterInitializer} from "moneydew";

const availableLanguages: {
    code: string,
    name: string,
    font: string,
    format: FormatterInitializer,
    customFormats: {
        code: string,
        format: FormatterInitializer
    }[]
}[] = [
    {
        code: "en",
        name: "English",
        font: "Barlow Condensed",
        format: {
            displayOrder: DisplayOrder.SIGN_SYMBOL_NUMBER_NAME,
            groupSeparator: ',',
            decimalSeparator: '.',
            symbolSeparator: '',
            nameSeparator: ' '
        },
        customFormats: []
    },
    {
        code: "de",
        name: "Deutsch",
        font: "Barlow Condensed",
        format: {
            displayOrder: DisplayOrder.NAME_SIGN_NUMBER_SYMBOL,
            groupSeparator: '.',
            decimalSeparator: ',',
            symbolSeparator: ' ',
            nameSeparator: ' '
        },
        customFormats: []
    },
    {
        code: "es",
        name: "Español",
        font: "Barlow Condensed",
        format: {
            displayOrder: DisplayOrder.NAME_SIGN_NUMBER_SYMBOL,
            groupSeparator: '.',
            decimalSeparator: ',',
            symbolSeparator: ' ',
            nameSeparator: ' '
        },
        customFormats: []
    }
];

export default availableLanguages