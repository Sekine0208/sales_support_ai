import React, { useState } from 'react';
import { Form, Radio, Switch, Input, Button, Space, App } from 'antd';
import type { VisitResult } from '../../types';

const { TextArea } = Input;

interface VisitResultFormProps {
  visitId: string;
  onSubmit: (result: {
    result: VisitResult;
    hasNegotiation: boolean;
    nextAction?: string;
    summary: string;
    details?: string;
  }) => void;
  onCancel: () => void;
  initialValues?: {
    result?: VisitResult;
    hasNegotiation?: boolean;
    nextAction?: string;
    summary?: string;
    details?: string;
  };
}

const VisitResultForm: React.FC<VisitResultFormProps> = ({
  visitId,
  onSubmit,
  onCancel,
  initialValues,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [hasNegotiation, setHasNegotiation] = useState(
    initialValues?.hasNegotiation || false
  );
  const { message } = App.useApp();

  const resultOptions: VisitResult[] = ['成功', '失敗', '再訪問', 'キャンセル'];

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      await onSubmit({
        result: values.result,
        hasNegotiation: values.hasNegotiation || false,
        nextAction: values.nextAction,
        summary: values.summary,
        details: values.details,
      });
      message.success('訪問結果を保存しました');
      form.resetFields();
    } catch (error) {
      message.error('保存に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={handleSubmit}
    >
      <Form.Item
        name="result"
        label="訪問結果"
        rules={[{ required: true, message: '訪問結果を選択してください' }]}
      >
        <Radio.Group>
          <Space direction="vertical">
            {resultOptions.map(option => (
              <Radio key={option} value={option}>
                {option}
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      </Form.Item>

      <Form.Item name="hasNegotiation" label="商談発生" valuePropName="checked">
        <Switch
          checkedChildren="あり"
          unCheckedChildren="なし"
          onChange={setHasNegotiation}
        />
      </Form.Item>

      {hasNegotiation && (
        <Form.Item
          name="negotiationSummary"
          label="商談概要"
          rules={[{ required: true, message: '商談概要を入力してください' }]}
        >
          <TextArea
            rows={2}
            placeholder="商談の概要を記入してください"
            maxLength={200}
            showCount
          />
        </Form.Item>
      )}

      <Form.Item name="nextAction" label="次のアクション">
        <Input
          placeholder="次回の予定や必要なアクションを記入"
          maxLength={100}
        />
      </Form.Item>

      <Form.Item
        name="summary"
        label="訪問サマリー"
        rules={[{ required: true, message: '訪問サマリーを入力してください' }]}
      >
        <TextArea
          rows={3}
          placeholder="訪問の概要を簡潔に記入してください"
          maxLength={300}
          showCount
        />
      </Form.Item>

      <Form.Item name="details" label="詳細メモ（任意）">
        <TextArea
          rows={4}
          placeholder="詳細な内容や気づいた点などを記入してください"
          maxLength={1000}
          showCount
        />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            保存
          </Button>
          <Button onClick={onCancel}>キャンセル</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default VisitResultForm;
