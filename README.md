# QUAD REVERSI — Ver. 1.2

4色で対戦する10×10リバーシ。A four-color Reversi game on a 10×10 board.

## Ver. 1.2 の変更

- CPUの初期配置は、難易度に関係なく中央4×4の空きマスから均等ランダムに選択。
- 着手時の短いクリック音。
- オリジナルの自動生成BGM（初期値OFF）。タイトル・設定・対局・結果画面でON/OFFを切り替え可能。
- 石のハイライトと影を強化。
- トロフィー、順位、同順位に対応したWinner画面。短い拍手・歓声風の合成効果音。
- タイトル・設定にVer. 1.2表示。
- 日本語／ENGLISH切り替え。選んだ言語とBGM設定をブラウザーに保存。

## 遊び方 / How to play

1. STARTから人間の人数（1〜4人）とCPU難易度（1〜5）を選択します。
2. 各色の手番順は毎回ランダムです。最初に中央4×4へ各色4枚、計16枚を置きます。この間は石を返しません。
3. 対局フェーズでは盤全体を使い、他の色の石を自分の色で挟んだ列を返します。
4. 置けない色は自動パス。全員置けなくなった時点で石数を比較します。同数トップは引き分けです。

Choose human players and CPU difficulty. Place four stones per color in the central area, then bracket other colors to flip their stones. Players with no move pass automatically. Most stones wins; equal top scores share first place.

## ファイル / Files

- index.html: 画面・操作 / UI
- engine.mjs: ルール・CPU・順位 / game logic
- audio.mjs: BGM・効果音の生成 / procedural audio
- i18n.mjs: 日本語・英語 / translations
- logo.png: 完成ロゴ / logo
- README.md: 説明 / documentation

## 公開 / Hosting

上の6ファイルをGitHubリポジトリの同じ階層にアップロードしてください。
GitHub Pages: Deploy from a branch → main → / (root).
Upload all six files to the same repository folder. Publish main / (root) with GitHub Pages.

ローカルではHTTPサーバーから開いてください。HTMLの直接ダブルクリックではモジュールが読み込めない場合があります。

```sh
python -m http.server 8000
```

http://localhost:8000 を開きます。

## 音声について / Audio

外部の録音や音楽ファイルを使わず、Web Audio APIでオリジナルBGMと効果音を生成します。
音声はボタンなどの操作後に再生されます。端末の音量・ブラウザー設定によっては音が出ない場合があります。
BGM is off by default. Audio starts after user interaction. No external recordings or music assets are used.

Ⓒmelon0811 All rights reserved.


Ver. 1.2: プレイヤー表示を「赤 プレイヤー１」「青 プレイヤー２」「黄 CPU」に変更。英語は「Red Player１」「Yellow CPU」。色と役割の間は半角スペース、プレイヤー名と全角数字の間にスペースはありません。
