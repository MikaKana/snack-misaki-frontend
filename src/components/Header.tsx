import { useTranslation, type Language } from "../i18n";

function Header() {
    const { t, language, setLanguage, availableLanguages } = useTranslation();

    return (
    <header className="app-header">
        <div className="brand">
            <div className="brand-mark" aria-hidden="true">
                🍸
            </div>
            <div>
                <h1 className="brand-title">Snack Misaki</h1>
                <p className="brand-subtitle">{t("header.subtitle")}</p>
            </div>
      </div>
        <div className="header-controls">
            <label className="language-switcher">
                <span className="language-switcher__label">{t("app.languageSwitcherLabel")}</span>
                <select
                    className="language-select"
                    value={language}
                    onChange={(event) => setLanguage(event.target.value as Language)}
                >
                    {availableLanguages.map((option) => (
                        <option key={option.code} value={option.code}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </label>
      </div>
    </header>
  );
}

export default Header;
