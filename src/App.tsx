import ChatWindow from "./components/ChatWindow";
import Footer from "./components/Footer";
import Header from "./components/Header";
import IntroSection from "./components/IntroSection";

function App() {
  return (
    <div className="app-shell">
      <Header />
      <main className="main-area">
          <IntroSection />
          <ChatWindow />
      </main>
      <Footer />
    </div>
  );
}

export default App;
