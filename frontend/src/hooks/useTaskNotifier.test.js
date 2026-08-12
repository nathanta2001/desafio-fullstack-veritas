import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useTaskNotifier } from './useTaskNotifier';
import dayjs from 'dayjs';

describe('useTaskNotifier Hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('deve identificar tarefas próximas do fim e disparar notificação', async () => {
    const now = dayjs();
    const taskExpiringSoon = [
      {
        id: 99,
        titulo: 'Tarefa Urgente',
        status: 'afazer',
        data_fim: now.add(5, 'minute').toISOString(),
      },
    ];

    renderHook(() => useTaskNotifier(taskExpiringSoon));

    await act(async () => {
      vi.advanceTimersByTime(10000);
    });

    expect(taskExpiringSoon[0].status).toBe('afazer');
  });
});