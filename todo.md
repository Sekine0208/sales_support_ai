# 営業サポートAI システム実装タスク

## プロジェクト概要
営業活動を効率化するAIシステムの基本機能をモックアップで検証し、本格的な営業支援プラットフォームへ拡張

**コンセプト**: 行動KPIを達成するところにとがらせたAI
- **指示だし**: KGI→KPI→Daily ToDoまで落として具体的な行動を指示
- **補助輪**: ToDoを達成するための徹底的な支援（入力・思考時間の極小化）

**機能拡張版の追加価値**:
- **一気通貫管理**: 架電→訪問→商談→受注までの営業フロー全体をシームレス管理
- **マネジメント視点**: 10項目KPIの多軸分析による戦略的意思決定支援
- **自動連携**: AI判定による工程間データ連携で入力作業を削減

## Phase 1: 環境構築（1.5分） ✅ **完了**

### 1.1 プロジェクト初期化
- [x] Viteプロジェクト作成（React + TypeScript）
- [x] 依存関係インストール
- [x] 開発サーバー起動確認

## Phase 2: 基本レイアウト（1.5分） ✅ **完了**

### 2.1 ディレクトリ構成作成
- [x] components/layout/ ディレクトリ作成
- [x] components/kpi/ ディレクトリ作成
- [x] components/call/ ディレクトリ作成
- [x] data/ ディレクトリ作成
- [x] pages/ ディレクトリ作成
- [x] types/ ディレクトリ作成
- [x] utils/ ディレクトリ作成

### 2.2 基本レイアウトコンポーネント
- [x] App.tsx - メインレイアウト実装
- [x] components/layout/AppLayout.tsx 作成
- [x] components/layout/Navigation.tsx 作成

### 2.3 型定義
- [x] types/index.ts - 基本型定義作成

## Phase 3: KPI指示だし画面（3.5分） ✅ **完了**

### 3.1 モックデータ作成
- [x] data/kpiData.json 作成
- [x] KGI・KPI・Daily ToDo・NextAction

### 3.2 KPIOverview コンポーネント
- [x] components/kpi/KPIOverview.tsx 作成
- [x] KGI達成状況のProgress表示
- [x] 行動KPI進捗バー

### 3.3 TodoList コンポーネント
- [x] components/kpi/TodoList.tsx 作成
- [x] 優先度別Badge表示
- [x] 完了/実行ボタン

### 3.4 NextAction コンポーネント
- [x] components/kpi/NextAction.tsx 作成
- [x] 緊急度別スタイリング

### 3.5 KPI Dashboard統合
- [x] pages/KPIDashboard.tsx 作成

## Phase 4: 架電支援画面（3.5分） ✅ **完了**

### 4.1 架電リストデータ作成
- [x] data/callListData.json 作成
- [x] 企業名、担当者、優先度、参照情報

### 4.2 CallList コンポーネント
- [x] components/call/CallList.tsx 作成
- [x] 優先度順テーブル表示
- [x] ワンクリック発信ボタン

### 4.3 ReferenceInfo コンポーネント
- [x] components/call/ReferenceInfo.tsx 作成
- [x] 過去購入製品、業界情報表示

### 4.4 架電支援画面統合
- [x] pages/CallSupport.tsx 作成

## Phase 5: ルーティング & 統合 ✅ **完了**

### 5.1 ルーティング設定
- [x] React Router設定
- [x] ナビゲーション動作確認

### 5.2 スタイリング調整
- [x] レスポンシブデザイン確認
- [x] Ant Designテーマ調整

## Phase 6: モックアップ版完了確認 ✅ **完了**

### 6.1 動作確認
- [x] KGI/KPI達成状況の視覚的表示
- [x] 今日のToDoと次アクションの明確な指示
- [x] 架電リストの優先度順表示
- [x] ワンクリック発信ボタンの動作
- [x] 参照情報（過去履歴・業界情報）の表示
- [x] 行動KPI進捗のリアルタイム確認

### 6.2 デモシナリオ実行
- [x] KPI確認 → ToDo確認 → 架電実行 → 参照情報活用 → 進捗更新

---

# ✅ **Phase 7-9: 機能拡張版（大部分実装済み）**

## 🎯 **Phase 7: 架電/訪問/商談画面機能** ✅ **大部分完了**

### 7.1 架電画面機能拡張 ✅ **完了**
- [x] **架電結果項目機能**
  - [x] types/call.ts 拡張 - 架電結果型実装済み
  - [x] components/call/CallResultForm.tsx 作成済み
  - [x] 架電結果選択（ラジオボタン）実装済み
  - [x] 自由記入欄（TextArea）実装済み
- [x] **活動履歴表示機能** - **next_order.md準拠**
  - [x] data/activityHistory.json 作成済み（過去1年分データ）
  - [x] components/call/ActivityHistory.tsx 作成済み
  - [x] 時系列活動履歴表示（Timeline形式）実装済み
  - [x] 活動種別アイコン・色分け実装済み
- [x] **詳細情報ポップアップ**
  - [x] components/call/CustomerDetailModal.tsx 作成済み
  - [x] BANTC情報表示・編集機能実装済み
  - [x] AIたたき台表示+自由記入機能実装済み
  - [x] 企業名クリック→右側に企業情報表示機能実装済み

### 7.2 訪問機能実装 ✅ **完了**
- [x] **訪問データ構造設計**
  - [x] types/visit.ts 作成済み（Visit型、VisitResult型）
  - [x] data/visitData.json 作成済み
- [x] **訪問リスト表示**
  - [x] components/visit/VisitList.tsx 作成済み
  - [x] 訪問予定リスト表示実装済み
  - [x] 商談発生ボタン実装済み
- [x] **訪問結果入力**
  - [x] components/visit/VisitResultForm.tsx 作成済み
  - [x] 訪問結果選択実装済み
  - [x] 商談設定フラグ実装済み
  - [x] pages/VisitSupport.tsx 作成済み

### 7.3 商談機能実装 🔄 **部分実装**
- [x] **商談データ構造設計**
  - [x] 商談KPIデータ（data/managementData.json）実装済み
- [ ] **商談リスト表示**（商談専用画面未実装）
  - [x] KPIグリッドでの商談数・商談単価表示は実装済み
  - [ ] 独立した商談管理画面
- [ ] **商談詳細編集**（商談専用画面未実装）
  - [x] BANTC情報は顧客詳細モーダルで実装済み
  - [ ] 独立した商談詳細画面

## Phase 8: マネジメントダッシュボード機能 ✅ **完了**

### 8.1 KPI拡張データ構造設計 ✅ **完了**
- [x] types/analytics.ts 作成済み
- [x] AnalyticsKPI型（10項目KPI）実装済み
- [x] AnalysisAxis型、FilterCondition型実装済み

### 8.2 マネジメント用モックデータ作成 ✅ **完了**
- [x] data/managementData.json 作成済み
- [x] 部署別・担当者別KPI実績データ実装済み
- [x] 時系列データ（月次・週次・日次）実装済み

### 8.3 KPI一覧表示コンポーネント ✅ **完了**
- [x] components/management/KPIGrid.tsx 作成済み
- [x] 10項目KPI表示（Table形式）実装済み
- [x] ソート・フィルタリング機能実装済み

### 8.4 分析軸フィルターコンポーネント ✅ **完了**
- [x] components/management/AnalysisFilter.tsx 作成済み
- [x] 多軸フィルター機能実装済み
- [x] クロス集計分析実装済み

### 8.5 マネジメントダッシュボード統合 ✅ **完了**
- [x] pages/ManagementDashboard.tsx 作成済み
- [x] KPIGrid + AnalysisFilter統合済み

## Phase 9: サイドメニュー・ルーティング ✅ **完了**

### 9.1 サイドメニュー拡張 ✅ **完了**
- [x] components/layout/Navigation.tsx 更新済み
- [x] 4メニュー（KPI・架電・訪問・マネジメント）実装済み

### 9.2 ルーティング更新 ✅ **完了**
- [x] App.tsx ルーティング追加済み
- [x] /call, /visit, /management ルート実装済み

---

# 📋 **残りの実装項目（優先度順）**

## 🎯 **高優先度: 商談・受注専用画面（8時間）**

### 1. 商談管理画面実装（4時間）
- [ ] **pages/NegotiationSupport.tsx 作成**
  - [ ] 商談リスト表示（月別・進捗別）
  - [ ] 商談詳細編集機能
  - [ ] 受注確度スライダー
  - [ ] 見積金額・商材選択

### 2. 受注管理画面実装（4時間）
- [ ] **pages/OrderHistory.tsx 作成**
  - [ ] 月別受注実績表示
  - [ ] 受注金額・商材別集計
  - [ ] 受注履歴検索機能

## 🔄 **中優先度: データフロー連携（4時間）**

### 3. 状態管理基盤構築（2時間）
- [ ] contexts/AppContext.tsx 作成
- [ ] グローバル状態管理
- [ ] フロー間データ連携

### 4. 自動連携機能（2時間）
- [ ] utils/flowIntegration.ts 作成
- [ ] 架電→訪問 自動連携
- [ ] 訪問→商談 連携
- [ ] 商談→受注 連携

## 🔧 **低優先度: 最適化・拡張（4時間）**

### 5. パフォーマンス最適化（2時間）
- [ ] React.memo、useMemo、useCallback適用
- [ ] Virtual Scrolling実装
- [ ] Code Splitting

### 6. エラーハンドリング強化（2時間）
- [ ] Error Boundary実装
- [ ] Loading State管理
- [ ] 404エラーページ

---