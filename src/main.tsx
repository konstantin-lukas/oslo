import React from 'react';
import ReactDOM from 'react-dom/client';
import './main.scss';
import App from "./App";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

document.addEventListener('contextmenu', (e) => {
    api.dev.contextMenu({x: e.x, y: e.y});
});

root.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
);

