import React, {useContext, useEffect, useState} from "react";
import './BalanceChart.scss';
import { Chart as ChartJS, CategoryScale, LinearScale, LineController, PointElement, LineElement} from 'chart.js';
import { Chart } from "react-chartjs-2";
import { add } from "date-fns";
import {LanguageContext} from "./misc/Contexts";
import {useTheme} from "styled-components";

ChartJS.register(CategoryScale, LinearScale, LineController, PointElement, LineElement);
export default function BalanceChart({transactions, from, until}: {
    transactions: Transaction[],
    from: Date,
    until: Date
}) {
    const theme = useTheme();
    const [labels, setLabels] = useState([]);
    const [data, setData] = useState([])
    const language = useContext(LanguageContext);
    useEffect(() => {
        let indexDate = structuredClone(from);
        let labelArray: string[] = [];
        let dataArray: number[] = [];
        while(indexDate <= until) {
            labelArray.push(indexDate.toLocaleDateString(language || 'en', {
                month: "2-digit",
                day: "2-digit",
                year: "numeric"
            }))
            dataArray.push(0);
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
                        borderColor: `rgb(${theme.theme_color.r},${theme.theme_color.g},${theme.theme_color.b})`,
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
                                    return 'Datum: ' + context[0].label;
                                },
                                label: function(context) {
                                    let label = context.dataset.label || '';
                                    if (label) label += ': ';
                                    if (context.parsed.y !== null) label += new Intl.NumberFormat('de', { style: 'currency', currency: 'EUR' }).format(context.parsed.y);
                                    return label;
                                }
                            }
                        }
                    },
                    elements:  {
                        point: {
                            radius: 6
                        }
                    },
                    scales: {
                        x: {
                            grid: {
                                color: 'rgba(255,255,255,0)',
                                tickColor: '#fff',
                                /*borderWidth: 1,
                                borderColor: '#fff',*/
                                lineWidth: 1
                            }
                        },
                        y: {
                            grid: {
                                color: 'rgba(255,255,255,0.4)',
                                tickColor: 'rgba(0,0,0,0)',
                                /*borderWidth: 0,
                                borderColor: '#fff'*/
                            },
                            border: {
                                width: 0,
                                color: '#fff'
                            },
                            ticks: {
                                callback: function (value) {
                                    if (typeof value === 'string')
                                        value = parseInt(value);
                                    return new Intl.NumberFormat('de', { style: 'currency', currency: 'EUR', currencyDisplay: 'code', maximumFractionDigits: 0 }).format(value);
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