import {DisplayOrder} from "moneydew";

export default [
    {
        code: "en",
        name: "English",
        font: "Barlow Condensed",
        display_order: DisplayOrder.SIGN_SYMBOL_NUMBER_NAME,
        group_separator: ',',
        decimal_separator: '.',
        custom_symbols: []
    },
    {
        code: "de",
        name: "Deutsch",
        font: "Barlow Condensed",
        display_order: DisplayOrder.NAME_SIGN_NUMBER_SYMBOL,
        group_separator: '.',
        decimal_separator: ',',
        custom_symbols: []
    }
];