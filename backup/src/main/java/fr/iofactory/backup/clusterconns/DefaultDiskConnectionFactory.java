package fr.iofactory.backup.clusterconns;

import fr.iofactory.backup.shared.exceptions.TypeNotFoundException;
import org.springframework.stereotype.Component;

@Component
public class DefaultDiskConnectionFactory {

    public DiskConnection getConnection(String type, String hostname, int port, String storagePath) throws TypeNotFoundException {
        if (type.equals("ssh")) {
            return new SSHDiskConn(hostname, port, storagePath);
        }
        throw new TypeNotFoundException(type);
    }
}
