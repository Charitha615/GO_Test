// main.go
package main

import (
	"log"
	"os"

	"backend/internal/handlers"
	"backend/pkg/database/mongodb"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
)

func init() {
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}
}

func main() {
	app := fiber.New()

	// Use CORS middleware
	app.Use(cors.New())

	// Initialize MongoDB connection
	mongoDB := mongodb.InitMongoDB()
	defer mongoDB.Client.Disconnect(mongoDB.Ctx)

	// Initialize handlers with MongoDB connection
	userHandler := handlers.NewUserHandler(mongoDB.Database)

	// Routes
	app.Get("/usersall", userHandler.GetUsers)
	app.Get("/users/:id", userHandler.GetUserByID)
	app.Post("/users", userHandler.CreateUser)
	app.Put("/users/:id", userHandler.UpdateUser)
	app.Delete("/users/:id", userHandler.DeleteUser)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server is running on port %s", port)
	log.Fatal(app.Listen(":" + port))
}
