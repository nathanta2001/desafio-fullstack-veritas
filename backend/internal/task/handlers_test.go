package task

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"path/filepath"
	"testing"
)

func newTestHandler(t *testing.T) *TaskHandler {
	tmpDir := t.TempDir()
	testPath := filepath.Join(tmpDir, "test_tasks.json")
	return NewTaskHandlerWithPath(testPath)
}

func TestCreateTaskValidation(t *testing.T) {
	handler := newTestHandler(t)

	// Título Vazio
	invalidTask := map[string]string{"titulo": "", "status": "afazer"}
	body, _ := json.Marshal(invalidTask)
	req := httptest.NewRequest(http.MethodPost, "/tasks", bytes.NewBuffer(body))
	rec := httptest.NewRecorder()

	handler.ServeHTTP(rec, req)

	if rec.Code != http.StatusBadRequest {
		t.Errorf("esperava status %d, recebeu %d", http.StatusBadRequest, rec.Code)
	}

	// Título com mais de 80 caracteres
	longTitle := "Este titulo possui mais de oitenta caracteres e portanto deve falhar na validacao do backend de tarefas"
	invalidTaskLong := map[string]string{"titulo": longTitle, "status": "afazer"}
	bodyLong, _ := json.Marshal(invalidTaskLong)
	reqLong := httptest.NewRequest(http.MethodPost, "/tasks", bytes.NewBuffer(bodyLong))
	recLong := httptest.NewRecorder()

	handler.ServeHTTP(recLong, reqLong)

	if recLong.Code != http.StatusBadRequest {
		t.Errorf("esperava status %d, recebeu %d", http.StatusBadRequest, recLong.Code)
	}
}

func TestGetTasksSuccess(t *testing.T) {
	handler := newTestHandler(t)

	req := httptest.NewRequest(http.MethodGet, "/tasks", nil)
	rec := httptest.NewRecorder()

	handler.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Errorf("esperava status %d, recebeu %d", http.StatusOK, rec.Code)
	}
}

func TestTaskCRUDCycle(t *testing.T) {
	handler := newTestHandler(t)

	// Criar
	createBody := map[string]string{"titulo": "Tarefa de Teste", "status": "afazer"}
	bodyBytes, _ := json.Marshal(createBody)
	req := httptest.NewRequest(http.MethodPost, "/tasks", bytes.NewBuffer(bodyBytes))
	rec := httptest.NewRecorder()

	handler.ServeHTTP(rec, req)

	if rec.Code != http.StatusCreated {
		t.Fatalf("esperava status %d ao criar, recebeu %d", http.StatusCreated, rec.Code)
	}

	var created Task
	_ = json.Unmarshal(rec.Body.Bytes(), &created)
	if created.ID != 1 {
		t.Errorf("esperava ID 1, recebeu %d", created.ID)
	}

	// Atualizar
	updateBody := map[string]string{"titulo": "Tarefa Atualizada", "status": "emprogresso"}
	upBytes, _ := json.Marshal(updateBody)
	reqUpdate := httptest.NewRequest(http.MethodPut, "/tasks/1", bytes.NewBuffer(upBytes))
	recUpdate := httptest.NewRecorder()

	handler.ServeHTTP(recUpdate, reqUpdate)

	if recUpdate.Code != http.StatusOK {
		t.Errorf("esperava status %d ao atualizar, recebeu %d", http.StatusOK, recUpdate.Code)
	}

	// Deletar
	reqDelete := httptest.NewRequest(http.MethodDelete, "/tasks/1", nil)
	recDelete := httptest.NewRecorder()

	handler.ServeHTTP(recDelete, reqDelete)

	if recDelete.Code != http.StatusNoContent {
		t.Errorf("esperava status %d ao deletar, recebeu %d", http.StatusNoContent, recDelete.Code)
	}
}
