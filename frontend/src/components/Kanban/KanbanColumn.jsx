import React from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Card, Badge, Typography, Empty, theme } from 'antd';
import { TaskCard } from './TaskCard';

const { Title } = Typography;
const { useToken } = theme;

export const KanbanColumn = ({ column, tasks, onEditTask, onDeleteTask, onViewTask }) => {
  const { token } = useToken();

  return (
    <Card
      style={{
        backgroundColor: token.colorBgElevated,
        borderColor: token.colorBorderSecondary,
        borderRadius: token.borderRadiusLG,
        display: 'flex',
        flexDirection: 'column',
        maxHeight: 'calc(100vh - 120px)',
      }}
      styles={{
        body: {
          flex: 1,
          overflowY: 'auto',
          padding: 12,
        }
      }}
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={5} style={{ margin: 0, color: token.colorText }}>
            {column.title}
          </Title>
          <Badge count={tasks.length} showZero color={token.colorPrimary} />
        </div>
      }
    >
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              minHeight: 180,
              padding: '4px',
              backgroundColor: snapshot.isDraggingOver ? token.colorPrimaryBg : 'transparent',
              borderRadius: token.borderRadius,
              transition: 'background-color 0.2s ease',
            }}
          >
            {tasks.length === 0 ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={<span style={{ color: token.colorTextDisabled }}>Nenhuma tarefa</span>}
              />
            ) : (
              tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                  {(dragProvided) => (
                    <TaskCard
                      task={task}
                      provided={dragProvided}
                      onEdit={onEditTask}
                      onDelete={onDeleteTask}
                      onView={onViewTask}
                    />
                  )}
                </Draggable>
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </Card>
  );
};