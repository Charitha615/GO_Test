// main.go
package main

import (
	"log"
	"net/http"
	"os"

	"backend/internal/handlers"
	"backend/pkg/database/mongodb"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func init() {
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}
}

func main() {
	router := gin.Default()

	// Initialize MongoDB connection
	mongoDB := mongodb.InitMongoDB()
	defer mongoDB.Client.Disconnect(mongoDB.Ctx)

	// Initialize handlers with MongoDB connection
	userHandler := handlers.NewUserHandler(mongoDB.Database)

	// Routes
	router.GET("/users", userHandler.GetUsers)
	router.GET("/users/:id", userHandler.GetUserByID)
	router.POST("/users", userHandler.CreateUser)
	router.PUT("/users/:id", userHandler.UpdateUser)
	router.DELETE("/users/:id", userHandler.DeleteUser)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server is running on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, router))
}
