package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestTimezoneEndpoint(t *testing.T) {
	w := httptest.NewRecorder()
	r, err := http.NewRequest("GET", "/", nil)
	if err != nil {
		t.Fatal(err)
	}

	handler := http.HandlerFunc(timezoneHandler)
	handler(w, r)
	t.Run("Status code", func(t *testing.T) {
		statusCode := w.Code
		expectedStatusCode := http.StatusOK
		if statusCode != expectedStatusCode {
			t.Errorf("StatusCode: actual %v, expected: %v", statusCode, expectedStatusCode)
		}
	})

	t.Run("Content-type", func(t *testing.T) {
		contentType := w.Result().Header.Get("Content-Type")
		expected := "application/json"
		if contentType != expected {
			t.Errorf("Content-Type: actual: %v, expected: %v", contentType, expected)
		}
	})

	t.Run("JSON data", func(t *testing.T) {
		var data timezone
		err := json.NewDecoder(w.Body).Decode(&data)
		if err != nil {
			t.Fatal(err)
		}

		expectedData := timezone{
			Id: 0,
			Code: "JST",
			Locale: "ja",
			Name: "Japan Standard Time",
		}

		if data != expectedData {
			t.Errorf("JSON data: actual %v, expected: %v", data, expectedData)
		}
	})
}
