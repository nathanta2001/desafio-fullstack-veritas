import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker } from 'antd';
import dayjs from 'dayjs';

const { TextArea } = Input;

export const TaskModal = ({ open, onCancel, onSubmit, initialValues, loading }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      if (initialValues) {
        form.setFieldsValue({
          titulo: initialValues.titulo,
          descricao: initialValues.descricao,
          status: initialValues.status,
          data_inicio: initialValues.data_inicio ? dayjs(initialValues.data_inicio) : null,
          data_fim: initialValues.data_fim ? dayjs(initialValues.data_fim) : null,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ status: 'afazer' });
      }
    }
  }, [open, initialValues, form]);

  const handleFinish = (values) => {
    const formattedData = {
      ...values,
      data_inicio: values.data_inicio ? values.data_inicio.toISOString() : null,
      data_fim: values.data_fim ? values.data_fim.toISOString() : null,
    };

    onSubmit(formattedData);
  };

  return (
    <Modal
      open={open}
      title={initialValues ? 'Editar Tarefa' : 'Nova Tarefa'}
      okText={initialValues ? 'Salvar' : 'Criar'}
      cancelText="Cancelar"
      confirmLoading={loading}
      onCancel={onCancel}
      onOk={() => form.submit()}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="titulo"
          label="Título"
          rules={[
            { required: true, message: 'Por favor, insira o título da tarefa' },
            { max: 80, message: 'O título deve ter no máximo 80 caracteres' },
          ]}
        >
          <Input placeholder="Ex: Desenvolver endpoint de usuários" maxLength={80} showCount/>
        </Form.Item>

        <Form.Item name="descricao" label="Descrição">
          <TextArea rows={3} placeholder="Descrição opcional das atividades..." />
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: 'Selecione o status' }]}
        >
          <Select
            options={[
              { value: 'afazer', label: 'A Fazer' },
              { value: 'emprogresso', label: 'Em Progresso' },
              { value: 'feito', label: 'Concluídas' },
            ]}
          />
        </Form.Item>

        <Form.Item name="data_inicio" label="Data e Hora de Início (Opcional)">
          <DatePicker showTime format="DD/MM/YYYY HH:mm" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="data_fim" label="Data e Hora de Término (Opcional)">
          <DatePicker showTime format="DD/MM/YYYY HH:mm" style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};