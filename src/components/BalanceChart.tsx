import React, {useContext, useEffect, useState} from "react";
import './BalanceChart.scss';
import { Chart as ChartJS, CategoryScale, LinearScale, LineController, PointElement, LineElement, Tooltip} from 'chart.js';
import { Chart } from "react-chartjs-2";
import { add } from "date-fns";
import {CurrencyContext, LanguageContext, LightModeContext, TextContext} from "./misc/Contexts";
import {useTheme} from "styled-components";
import {Money, MoneyCalculator, MoneyFormatter} from "moneydew";
import {getZeroValue} from "./misc/Format";

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
    const [color, setColor] = useState('#ffffff');
    const [initialBalance, setInitialBalance] = useState(0);
    const language = useContext(LanguageContext);
    const currency = useContext(CurrencyContext);
    const text = useContext(TextContext);
    const lightMode = useContext(LightModeContext);

    useEffect(() => {
        api.db.getBalanceUntilExcluding(openAccountId, from.toISOString().split('T')[0]).then(sum => {
            setInitialBalance(parseInt(sum));
        });
    }, [from, openAccountId]);

    useEffect(() => {
        setColor(lightMode ? '#1a1a1a' : '#ffffff');
    }, [lightMode]);

    useEffect(() => {
        let indexDate = structuredClone(from);
        const labelArray: string[] = [];
        const dataArray: number[] = [];
        let sum = initialBalance;
        let today = indexDate.toISOString().split('T')[0];
        const until_string = until.toISOString().split('T')[0];
        while(today <= until_string) {
            labelArray.push(indexDate.toLocaleDateString(language.code, {
                month: "2-digit",
                day: "2-digit",
                year: "numeric"
            }));
            const balanceChange = transactions
                .filter(transaction => transaction.timestamp.startsWith(today))
                .map(transaction => transaction.sum)
                .reduce((previousValue, currentValue) => {
                    return MoneyCalculator.add(previousValue, new Money(currentValue))
                }, new Money(getZeroValue(currency.decimalPlaces)))
                .value;
            sum += parseInt(balanceChange);
            dataArray.push(sum);
            indexDate = add(indexDate, {
                days: 1
            });
            today = indexDate.toISOString().split('T')[0];
        }
        setLabels(labelArray);
        setData(dataArray);
    }, [transactions, from, until]);
    ChartJS.defaults.font.size = 16;
    ChartJS.defaults.font.family = "'Barlow Condensed', 'Noto Sans JP', sans-serif";
    ChartJS.defaults.font.weight = lightMode ? '400' : '300'
    ChartJS.defaults.color = color;
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
                                    if (context.parsed.y !== null) label += new Intl.NumberFormat(language.code,
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
                                tickColor: color,
                                lineWidth: 1
                            }
                        },
                        y: {
                            grid: {
                                color: '#808080',
                                tickColor: 'rgba(0,0,0,0)'
                            },
                            border: {
                                width: 0,
                                color: color
                            },
                            ticks: {
                                callback: function (value) {
                                    if (typeof value !== 'string')
                                        value = value.toString();
                                    return new MoneyFormatter({
                                        ...language.format,
                                        currencyName: currency.name,
                                        currencySymbol: ''
                                    }).format(new Money(value))
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