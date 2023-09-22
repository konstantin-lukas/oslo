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
    timestamp: string,
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
    theme_color: string
}

declare type TextContent = {
    language_: string,
    theme_color_: string,
    dark_theme_: string,
    allow_overdrawing_: string,
    vertical_layout_: string,
    save_: string,
    cancel_: string,
    new_account_: string,
    confirm_: string,
    transaction_: string,
    amount_: string,
    reference_: string,
    date_: string,
    savings_accounts_: string,
    account_name_: string,
    add_: string,
    cannot_overdraw_: string,
    export_data_: string,
    export_: string,
    import_data_: string,
    import_: string,
    no_standing_orders_: string,
    create_standing_order_: string,
    manage_standing_orders_: string,
    standing_order_name_: string,
    execution_: string,
    day_of_execution_: string,
    exec_on_last_day_of_month_: string,
    exec_interval_: string,
    no_: string,
    yes_: string,
    every_1_: string,
    every_2_: string,
    every_3_: string,
    every_4_: string,
    every_5_: string,
    every_6_: string,
    every_7_: string,
    every_8_: string,
    every_9_: string,
    every_10_: string,
    every_11_: string,
    every_12_: string,
    last_day_of_month_: string,
    balance_: string,
    settings_: string,
    pick_name_and_currency_: string,
    confirm_delete_: string,
    cannot_delete_last_account_: string,
    invalid_values_: string,
    confirm_import_: string,
    interest_rate_: string,
    selected_time_span_: string,
    interest_: string,
    no_transactions_: string,
    delete_: string,
    fill_in_all_fields_: string,
    confirm_standing_order_delete_: string,
    confirm_transaction_delete_: string,
    changes_saved_: string,
    first_execution_: string
}