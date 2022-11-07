package fr.iofactory.backup.clusterconns;

import org.springframework.stereotype.Component;

import java.io.BufferedInputStream;
import java.util.ArrayList;

@Component
public class SSHDiskConn implements DiskConnection {
    private String hostname;
    private int port;
    private String storagePath;

    public SSHDiskConn(String hostname, int port, String storagePath) {
        this.hostname = hostname;
        this.port = port;
        this.storagePath = storagePath;
    }

    @Override
    public boolean testConnection() {
        return false;
    }

    @Override
    public BufferedInputStream getConfigurationFileReader(String filename) {
        return null;
    }

    @Override
    public ArrayList<String> getUserFilesNames() {
        return null;
    }

    @Override
    public BufferedInputStream getUserFileReader(String filename) {
        return null;
    }
}
