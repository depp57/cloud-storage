export const API_ENDPOINT         = '/api/'; // https://sachathommet.fr/api/
export const API_FILES_CACHE_TIME = 1000 * 60 * 2; // 2 minutes
export const AUTH_COOKIE_LIFETIME = 1000 * 60 * 5; // 5 minutes
export const AUTH_COOKIE_NAME     = 'user_credentials';

export const HTTP_ERROR_CODES: Record<number, string> = {
  0: 'Vous n\'êtes pas connecté à internet',
  400: 'Syntaxe de la requête HTTP erronée, veuillez contacter un administrateur',
  401: 'Identifiants incorrects',
  403: 'Vous devez être identifié pour accéder à cette ressource'
};

export enum RedirectReasons {
  UNAUTHENTICATED = 'Vous devez être connecté pour accéder à vos fichiers',
  SIGNED_OUT      = 'Vous vous êtes bien déconnecté'
}

export const PATH_SEPARATOR = '/';

/*
401 : Quand login/password
{
 "error": INCORRECT_USERNAME | INCORRECT_PASSWORD
}

405 : pas censé arriver -> ADMIN

404 : gérée
 */

// TODO
