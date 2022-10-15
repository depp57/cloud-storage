package api

import (
	"log"
	"net/http"
	"strings"

	. "gitlab.com/sthommet/cloud-storage/server/clientEndpoint/api/common"
	"gitlab.com/sthommet/cloud-storage/server/clientEndpoint/services"
)

const (
	GET     = "GET"
	POST    = "POST"
	PUT     = "PUT"
	DELETE  = "DELETE"
	OPTIONS = "OPTIONS"
)

type RestAPIRouters struct {
	mainRouter *http.ServeMux
	restRouter *http.ServeMux
	auth       services.Auth
}

func NewRestAPIRouters(a services.Auth) *RestAPIRouters {
	routers := &RestAPIRouters{
		mainRouter: http.NewServeMux(),
		restRouter: http.NewServeMux(),
		auth:       a,
	}

	routers.mainRouter.Handle("/", http.HandlerFunc(routers.rootHandler))

	return routers
}

func (m *RestAPIRouters) ListenAndServeTLS(addr, certFile, keyFile string) {
	log.Fatal(http.ListenAndServeTLS(addr, certFile, keyFile, m.mainRouter))
}

func (m *RestAPIRouters) ListenAndServe(addr string) error {
	return http.ListenAndServe(addr, m.mainRouter)
}

func (m *RestAPIRouters) rootHandler(w http.ResponseWriter, r *http.Request) {
	// Handle CORS preflight
	if r.Method == OPTIONS {
		headers := w.Header()
		headers.Add("Access-Control-Allow-Origin", "*")
		headers.Add("Access-Control-Allow-Headers", "Content-Type, Origin, Accept, token, authorization")
		headers.Add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		headers.Add("Vary", "Origin")
		headers.Add("Vary", "Access-Control-Request-Method")
		headers.Add("Vary", "Access-Control-Request-Headers")

		return
	} else {
		// For any other requests use restRouter
		w.Header().Add("Content-Type", "application/json")
		w.Header().Add("Access-Control-Allow-Origin", "*")

		m.restRouter.ServeHTTP(w, r)
		return
	}
}

func (m *RestAPIRouters) DefaultRoute(pattern string, method string, handlerFunc http.HandlerFunc) {
	if handlerFunc == nil {
		panic("restRouter: nil handlerFunc")
	}

	m.restRouter.Handle(pattern, http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		//Check if http method is appropriate
		if r.Method != method {
			w.WriteHeader(http.StatusMethodNotAllowed)
			w.Write(HttpMethodError(method, r.Method))
			return
		}

		handlerFunc(w, r)
	}))
}

func (m *RestAPIRouters) AuthentifiedRoute(pattern string, method string, handlerFunc http.HandlerFunc) {
	if handlerFunc == nil {
		panic("restRouter: nil handlerFunc")
	}

	m.restRouter.Handle(pattern, http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		//Check if http method is appropriate
		if r.Method != method {
			w.WriteHeader(http.StatusMethodNotAllowed)
			w.Write(HttpMethodError(method, r.Method))
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

		user, err := m.auth.GetUser(token)
		if err != nil {
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte("{\"error\": \"" + err.Error() + "\"}"))
			return
		}

		// Add temporar header to the request
		// identify user for futher use in handlers
		r.Header.Set(InternalHeaderAuth, user.Id) //TODO FAILLE de sécurité majeure : user peut ajouter lui même un header Authentified

		handlerFunc(w, r)
	}))
}
