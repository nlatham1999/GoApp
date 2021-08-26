package routes

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"server/models"
	"github.com/go-playground/validator/v10"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/bson"
	"github.com/gin-gonic/gin"
)

var validate = validator.New()

var orderCollection *mongo.Collection = OpenCollection(Client, "orders")

//add an order
func AddOrder(c *gin.Context) {

	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)

	var order models.Order

	if err := c.BindJSON(&order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	validationErr := validate.Struct(order)
	if validationErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": validationErr.Error()})
		fmt.Println(validationErr)
		return
	}
	order.ID = primitive.NewObjectID()

	result, insertErr := orderCollection.InsertOne(ctx, order)
	if insertErr != nil {
		msg := fmt.Sprintf("order item was not created")
		c.JSON(http.StatusInternalServerError, gin.H{"error": msg})
		fmt.Println(insertErr)
		return
	}
	defer cancel()

	c.JSON(http.StatusOK, result)
}

//get all orders
func GetOrders(c *gin.Context){
	
    c.Header("Access-Control-Allow-Origin", "*")

	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
	
	var orders []bson.M

	cursor, err := orderCollection.Find(ctx, bson.M{})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}
	
	if err = cursor.All(ctx, &orders); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	defer cancel()

	fmt.Println(orders)

	c.JSON(http.StatusOK, orders)
}

//get all orders by the waiter's name
func GetOrdersByWaiter(c *gin.Context){

    c.Header("Access-Control-Allow-Origin", "*")

	waiter := c.Params.ByName("waiter")
	
	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
	
	var orders []bson.M

	cursor, err := orderCollection.Find(ctx, bson.M{"server": waiter})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	if err = cursor.All(ctx, &orders); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	defer cancel()

	fmt.Println(orders)

	c.JSON(http.StatusOK, orders)
}

//get an order by its id
func GetOrderById(c *gin.Context){
	
    c.Header("Access-Control-Allow-Origin", "*")

	orderID := c.Params.ByName("id")
	docID, _ := primitive.ObjectIDFromHex(orderID)

	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)

	var order bson.M

	if err := orderCollection.FindOne(ctx, bson.M{"_id": docID}).Decode(&order); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	defer cancel()

	fmt.Println(order)

	c.JSON(http.StatusOK, order)
}

//update a waiter's name for an order
func UpdateWaiter(c *gin.Context){
	
    c.Header("Access-Control-Allow-Origin", "*")

	orderID := c.Params.ByName("id")
	docID, _ := primitive.ObjectIDFromHex(orderID)

	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)

	type Waiter struct {
		Server		*string				`json:"server"`
	}

	var waiter Waiter

	if err := c.BindJSON(&waiter); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	result, err := orderCollection.UpdateOne(ctx, bson.M{"_id": docID}, 
		bson.D{
			{"$set", bson.D{{"server", waiter.Server}}},
		},
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	defer cancel()

	c.JSON(http.StatusOK, result.ModifiedCount)

}

//update the order
func UpdateOrder(c *gin.Context){
	
    c.Header("Access-Control-Allow-Origin", "*")

	orderID := c.Params.ByName("id")
	docID, _ := primitive.ObjectIDFromHex(orderID)

	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)

	var order models.Order

	if err := c.BindJSON(&order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	validationErr := validate.Struct(order)
	if validationErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": validationErr.Error()})
		fmt.Println(validationErr)
		return
	}

	result, err := orderCollection.ReplaceOne(
		ctx,
		bson.M{"_id": docID},
		bson.M{
			"dish":  order.Dish,
			"price": order.Price,
			"server": order.Server,
			"table": order.Table,
		},
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	defer cancel()

	c.JSON(http.StatusOK, result.ModifiedCount)
}

//delete an order given the id
func DeleteOrder(c * gin.Context){
	
    c.Header("Access-Control-Allow-Origin", "*")
	
	orderID := c.Params.ByName("id")
	docID, _ := primitive.ObjectIDFromHex(orderID)

	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)

	result, err := orderCollection.DeleteOne(ctx, bson.M{"_id": docID})
	
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	defer cancel()

	c.JSON(http.StatusOK, result.DeletedCount)

}

