// internal/handlers/user_handler.go
package handlers

import (
	"backend/internal/models"
	"context"
	"fmt"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"log"
	"net/http"
)

type UserHandler struct {
	UserCollection *mongo.Collection
}

func NewUserHandler(db *mongo.Database) *UserHandler {
	return &UserHandler{
		UserCollection: db.Collection("users"),
	}
}

func (h *UserHandler) CreateUser(c *gin.Context) {
	var newUser models.User

	if err := c.ShouldBindJSON(&newUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Assign a new ID to the user
	newUser.ID = primitive.NewObjectID().Hex()

	// Insert the user into the MongoDB collection
	_, err := h.UserCollection.InsertOne(context.TODO(), newUser)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "User created successfully", "user": newUser})
}

func (h *UserHandler) GetUsers(c *gin.Context) {
	// Implementation to get all users
	cursor, err := h.UserCollection.Find(context.TODO(), bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch users"})
		return
	}
	defer cursor.Close(context.TODO())

	var users []models.User
	if err := cursor.All(context.TODO(), &users); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decode users"})
		return
	}

	// Return a single JSON object with a "users" key
	c.JSON(http.StatusOK, gin.H{"users": users})
}

func (h *UserHandler) GetUserByID(c *gin.Context) {

	userID := c.Param("id")

	objectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}
	fmt.Printf("objectID IS %s document(s)\n", objectID)

	var user models.User
	err = h.UserCollection.FindOne(context.TODO(), bson.M{"_id": userID}).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user"})
		return
	}

	c.JSON(http.StatusOK, user)
}

func (h *UserHandler) UpdateUser(c *gin.Context) {
	userID := c.Param("id")

	//objectID, err := primitive.ObjectIDFromHex(userID)
	//if err != nil {
	//	c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
	//	return
	//}

	var updatedUser models.User
	if err := c.ShouldBindJSON(&updatedUser); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
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
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user"})
		return
	}

	if result.ModifiedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User updated successfully"})
}

func (h *UserHandler) DeleteUser(c *gin.Context) {
	userID := c.Param("id")
	log.Printf("Error fetching user with ID %s: ", userID)

	//objectID, err := primitive.ObjectIDFromHex(userID)
	//log.Printf("objectID %s: ", objectID)
	//if err != nil {
	//	c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
	//	return
	//}
	//fmt.Printf("objectID IS %s document(s)\n", objectID)

	result, err := h.UserCollection.DeleteOne(context.TODO(), bson.M{"_id": userID})

	log.Printf("result ID %s: ", result)
	log.Printf("Error  ID %s: ", err)
	fmt.Printf("Deleted %d document(s)\n", result.DeletedCount)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete user"})
		return
	}

	if result.DeletedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User deleted successfully"})
}
