import React from "react";
import './GlobalSettings.scss';
export default function GlobalSettings() {
    return (
        <div id="global_settings">
            <label className="container export_label"><span id="export_label_span">Kontosammlung exportieren</span>
                <button type="button" name="export" className="theme_background">Exportieren</button>
            </label>
            <label className="container import_label"><span id="import_label_span">Kontosammlung importieren</span>
                <button type="button" name="import" className="theme_background">Importieren</button>
            </label>
            <label className="container">
                <span id="dark_span">Dunkles Thema</span>
                <input type="checkbox" name="dark_mode" defaultChecked={true}/>
                    <span className="toggle_checkbox"></span>
            </label>
            <label>
                <span id="lang_span">Sprache</span>
                <span className="custom-select-container">
                    <span className="selected">Deutsch</span>
                    <span className="custom-select">
                        <span className="option" data-value="de">Deutsch</span>
                        <span className="option" data-value="en">Englisch</span>
                        <span className="option" data-value="fr">Französisch</span>
                        <span className="option" data-value="ja">Japanisch</span>
                        <span className="option" data-value="es">Spanish</span>
                        <select>
                            <option className="option" value="de">Deutsch</option>
                            <option className="option" value="en">Englisch</option>
                            <option className="option" value="fr">Französisch</option>
                            <option className="option" value="ja">Japanisch</option>
                            <option className="option" value="es">Spanisch</option>
                        </select>
                    </span>
                </span>
            </label>
            <button type="button" name="save_global_settings" className="theme_background">Speichern</button>
        </div>
    );
}