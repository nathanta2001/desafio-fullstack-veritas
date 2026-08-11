package task

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
	"sync"
)

type TaskHandler struct {
	mu     sync.RWMutex
	tasks  map[int]Task
	nextID int
}

func NewTaskHandler() *TaskHandler {

	return &TaskHandler{
		tasks:  make(map[int]Task),
		nextID: 1,
	}

}

// ServeHTTP como roteador para os endpoints de tarefas
func (h *TaskHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {

	//cors
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	path := strings.TrimPrefix(r.URL.Path, "/tasks")
	path = strings.Trim(path, "/")

	if path == "" {
		switch r.Method {
		case http.MethodGet:
			h.getTasks(w, r)
		case http.MethodPost:
			h.createTask(w, r)
		default:
			http.Error(w, `{"error": "Método não permitido"}`, http.StatusMethodNotAllowed)
		}
		return
	}

	id, err := strconv.Atoi(path)
	if err != nil {
		http.Error(w, `{"error": "ID inválido"}`, http.StatusBadRequest)
		return
	}

	switch r.Method {
	case http.MethodPut:
		h.updateTask(w, r, id)
	case http.MethodDelete:
		h.deleteTask(w, r, id)
	default:
		http.Error(w, `{"error": "Método não permitido"}`, http.StatusMethodNotAllowed)
	}
}

func (h *TaskHandler) getTasks(w http.ResponseWriter, r *http.Request) {
	h.mu.RLock()
	defer h.mu.RUnlock()

	taskList := make([]Task, 0, len(h.tasks))
	for _, t := range h.tasks {
		taskList = append(taskList, t)
	}

	json.NewEncoder(w).Encode(taskList)
}

func (h *TaskHandler) createTask(w http.ResponseWriter, r *http.Request) {
	var t Task
	if err := json.NewDecoder(r.Body).Decode(&t); err != nil {
		http.Error(w, `{"error": "JSON inválido"}`, http.StatusBadRequest)
		return
	}

	// Define status inicial padrão caso não seja informado
	if t.Status == "" {
		t.Status = StatusAfazer
	}

	if err := t.Validate(); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	h.mu.Lock()
	t.ID = h.nextID
	h.nextID++
	h.tasks[t.ID] = t
	h.mu.Unlock()

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(t)
}

func (h *TaskHandler) updateTask(w http.ResponseWriter, r *http.Request, id int) {
	var updatedTask Task
	if err := json.NewDecoder(r.Body).Decode(&updatedTask); err != nil {
		http.Error(w, `{"error": "JSON inválido"}`, http.StatusBadRequest)
		return
	}

	if err := updatedTask.Validate(); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	h.mu.Lock()
	defer h.mu.Unlock()

	if _, exists := h.tasks[id]; !exists {
		http.Error(w, `{"error": "Tarefa não encontrada"}`, http.StatusNotFound)
		return
	}

	updatedTask.ID = id
	h.tasks[id] = updatedTask

	json.NewEncoder(w).Encode(updatedTask)
}

func (h *TaskHandler) deleteTask(w http.ResponseWriter, r *http.Request, id int) {
	h.mu.Lock()
	defer h.mu.Unlock()

	if _, exists := h.tasks[id]; !exists {
		http.Error(w, `{"error": "Tarefa não encontrada"}`, http.StatusNotFound)
		return
	}

	delete(h.tasks, id)
	w.WriteHeader(http.StatusNoContent)
}
