import React from 'react';
import ReactDOM from 'react-dom/client';
import Header from "./components/Header";
import Main from "./components/Main";
import './main.scss';
import App from "./components/App";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <App>
            <Header/>
            <Main/>
        </App>
    </React.StrictMode>
);

