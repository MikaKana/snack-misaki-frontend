import { useTranslation } from "../i18n";

function IntroSection() {
    const { t } = useTranslation();

    return (
        <section className="intro-section" aria-labelledby="intro-heading">
            <div className="intro-content">
                <p className="intro-kicker">{t("intro.kicker")}</p>
                <h2 id="intro-heading" className="intro-title">
                    {t("intro.title")}
                </h2>
                <p className="intro-description">{t("intro.description")}</p>
            </div>
        </section>
    );
}

export default IntroSection;
