import {DisplayOrder, FormatterInitializer} from "moneydew";

const availableLanguages: {
    code: string,
    name: string,
    format: FormatterInitializer,
    customFormats: {
        currency: string,
        format: FormatterInitializer
    }[]
}[] = [
    {
        code: "en",
        name: "English",
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
        code: "ja",
        name: "日本語",
        format: {
            displayOrder: DisplayOrder.SIGN_SYMBOL_NUMBER_NAME,
            groupSeparator: ',',
            decimalSeparator: '.',
            symbolSeparator: '',
            nameSeparator: ' '
        },
        customFormats: [
            {
                currency: "JPY",
                format: {
                    displayOrder: DisplayOrder.NAME_SIGN_NUMBER_SYMBOL,
                    groupSeparator: ',',
                    decimalSeparator: '.',
                    currencyName: '',
                    currencySymbol: '円',
                    symbolSeparator: ''
                }
            }
        ]
    }
];

export default availableLanguages