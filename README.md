# HTML / CSS 最強のコーディング開発環境
gulpを使用し、効率的にWebサイトを製作できるテンプレートです。

- HTMLのマークアップにejsを使用しています。
- ScssのコンパイルにDart Sassを使用しています。
- JavaScriptのバンドルにRollupを使用しています。

## 使用方法
1. （初回のみ） `npm i` を実行します。
2. `npm start` を実行すると、開発サーバーが立ち上がります（ `npx gulp` でも同様です）。
3. 開発サーバーが立ち上がった状態で、ejsやscssを更新すると、自動的にリロードします。
4. `npm run build` を実行すると、CSSやJavaScriptが圧縮された状態で出力されます。
