package bcrypt

import (
  "fmt"
  "golang.org/x/crypto/bcrypt"
  "io/ioutil"
  "log"
  "net/http"
  "sync"
)

const passwordCost = 20
var passwords sync.Map

func HandleSetPassword(writer http.ResponseWriter, request *http.Request) {
  username := request.URL.Path[len("/password/set/"):]
  body, err := ioutil.ReadAll(request.Body)
  if err != nil {
    log.Printf("Error reading body: %v", err)
    http.Error(writer, "Can't read body", http.StatusBadRequest)
    return
  }
  password, err := bcrypt.GenerateFromPassword(body, passwordCost)
  passwords.Store(username, password)
  _, err = fmt.Fprint(writer, "OK")
  if err != nil {
    log.Printf("Error writing response: %v", err)
    http.Error(writer, "Can't write response", http.StatusInternalServerError)
  }
}

func HandleVerifyPassword(writer http.ResponseWriter, request *http.Request) {
  username := request.URL.Path[len("/password/verify/"):]
  body, err := ioutil.ReadAll(request.Body)
  if err != nil {
    log.Printf("Error reading body: %v", err)
    http.Error(writer, "Can't read body", http.StatusBadRequest)
    return
  }
  password, ok := passwords.Load(username)
  if !ok {
    _, _ = bcrypt.GenerateFromPassword(body, passwordCost)
    log.Printf("Password not found for user: %v", username)
    http.Error(writer, "Password not found", http.StatusBadRequest)
    return
  }
  err = bcrypt.CompareHashAndPassword(password.([]byte), body)
  if err != nil {
    errorText := fmt.Sprintf("Passwords didn't match for user: %v", username)
    log.Printf(errorText)
    http.Error(writer, errorText, http.StatusForbidden)
    return
  }
  _, err = fmt.Fprint(writer, "OK")
  if err != nil {
    log.Printf("Error writing response: %v", err)
    http.Error(writer, "Can't write response", http.StatusInternalServerError)
  }
}
