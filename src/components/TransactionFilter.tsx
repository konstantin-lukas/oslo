import "./TransactionFilter.scss";
import React, {useContext} from "react";
import {TextContext} from "./misc/Contexts";

export type Filters = {
    reference: string,
    category: string
}

export default function TransactionFilter({filters, setFilters}: {
    filters: Filters
    setFilters: React.Dispatch<React.SetStateAction<Filters>>
}) {
    const text = useContext(TextContext);
    return (
        <div className="transaction-filter">
            <h2>{text.filter_transactions_}</h2>
            <div className="input-container">
                <input
                    type="text"
                    placeholder={text.search_by_reference_}
                    value={filters.reference}
                    onInput={(e) => {
                        setFilters((prev: Filters) => (
                            {...prev, reference: (e.target as HTMLInputElement).value}
                        ));
                    }}
                />
                <input
                    type="text"
                    placeholder={text.search_by_category_}
                    value={filters.category}
                    onInput={(e) => {
                        setFilters((prev: Filters) => (
                            {...prev, category: (e.target as HTMLInputElement).value}
                        ));
                    }}
                />
            </div>
        </div>
    )
}