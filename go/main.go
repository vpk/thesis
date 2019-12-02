package main

import (
	"./bcrypt"
	"./sleeper"
	"./userinfo"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
)

func handler(writer http.ResponseWriter, _ *http.Request) {
	_, err := fmt.Fprint(writer, "OK")
	if err != nil {
		log.Printf("Error writing response: %v", err)
		http.Error(writer, "Can't write response", http.StatusInternalServerError)
	}
}

func runServer() {
	http.HandleFunc("/password/set/", bcrypt.HandleSetPassword)
	http.HandleFunc("/password/verify/", bcrypt.HandleVerifyPassword)
	http.HandleFunc("/longPoll", sleeper.LongPollHandler)
	http.HandleFunc("/user/get/", userinfo.HandleGetUser)
	http.HandleFunc("/user/set/", userinfo.HandleSetUser)
	http.HandleFunc("/", handler)
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func wait(val int64, channel chan bool) {
	log.Printf("Routine %v created", val)
	_ = <- channel
	log.Printf("Routine %v released", val)
}

func fill(max int64) {
	channel := make(chan bool)
	log.Printf("Creating %v go routines", max)
	for i := int64(0); i < max; i++ {
		go wait(i, channel)
	}
	log.Printf("Created %v go routines", max)
	for i := int64(0); i < max; i++ {
		channel <- true
	}
	log.Print("Cleaned up...")
}

func main() {
	if len(os.Args) < 2 {
		log.Printf("Usage ./%v [server|fill] to run either server or create go routine mode.", os.Args[0])
		return
	}
	module := os.Args[1]
	switch module {
	case "server":
		runServer()
	case "fill":
		if len(os.Args) < 3 {
			log.Printf("Give maximum number of go routines to create")
			return
		}
		max, err := strconv.ParseInt(os.Args[2], 10, 64)
		if err != nil {
			log.Printf("Error parsing value %v as max go routines, error: %v", os.Args[2], err)
		}
		fill(max)
	default:
		log.Printf("Usage ./%v [server|fill] to run either server or create go routine mode.", os.Args[0])
	}
}
