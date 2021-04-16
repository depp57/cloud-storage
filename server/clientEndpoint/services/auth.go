package services

import (
	"errors"
	"fmt"
	"time"

	"github.com/sventhommet/cloud-storage/server/clientEndpoint/database"
	"github.com/sventhommet/cloud-storage/server/common/utils"
)

const TOKEN_TTL_SECONDS = 60 * 5

type Auth interface {
	//Try to connect user and returns a session token if authentication succeed
	Connect(username string, password string) (string, error)
	GetUser(token string) (database.User, error)
	Revoke(token string) error
	ReloadTTL(token string, seconds int) error
}

type defaultAuth struct {
	db database.AuthDbPort
	//Keep a cached list of connected users, identified by their token
	users map[string]database.User
}

func InitAuth(db database.AuthDbPort) Auth { //TODO faire un singleton ?
	auth := &defaultAuth{}
	auth.db = db
	auth.users = make(map[string]database.User)

	return auth
}

func (a *defaultAuth) Connect(username string, password string) (string, error) {
	if !a.db.UserExist(username) {
		return "", errors.New("Le nom d'utilisateur est invalide")
	}

	now := time.Now()
	expiration := now.Add(time.Second * TOKEN_TTL_SECONDS)
	user, ok := a.db.ChallengeUserPassword(username, utils.Sha256(password), expiration)
	if !ok {
		return "", errors.New("Mot de passe incorrect")
	}

	//Add the authenticated user to the cached list in auth component
	a.users[user.Token] = user
	return user.Token, nil
}

func (a *defaultAuth) GetUser(token string) (database.User, error) {
	//Lookup for user in auth cached list
	if user, ok := a.users[token]; ok {
		//If token has expired in cached list, don't try to lookup in database
		if user.Token_expiration.Before(time.Now()) {
			return database.User{}, errors.New("Token de session expiré")
		}

		return user, nil
	}
	fmt.Println("\nchallenge...")
	//Now we must lookup in database
	if user, ok := a.db.ChallengeUserToken(token); ok {
		//User can be (re)set to the cached list in auth component
		a.users[user.Token] = user

		return user, nil
	}

	return database.User{}, errors.New("Utilisateur déconnecté ou token invalide")
}

func (a *defaultAuth) Revoke(token string) error {
	if !a.db.UnsetUserToken(token) {
		return errors.New("Token invalide")
	}

	//Delete user from auth cache
	delete(a.users, token)

	return nil
}

func (a *defaultAuth) ReloadTTL(token string, seconds int) error {
	user, ok := a.db.ChallengeUserToken(token)
	if !ok {
		return errors.New("Token invalide")
	}

	new_exp := user.Token_expiration.Add(time.Duration(seconds))

	//Setup database first (source of thruth), then setup auth cache
	a.db.ReloadToken(token, new_exp)
	if user, ok := a.users[token]; ok {
		user.Token_expiration = new_exp
		a.users[token] = user
	}

	return nil
}