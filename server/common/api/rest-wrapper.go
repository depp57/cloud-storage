package api

import (
	"net/http"
	"strings"

	"github.com/sventhommet/cloud-storage/server/common/auth"
)

const (
	GET     = "GET"
	POST    = "POST"
	PUT     = "PUT"
	DELETE  = "DELETE"
	OPTIONS = "OPTIONS"
)

type RestAPIMux struct {
	http.ServeMux           // "Is a" dependance
	auth          auth.Auth // "Has a" dependance
}

func NewRestAPIMux(a auth.Auth) *RestAPIMux {
	var mux = new(RestAPIMux)
	mux.auth = a
	return mux
}

func (this *RestAPIMux) DefaultRoute(pattern string, method string, handler http.HandlerFunc) {
	if handler == nil {
		panic("http: nil handler")
	}
	this.Handle(pattern, http.HandlerFunc(defaultClosure(handler, method)))
}

func defaultClosure(handler http.HandlerFunc, method string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		//Check if http method is appropriate
		if r.Method != method {
			w.WriteHeader(http.StatusMethodNotAllowed)
			w.Write([]byte("{\"error\": \"must be " + method + " method, got " + r.Method + "\"}"))
			return
		}

		handler(w, r)
	}
}

func (this *RestAPIMux) UserRoute(pattern string, method string, handler http.HandlerFunc) {
	if handler == nil {
		panic("http: nil handler")
	}
	this.Handle(pattern, http.HandlerFunc(authentifiedClosure(handler, this.auth, method)))
}

func authentifiedClosure(handler http.HandlerFunc, a auth.Auth, method string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		//Check if http method is appropriate
		if r.Method != method {
			w.WriteHeader(http.StatusMethodNotAllowed)
			w.Write([]byte("{\"error\": \"must be " + method + " method, got " + r.Method + "\"}"))
			return
		}

		authorization_h := r.Header.Get("Authorization")
		if authorization_h == "" {
			w.WriteHeader(http.StatusForbidden)
			return
		}
		if strings.Split(authorization_h, " ")[0] != "Bearer" {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		token := strings.Split(authorization_h, " ")[1]

		if _, err := a.GetUser(token); err != nil {
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte("{\"error\": \"" + err.Error() + "\"}"))
			return
		}

		// Add temporar header to the request
		// --> identify user with token validated by auth
		r.Header.Set("Authentified", token)

		handler(w, r)
	}
}
