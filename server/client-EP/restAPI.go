package main

import (
	"net/http"
	"strings"
)

type RestAPIMux struct {
	http.ServeMux      // "Is a" dependance
	auth          Auth // "Has a" dependance
}

func NewRestAPIMux(a Auth) *RestAPIMux {
	var mux = new(RestAPIMux)
	mux.auth = a
	return mux
}

// func (this *RestAPIMux) isAuth(w http.ResponseWriter, r *http.Request) bool {
// 	authorization_h := r.Header.Get("Authorization")
// 	if authorization_h == "" {
// 		w.WriteHeader(http.StatusForbidden)
// 		return false
// 	}
// 	if strings.Split(authorization_h, " ")[0] != "Baerer" {
// 		w.WriteHeader(http.StatusBadRequest)
// 		return false
// 	}
// 	token := strings.Split(authorization_h, " ")[1]

// 	if _, err := this.auth.GetUser(token); err != nil {
// 		w.WriteHeader(http.StatusUnauthorized)
// 		return false
// 	}

// 	return true
// }

func (this *RestAPIMux) Route(pattern string, handler http.HandlerFunc) {
	if handler == nil {
		panic("http: nil handler")
	}
	this.Handle(pattern, http.HandlerFunc(closure(handler, this.auth)))
}

func closure(handler http.HandlerFunc, a Auth) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		//Blabla auth
		//...
		//...
		authorization_h := r.Header.Get("Authorization")
		if authorization_h == "" {
			w.WriteHeader(http.StatusForbidden)
			return
		}
		if strings.Split(authorization_h, " ")[0] != "Baerer" {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		token := strings.Split(authorization_h, " ")[1]

		if _, err := a.GetUser(token); err != nil {
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte("{\"error\": \"" + err.Error() + "\"}"))
			return
		}

		handler(w, r)
	}
}
