package task

import (
	"errors"
	"strings"
)

type TaskStatus string

const (
	StatusAfazer      TaskStatus = "afazer"
	StatusEmprogresso TaskStatus = "emprogresso"
	StatusFeito       TaskStatus = "feito"
)

type Task struct {
	ID        int        `json:"id"`
	Titulo    string     `json:"titulo"`
	Descricao string     `json:"descricao"`
	Status    TaskStatus `json:"status"`
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
	return nil

}
