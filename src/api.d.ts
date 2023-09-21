declare const api: typeof import("./api").default;

declare type Color = {
    r: number,
    g: number,
    b: number
}

declare type Transaction = {
    id: number
    title: string,
    sum: string,
    date: string,
    time: string
}

declare type StandingOrder = {
    title: string,
    sum: string,
    exec_interval: number,
    exec_on: number,
    last_exec: string
}

declare type AccountData = {
    id: number
    name: string,
    currency: string,
    allow_negative_values: boolean,
    interest_rate: number,
    creation_date: string,
    last_interest: number,
    theme_color: Color,
    transactions: Transaction[],
    standing_orders: StandingOrder[]
}

declare type TextContent = {
    de: string,
    en: string,
    fr: string,
    ja: string,
    es: string,
    language: string,
    theme_color: string,
    dark_theme: string,
    allow_overdrawing: string,
    vertical_layout: string,
    save_: string,
    cancel: string,
    new_account: string,
    confirm: string,
    transaction: string,
    amount: string,
    reference: string,
    date: string,
    savings_accounts: string,
    account_name: string,
    add: string,
    cannot_overdraw: string,
    export_data: string,
    export: string,
    import_data: string,
    import: string,
    no_standing_orders: string,
    create_standing_order: string,
    manage_standing_orders: string,
    standing_order_name: string,
    execution: string,
    day_of_execution: string,
    exec_on_last_day_of_month: string,
    exec_interval: string,
    no: string,
    yes: string,
    every_1: string,
    every_2: string,
    every_3: string,
    every_4: string,
    every_5: string,
    every_6: string,
    every_7: string,
    every_8: string,
    every_9: string,
    every_10: string,
    every_11: string,
    every_12: string,
    last_day_of_month: string,
    balance: string,
    settings: string,
    pick_name_and_currency: string,
    confirm_delete: string,
    cannot_delete_last_account: string,
    invalid_values: string,
    confirm_import: string,
    interest_rate: string,
    selected_time_span: string,
    interest: string,
    no_transactions: string,
    delete: string,
    fill_in_all_fields: string,
    confirm_standing_order_delete: string,
    confirm_transaction_delete: string,
    changes_saved: string,
    first_execution: string
}