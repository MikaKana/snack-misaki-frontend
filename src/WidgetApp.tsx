import ChatWindow from "./components/ChatWindow";
import Footer from "./components/Footer";
import Header from "./components/Header";

function WidgetApp() {
    return (
        <div className="widget-shell">
            <Header />
            <ChatWindow />
            <Footer />
        </div>
    );
}

export default WidgetApp;
