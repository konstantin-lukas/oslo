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