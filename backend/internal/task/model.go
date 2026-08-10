package task

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
