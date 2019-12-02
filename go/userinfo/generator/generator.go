package generator

import (
	"math/rand"
	"time"
)

const charset = "abcdefghijklmnopqrstuvwxyz" +
				"ABCDEFGHIJKLMNOPQRSTUVWXYZ"

var seededRand *rand.Rand = rand.New(rand.NewSource(time.Now().UnixNano()))
var groups = [...]string {"group1", "group2", "group3", "group4", "group5", "group6", "group7", "group8"}

func GetRandomName() string {
	givenNameLength := seededRand.Intn(15)
	familyNameLength := seededRand.Intn(20)
	givenName := make([]byte, givenNameLength)
	familyName := make([]byte, familyNameLength)
	for i := range givenName {
		givenName[i] = charset[seededRand.Intn(len(charset))]
	}
	for i := range familyName {
		familyName[i] = charset[seededRand.Intn(len(charset))]
	}
	result := string(familyName) + ", " + string(givenName)
	return result
}

func GetRandomDescription() string {
	descriptionLength := seededRand.Intn(40)
	description := make([]byte, descriptionLength)
	for i := range description {
		description[i] = charset[seededRand.Intn(len(charset))]
	}
	return string(description)
}

func GetRandomAge() int  {
	return seededRand.Intn(100)
}

func GetRandomTemp() float64 {
	return seededRand.Float64()
}

func GetRandomGroups() []string {
	items := seededRand.Intn(len(groups))
	return groups[0:items]
}