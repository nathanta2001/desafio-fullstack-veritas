package task

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"sync"
)

const defaultJSONFilePath = "tasks.json"

type TaskHandler struct {
	mu       sync.RWMutex
	tasks    map[int]Task
	nextID   int
	jsonPath string
}

func NewTaskHandler() *TaskHandler {
	return NewTaskHandlerWithPath(defaultJSONFilePath)
}

func NewTaskHandlerWithPath(path string) *TaskHandler {
	h := &TaskHandler{
		tasks:    make(map[int]Task),
		nextID:   1,
		jsonPath: path,
	}
	h.loadFromFile()
	return h
}

func (h *TaskHandler) loadFromFile() {
	file, err := os.ReadFile(h.jsonPath)
	if err != nil {
		if !os.IsNotExist(err) {
			log.Printf("[WARNING] Erro ao ler arquivo de tarefas (%s): %v", h.jsonPath, err)
		}
		return
	}

	var savedTasks []Task
	if err := json.Unmarshal(file, &savedTasks); err != nil {
		log.Printf("[ERROR] Erro ao deserializar tarefas do arquivo: %v", err)
		return
	}

	maxID := 0
	for _, t := range savedTasks {
		h.tasks[t.ID] = t
		if t.ID > maxID {
			maxID = t.ID
		}
	}
	h.nextID = maxID + 1
}

func (h *TaskHandler) saveToFile() {
	taskList := make([]Task, 0, len(h.tasks))
	for _, t := range h.tasks {
		taskList = append(taskList, t)
	}

	data, err := json.MarshalIndent(taskList, "", "  ")
	if err != nil {
		log.Printf("[ERROR] Erro ao serializar tarefas para JSON: %v", err)
		return
	}

	tmpFile := h.jsonPath + ".tmp"
	if err := os.WriteFile(tmpFile, data, 0644); err != nil {
		log.Printf("[ERROR] Erro ao escrever arquivo temporário (%s): %v", tmpFile, err)
		return
	}

	if err := os.Rename(tmpFile, h.jsonPath); err != nil {
		log.Printf("[ERROR] Erro ao renomear arquivo de persistência: %v", err)
	}
}

func (h *TaskHandler) writeJSONError(w http.ResponseWriter, message string, statusCode int) {
	w.WriteHeader(statusCode)
	_ = json.NewEncoder(w).Encode(map[string]string{"error": message})
}

func (h *TaskHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
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
			h.writeJSONError(w, "Método não permitido", http.StatusMethodNotAllowed)
		}
		return
	}

	id, err := strconv.Atoi(path)
	if err != nil {
		h.writeJSONError(w, "ID inválido", http.StatusBadRequest)
		return
	}

	switch r.Method {
	case http.MethodPut:
		h.updateTask(w, r, id)
	case http.MethodDelete:
		h.deleteTask(w, r, id)
	default:
		h.writeJSONError(w, "Método não permitido", http.StatusMethodNotAllowed)
	}
}

func (h *TaskHandler) getTasks(w http.ResponseWriter, r *http.Request) {
	h.mu.RLock()
	defer h.mu.RUnlock()

	taskList := make([]Task, 0, len(h.tasks))
	for _, t := range h.tasks {
		taskList = append(taskList, t)
	}

	_ = json.NewEncoder(w).Encode(taskList)
}

func (h *TaskHandler) createTask(w http.ResponseWriter, r *http.Request) {
	r.Body = http.MaxBytesReader(w, r.Body, 1<<20) // Limite de 1MB no body
	defer r.Body.Close()

	var t Task
	if err := json.NewDecoder(r.Body).Decode(&t); err != nil {
		h.writeJSONError(w, "JSON inválido ou corpo da requisição muito grande", http.StatusBadRequest)
		return
	}

	if t.Status == "" {
		t.Status = StatusAfazer
	}

	if err := t.Validate(); err != nil {
		h.writeJSONError(w, err.Error(), http.StatusBadRequest)
		return
	}

	h.mu.Lock()
	t.ID = h.nextID
	h.nextID++
	h.tasks[t.ID] = t
	h.saveToFile()
	h.mu.Unlock()

	w.WriteHeader(http.StatusCreated)
	_ = json.NewEncoder(w).Encode(t)
}

func (h *TaskHandler) updateTask(w http.ResponseWriter, r *http.Request, id int) {
	r.Body = http.MaxBytesReader(w, r.Body, 1<<20) // Limite de 1MB no body
	defer r.Body.Close()

	var updatedTask Task
	if err := json.NewDecoder(r.Body).Decode(&updatedTask); err != nil {
		h.writeJSONError(w, "JSON inválido ou corpo da requisição muito grande", http.StatusBadRequest)
		return
	}

	if err := updatedTask.Validate(); err != nil {
		h.writeJSONError(w, err.Error(), http.StatusBadRequest)
		return
	}

	h.mu.Lock()
	defer h.mu.Unlock()

	if _, exists := h.tasks[id]; !exists {
		h.writeJSONError(w, "Tarefa não encontrada", http.StatusNotFound)
		return
	}

	updatedTask.ID = id
	h.tasks[id] = updatedTask
	h.saveToFile()

	_ = json.NewEncoder(w).Encode(updatedTask)
}

func (h *TaskHandler) deleteTask(w http.ResponseWriter, r *http.Request, id int) {
	h.mu.Lock()
	defer h.mu.Unlock()

	if _, exists := h.tasks[id]; !exists {
		h.writeJSONError(w, "Tarefa não encontrada", http.StatusNotFound)
		return
	}

	delete(h.tasks, id)
	h.saveToFile()
	w.WriteHeader(http.StatusNoContent)
}
