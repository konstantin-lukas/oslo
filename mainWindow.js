const electron = require('electron');
const ipc = electron.ipcRenderer;
const Pickr = require('@simonwep/pickr');
const Chart = require('chart.js');
const fs = require('fs');
const anime = require('animejs');

const config = JSON.parse(fs.readFileSync('json/config.json', 'utf8'));
const lang = JSON.parse(fs.readFileSync('json/lang.json', 'utf8'));
let data = JSON.parse(fs.readFileSync('json/data.json', 'utf8'));

if (data.length < 1) {
    data.push({
        name: lang[config.language].trans[7],
        currency: "EUR",
        allow_negative_values: false,
        interest_rate: 0,
        creation_date: date_to_string(new Date()),
        last_interest: new Date().getFullYear() - 1,
        theme_color: {
            r: (config.light_mode === true) ? 79 : 255,
            g: (config.light_mode === true) ? 79 : 255,
            b: (config.light_mode === true) ? 79 : 255
        },
        changes: [],
        standing_orders: []
    });
}

let color = data[0].theme_color;
if (data[config.last_tab] == undefined) config.last_tab = 0;
if (config.light_mode === true) {
    document.body.classList.add('light_mode');
    document.querySelector('#dark_span + input').checked = false;
}
{
    const language = document.querySelector('#lang_span + .custom-select-container');
    language.querySelector('select').value = config.language;
    language.querySelector(`[data-value=${config.language}]`).classList.add('selected_option');
    language.querySelector('.selected').innerHTML = language.querySelector(`[data-value=${config.language}]`).innerHTML;
}

const currencyCodes = ['AED', 'AFN', 'ALL', 'AMD', 'ANG', 'AOA', 'ARS', 'AUD', 'AWG', 'AZN', 'BAM', 'BBD', 'BDT', 'BGN', 'BHD', 'BIF', 'BMD', 'BND', 'BOB', 'BRL', 'BSD', 'BTN', 'BWP', 'BZD', 'CAD', 'CDF', 'CHF', 'CLP', 'CNY', 'COP', 'CRC', 'CUC', 'CUP', 'CVE', 'CZK', 'DJF', 'DKK', 'DOP', 'DZD', 'EGP', 'ERN', 'ETB', 'EUR', 'FJD', 'FKP', 'GBP', 'GEL', 'GHS', 'GIP', 'GMD', 'GNF', 'GTQ', 'GYD', 'HKD', 'HNL', 'HRK', 'HTG', 'HUF', 'IDR', 'ILS', 'INR', 'IQD', 'IRR', 'ISK', 'JMD', 'JOD', 'JPY', 'KES', 'KGS', 'KHR', 'KMF', 'KPW', 'KRW', 'KWD', 'KYD', 'KZT', 'LAK', 'LBP', 'LKR', 'LRD', 'LSL', 'LYD', 'MAD', 'MDL', 'MGA', 'MKD', 'MMK', 'MNT', 'MOP', 'MUR', 'MVR', 'MWK', 'MXV', 'MYR', 'MZN', 'NAD', 'NGN', 'NIO', 'NOK', 'NPR', 'NZD', 'OMR', 'PAB', 'PEN', 'PGK', 'PHP', 'PKR', 'PLN', 'PYG', 'QAR', 'RON', 'RSD', 'RUB', 'RWF', 'SAR', 'SBD', 'SCR', 'SDG', 'SEK', 'SGD', 'SHP', 'SLL', 'SOS', 'SRD', 'SSP', 'SYP', 'SZL', 'THB', 'TJS', 'TMT', 'TND', 'TOP', 'TRY', 'TTD', 'TWD', 'TZS', 'UAH', 'UGX', 'USD', 'UYU', 'UZS', 'VND', 'VUV', 'WST', 'XAF', 'XCD', 'XDR', 'XOF', 'XPF', 'YER', 'ZAR', 'ZMW'];

const pickr = Pickr.create({
    el: '#color_picker',
    theme: 'monolith',
    default: `rgb(${data[config.last_tab].theme_color.r},${data[config.last_tab].theme_color.g},${data[config.last_tab].theme_color.b})`,
    useAsButton: true,
    lockOpacity: true,
    defaultRepresentation: 'HEX',
    appClass: 'custom-color-picker',
    swatches: [
        '#FF33A3',
        '#E233FF',
        '#3F33FF',
        '#33B6FF',
        '#80FF33',
        '#FFF833',
        '#FF7C33',
        '#FF3333'
    ],
    components: {
        preview: true,
        opacity: false,
        hue: true,
        interaction: {
            input: true,
            cancel: true,
            save: true
        }
    },
    i18n: {
        'btn:save': 'Save',
        'btn:cancel': 'Cancel'
    }
});

const ctx = document.getElementById('balance_chart');
Chart.defaults.font.size = 16;
Chart.defaults.font.family = (config.language == 'ja') ? ['Yu Gothic', 'Yu Gothic UI', '游ゴシック', '游ゴシック体', 'Hiragino Sans', 'Hiragino Kaku Gothic Pro', 'ＭＳ ゴシック', 'MS Gothic'] : 'Barlow Condensed';
Chart.defaults.color = (config.light_mode === true) ? '#1a1a1a' : '#fff';
const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            data: [],
            borderColor: `rgb(${color.r},${color.g},${color.b})`,
            borderWidth: 1
        }]
    },
    options: {
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
                padding: {
                    x: 10,
                    y: 7
                },
                callbacks: {
                    title: function(context) {
                        return lang[config.language].trans[12] + ': ' + context[0].label;
                    },
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) label += ': ';
                        if (context.parsed.y !== null) label += new Intl.NumberFormat(config.language, { style: 'currency', currency: 'EUR' }).format(context.parsed.y);
                        return label;
                    }
                }
            }
        },
        elements:  {
            point: {
                radius: function () {
                    return (window.innerWidth / 300 > 6) ? 6 : window.innerWidth / 300;
                }
            }
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(255,255,255,0)',
                    tickColor: (config.light_mode === true) ? '#1a1a1a' : '#fff',
                    borderWidth: 1,
                    borderColor: (config.light_mode === true) ? '#1a1a1a' : '#fff',
                    lineWidth: 1
                }
            },
            y: {
                grid: {
                    color: (config.light_mode === true) ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)',
                    tickColor: 'rgba(0,0,0,0)',
                    borderWidth: 0,
                    borderColor: (config.light_mode === true) ? '#1a1a1a' : '#fff'
                },
                ticks: {
                    callback: function (value) {
                        return new Intl.NumberFormat(config.language, { style: 'currency', currency: 'EUR', currencyDisplay: 'code', maximumFractionDigits: 0 }).format(value);
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
    }
});
















//FUNCTIONS
let set_language = function () {
    document.documentElement.lang = config.language;
    document.querySelector('#title').innerHTML = lang[config.language].trans[11];
    document.querySelector('#confirm').innerHTML = lang[config.language].trans[15];
    document.querySelector('#addExpense h2').innerHTML = lang[config.language].trans[9];
    document.querySelector('#account_settings h2').innerHTML = lang[config.language].trans[46];
    document.querySelector('#name').innerHTML = lang[config.language].trans[14];
    document.querySelector('#color_span').innerHTML = lang[config.language].trans[1];
    document.querySelector('#negative_span').innerHTML = lang[config.language].trans[3];
    document.querySelector('#buttons button[name=confirm]').innerHTML = lang[config.language].trans[8];
    document.querySelector('#buttons button[name=cancel]').innerHTML = lang[config.language].trans[6];
    document.querySelector('#save_acc_set').innerHTML = lang[config.language].trans[5];
    document.querySelector('#export_label_span').innerHTML = lang[config.language].trans[18];
    document.querySelector('#import_label_span').innerHTML = lang[config.language].trans[20];
    document.querySelector('#export_label_span + button').innerHTML = lang[config.language].trans[19];
    document.querySelector('#import_label_span + button').innerHTML = lang[config.language].trans[21];
    document.querySelector('#dark_span').innerHTML = lang[config.language].trans[2];
    document.querySelector('#lang_span').innerHTML = lang[config.language].trans[0];
    document.querySelector('[name=save_global_settings]').innerHTML = lang[config.language].trans[5];
    document.querySelector('#lang_span + .custom-select-container .selected').innerHTML = lang[config.language].lang[config.language];
    document.querySelector('#interest_rate').innerHTML = lang[config.language].trans[53];
    document.querySelector('#interval_select .label_name').innerHTML = lang[config.language].trans[29];
    document.querySelector('#exec_on_last .label_name').innerHTML = lang[config.language].trans[28];
    document.querySelector('#exec_date_label .label_name').innerHTML = lang[config.language].trans[63];
    document.querySelector('#name_label .label_name').innerHTML = lang[config.language].trans[25];
    document.querySelector('#create_order').innerHTML = lang[config.language].trans[15];
    document.querySelector('#add_order h2').innerHTML = lang[config.language].trans[23];
    document.querySelector('#manage_orders h2').innerHTML = lang[config.language].trans[24];
    document.querySelector('button[name=add_tab]').title = lang[config.language].trans[7];
    for (var key in lang[config.language].lang) {
        if (lang[config.language].lang.hasOwnProperty(key)) {
            document.querySelector(`#lang_span + .custom-select-container [data-value=${key}]`).innerHTML = lang[config.language].lang[key];
            document.querySelector(`#lang_span + .custom-select-container option[value=${key}]`).innerHTML = lang[config.language].lang[key];
        }
    }

}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function date_to_string(date) {
    return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
}

function add_days_to_date(date, diff) {
    let d = new Date(date);
    let day = d.getDate();
    const month = d.getMonth();
    d.setDate(d.getDate() + diff);
    return date_to_string(d);
}

let add_months_to_date = function (date, diff) {
    let d = new Date(date);
    let day = d.getDate();
    const month = d.getMonth();
    d.setMonth(d.getMonth() + diff);
    if (d.getMonth() == month) {
        d.setMonth(d.getMonth() + ((diff > 0) ? 1 : -1));
    }
    while (day != d.getDate()) {
        day--;
        d.setDate(day);
    }
    return date_to_string(d);
}

let reset_dates = function () {
    const from_date = document.querySelector('#from_date');
    const until_date = document.querySelector('#until_date');
    until_date.innerHTML = new Intl.DateTimeFormat(config.language,{year: 'numeric',month: '2-digit',day: '2-digit'}).format(new Date());
    from_date.innerHTML = new Intl.DateTimeFormat(config.language,{year: 'numeric',month: '2-digit',day: '2-digit'}).format(new Date(add_months_to_date(new Date(), -1)));
    from_date.setAttribute('data-date',add_months_to_date(new Date(), -1));
    until_date.setAttribute('data-date',date_to_string(new Date()));
}

function get_locale_date_format(locale,target) {
    const formats = {
        "de": ["dd.MM.yyyy", "dd.MM", "MM.yyyy"],
        "en": ["dd/MM/yyyy", "dd/MM", "MM/yyyy"],
        "es": ["dd/MM/yyyy", "dd/MM", "MM/yyyy"],
        "fr": ["dd/MM/yyyy", "dd/MM", "MM/yyyy"],
        "ja": ["yyyy/MM/dd", "MM/dd", "yyyy/MM"]
    };
    return formats[locale][target] || "dd/MM/yyyy";
}

function get_balance_data(locale, options) {
    const target = (options.last_tab !== true) ? document.querySelector('.current_tab').getAttribute('data-target') : config.last_tab;
    const lower_limit = new Date(document.querySelector('#from_date').getAttribute('data-date'));
    const upper_limit = new Date(document.querySelector('#until_date').getAttribute('data-date'));

    let difference = (upper_limit.getTime() - lower_limit.getTime()) / (1000 * 3600 * 24) + 1;
    myChart.options.elements.point.radius = (200 / difference > 10) ? 10 : 200 / difference;
    if (200 / difference < 2) myChart.options.elements.point.radius = 0;
    myChart.update();
    let label_names = [];
    for (var i = 0; i < difference; i++) {
        label_names.push(add_days_to_date(lower_limit,i));
    }
    let starting_balance = data[target].changes
    .filter(function (value) {
        return new Date(value.date) < lower_limit;
    })
    .reduce(function (total, value) {
        return total + value.sum;
    }, 0);
    let balance_data = [];
    label_names.forEach((label, i) => {
        if (new Date(label).getTime() <= new Date().setUTCHours(0,0,0,0)) {
            data[target].changes.forEach((change, j) => {
                if (new Date(label).getTime() == new Date(change.date).getTime()) {
                    starting_balance += change.sum;
                }
            });
            balance_data.push(starting_balance / 1000);
            label_names[i] = new Intl.DateTimeFormat(config.language,{year: 'numeric',month: '2-digit',day: '2-digit'}).format(new Date(label));
        } else {
            label_names.splice(i, 1);
        }
    });
    return (options.labels === true) ? label_names : balance_data;
}

let get_week_abbreviations = function(locale,narrow = false) {
    let days = [];
    for (var i = 1; i <= 7; i++) {
        if (narrow === false) {
            days.push(new Intl.DateTimeFormat(locale, { weekday: 'short' }).format( new Date('2020/11/'+i) ));
        } else {
            days.push(new Intl.DateTimeFormat(locale, { weekday: 'narrow' }).format( new Date('2020/11/'+i) ));
        }
    }
    return days;
}

let container_click = function () {
    const target = this.parentNode;
    if (target.classList.contains('open')) {
        target.classList.remove('open');
    } else {
        target.classList.add('open');
    }
}

let delete_account = function () {
    const target = document.querySelector('.current_tab').getAttribute('data-target');
    data.splice(target, 1);
    if (data.length < 1) {
        data.push({
            name: lang[config.language].trans[7],
            currency: "EUR",
            allow_negative_values: false,
            interest_rate: 0,
            creation_date: date_to_string(new Date()),
            last_interest: new Date().getFullYear() - 1,
            theme_color: {
                r: (config.light_mode === true) ? 79 : 255,
                g: (config.light_mode === true) ? 79 : 255,
                b: (config.light_mode === true) ? 79 : 255
            },
            changes: [],
            standing_orders: []
        });
        load_account(0, true);
    } else {
        config.last_tab = (target == 0 ? target : target - 1);
        load_account((target == 0 ? target : target - 1), true);
    }
    fs.writeFile('json/data.json', JSON.stringify(data, null, 4), function (err) {
        if (err) return console.log(err);
    });
    load_tabs();
    alert_box_toggle();
}

let option_click = function () {
    const parent_test = this.parentNode.classList.contains('scroll-anchor');
    let select = parent_test ? this.parentNode.parentNode.querySelector('select') : this.parentNode.querySelector('select');
    let container = parent_test ? this.parentNode.parentNode.parentNode : this.parentNode.parentNode;
    let selected = container.querySelector('.selected');
    select.value = this.dataset.value;
    selected.innerHTML = this.innerHTML;
    container.classList.remove('open');
    container.querySelector('.selected_option').classList.remove('selected_option');
    this.classList.add('selected_option');
}

let text_color_by_background = function (red, green, blue) {
    const brightness = Math.round(((red * 299) + (green * 587) + (blue * 114)) / 1000);
    return (brightness > 125) ? '#1a1a1a' : '#fff';
}

let settings_toggle = function () {
    const box = document.querySelector('#global_settings');
    if (box.classList.contains('open')) {
        box.classList.remove('open');
    } else {
        box.classList.add('open');
    }
}

let alert_box_toggle = function(e = false, message = false, callback = false, html = false, confirm = false) {
    const box = document.querySelector('#custom_alert');
    if (message === false) return box.classList.remove('open_alert');
    if (callback !== false) {
        let old_elem = document.querySelector('#custom_alert button[name=confirm]');
        old_elem.classList.remove('hide_btn');
        let new_elem = old_elem.cloneNode(true);
        new_elem.addEventListener('click',callback);
        old_elem.parentNode.replaceChild(new_elem, old_elem);
    } else {
        document.querySelector('#custom_alert button[name=confirm]').classList.add('hide_btn');
    }
    if (confirm === true) {
        document.querySelector('#custom_alert button[name=cancel]').innerHTML = lang[config.language].trans[8];
    } else {
        document.querySelector('#custom_alert button[name=cancel]').innerHTML = lang[config.language].trans[6];
    }
    let custom_html = document.querySelector('#custom_html');
    custom_html.innerHTML = '';
    if (html !== false) {
        html.forEach((item, i) => {
            custom_html.appendChild(item);
        });
    }
    document.querySelector('#custom_message').innerHTML = escapeHtml(message);
    box.classList.add('open_alert');

}

let query_delete_account = function () {
    const message = lang[config.language].trans[48];
    alert_box_toggle(false, message, delete_account);
}

let select_tab = function (e, target = false) {
    let elem = (target == false) ? this : target;
    document.querySelector('.current_tab').classList.remove('current_tab');
    elem.classList.add('current_tab');
    var  i= 0;
    while((elem = elem.previousElementSibling) != null) ++i;
}

let get_currency_select = function () {
    let custom_select_container = document.createElement('SPAN');
    custom_select_container.classList.add('custom-select-container');
    custom_select_container.classList.add('limited_height');
    custom_select_container.innerHTML =
    `<span class="selected">EUR (${new Intl.DisplayNames([config.language], { type: 'currency' }).of('EUR')})</span>
    <span class="custom-select">
        <span class="scroll-anchor hide_scrollbar">
        ${(function () {
            let tmp_html = '';
            currencyCodes.forEach((item, i) => {
                let name = new Intl.DisplayNames(config.language, { type: 'currency' }).of(item);
                tmp_html += `<span class="option${(item == 'EUR') ? ' selected_option' : ''}" data-value="${item}" title="${name}">${item} (${name})</span>`;
            });
            return tmp_html;
        })()}
        </span>
        <select name="new_acc_cur">
            ${(function () {
                let tmp_html = '';
                currencyCodes.forEach((item, i) => {
                    tmp_html += `<option class="option" value="${item}"${(item == 'EUR') ? ' selected' : ''}>${item}</option>`;
                });
                return tmp_html;
            })()}
        </select>
    </span>`;
    custom_select_container.querySelector('.selected').addEventListener('click',container_click);
    custom_select_container.querySelectorAll('.option').forEach((item, i) => {
        item.addEventListener('click',option_click);
    });
    return custom_select_container;
}

let get_interval_select = function () {
    let custom_select_container = document.createElement('SPAN');
    custom_select_container.classList.add('custom-select-container');
    custom_select_container.classList.add('limited_height');
    custom_select_container.innerHTML =
    `<span class="selected">${lang[config.language].trans[32]}</span>
    <span class="custom-select">
        <span class="scroll-anchor hide_scrollbar">
        ${(function () {
            let tmp_html = '';
            for (var i = 32; i < 44; i++) {
                tmp_html += `<span class="option${(i == 32) ? ' selected_option' : ''}" data-value="${i-31}" title="${lang[config.language].trans[i]}">${lang[config.language].trans[i]}</span>`;
            }
            return tmp_html;
        })()}
        </span>
        <select name="order_int_select">
            ${(function () {
                let tmp_html = '';
                for (var i = 32; i < 44; i++) {
                    tmp_html += `<option class="option" value="${i-31}"${(i == 32) ? ' selected' : ''}>${lang[config.language].trans[i]}</option>`;
                }
                return tmp_html;
            })()}
        </select>
    </span>`;
    custom_select_container.querySelector('.selected').addEventListener('click',container_click);
    custom_select_container.querySelectorAll('.option').forEach((item, i) => {
        item.addEventListener('click',option_click);
    });
    return custom_select_container;
}

let get_lom_select = function () {
    let custom_select_container = document.createElement('SPAN');
    custom_select_container.classList.add('custom-select-container');
    custom_select_container.innerHTML =
    `<span class="selected">${lang[config.language].trans[30]}</span>
    <span class="custom-select">
        <span class="scroll-anchor hide_scrollbar">
            <span class="option selected_option" data-value="false" title="${lang[config.language].trans[30]}">${lang[config.language].trans[30]}</span>
            <span class="option" data-value="true" title="${lang[config.language].trans[31]}">${lang[config.language].trans[31]}</span>
        </span>
        <select name="order_lom_select">
            <option class="option" value="false" selected>${lang[config.language].trans[30]}</option>
            <option class="option" value="true">${lang[config.language].trans[31]}</option>
        </select>
    </span>`;
    custom_select_container.querySelector('.selected').addEventListener('click',container_click);
    custom_select_container.querySelectorAll('.option').forEach((item, i) => {
        item.addEventListener('click',option_click);
    });
    return custom_select_container;
}

let get_dot_select = function (selected) {
    let custom_select_container = document.createElement('SPAN');
    custom_select_container.classList.add('custom-select-container');
    custom_select_container.classList.add('limited_height');
    custom_select_container.innerHTML =
    `<span class="selected">${(selected == 32) ? lang[config.language].trans[44] : selected}</span>
    <span class="custom-select">
        <span class="scroll-anchor hide_scrollbar">
        ${(function () {
            let tmp_html = '';
            for (var i = 1; i < 33; i++) {
                tmp_html += `<span class="option${(i == selected) ? ' selected_option' : ''}" data-value="${i}">${(i == 32) ? lang[config.language].trans[44] : i}</span>`;
            }
            return tmp_html;
        })()}
        </span>
        <select name="order_dot">
            ${(function () {
                let tmp_html = '';
                for (var i = 1; i < 33; i++) {
                    tmp_html += `<option class="option" value="${i}"${(i == selected) ? ' selected' : ''}>${(i == 32) ? lang[config.language].trans[44] : i}</option>`;
                }
                return tmp_html;
            })()}
        </select>
    </span>`;
    custom_select_container.querySelector('.selected').addEventListener('click',container_click);
    custom_select_container.querySelectorAll('.option').forEach((item, i) => {
        item.addEventListener('click',option_click);
    });
    return custom_select_container;
}

let delete_order = function (account, order) {
    data[account].standing_orders.splice(order, 1);
    fs.writeFile('json/data.json', JSON.stringify(data, null, 4), function (err) {
        if (err) return console.log(err);
    });
    alert_box_toggle();
    load_orders(account);
}

let query_delete_order = function (account, order) {
    alert_box_toggle(false, lang[config.language].trans[60], function () {
        delete_order(account, order)
    });
}

let load_orders = function (account) {
    const target = document.querySelector('#manage_orders');
    target.innerHTML = `<h2>${lang[config.language].trans[24]}</h2>`;
    if (data[account].standing_orders.length > 0) {
        const currency = data[account].currency;
        const sub_div = new Intl.NumberFormat('en', { style: 'currency', currency: currency, signDisplay: 'never', currencyDisplay: 'code' }).format(1).substr(4);
        const decimals = (sub_div.match(/(0)/g) || []).length;
        data[account].standing_orders.forEach((order, i) => {
            const container = document.createElement('DIV');
            container.classList.add('standing_order');
            container.innerHTML =
            `<label class="heading">
                <span class="label_name">${lang[config.language].trans[25]}</span>
                <input type="text" class="adjust_title" value="${order.title}" autocomplete="off">
            </label>
            <label><span class="label_name">${lang[config.language].trans[10]} (${data[account].currency})</span>
                <input type="text" class="adjust_amount" value="${new Intl.NumberFormat(config.language, { style: 'decimal', minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(order.sum / 1000)}" autocomplete="off">
            </label>
            <label class="dot" style="z-index: ${
            (data[account].standing_orders.length - i) * 2 + 1};"><span class="label_name">${lang[config.language].trans[27]}</span></label>
            <label class="int" style="z-index: ${
            (data[account].standing_orders.length - i) * 2};"><span class="label_name">${lang[config.language].trans[29]}</span></label>
            <div class="contain_two">
                <button type="button" name="save_adjustments" value="${i}" class="theme_background">${lang[config.language].trans[5]}</button>
                <button type="button" name="delete_order" class="standing_order_del theme_background" value="${i}">${lang[config.language].trans[57]}</button>
            </div>`;
            container.querySelector('.dot').appendChild(get_dot_select(data[account].standing_orders[i].exec_on));
            container.querySelector('.int').appendChild(get_interval_select(data[account].standing_orders[i].exec_inter));
            container.querySelector('.adjust_amount').addEventListener('keypress', validate_amount);
            container.querySelector('.adjust_amount').addEventListener('paste', validate_amount);
            container.querySelector('.adjust_amount').addEventListener('keydown', validate_amount);
            container.querySelector('.adjust_amount').addEventListener('drop', function () {
                event.preventDefault();
            });
            container.querySelector('button[name=delete_order]').addEventListener('click', function () {
                query_delete_order(account, i);
            });
            container.querySelector('button[name=save_adjustments]').addEventListener('click',update_order);
            target.appendChild(container);
        });
    } else {
        const label = document.createElement('LABEL');
        label.innerHTML = lang[config.language].trans[22];
        label.style.marginTop = '1em';
        target.appendChild(label);
    }
}

let set_colors = function(color) {
    const contrast = text_color_by_background(color.r, color.g, color.b);
    const contrast_opposite = (contrast == '#fff') ? '#1a1a1a' : '#fff';
    const alt_opp = (contrast == '#1a1a1a') ? '#444' : '#fff';
    let html =
    `::selection {
        color: ${contrast};
        background: rgba(${color.r},${color.g},${color.b},0.99);
    }
    .theme_fill {
        fill: rgb(${color.r},${color.g},${color.b}) !important;
    }
    .theme_background:not(#color_picker):not(button):not(#add_order):not(#manage_orders), input:checked + .toggle_checkbox, .pcr-save, .pcr-cancel {
        color: ${contrast} !important;
        background: rgb(${color.r},${color.g},${color.b}) !important;
    }
    .theme_background::after, .theme_background::before, button.del.theme_background:hover, .picker-content, .picker-foot, .custom-color-picker {
        background: ${contrast} !important;
    }
    ${(contrast == '#1a1a1a') ? '.picker-content, .picker-foot { background: #262626 !important }' : ''}
    input:not(:checked) .toggle_checkbox, input:checked + .toggle_checkbox::after {
        background: ${alt_opp} !important;
    }
    ${(alt_opp == '#444') ? '.light_mode input:checked + .toggle_checkbox::after { background: #e4e4e4 !important }' : ''}
    .toggle_checkbox::after, button.del.theme_background, .picker-head, .picker-active::before {
        background: rgb(${color.r},${color.g},${color.b}) !important;
    }
    button.theme_background:not(.del) {
        background: transparent !important;
        color: ${contrast} !important;
    }
    button.theme_background:not(.del):hover, .picker-content, .picker-foot {
        color: ${contrast_opposite} !important;
    }
    button.theme_background:not(.del)::after {
        background: linear-gradient(0deg, ${contrast}, ${contrast} 50%, rgb(${color.r},${color.g},${color.b}) 50%) !important;
    }
    #global_settings button.theme_background:not(.del)::after {
        background: linear-gradient(0deg, ${alt_opp}, ${alt_opp} 50%, rgb(${color.r},${color.g},${color.b}) 50%) !important;
    }
    button.del.theme_background:hover::before, button.del.theme_background:hover::after {
        background: ${contrast_opposite} !important;
    }
    .picker-now, .picker-row.picker-active {
        color: rgb(${color.r},${color.g},${color.b}) !important;
    }
    .picker-head *, .picker-active {
        color: ${contrast} !important;
    }`;
    document.querySelector('#master_style').innerHTML = html;
    document.querySelector('#color_picker').innerHTML = ('#' + color.r.toString(16) + color.g.toString(16) + color.b.toString(16)).toUpperCase();
    document.querySelector('#color_picker').style.color = contrast;
    document.querySelector('#color_picker').style.backgroundColor = `rgb(${color.r},${color.g},${color.b})`;
    myChart.data.datasets[0].borderColor = `rgb(${color.r},${color.g},${color.b})`;
    myChart.update('show');
}

let toggle_orders = function (e, forceClose = false) {
    if (forceClose !== false) return document.body.classList.remove('open_orders');
    if (document.body.classList.contains('open_orders')) {
        document.body.classList.remove('open_orders');
    } else {
        document.body.classList.add('open_orders');
    }
}

let load_account = function (index, refresh = false) {
    if (refresh !== false) reset_dates();
    toggle_orders(false,true);
    document.querySelectorAll('input').forEach((item, i) => {
        item.value = '';
    });
    const account = data[index];
    load_orders(index);
    document.querySelector('#name + input').value = account.name;
    document.querySelector('#interest_rate + input').value = account.interest_rate + '%';
    pickr.setColor(`rgb(${account.theme_color.r},${account.theme_color.g},${account.theme_color.b})`);
    document.querySelector('h1').innerHTML = escapeHtml(account.name);
    document.querySelector('h1').title = account.name;
    document.querySelector('#amount').innerHTML = lang[config.language].trans[10] + ' (' + account.currency + ')';
    document.querySelector('#amount_label .label_name').innerHTML = lang[config.language].trans[10] + ' (' + account.currency + ')';
    const target = document.querySelector('.balanceChangeTable');
    //TABLE HEADER
    target.innerHTML = '';
    const body = document.createElement('TR');
    body.classList.add('headingRow');
    body.innerHTML =
    `<td colspan="5">${lang[config.language].trans[10]}</td>
    <td colspan="10">${lang[config.language].trans[11]}</td>
    <td colspan="5">${lang[config.language].trans[12]}</td>
    <td colspan="1" class="delRow"></td>`;
    target.appendChild(body);

    //TABLE CONTENT
    let balance = monthly_balance = 0;
    let changes = account.changes.sort(function (a, b) {
        if (new Date(a.date) < new Date(b.date)) {
            return 1;
        } else if (new Date(a.date) > new Date(b.date)) {
            return -1;
        }
        if (a.time > b.time) {
            return -1;
        } else if (a.time < b.time) {
            return 1
        } else {
            return 0;
        }
    });
    const lower_limit = new Date(document.querySelector('#from_date').getAttribute('data-date'));
    const upper_limit = new Date(document.querySelector('#until_date').getAttribute('data-date'));
    const lower_limit_formatted = new Intl.DateTimeFormat(config.language,{year: 'numeric',month: '2-digit',day: '2-digit'}).format(lower_limit);
    const upper_limit_formatted = new Intl.DateTimeFormat(config.language,{year: 'numeric',month: '2-digit',day: '2-digit'}).format(upper_limit);
    changes.forEach((change, i) => {
        balance += change.sum;
        const row = document.createElement('TR');
        const sum = new Intl.NumberFormat(config.language, { style: 'currency', currency: account.currency, signDisplay: 'always' }).format(change.sum / 1000);
        const d = new Date(change.date);
        if (d >= lower_limit && d <= upper_limit) {
            monthly_balance += change.sum;
            const formatted_date = new Intl.DateTimeFormat(config.language,{year: 'numeric',month: '2-digit',day: '2-digit'}).format(d);
            row.classList.add('balanceChange');
            row.classList.add((change.sum >= 0) ? 'proceed' : 'expense');
            row.innerHTML =
            `<td colspan="5" title="${sum}"><span>${sum}</span></td>
            <td colspan="10" title="${change.title}">${escapeHtml(change.title)}</td>
            <td colspan="5" title="${formatted_date}">${formatted_date}</td>
            <td colspan="1" class="delRow"><button type="button" value="${i}" data-value="${change.sum}" class="del theme_background"></button></td>`;
            target.appendChild(row);
        }
    });

    if (target.querySelectorAll('.balanceChange').length == 0) {
        const row = document.createElement('TR');
        row.classList.add('balanceChange');
        row.innerHTML = `<td colspan="21" style="white-space: normal;">${lang[config.language].trans[56]}</td>`;
        target.appendChild(row);
    }

    document.querySelectorAll('table .del').forEach((item, i) => {
        item.addEventListener('click',function () {
            query_delete_change(this.value, this.getAttribute('data-value'));
        });
    });

    //TABLE FOOTER
    const balance_row = document.createElement('TR');
    const today = new Intl.DateTimeFormat(config.language,{year: 'numeric',month: '2-digit',day: '2-digit'}).format(new Date());
    const final_balance = new Intl.NumberFormat(config.language, { style: 'currency', currency: account.currency, signDisplay: 'always', currencyDisplay: 'code' }).format(balance / 1000);
    const final_monthly_balance = new Intl.NumberFormat(config.language, { style: 'currency', currency: account.currency, signDisplay: 'always', currencyDisplay: 'code' }).format(monthly_balance / 1000);
    balance_row.innerHTML =
    `<td colspan="21" class="balance_row" data-value="${balance}">${lang[config.language].trans[45]}: <span style="margin-right:.25em;color:${(balance >= 0) ? 'green' : 'red'};">${final_balance}</span> (<span title="${lang[config.language].trans[54]} (${lower_limit_formatted} – ${upper_limit_formatted})" style="color:${(monthly_balance >= 0) ? 'green' : 'red'};">${final_monthly_balance}</span>)</td>`;
    target.insertBefore(balance_row, target.firstChild);
    set_colors(account.theme_color);

    //GRAPH
    select_tab(false,document.querySelectorAll('.tab')[index]);
    const labels = get_balance_data(config.language, {
        labels: true
    });
    const values = get_balance_data(config.language, {});
    myChart.data = {
        labels: labels,
        datasets: [{
            data: values,
            borderColor: `rgb(${account.theme_color.r},${account.theme_color.g},${account.theme_color.b})`,
            borderWidth: 1.5,
            hoverBorderWidth: 1.5,
            parsing: {
                yAxisKey: 'y'
            }
        }]
    };
    myChart.options.plugins.tooltip = {
        displayColors: false,
        titleFont: {
            weight: '300'
        },
        titleMarginBottom: 0,
        padding: {
            x: 10,
            y: 7
        },
        callbacks: {
            title: function(context) {
                return lang[config.language].trans[12] + ': ' + context[0].label;
            },
            label: function(context) {
                let label = context.dataset.label || '';
                if (label) label += ': ';
                if (context.parsed.y !== null) label += new Intl.NumberFormat(config.language, { style: 'currency', currency: account.currency }).format(context.parsed.y);
                return label;
            }
        }
    };
    myChart.options.scales.y.ticks = {
        callback: function (value) {
            return new Intl.NumberFormat(config.language, { style: 'currency', currency: account.currency, currencyDisplay: 'code', maximumFractionDigits: 0 }).format(value);
        },
        maxTicksLimit: 8,
        crossAlign: 'far'
    };
    myChart.update();
    document.querySelector('#negative_span + input').checked = (account.allow_negative_values === true) ? true : false;
    document.querySelector('.pcr-save').value = lang[config.language].trans[5];
    document.querySelector('.pcr-cancel').value = lang[config.language].trans[6];
}

let add_tab = function () {
    let div = document.createElement('DIV');
    const title = document.querySelector('input[name=new_acc_name]').value;
    const currency = document.querySelector('select[name=new_acc_cur]').value;
    if (title.length < 1 || title.length > 60) return;
    div.classList.add('tab');
    const new_index = document.querySelectorAll('.tab').length;
    div.setAttribute('data-target',new_index);
    const default_color = (document.body.classList.contains('light_mode')) ? {r:79,g:79,b:79} : {r:255,g:255,b:255};
    div.innerHTML = `<span style="color:rgb(${default_color.r},${default_color.g},${default_color.b});">${escapeHtml(title)}</span>`;
    div.addEventListener('click',function () {
        load_account(new_index, true);
    });
    div.addEventListener('click', select_tab);
    const target = document.querySelector('button[name=add_tab]');
    target.parentNode.insertBefore(div, target);
    select_tab(false, div);
    set_colors(default_color);
    alert_box_toggle();
    data.push({
        name: title,
        currency: currency,
        allow_negative_values: false,
        interest_rate: 0,
        creation_date: date_to_string(new Date()),
        last_interest: new Date().getFullYear() - 1,
        theme_color: {
            r: default_color.r,
            g: default_color.g,
            b: default_color.b
        },
        changes: [],
        standing_orders: []
    });
    fs.writeFile('json/data.json', JSON.stringify(data, null, 4), function (err) {
        if (err) return console.log(err);
    });
    load_account(new_index);
}

let query_new_tab = function () {
    const message = lang[config.language].trans[47];
    let input = document.createElement('INPUT');
    input.type = 'text';
    input.name = 'new_acc_name';
    input.style.width = '100%';
    input.style.boxSizing = 'border-box';
    input.setAttribute('maxlength','60');
    alert_box_toggle(false, message, add_tab, [get_currency_select(), input]);
}

function load_tabs() {
    const target = document.querySelector('#tab-group');
    target.innerHTML = '';
    const current_tab = (config.last_tab <= data.length - 1) ? config.last_tab : 0;
    data.forEach((account, i) => {
        const color = `rgb(${account.theme_color.r},${account.theme_color.g},${account.theme_color.b})`;
        const tab = document.createElement('DIV');
        tab.addEventListener('click',function () {
            load_account(i, true);
        });
        tab.classList.add('tab');
        if (i == current_tab) tab.classList.add('current_tab');
        tab.setAttribute('data-target', i)
        tab.innerHTML = `<span style="color:${color};">${escapeHtml(account.name)}</span>`;
        tab.addEventListener('click', select_tab);
        target.appendChild(tab);
    });
    const button = document.createElement('BUTTON');
    button.type = 'button';
    button.name = 'add_tab';
    button.addEventListener('click', query_new_tab);
    target.appendChild(button);
}

let open_calendar = function () {
    const target = this;
    const other_picker = (target.id == 'from_date') ? document.querySelector('#until_date') : document.querySelector('#from_date');
    const creation_date_tmp = data[document.querySelector('.current_tab').getAttribute('data-target')].creation_date;
    const lower_limit_tmp = (date_to_string(new Date()) < add_months_to_date(creation_date_tmp,1)) ? add_months_to_date(new Date(),-1) : add_days_to_date(creation_date_tmp,0);
    const picker = new DateTimePicker.Date({
        min: (target.id == 'until_date') ? add_days_to_date(other_picker.getAttribute('data-date'), 1) : lower_limit_tmp,
        max: (target.id == 'from_date') ? add_days_to_date(other_picker.getAttribute('data-date'), -1) : add_days_to_date(new Date(),0)
    },{
        day: get_week_abbreviations(config.language),
        shortDay: get_week_abbreviations(config.language, true),
        MDW: 'D, ' + get_locale_date_format(config.language, 1),
        YM: get_locale_date_format(config.language, 2),
        OK: lang[config.language].trans[5],
        CANCEL: lang[config.language].trans[6]
    });
    document.querySelector('.picker-act-clear').remove();
    picker.on('canceled', function () {
        picker.destroy();
    });
    picker.on('selected', function (value) {
        const lower_date = (target.id == 'from_date') ? value : other_picker.getAttribute('data-date');
        const upper_date = (target.id == 'from_date') ? other_picker.getAttribute('data-date') : value;
        if (new Date(lower_date) >= new Date(upper_date)) return picker.destroy();
        target.innerHTML = new Intl.DateTimeFormat(config.language,{year: 'numeric',month: '2-digit',day: '2-digit'}).format(new Date(value));
        target.setAttribute('data-date',value);
        load_account(document.querySelector('.current_tab').getAttribute('data-target'));
        picker.destroy();
    });
}

let add_change = function (e, name_arg = false, amount_arg = false, target_arg = false) {
    const name = (name_arg !== false) ? name_arg : document.querySelector('#title + input').value;
    const amount_unparsed = (amount_arg !== false) ? amount_arg : document.querySelector('#amount + input').value.replace(/,/g, '.');
    const amount = 1000 * amount_unparsed;
    const target = (target_arg !== false) ? target_arg : document.querySelector('.current_tab').getAttribute('data-target');
    const balance = data[target].changes.reduce(function (sum, value) {
        return sum + value.sum;
    },0);
    if (data[target].allow_negative_values !== true && (balance + amount) < 0 && amount < 0) return alert_box_toggle(false, lang[config.language].trans[50]);
    if (name == '' || Number.isInteger(amount) === false || isNaN(amount_unparsed[amount_unparsed.length - 1])) return alert_box_toggle(false, lang[config.language].trans[59]);
    if (amount == 0) return alert_box_toggle(false, lang[config.language].trans[58]);

    const date = new Date();
    const date_str = date.toISOString();
    data[target].changes.push({
        title: name,
        sum: amount,
        date: date_str.substr(0, date_str.indexOf('T')),
        time: date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()
    });
    fs.writeFile('json/data.json', JSON.stringify(data, null, 4), function (err) {
        if (err) return console.log(err);
    });
    document.querySelector('#title + input').value = '';
    document.querySelector('#amount + input').value = '';
    load_account(target, true);
}

let delete_change = function (change) {
    const target = document.querySelector('.current_tab').getAttribute('data-target');
    data[target].changes.splice(change, 1);
    fs.writeFile('json/data.json', JSON.stringify(data, null, 4), function (err) {
        if (err) return console.log(err);
    });
    alert_box_toggle();
    load_account(target, true);
}

let query_delete_change = function (change, sum) {
    const balance = document.querySelector('.balance_row').getAttribute('data-value');
    const target = document.querySelector('.current_tab').getAttribute('data-target');
    if (data[target].allow_negative_values !== true && sum > 0 && balance - Math.abs(sum) < 0) {
        return alert_box_toggle(false, lang[config.language].trans[50]);
    } else {
        alert_box_toggle(false, lang[config.language].trans[61], function () {
            delete_change(change);
        });
    }
}

let adjust_settings = function () {
    const target = document.querySelector('.current_tab').getAttribute('data-target');
    const negative = document.querySelector('#negative_span + input').checked;
    const name = escapeHtml(document.querySelector('#name + input').value);
    const interest = parseFloat(document.querySelector('#interest_rate + input').value);
    const tmp_color = pickr.getColor().toRGBA();
    const color = {
        r: Math.round(tmp_color[0]),
        g: Math.round(tmp_color[1]),
        b: Math.round(tmp_color[2])
    }
    if (name != '') data[target].name = name;
    data[target].theme_color = color;
    data[target].interest_rate = interest ? interest : 0;
    data[target].allow_negative_values = negative;
    fs.writeFile('json/data.json', JSON.stringify(data, null, 4), function (err) {
        if (err) return console.log(err);
    });
    document.querySelector('.current_tab span').style.color = `rgb(${color.r},${color.g},${color.b})`;
    document.querySelector('.current_tab span').innerHTML = escapeHtml(data[target].name);
    load_account(target, true);
}

let adjust_global_settings = function () {
    const dark_mode = document.querySelector('#dark_span + input').checked;
    const language = document.querySelector('#lang_span + span select').value;
    config.light_mode = !dark_mode;
    config.language = language;
    fs.writeFile('json/config.json', JSON.stringify(config, null, 4), function (err) {
        if (err) return console.log(err);
    });
    location.reload();
}

let query_import_data = function () {
    ipc.send('import_data');
}

let get_value = function (e, target) {
    if (e.type == 'paste') return target.value.slice(0,target.selectionStart) + e.clipboardData.getData('text/plain') + target.value.slice(target.selectionEnd);
    if (e.type == 'keypress') return target.value.slice(0,target.selectionStart) + e.key + target.value.slice(target.selectionEnd);
    if (e.type == 'keydown' && e.key == 'Backspace') {
        if (target.selectionStart != target.selectionEnd) {
            return target.value.slice(0,target.selectionStart) + target.value.slice(target.selectionEnd);
        } else {
            return target.value.slice(0,target.selectionStart - 1) + target.value.slice(target.selectionEnd);
        }
    }
    return '';
}

let validate_interest_rate = function (e) {
    const input = get_value(e, this);
    if (e.type == 'keydown' && input == '') return;
    const target = document.querySelector('.current_tab').getAttribute('data-target');
    if (input.match(/^(100|0|[1-9]{1}\d?){1}((?<!100)[.,]?(?<=[.,])\d?)?((?<![.,])%?)?$/) === null) e.preventDefault();
}

let validate_amount = function (e) {
    const input = get_value(e, this);
    const target = document.querySelector('.current_tab').getAttribute('data-target');
    const currency = data[target].currency;
    const sub_div = new Intl.NumberFormat('en', { style: 'currency', currency: currency, signDisplay: 'never', currencyDisplay: 'code' }).format(1).substr(4);
    const decimals = (sub_div.match(/(0)/g) || []).length;
    if (e.type == 'keydown' && input == '') return;
    const regex = (decimals == 0) ? /^(\-)?([1-9]*|[1-9]{1}\d*)$/ : new RegExp('^(\\-)?([1-9]*|0|[1-9]{1}[0-9]*){1}((?<=\\d)[.,]\\d{0,'+decimals+'})?$');
    if (input.match(regex) === null) e.preventDefault();
}

let calc_interest = function () {
    data.forEach((account, i) => {
        const current_year = new Date().getFullYear();
        if (account.last_interest < current_year - 1) {
            const last = account.last_interest;
            for_loop:
            for (var j = 0; j < current_year - last; j++) {
                const days = ((last + j) == new Date(account.creation_date).getFullYear()) ? (new Date((last + j)+'-12-31') - new Date(account.creation_date)) / (24 * 60 * 60 * 1000) : 360;
                const balance_for_year = account.changes
                .filter(function (value) {
                    return (last + j)+'-12-31' >= value.date;
                })
                .reduce(function (total, value) {
                    return total + value.sum;
                }, 0);
                const sub_div = new Intl.NumberFormat('en', { style: 'currency', currency: account.currency, signDisplay: 'never', currencyDisplay: 'code' }).format(1).substr(4);
                const decimals = (sub_div.match(/(0)/g) || []).length;
                const division = 1000 / Math.pow(10,decimals);
                const interest = Math.trunc(Math.trunc(balance_for_year * (account.interest_rate / 100) * (days / 360)) / division) * division;
                if (interest <= 0) continue for_loop;
                account.changes.push({
                    title: lang[config.language].trans[55] + ` (${last + j})`,
                    sum: interest,
                    date: (last + j) + '-12-31',
                    time: '23:59:59'
                });
            }
        }
        account.last_interest = new Date().getFullYear() - 1;
    });
    fs.writeFile('json/data.json', JSON.stringify(data, null, 4), function (err) {
        if (err) return console.log(err);
    });
}

let backAnim = function (path,target) {
	anime({
		targets: target,
		points: path,
		easing: 'cubicBezier(0,.5,.56,1.01)',
		duration: 200,
		loop: false,
		complete: function () {
			this.reverse();
		}
	});
};

let exec_standing_orders = function () {
    const today = new Date(new Date().setHours(0,0,0,0));
    data.forEach((dataset, x) => {
        dataset.standing_orders.forEach((order, y) => {
            const exec_on = order.exec_on;
            const exec_inter = order.exec_inter;
            const last_exec = date_to_string(new Date(new Date(new Date(order.last_exec).setDate(1)).setHours(0,0,0,0)));
            let i = 1;
            while (add_months_to_date(last_exec, exec_inter * i) <= date_to_string(today)) {
                let date_of_exec = new Date(new Date(add_months_to_date(last_exec, exec_inter * i)).setHours(0,0,0,0));
                const last_day_of_month = new Date(date_of_exec.getFullYear(),date_of_exec.getMonth() + 1,0).getDate();
                if (exec_on == 32 || last_day_of_month < exec_on) {
                    date_of_exec = new Date(new Date(date_of_exec).setDate(last_day_of_month));
                } else {
                    date_of_exec = new Date(new Date(date_of_exec).setDate(exec_on));
                }
                if (date_of_exec <= today) {
                    data[x].standing_orders[y].last_exec = date_to_string(date_of_exec);
                    data[x].changes.push({
                        title: order.title,
                        sum: order.sum,
                        date: date_to_string(date_of_exec),
                        time: '00:00:00'
                    });
                    fs.writeFile('json/data.json', JSON.stringify(data, null, 4), function (err) {
                        if (err) return console.log(err);
                    });
                }
                i++;
            }
        });
    });
}

let add_order = function () {
    const title = document.querySelector('#name_label input').value;
    const sum_unparsed = document.querySelector('#amount_label input').value.replace(/,/g, '.');
    const sum = 1000 * sum_unparsed;
    const exec_on = document.querySelector('#exec_date').getAttribute('data-date');
    const exec_inter = parseInt(document.querySelector('#interval_select select').value);
    const exec_on_last = document.querySelector('#exec_on_last select').value;
    if (title == '' || Number.isInteger(sum) === false || isNaN(sum_unparsed[sum_unparsed.length - 1])) return alert_box_toggle(false, lang[config.language].trans[59]);
    if (sum == 0) return alert_box_toggle(false, lang[config.language].trans[58]);
    const target = document.querySelector('.current_tab').getAttribute('data-target');
    data[target].standing_orders.push({
        title: title,
        sum: sum,
        exec_inter: exec_inter,
        exec_on: (exec_on_last == 'true') ? 32 : new Date(exec_on).getDate(),
        last_exec: add_months_to_date(exec_on, -new Date(exec_inter).getDate())
    });
    fs.writeFile('json/data.json', JSON.stringify(data, null, 4), function (err) {
        if (err) return console.log(err);
    });
    load_orders(target);
    document.querySelector('#name_label input').value = '';
    document.querySelector('#amount_label input').value = '';
}

let update_order = function () {
    const parent = this.parentNode.parentNode;
    const target = this.value;
    const account = document.querySelector('.current_tab').getAttribute('data-target');
    const sum_unparsed = parent.querySelector('.adjust_amount').value.replace(/,/g, '.');
    const sum = 1000 * sum_unparsed;
    const title = parent.querySelector('.adjust_title').value;
    const exec_on = parseInt(parent.querySelector('select[name=order_dot]').value);
    const exec_inter = parseInt(parent.querySelector('select[name=order_int_select]').value);
    if (title == '' || Number.isInteger(sum) === false || isNaN(sum_unparsed[sum_unparsed.length - 1])) return alert_box_toggle(false, lang[config.language].trans[59]);
    if (sum == 0) return alert_box_toggle(false, lang[config.language].trans[58]);
    data[account].standing_orders[target].title = title;
    data[account].standing_orders[target].sum = sum;
    data[account].standing_orders[target].exec_inter = exec_inter;
    data[account].standing_orders[target].exec_on = exec_on;
    fs.writeFile('json/data.json', JSON.stringify(data, null, 4), function (err) {
        if (err) return console.log(err);
    });
    load_orders(account);
    alert_box_toggle(false, lang[config.language].trans[62], false, false, true);
}







//EVENT LISTENERS
document.querySelector('#confirm').addEventListener('click',add_change);
document.querySelector('#account_settings button').addEventListener('click',adjust_settings);
document.querySelector('#delete_button').addEventListener('click',query_delete_account);
document.querySelector('button[name=export]').addEventListener('click',function () {
    ipc.send('export_data', data);
});




document.querySelector('#back_btn').addEventListener('mouseover',function () {
	backAnim('165.1,115.5 270.4,115.5 270.4,168 165.1,168 165.1,168 112.6,168 112.6,230 13.1,141.7 13.1,141.7 112.6,53.5 112.6,115.5 165.1,115.5','#back_btn .st0');
});

document.querySelector('#back_btn').addEventListener('mouseleave',function () {
	backAnim('178.9,141.7 271.7,234.5 234.5,271.7 141.7,178.9 48.9,271.7 11.8,234.5 104.6,141.7 11.8,48.9 48.9,11.8 141.7,104.6 234.5,11.8 271.7,48.9','#back_btn .st0');
});

document.querySelector('button[name=save_global_settings]').addEventListener('click',adjust_global_settings);

document.querySelector('button[name=import]').addEventListener('click',query_import_data);
document.querySelector('#exec_date').addEventListener('click',function () {
    const picker = new DateTimePicker.Date({
        min: date_to_string(new Date())
    },{
        day: get_week_abbreviations(config.language),
        shortDay: get_week_abbreviations(config.language, true),
        MDW: 'D, ' + get_locale_date_format(config.language, 1),
        YM: get_locale_date_format(config.language, 2),
        OK: lang[config.language].trans[5],
        CANCEL: lang[config.language].trans[6]
    });
    document.querySelector('.picker-act-clear').remove();
    picker.on('canceled', function () {
        picker.destroy();
    });
    picker.on('selected', function (value) {
        const target = document.querySelector('#exec_date');
        target.innerHTML = new Intl.DateTimeFormat(config.language,{year: 'numeric',month: '2-digit',day: '2-digit'}).format(new Date(value));
        target.setAttribute('data-date',value);
        picker.destroy();
    });
});

document.querySelectorAll('.selected').forEach((item, i) => {
    item.addEventListener('click',container_click);
});

document.querySelectorAll('.option').forEach((item, i) => {
    item.addEventListener('click',option_click);
});

document.querySelector('#calendar_btn').addEventListener('click',toggle_orders);
document.querySelector('#back_btn').addEventListener('click',toggle_orders);

//CLOSE CUSTOM SELECTS AND DON'T TRIGGER CUSTOM SELECT BOX TWICE FOR BUTTONS THAT CALL IT
window.addEventListener('click',function () {
    if (!document.querySelector('#global_settings').contains(event.target) && event.target.id != 'global_settings' && event.target.id != 'config-btn' && document.querySelector('#global_settings').classList.contains('open')) settings_toggle();
    if (!document.querySelector('#custom_alert').contains(event.target) && event.target.name != 'add_tab' && event.target.id != 'delete_button' && event.target.id != 'confirm' && event.target.name != 'import' && event.target.id != 'create_order' && event.target.name != 'delete_order' && event.target.name != 'save_adjustments' && !event.target.classList.contains('del')) alert_box_toggle();
    if (event.target.classList.contains('selected') || event.target.type == 'select-one') return;
    document.querySelectorAll('.custom-select-container').forEach((item, i) => {
        item.classList.remove('open');
    });
});

document.querySelector('#custom_alert button[name=cancel]').addEventListener('click',alert_box_toggle);
document.querySelector('#close-btn').addEventListener('click', function (e) {
    ipc.send('close');
});

document.querySelector('#max-btn').addEventListener('click', function (e) {
    ipc.send('max');
});

document.querySelector('#min-btn').addEventListener('click', function (e) {
    ipc.send('min');
});

document.querySelector('#config-btn').addEventListener('click', settings_toggle);

document.querySelector('button[name=add_tab]').addEventListener('click', query_new_tab);

ipc.on('maximize', function(){
    document.body.classList.add('maximized');
});

ipc.on('unmaximize', function(){
    document.body.classList.remove('maximized');
});

ipc.on('close_settings', settings_toggle);

ipc.on('confirm_import', function (channel, import_data) {
    settings_toggle();
    alert_box_toggle(false, lang[config.language].trans[52], function () {
        fs.writeFile('json/data.json', JSON.stringify(import_data, null, 4), function (err) {
            if (err) return console.log(err);
        });
        location.reload();
    });
});

window.addEventListener('contextmenu', (e) => {
    ipc.send('context_menu',{x: e.x, y: e.y});
});

window.addEventListener('beforeunload', function(){
    const current_tab = document.querySelector('.current_tab').dataset.target;
    ipc.send('last_tab',current_tab);
});

pickr.on('save', (color, instance) => {
    pickr.hide();
    const new_color = pickr.getColor().toRGBA();
    const red = new_color[0];
    const green = new_color[1];
    const blue = new_color[2];
    document.querySelector('#color_picker').style.backgroundColor = new_color.toString();
    document.querySelector('#color_picker').style.color = text_color_by_background(red, green, blue);
    document.querySelector('#color_picker').innerHTML = pickr.getColor().toHEXA().toString();
}).on('cancel', instance => {
    pickr.hide();
});

document.querySelector('#from_date').addEventListener('click',open_calendar);
document.querySelector('#until_date').addEventListener('click',open_calendar);

document.querySelectorAll('input[name=amount], input.adjust_amount, #amount_label input').forEach((item, j) => {
    item.addEventListener('keypress', validate_amount);
    item.addEventListener('paste', validate_amount);
    item.addEventListener('keydown', validate_amount);
    item.addEventListener('drop', function () {
        event.preventDefault();
    });
});

document.querySelector('#interest_rate + input').addEventListener('keypress', validate_interest_rate);
document.querySelector('#interest_rate + input').addEventListener('drop', function () {
    event.preventDefault();
});
document.querySelector('#interest_rate + input').addEventListener('paste', validate_interest_rate);
document.querySelector('#interest_rate + input').addEventListener('keydown', validate_interest_rate);

document.querySelector('#create_order').addEventListener('click', add_order);



//FUNCTION CALLS
exec_standing_orders();
calc_interest();
reset_dates();
load_tabs();
load_account(config.last_tab, true);
set_language();
document.querySelector('#exec_date').setAttribute('data-date',date_to_string(new Date()));
document.querySelector('#exec_date').innerHTML = new Intl.DateTimeFormat(config.language,{year: 'numeric',month: '2-digit',day: '2-digit'}).format(new Date());
document.querySelector('#interval_select').appendChild(get_interval_select());
document.querySelector('#exec_on_last').appendChild(get_lom_select());
