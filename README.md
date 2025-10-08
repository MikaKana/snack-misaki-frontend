# Snack Misaki — Frontend

## 概要
このリポジトリは **Snack Misaki プロジェクトのフロントエンド** です。  
Vite + React + TypeScript をベースに、ユーザー入力と定型文レスポンスを提供します。

- **Stage 1**: フロントエンドのみで定型文レスポンスを返す PoC
- **Stage 2 以降**: バックエンド API（Lambda + LLM）との連携に対応

---

## 技術スタック
- [Vite](https://vitejs.dev/) — 高速なフロントエンドビルドツール
- [React](https://react.dev/) — コンポーネントベースの UI フレームワーク
- [TypeScript](https://www.typescriptlang.org/) — 型安全な開発環境

---

## 機能
1. **ユーザー入力フォーム**  
   テキスト入力を受け取り、レスポンスを表示

2. **定型文レスポンス**  
   パターンマッチに一致した場合は即時応答

3. **バックエンド連携 (Stage 2 以降)**  
   未対応の入力をバックエンド API へ送信し、LLM 応答を返す

---

## 実行方法（ローカル）
### 開発環境
```bash
npm install
npm run dev
```
ブラウザで [http://localhost:5173](http://localhost:5173) を開いて確認できます。

### Docker（開発環境）
```bash
docker compose up --build
```
初回起動時に依存パッケージのインストールも自動で行われます。<br>
起動後は [http://localhost:5173](http://localhost:5173) にアクセスしてください。

ホットリロードに対応しているため、ホスト側でソースコードを編集するとコンテナ内の Vite サーバーに即座に反映されます。停止する場合は `Ctrl + C` を押すか、別ターミナルで `docker compose down` を実行してください。

### 本番ビルドの手順
```bash
docker-compose -f docker-compose.prod.yml up --build
```
本番モードでは [http://localhost:4173](http://localhost:4173) でアクセスできます。

---

## 環境変数
`.env` または `src/config.ts` で設定します。

- `VITE_API_BASE_URL` : バックエンド API のエンドポイント

---

## カスタマイズ方法
- **定型文の追加**: `src/constants/responses.ts` に追記
- **UI の編集**: `src/components/ChatWindow.tsx` を編集
- **API の切替**: 環境変数で管理

---

## 外部サイトへの埋め込み
チャットを別サイトに設置したい場合は、ビルド成果物に含まれる `widget.html` を iframe として読み込むだけで利用できます。

```html
<iframe
  src="https://example.com/widget.html"
  title="Snack Misaki Chat"
  style="width: 360px; height: 640px; border: 0;"
  allow="clipboard-write"
></iframe>
```

開発環境では [http://localhost:5173/widget.html](http://localhost:5173/widget.html) にアクセスするとウィジェット単体の画面を確認できます。<br>
Vite のマルチページ構成を利用しているため、`npm run build` で生成される `dist/widget.html` をそのままホスティングすれば「分店」のようにどこからでも呼び出すことができます。

---

## 今後の拡張
- **UI/UX 改善**: 会話履歴、テーマ切替など
- **多言語対応**
- **モバイル最適化**
- **時間帯による応答の変化**
    - 朝： 「眠そうなママが『まだ開店してないのよ〜』」
    - 夜： 「テンション高めのママが迎えてくれる」
    - 深夜： 「閉店モードで『今日はもうおしまいよ』」
- **個室モード**
    - ログインしたユーザーごとに専用のやりとりを保存
    - 「常連さん専用ボトルキープ」みたいな体験を提供  
