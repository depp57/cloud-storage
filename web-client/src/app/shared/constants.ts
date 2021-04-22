export const API_ENDPOINT = 'https://sachathommet.fr/api/'; // http://iofactory.fr:8008/
export const USER_TOKEN_COOKIE_LIFETIME = 1000 * 60 * 60 * 72; // 3 days
export const AUTH_COOKIE_NAME = 'user_credentials';

export const HTTP_ERROR_CODES: Record<number, string> = {
  0: 'Vous n\'êtes pas connecté à internet',
  400: 'Syntaxe de la requête HTTP erronée, veuillez contacter un administrateur',
  401: 'Identifiants incorrects'
};

export enum RedirectReasons {
  UNAUTHENTICATED = 'Vous devez être connecté pour accéder à vos fichiers',
  SIGNED_OUT = 'Vous vous êtes bien déconnecté'
}


/*
401 : Quand login/password
{
 "error": INCORRECT_USERNAME | INCORRECT_PASSWORD
}

405 : pas censé arriver -> ADMIN

403 : Vous devez être identifié pour accéder à cette ressource

404 : gérée
 */

// TODO
