import {registerLocale} from "react-datepicker";
import {
    bg, cs, da, de, el, enUS, es, fi,
    fr, hi, hu, id, is, it, ja, ko,
    ms, nb, nl, pl, pt, ro, ru, sv,
    th, tr, uk, vi, zhCN
} from "date-fns/locale";

export default function registerLocales() {
    registerLocale('bg', bg);
    registerLocale('cs', cs);
    registerLocale('da', da);
    registerLocale('de', de);
    registerLocale('el', el);
    registerLocale('en', enUS);
    registerLocale('es', es);
    registerLocale('fi', fi);
    registerLocale('fr', fr);
    registerLocale('hi', hi);
    registerLocale('hu', hu);
    registerLocale('id', id);
    registerLocale('is', is);
    registerLocale('it', it);
    registerLocale('ja', ja);
    registerLocale('ko', ko);
    registerLocale('ms', ms);
    registerLocale('nb', nb);
    registerLocale('nl', nl);
    registerLocale('pl', pl);
    registerLocale('pt', pt);
    registerLocale('ro', ro);
    registerLocale('ru', ru);
    registerLocale('sv', sv);
    registerLocale('th', th);
    registerLocale('tr', tr);
    registerLocale('uk', uk);
    registerLocale('vi', vi);
    registerLocale('zh', zhCN);
}