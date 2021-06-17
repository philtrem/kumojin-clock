package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
)

func setLogOutput() {
	file, err := os.OpenFile("logs.txt", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0666)
	if err != nil {
		log.Fatal(err)
	}

	log.SetOutput(file)
}

func main() {
	setLogOutput()

	http.Handle("/", http.FileServer(http.Dir("./front-end/build")))
	http.HandleFunc("/timezone", timezoneHandler)
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatalln(err)
	}
}

type timezone struct {
	Id int `json:"id"`
	Code string `json:"code"`
	Name string `json:"name"`
}

func timezoneHandler(w http.ResponseWriter, r *http.Request) {
	japanTimezone := timezone{
		Id: 0,
		Code: "JST",
		Name: "Japan Standard Time",
	}

	w.Header().Set("Content-Type", "application/json")
	err := json.NewEncoder(w).Encode(japanTimezone)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		log.Println(err)
	}
}