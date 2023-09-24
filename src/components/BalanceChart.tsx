import React, {useContext, useEffect, useState} from "react";
import './BalanceChart.scss';
import { Chart as ChartJS, CategoryScale, LinearScale, LineController, PointElement, LineElement, Tooltip} from 'chart.js';
import { Chart } from "react-chartjs-2";
import { add } from "date-fns";
import {CurrencyContext, LanguageContext, TextContext} from "./misc/Contexts";
import {useTheme} from "styled-components";
import {Money, MoneyCalculator} from "moneydew";

ChartJS.register(CategoryScale, LinearScale, LineController, PointElement, LineElement, Tooltip);
export default function BalanceChart({transactions, from, until, openAccountId}: {
    transactions: Transaction[],
    from: Date,
    until: Date,
    openAccountId: number
}) {
    const theme = useTheme();
    const [labels, setLabels] = useState([]);
    const [data, setData] = useState([]);
    const [initialBalance, setInitialBalance] = useState(0);
    const language = useContext(LanguageContext);
    const currency = useContext(CurrencyContext);
    const text = useContext(TextContext);

    useEffect(() => {
        api.db.getBalanceUntilExcluding(openAccountId, from.toISOString().split('T')[0]).then(sum => {
            setInitialBalance(parseInt(sum));
        });
    }, [from, openAccountId]);

    useEffect(() => {
        let indexDate = structuredClone(from);
        let labelArray: string[] = [];
        let dataArray: number[] = [];
        let sum = initialBalance;
        while(indexDate <= until) {
            labelArray.push(indexDate.toLocaleDateString(language, {
                month: "2-digit",
                day: "2-digit",
                year: "numeric"
            }));
            const today = indexDate.toISOString().split('T')[0];
            const balanceChange = transactions
                .filter(transaction => transaction.timestamp.startsWith(today))
                .map(transaction => transaction.sum)
                .reduce((previousValue, currentValue) => {
                    return MoneyCalculator.add(previousValue, new Money(currentValue))
                }, new Money('0.00'))
                .value;
            sum += parseInt(balanceChange);
            dataArray.push(sum);
            indexDate = add(indexDate, {
                days: 1
            });
        }
        setLabels(labelArray);
        setData(dataArray);
    }, [transactions, from, until]);
    ChartJS.defaults.font.size = 16;
    ChartJS.defaults.font.family = 'Barlow Condensed';
    ChartJS.defaults.color = '#ffffff';
    return (
        <div id="account_balance">
            <Chart
                type="line"
                data={{
                    labels: labels,
                    datasets: [{
                        data: data,
                        borderColor: theme.theme_color,
                        borderWidth: 1
                    }]
                }}
                options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false,
                        },
                        tooltip: {
                            displayColors: false,
                            titleFont: {
                                weight: '300'
                            },
                            titleMarginBottom: 0,
                            padding: 10,
                            callbacks: {
                                title: function(context) {
                                    return text?.date_ + ': ' + context[0].label;
                                },
                                label: function(context) {
                                    let label = context.dataset.label || '';
                                    if (label) label += ': ';
                                    if (context.parsed.y !== null) label += new Intl.NumberFormat(language,
                                        {
                                            style: 'currency',
                                            currency: currency.name
                                        }).format(context.parsed.y);
                                    return label;
                                }
                            }
                        }
                    },
                    elements:  {
                        point: {
                            radius: Math.min(200 / (data.length || 1), 10)
                        }
                    },
                    scales: {
                        x: {
                            grid: {
                                color: 'rgba(255,255,255,0)',
                                tickColor: '#fff',
                                lineWidth: 1
                            }
                        },
                        y: {
                            grid: {
                                color: 'rgba(255,255,255,0.4)',
                                tickColor: 'rgba(0,0,0,0)'
                            },
                            border: {
                                width: 0,
                                color: '#fff'
                            },
                            ticks: {
                                callback: function (value) {
                                    if (typeof value === 'string')
                                        value = parseInt(value);
                                    return new Intl.NumberFormat(language, { style: 'currency', currency: currency.name, currencyDisplay: 'code', maximumFractionDigits: 0 }).format(value);
                                },
                                maxTicksLimit: 8,
                                crossAlign: 'far'
                            },
                            beginAtZero: true,
                            suggestedMax: 10
                        }
                    },
                    interaction: {
                        mode: 'index',
                        intersect: false
                    },
                    locale: 'de-DE'
                }}
            />
        </div>
    );
}