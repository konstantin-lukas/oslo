import React, {useState} from 'react';
import './Header.scss';

export default function Header() {
    const [isWindowMaximized, setIsWindowMaximized] = useState<boolean>(true);
    api.on('maximize', function(){
        setIsWindowMaximized(true);
    });

    api.on('unmaximize', function(){
        setIsWindowMaximized(false);
    });

    return (
        <header className={isWindowMaximized ? 'maximized' : ''}>
            <div id="tab-group">
                <div className="tab current_tab" data-target="0"><span>My First Account</span></div>
                <button type="button" name="add_tab"></button>
            </div>
            <div className="window_nav" id="config-btn">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <span className="window_nav" id="min-btn" onClick={() => api.send('min')}></span>
            <span className="window_nav" id="max-btn" onClick={() => api.send('max')}></span>
            <span className="window_nav" id="close-btn" onClick={() => api.send('close')}></span>
        </header>
    )
}