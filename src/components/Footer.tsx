import { API_BASE_URL } from "../config";

function Footer() {
  return (
    <footer className="app-footer">
      <p>© {new Date().getFullYear()} Snack Misaki</p>
      <p className="footer-note">
        API ベース URL: <code>{API_BASE_URL ?? "未設定"}</code>
      </p>
    </footer>
  );
}

export default Footer;
