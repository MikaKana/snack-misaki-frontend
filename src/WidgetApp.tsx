import ChatWindow from "./components/ChatWindow";
import Footer from "./components/Footer";
import Header from "./components/Header";
import IntroSection from "./components/IntroSection";

function WidgetApp() {
    return (
        <div className="widget-shell">
            <Header />
            <IntroSection />
            <ChatWindow />
            <Footer />
        </div>
    );
}

export default WidgetApp;
