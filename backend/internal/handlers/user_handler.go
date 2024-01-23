// handlers/user_handler.go
package handlers

import (
	"backend/internal/models"
	"context"
	"log"
	"net/http"
	"time"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type UserHandler struct {
	UserCollection *mongo.Collection
}

func NewUserHandler(db *mongo.Database) *UserHandler {
	return &UserHandler{
		UserCollection: db.Collection("users"),
	}
}

func (h *UserHandler) logRequest(c *fiber.Ctx) {
	log.Printf("[%s] %s %s", time.Now().Format("2006-01-02 15:04:05"), c.Method(), c.OriginalURL())
}

func (h *UserHandler) CreateUser(c *fiber.Ctx) error {
	h.logRequest(c)

	var newUser models.User

	if err := c.BodyParser(&newUser); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	// Assign a new ID to the user
	newUser.ID = primitive.NewObjectID().Hex()

	// Insert the user into the MongoDB collection
	_, err := h.UserCollection.InsertOne(context.TODO(), newUser)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create user"})
	}

	return c.Status(http.StatusCreated).JSON(fiber.Map{"message": "User created successfully", "user": newUser})
}

func (h *UserHandler) GetUsers(c *fiber.Ctx) error {
	h.logRequest(c)

	// Implementation to get all users
	cursor, err := h.UserCollection.Find(context.TODO(), bson.M{})
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch users"})
	}
	defer cursor.Close(context.TODO())

	var users []models.User
	if err := cursor.All(context.TODO(), &users); err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to decode users"})
	}

	// Return a single JSON object with a "users" key
	return c.JSON(fiber.Map{"users": users})
}

func (h *UserHandler) GetUserByID(c *fiber.Ctx) error {
	h.logRequest(c)

	userID := c.Params("id")

	objectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": "Invalid user ID"})
	}

	var user models.User
	err = h.UserCollection.FindOne(context.TODO(), bson.M{"_id": objectID}).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
		}
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch user"})
	}

	return c.JSON(user)
}

func (h *UserHandler) UpdateUser(c *fiber.Ctx) error {
	h.logRequest(c)

	userID := c.Params("id")

	var updatedUser models.User
	if err := c.BodyParser(&updatedUser); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	result, err := h.UserCollection.UpdateOne(
		context.TODO(),
		bson.M{"_id": userID},
		bson.D{
			{"$set", bson.D{
				{"username", updatedUser.Username},
				{"email", updatedUser.Email},
			}},
		},
	)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update user"})
	}

	if result.ModifiedCount == 0 {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
	}

	return c.Status(http.StatusOK).JSON(fiber.Map{"message": "User updated successfully"})
}

func (h *UserHandler) DeleteUser(c *fiber.Ctx) error {
	h.logRequest(c)

	userID := c.Params("id")

	result, err := h.UserCollection.DeleteOne(context.TODO(), bson.M{"_id": userID})
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete user"})
	}

	if result.DeletedCount == 0 {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
	}

	return c.Status(http.StatusOK).JSON(fiber.Map{"message": "User deleted successfully"})
}
