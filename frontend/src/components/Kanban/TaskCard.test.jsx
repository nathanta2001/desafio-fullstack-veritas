import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TaskCard } from './TaskCard';

const dummyTask = {
  id: 1,
  titulo: 'Testar Frontend',
  descricao: 'Descrição de teste',
  status: 'afazer',
};

const dummyProvided = {
  innerRef: () => {},
  draggableProps: {},
  dragHandleProps: {},
};

describe('TaskCard Component', () => {
  it('deve renderizar o título e status da tarefa corretamente', () => {
    render(<TaskCard task={dummyTask} provided={dummyProvided} onEdit={() => {}} onDelete={() => {}} />);

    expect(screen.getByText('Testar Frontend')).toBeInTheDocument();
    expect(screen.getByText('A Fazer')).toBeInTheDocument();
  });
});