import React, { useState } from 'react';
import { List, Badge, Button, Space, Typography, Tag } from 'antd';
import {
  CheckOutlined,
  PhoneOutlined,
  FileTextOutlined,
  TeamOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import type { TodoItem } from '../../types';

const { Text } = Typography;

interface TodoListProps {
  todos: TodoItem[];
  onTodoComplete: (todoId: string) => void;
  onTodoAction: (todoId: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({
  todos,
  onTodoComplete,
  onTodoAction,
}) => {
  const [completedTodos, setCompletedTodos] = useState<Set<string>>(new Set());

  const handleComplete = (todoId: string) => {
    setCompletedTodos(prev => new Set(prev).add(todoId));
    onTodoComplete(todoId);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'red';
      case 'medium':
        return 'orange';
      case 'low':
        return 'blue';
      default:
        return 'default';
    }
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'call':
        return <PhoneOutlined />;
      case 'appointment':
        return <TeamOutlined />;
      case 'proposal':
        return <FileTextOutlined />;
      default:
        return <MoreOutlined />;
    }
  };

  const sortedTodos = [...todos].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <List
      header={
        <div style={{ fontSize: 16, fontWeight: 'bold' }}>今日のToDo</div>
      }
      dataSource={sortedTodos}
      renderItem={item => (
        <List.Item
          style={{
            textDecoration: completedTodos.has(item.id)
              ? 'line-through'
              : 'none',
            opacity: completedTodos.has(item.id) ? 0.6 : 1,
          }}
          actions={[
            <Button
              type="primary"
              size="small"
              icon={<CheckOutlined />}
              disabled={completedTodos.has(item.id)}
              onClick={() => handleComplete(item.id)}
            >
              完了
            </Button>,
            <Button
              size="small"
              icon={getActionIcon(item.actionType)}
              disabled={completedTodos.has(item.id)}
              onClick={() => onTodoAction(item.id)}
            >
              実行
            </Button>,
          ]}
        >
          <List.Item.Meta
            avatar={
              <Badge
                color={getPriorityColor(item.priority)}
                text={
                  <Tag color={getPriorityColor(item.priority)}>
                    {item.priority === 'high'
                      ? '高'
                      : item.priority === 'medium'
                        ? '中'
                        : '低'}
                  </Tag>
                }
              />
            }
            title={
              <Space>
                <Text strong>{item.title}</Text>
                {item.dueTime && (
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {item.dueTime}
                  </Text>
                )}
              </Space>
            }
            description={
              <Space direction="vertical" size={0}>
                <Text type="secondary">{item.description}</Text>
                {item.relatedCompany && (
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    関連: {item.relatedCompany}
                  </Text>
                )}
              </Space>
            }
          />
        </List.Item>
      )}
    />
  );
};

export default TodoList;
