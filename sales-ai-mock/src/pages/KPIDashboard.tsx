import React from 'react';
import { Row, Col, Card, App } from 'antd';
import { useNavigate } from 'react-router-dom';
import KPIOverview from '../components/kpi/KPIOverview';
import TodoList from '../components/kpi/TodoList';
import NextAction from '../components/kpi/NextAction';
import kpiData from '../data/kpiData.json';
import type { KPIData, TodoItem } from '../types';

const KPIDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const data = kpiData.kpi as KPIData;
  const todos = kpiData.todos as TodoItem[];

  const handleTodoComplete = (_todoId: string) => {
    message.success('タスクを完了しました！');
  };

  const handleTodoAction = (todoId: string) => {
    const todo = todos.find(t => t.id === todoId);
    if (todo?.actionType === 'call') {
      navigate('/call');
    } else {
      message.info('アクションを実行します');
    }
  };

  const handleNextAction = () => {
    if (data.nextAction.actionType === 'call') {
      navigate('/call');
    } else {
      message.info('アクションを実行します');
    }
  };

  return (
    <div>
      <NextAction nextAction={data.nextAction} onAction={handleNextAction} />
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <KPIOverview data={data} />
        </Col>
        <Col xs={24} lg={12}>
          <Card style={{ height: '100%' }}>
            <TodoList
              todos={todos}
              onTodoComplete={handleTodoComplete}
              onTodoAction={handleTodoAction}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default KPIDashboard;
