import React, { useState } from 'react';
import { Form, Radio, Input, Button, Space, App } from 'antd';
import type { CallResultType } from '../../types';

const { TextArea } = Input;

interface CallResultFormProps {
  callId: string;
  onSubmit: (result: { resultType: CallResultType; notes: string }) => void;
  onCancel: () => void;
  initialValues?: {
    resultType?: CallResultType;
    notes?: string;
  };
}

const CallResultForm: React.FC<CallResultFormProps> = ({
  callId,
  onSubmit,
  onCancel,
  initialValues,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { message } = App.useApp();

  const resultOptions: CallResultType[] = [
    '架電済',
    '通電',
    'アポ獲得',
    '不在',
    '拒否',
    'その他',
  ];

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      await onSubmit({
        resultType: values.resultType,
        notes: values.notes || '',
      });
      message.success('架電結果を保存しました');
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
        name="resultType"
        label="架電結果"
        rules={[{ required: true, message: '架電結果を選択してください' }]}
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

      <Form.Item name="notes" label="メモ（任意）">
        <TextArea
          rows={4}
          placeholder="架電の詳細や次回アクションなどをメモしてください"
          maxLength={500}
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

export default CallResultForm;
