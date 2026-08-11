package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/nathanta2001/desafio-fullstack-veritas/internal/task"
)

func main() {
	taskHandler := task.NewTaskHandler()

	http.Handle("/tasks", taskHandler)
	http.Handle("/tasks/", taskHandler)

	port := ":8080"
	fmt.Printf("Servidor backend Go rodando na porta %s...\n", port)
	if err := http.ListenAndServe(port, nil); err != nil {
		log.Fatalf("Erro ao iniciar servidor: %v", err)
	}
}
