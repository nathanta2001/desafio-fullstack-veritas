import React, { useState } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { Button, Spin, Alert, Layout, Typography, Row, Col, theme } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useTasksQuery } from '../../hooks/useTasksQuery';
import { KanbanColumn } from './KanbanColumn';
import { TaskModal } from '../Modals/TaskModal';
import { TaskDetailsModal } from '../Modals/TaskDetailsModal';
import { useTaskNotifier } from '../../hooks/useTaskNotifier';

const { Header, Content } = Layout;
const { Title } = Typography;
const { useToken } = theme;

const COLUMNS = [
  { id: 'afazer', title: 'A Fazer' },
  { id: 'emprogresso', title: 'Em Progresso' },
  { id: 'feito', title: 'Concluídas' },
];

export const KanbanBoard = () => {
  const { token } = useToken();
  const { tasks, isLoading, isError, createTask, updateTask, deleteTask } = useTasksQuery();
  const [modalOpen, setModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewingTask, setViewingTask] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useTaskNotifier(tasks);

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const taskId = Number(draggableId);
    const draggedTask = tasks.find((t) => t.id === taskId);
    if (!draggedTask) return;

    const updatedTask = {
      ...draggedTask,
      status: destination.droppableId,
    };

    await updateTask(updatedTask);
  };

  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleOpenViewModal = (task) => {
    setViewingTask(task);
    setDetailsModalOpen(true);
  };

  const handleSubmitModal = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingTask) {
        await updateTask({ id: editingTask.id, ...formData });
      } else {
        await createTask(formData);
      }
      setModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: token.colorBgBase }}>
        <Spin size="large" description="Carregando tarefas..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ padding: 24, backgroundColor: token.colorBgBase, minHeight: '100vh' }}>
        <Alert
          title="Erro de Conexão"
          description="Não foi possível conectar com o backend Go. Certifique-se de que o servidor está rodando na porta 8080."
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: token.colorBgBase }}>
      <Header
        style={{
          backgroundColor: token.colorBgElevated,
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          padding: '0 16px',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <Title level={4} style={{ margin: 0, color: token.colorText }}>
          Mini Kanban
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleOpenCreateModal}
          style={{ fontWeight: 600 }}
        >
          Nova Tarefa
        </Button>
      </Header>

      <Content style={{ padding: '16px', maxWidth: 1400, margin: '0 auto', width: '100%' }}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Row gutter={[16, 16]}>
            {COLUMNS.map((col) => {
              const columnTasks = tasks.filter((t) => t.status === col.id);
              return (
                <Col xs={24} md={8} key={col.id}>
                  <KanbanColumn
                    column={col}
                    tasks={columnTasks}
                    onEditTask={handleOpenEditModal}
                    onDeleteTask={deleteTask}
                    onViewTask={handleOpenViewModal}
                  />
                </Col>
              );
            })}
          </Row>
        </DragDropContext>
      </Content>

      <TaskModal
        open={modalOpen}
        initialValues={editingTask}
        loading={isSubmitting}
        onCancel={() => setModalOpen(false)}
        onSubmit={handleSubmitModal}
      />

      <TaskDetailsModal
        open={detailsModalOpen}
        task={viewingTask}
        onClose={() => setDetailsModalOpen(false)}
      />
    </Layout>
  );
};