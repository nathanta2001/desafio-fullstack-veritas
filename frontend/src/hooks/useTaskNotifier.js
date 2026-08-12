import { useEffect, useRef } from 'react';
import { notification } from 'antd';
import dayjs from 'dayjs';


export const useTaskNotifier = (tasks = []) => {
  const notifiedTasksRef = useRef(new Set());

  // Solicita permissão do navegador para enviar notificações
  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        notification.success({
          title: 'Notificações Ativadas',
          description: 'Você receberá avisos sobre o início e prazo das suas tarefas.',
        });
      }
    }
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    if (!tasks || tasks.length === 0) return;

    const interval = setInterval(() => {
      const now = dayjs();

      tasks.forEach((task) => {
        // Se a tarefa já foi concluída, não notificar
        if (task.status === 'feito') return;

        // Alerta de Início de Tarefa
        if (task.data_inicio) {
          const inicio = dayjs(task.data_inicio);
          const keyInicio = `start-${task.id}-${inicio.format('YYYY-MM-DD-HH-mm')}`;

          if (now.isAfter(inicio) && now.isBefore(inicio.add(2, 'minute')) && !notifiedTasksRef.current.has(keyInicio)) {
            triggerNotification('Hora de Começar!', `A tarefa "${task.titulo}" está agendada para começar agora.`);
            notifiedTasksRef.current.add(keyInicio);
          }
        }

        // Alerta de Fim de Tarefa (Prestes a expirar ou Expirada)
        if (task.data_fim) {
          const fim = dayjs(task.data_fim);
          const diffMinutes = fim.diff(now, 'minute');

          const keyNearEnd = `near-end-${task.id}`;
          const keyExpired = `expired-${task.id}`;

          // Faltam 10 minutos ou menos
          if (diffMinutes > 0 && diffMinutes <= 10 && !notifiedTasksRef.current.has(keyNearEnd)) {
            triggerNotification('Prazo Próximo!', `A tarefa "${task.titulo}" expira em aproximadamente ${diffMinutes} minutos.`);
            notifiedTasksRef.current.add(keyNearEnd);
          }

          // Já expirou
          if (now.isAfter(fim) && !notifiedTasksRef.current.has(keyExpired)) {
            triggerNotification('Tarefa Expirada!', `O prazo da tarefa "${task.titulo}" expirou.`);
            notifiedTasksRef.current.add(keyExpired);
          }
        }
      });
    }, 10000); // Checa a cada 10 segundos

    return () => clearInterval(interval);
  }, [tasks]);

  const triggerNotification = (title, body) => {
    // Exibe notificação interna da interface
    notification.info({
      title: title,
      description: body,
      placement: 'topRight',
      duration: 10,
    });

    // Exibe notificação push do navegador caso a permissão tenha sido concedida
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
      });
    }
  };

  return { requestNotificationPermission };
};