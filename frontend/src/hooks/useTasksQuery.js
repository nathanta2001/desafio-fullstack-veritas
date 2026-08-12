import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../services/taskService';
import { message } from 'antd';

export const TASKS_QUERY_KEY = ['tasks'];

export const useTasksQuery = () => {
  const queryClient = useQueryClient();

  // Buscar tarefas
  const tasksQuery = useQuery({
    queryKey: TASKS_QUERY_KEY,
    queryFn: taskService.getTasks,
  });

  // Criar tarefa
  const createTaskMutation = useMutation({
    mutationFn: taskService.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      message.success('Tarefa criada com sucesso!');
    },
    onError: (err) => {
      message.error(err.response?.data?.error || 'Erro ao criar tarefa');
    },
  });

  // Atualizar tarefa 
  const updateTaskMutation = useMutation({
    mutationFn: taskService.updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      message.success('Tarefa atualizada!');
    },
    onError: (err) => {
      message.error(err.response?.data?.error || 'Erro ao atualizar tarefa');
    },
  });

  // Deletar tarefa
  const deleteTaskMutation = useMutation({
    mutationFn: taskService.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      message.success('Tarefa removida!');
    },
    onError: (err) => {
      message.error(err.response?.data?.error || 'Erro ao deletar tarefa');
    },
  });

  return {
    tasks: tasksQuery.data || [],
    isLoading: tasksQuery.isLoading,
    isError: tasksQuery.isError,
    error: tasksQuery.error,
    createTask: createTaskMutation.mutateAsync,
    updateTask: updateTaskMutation.mutateAsync,
    deleteTask: deleteTaskMutation.mutateAsync,
  };
};