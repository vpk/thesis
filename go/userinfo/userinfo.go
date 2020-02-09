package userinfo

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"sync"
)

type User struct {
	ID          string   `json:"id"`
	Name        string   `json:"name"`
	Description string   `json:"description"`
	Age         int      `json:"age"`
	Heat        float64  `json:"heat"`
	Groups      []string `json:"groups"`
}

var users sync.Map

func HandleGetUser(writer http.ResponseWriter, request *http.Request) {
	username := request.URL.Path[len("/user/get/"):]
	user, ok := users.Load(username)
	if !ok {
		log.Printf("Error retrieving user: %v", username)
		http.Error(writer, "User not found.", http.StatusBadRequest)
		return
	}
	bytes, err := json.Marshal(user)
	if err != nil {
		log.Printf("Error marshalling JSON reponse: %v", err)
		http.Error(writer, "Can't create response", http.StatusInternalServerError)
		return
	}
	_, err = writer.Write(bytes)
	if err != nil {
		log.Printf("Error writing response: %v", err)
		http.Error(writer, "Can't write response", http.StatusInternalServerError)
	}
}

func HandleSetUser(writer http.ResponseWriter, request *http.Request) {
	username := request.URL.Path[len("/user/set/"):]
	inBytes, err := ioutil.ReadAll(request.Body)
	if err != nil {
		log.Printf("Error reading request body: %v", err)
		http.Error(writer, "Can't read request body", http.StatusBadRequest)
		return
	}
	var user User
	err = json.Unmarshal(inBytes, &user)
	if err != nil {
		log.Printf("Error reading request body: %v", err)
		http.Error(writer, "Can't read request body", http.StatusBadRequest)
		return
	}
	users.Store(username, user)
	outBytes, err := json.Marshal(user)
	if err != nil {
		log.Printf("Error marshalling JSON reponse: %v", err)
		http.Error(writer, "Can't create response", http.StatusInternalServerError)
		return
	}
	_, err = writer.Write(outBytes)
	if err != nil {
		log.Printf("Error writing response: %v", err)
		http.Error(writer, "Can't write response", http.StatusInternalServerError)
	}
}



