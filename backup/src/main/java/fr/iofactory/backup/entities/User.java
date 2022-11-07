package fr.iofactory.backup.entities;

import java.util.Date;

public class User {
    private int id;
    private String username;
    private String passwordSha256;
    private String sessionToken;
    private Date sessionTokenExpiration;
}
