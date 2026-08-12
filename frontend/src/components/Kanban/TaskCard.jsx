import React from 'react';
import { Card, Tag, Button, Popconfirm, Space, Typography, theme } from 'antd';
import { DeleteOutlined, EditOutlined, ClockCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text, Paragraph } = Typography;
const { useToken } = theme;

const statusColors = {
  afazer: { color: 'default', label: 'A Fazer' },
  emprogresso: { color: 'processing', label: 'Em Progresso' },
  feito: { color: 'success', label: 'Concluída' },
};

export const TaskCard = ({ task, onEdit, onDelete, onView, provided }) => {
  const { token } = useToken();
  const statusInfo = statusColors[task.status] || statusColors.afazer;

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return dayjs(dateStr).format('DD/MM/YYYY HH:mm');
  };

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      style={{
        marginBottom: 12,
        ...provided.draggableProps.style,
      }}
    >
      <Card
        size="small"
        hoverable
        onClick={() => onView && onView(task)}
        style={{
          backgroundColor: token.colorBgContainer,
          borderColor: token.colorBorderSecondary,
          borderRadius: token.borderRadiusLG,
          cursor: 'pointer',
        }}
        actions={[
          <Button
            type="text"
            icon={<EditOutlined style={{ color: token.colorPrimary }} />}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            key="edit"
          />,
          <Popconfirm
            title="Excluir tarefa"
            description="Tem certeza que deseja remover esta tarefa?"
            onConfirm={(e) => {
              e?.stopPropagation();
              onDelete(task.id);
            }}
            onCancel={(e) => e?.stopPropagation()}
            okText="Sim"
            cancelText="Não"
            key="delete"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={(e) => e.stopPropagation()}
            />
          </Popconfirm>,
        ]}
      >
        <Space orientation="vertical" style={{ width: '100%' }} size={4}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
            <Text strong ellipsis style={{ color: token.colorText, fontSize: 14, flex: 1 }}>
              {task.titulo}
            </Text>
            <Tag color={statusInfo.color} style={{ marginRight: 0 }}>
              {statusInfo.label}
            </Tag>
          </div>

          {task.descricao && (
            <Paragraph
              type="secondary"
              ellipsis={{ rows: 2 }}
              style={{ margin: '4px 0 8px 0', color: token.colorTextSecondary, fontSize: 12 }}
            >
              {task.descricao}
            </Paragraph>
          )}

          {(task.data_inicio || task.data_fim) && (
            <Space orientation="vertical" size={2} style={{ marginTop: 4 }}>
              {task.data_inicio && (
                <Text type="secondary" style={{ fontSize: 11, color: token.colorTextDescription }}>
                  <ClockCircleOutlined style={{ marginRight: 4 }} />
                  Início: {formatDate(task.data_inicio)}
                </Text>
              )}
              {task.data_fim && (
                <Text type="secondary" style={{ fontSize: 11, color: token.colorTextDescription }}>
                  <ClockCircleOutlined style={{ marginRight: 4 }} />
                  Fim: {formatDate(task.data_fim)}
                </Text>
              )}
            </Space>
          )}
        </Space>
      </Card>
    </div>
  );
};