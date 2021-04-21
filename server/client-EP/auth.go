package main

import (
	"errors"
	"time"

	"github.com/sventhommet/cloud-storage/server/db"
	"github.com/sventhommet/cloud-storage/server/utils"
)

const TOKEN_TTL_SECONDS = 300

type Auth interface {
	//Must be called at beggining to connect the database to auth component
	Init(db db.DbPort)
	//Try to connect user and returns a session token if authentication succeed
	Connect(username string, password_hash string) (string, error)
	GetUser(token string) (db.User, error)
	Revoke(token string) error
	ReloadTTL(token string, seconds int) error
}

type AuthStruct struct {
	db db.DbPort
	//Keep a cached list of connected users, identified by their token
	users map[string]db.User
}

func (this *AuthStruct) Init(dbPort db.DbPort) {
	this.db = dbPort
	this.users = make(map[string]db.User)
}

func (this *AuthStruct) Connect(username string, password string) (string, error) {
	if !this.db.UserExist(username) {
		return "", errors.New("Le nom d'utilisateur est invalide")
	}

	now := time.Now()
	expiration := now.Add(time.Second * TOKEN_TTL_SECONDS)
	user, ok := this.db.ChallengeUserPassword(username, utils.Sha256(password), expiration)
	if !ok {
		return "", errors.New("Mot de passe incorrect")
	}

	//Add the authenticated user to the cached list in auth component
	this.users[user.Token] = user
	return user.Token, nil
}

func (this *AuthStruct) GetUser(token string) (db.User, error) {
	//Lookup for user in auth cached list
	if user, ok := this.users[token]; ok {
		//If token has expired in cached list, don't try to lookup in database
		if user.Token_expiration.Before(time.Now()) {
			return db.User{}, errors.New("Token de session expiré")
		}

		return user, nil
	}

	//Now we must lookup in database
	if user, ok := this.db.ChallengeUserToken(token); ok {
		//User can be (re)set to the cached list in auth component
		this.users[user.Token] = user

		return user, nil
	}

	return db.User{}, errors.New("Utilisateur déconnecté ou token invalide")
}

func (this *AuthStruct) Revoke(token string) error {
	if !this.db.UnsetUserToken(token) {
		return errors.New("Token invalide")
	}

	//Delete user from auth cache
	delete(this.users, token)

	return nil
}

func (this *AuthStruct) ReloadTTL(token string, seconds int) error {
	user, ok := this.db.ChallengeUserToken(token)
	if !ok {
		return errors.New("Token invalide")
	}

	new_exp := user.Token_expiration.Add(time.Duration(seconds))

	//Setup database first (source of thruth), then setup auth cache
	this.db.ReloadToken(token, new_exp)
	if user, ok := this.users[token]; ok {
		user.Token_expiration = new_exp
		this.users[token] = user
	}

	return nil
}
