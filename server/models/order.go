package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Order struct {
	ID         	primitive.ObjectID 	`bson:"_id"`
	Dish       	*string            	`json:"dish"`
	Price   	*float64           	`json:"price""`
	Server		*string				`json:"server"`
	Table		*string				`json:"table"`
}