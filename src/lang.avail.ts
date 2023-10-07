import {DisplayOrder, FormatterInitializer} from "moneydew";

const availableLanguages: {
    code: string,
    name: string,
    format: FormatterInitializer
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
        }
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
        }
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
        }
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
        }
    },
    {
        code: "fr",
        name: "Français",
        format: {
            displayOrder: DisplayOrder.NAME_SIGN_NUMBER_SYMBOL,
            groupSeparator: ' ',
            decimalSeparator: ',',
            symbolSeparator: ' ',
            nameSeparator: ' '
        }
    }
];

export default availableLanguages