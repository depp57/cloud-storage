package fr.iofactory.backup.clusterconns;

import fr.iofactory.backup.shared.exceptions.TypeNotFoundException;

public interface DiskConnectionFactory {
    public DiskConnection getConnection(String type, String hostname, int port, String storagePath) throws TypeNotFoundException;
}
