package task

import (
	"errors"
	"strings"
	"time"
)

type TaskStatus string

const (
	StatusAfazer      TaskStatus = "afazer"
	StatusEmprogresso TaskStatus = "emprogresso"
	StatusFeito       TaskStatus = "feito"
)

type Task struct {
	ID         int        `json:"id"`
	Titulo     string     `json:"titulo"`
	Descricao  string     `json:"descricao"`
	Status     TaskStatus `json:"status"`
	DataInicio *string    `json:"data_inicio,omitempty"`
	DataFim    *string    `json:"data_fim,omitempty"`
}

func (s TaskStatus) IsValid() bool {

	switch s {
	case StatusAfazer, StatusEmprogresso, StatusFeito:
		return true
	default:
		return false
	}

}

func (t *Task) Validate() error {

	if strings.TrimSpace(t.Titulo) == "" {
		return errors.New("A tarefa deve ter um Título")
	}

	if !t.Status.IsValid() {
		return errors.New("Status inválido")
	}

	// se as duas datas forem fornecidas, data_inicio não pode ser depois da data_fim
	if t.DataInicio != nil && t.DataFim != nil && *t.DataInicio != "" && *t.DataFim != "" {
		inicio, errIni := time.Parse(time.RFC3339, *t.DataInicio)
		fim, errFim := time.Parse(time.RFC3339, *t.DataFim)

		if errIni == nil && errFim == nil && inicio.After(fim) {
			return errors.New("a data de fim deve ser superior à data de início")
		}
	}

	return nil
}
