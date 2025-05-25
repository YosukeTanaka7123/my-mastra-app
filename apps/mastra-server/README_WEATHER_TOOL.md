# OpenWeather API Mastraツール実装

このプロジェクトは、OpenWeather APIを使用するMastraツールをTypeScriptで実装したものです。

## 実装内容

### 1. `weatherInfo.ts` - OpenWeather APIツール

- **OpenWeatherApiClient クラス**: OpenWeather APIとの通信を担当
  - `getCurrentWeather()`: 座標から天気情報を取得
  - `getGeocoding()`: 都市名から座標を取得
- **weatherInfo ツール**: Mastraフレームワーク用の天気情報取得ツール
  - 都市名を入力として受け取り
  - 座標変換→天気情報取得の2段階処理
  - 日本語の天気情報を返却

### 2. `weather-agent.ts` - 天気エージェント

- Google Gemini 2.0 Flash Liteモデルを使用
- 作成した`weatherInfo`ツールを組み込み
- 日本語での天気情報提供に特化

## セットアップ

### 1. 環境変数の設定

`.env`ファイルで以下のAPIキーを設定してください：

```env
# OpenWeather API キー（https://openweathermap.org/api で取得）
OPENWEATHER_API_KEY=your_openweather_api_key_here

# Google AI API キー
GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key_here
```

### 2. OpenWeather APIキーの取得

1. [OpenWeatherMap](https://openweathermap.org/api)にアクセス
2. アカウントを作成/ログイン
3. APIキーを取得
4. `.env`ファイルの`OPENWEATHER_API_KEY`に設定

### 3. テスト実行

```bash
# 依存関係のインストール
npm install

# テストエージェントの実行
npm run test-agent
# または
npx tsx src/test-agent.ts
```

## 機能

### weatherInfoツール

**入力:**
- `city` (string): 天気情報を取得したい都市名

**出力:**
- `city`: 都市名（日本語名があれば日本語で表示）
- `temperature`: 気温（℃）
- `feelsLike`: 体感温度（℃）
- `humidity`: 湿度（%）
- `pressure`: 気圧（hPa）
- `conditions`: 天気の状態
- `description`: 天気の詳細説明
- `windSpeed`: 風速（m/s）
- `windDirection`: 風向（度）
- `coordinates`: 座標情報

### エラーハンドリング

- APIキーが設定されていない場合のエラー
- 都市が見つからない場合のエラー
- API通信エラーのハンドリング
- 詳細なエラーメッセージの提供

## 使用例

```typescript
// 天気エージェントを使用
const agent = mastra.getAgent("weatherAgent");
const result = await agent.generate("東京の天気を教えてください");
console.log(result.text);
```

## 注意事項

- OpenWeather APIの無料プランには制限があります（60回/分、1,000回/日）
- APIキーは必ず`.env`ファイルに設定し、Gitにコミットしないでください
- 座標変換に失敗した場合、都市名のスペルや表記を確認してください
