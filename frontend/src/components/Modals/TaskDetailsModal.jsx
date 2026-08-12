import React from 'react';
import { Modal, Typography, Tag, Space, Descriptions, Divider } from 'antd';
import { ClockCircleOutlined, CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Paragraph, Text } = Typography;

const statusColors = {
  afazer: { color: 'default', label: 'A Fazer' },
  emprogresso: { color: 'processing', label: 'Em Progresso' },
  feito: { color: 'success', label: 'Concluída' },
};

export const TaskDetailsModal = ({ open, onClose, task }) => {
  if (!task) return null;

  const statusInfo = statusColors[task.status] || statusColors.afazer;
  const formatDate = (dateStr) => (dateStr ? dayjs(dateStr).format('DD/MM/YYYY HH:mm') : 'Não informada');

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={
        <Space style={{ width: '100%', justifyContent: 'space-between', paddingRight: 24 }}>
          <Text type="secondary">ID #{task.id}</Text>
          <Tag color={statusInfo.color}>{statusInfo.label}</Tag>
        </Space>
      }
    >
      <Title level={4} style={{ marginTop: 8, color: '#f4f4f5' }}>
        {task.titulo}
      </Title>

      <Divider style={{ borderColor: '#3f3f46', margin: '12px 0' }} />

      <Paragraph style={{ color: '#d4d4d8', fontSize: 14, whiteSpace: 'pre-wrap' }}>
        {task.descricao || 'Nenhuma descrição fornecida.'}
      </Paragraph>

      <Divider style={{ borderColor: '#3f3f46', margin: '12px 0' }} />

      <Descriptions column={1} size="small" layout="horizontal">
        <Descriptions.Item label={<Space><CalendarOutlined /> Data de Início</Space>}>
          <Text style={{ color: '#a1a1aa' }}>{formatDate(task.data_inicio)}</Text>
        </Descriptions.Item>
        <Descriptions.Item label={<Space><ClockCircleOutlined /> Data de Término</Space>}>
          <Text style={{ color: '#a1a1aa' }}>{formatDate(task.data_fim)}</Text>
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};