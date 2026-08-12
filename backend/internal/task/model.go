package task

import (
	"errors"
	"strings"
	"time"
)

type TaskStatus string

const (
	StatusAfazer      TaskStatus = "afazer"
	StatusEmProgresso TaskStatus = "emprogresso"
	StatusFeito       TaskStatus = "feito"
)

type Task struct {
	ID         int        `json:"id"`
	Titulo     string     `json:"titulo"`
	Descricao  string     `json:"descricao"`
	Status     TaskStatus `json:"status"`
	DataInicio *time.Time `json:"data_inicio,omitempty"`
	DataFim    *time.Time `json:"data_fim,omitempty"`
}

func (s TaskStatus) IsValid() bool {
	switch s {
	case StatusAfazer, StatusEmProgresso, StatusFeito:
		return true
	default:
		return false
	}
}

func (t *Task) Validate() error {
	titulo := strings.TrimSpace(t.Titulo)
	if titulo == "" {
		return errors.New("o título da tarefa é obrigatório")
	}
	if len(titulo) > 80 {
		return errors.New("o título da tarefa não pode exceder 80 caracteres")
	}
	if !t.Status.IsValid() {
		return errors.New("status inválido. Use: 'afazer', 'emprogresso' ou 'feito'")
	}

	if t.DataInicio != nil && t.DataFim != nil {
		if t.DataInicio.After(*t.DataFim) {
			return errors.New("a data de início não pode ser posterior à data de fim")
		}
	}

	return nil
}
