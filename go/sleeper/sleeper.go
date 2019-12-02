package sleeper

import (
	"fmt"
	"log"
	"net/http"
	"time"
)


func LongPollHandler(writer http.ResponseWriter, _ *http.Request) {
	time.Sleep(5 * time.Second)
	_, err := fmt.Fprint(writer, "OK")
	if err != nil {
		log.Printf("Error writing response: %v", err)
		http.Error(writer, "Can't write response", http.StatusInternalServerError)
	}
}

