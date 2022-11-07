package fr.iofactory.backup.clusterconns;

import fr.iofactory.backup.entities.*;

public interface DatabaseConnection {
    Disk[] readNextDisks(int nb);
    User[] readNextUsers(int nb);
    File[] readNextFiles(int nb);
}
