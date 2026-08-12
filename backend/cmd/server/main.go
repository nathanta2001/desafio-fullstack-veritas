package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/nathanta2001/desafio-fullstack-veritas/internal/task"
)

func main() {
	taskHandler := task.NewTaskHandler()

	mux := http.NewServeMux()
	mux.Handle("/tasks", taskHandler)
	mux.Handle("/tasks/", taskHandler)

	port := ":8080"
	srv := &http.Server{
		Addr:         port,
		Handler:      mux,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	go func() {
		fmt.Printf("Servidor backend Go rodando na porta %s...\n", port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Erro ao iniciar servidor: %v\n", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt, syscall.SIGTERM)
	<-quit

	fmt.Println("\nEncerrando servidor com segurança...")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("Erro durante o encerramento forçado do servidor: %v", err)
	}

	fmt.Println("Servidor encerrado com sucesso.")
}
