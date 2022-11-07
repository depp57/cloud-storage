package fr.iofactory.backup.entities;

import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Component
public class CloudStorageCluster {
    private String dbHostname;
    private int dbPort;
    private String dbName;
    private final Map<String, Disk> disks;

    public CloudStorageCluster(String dbHostname, int dbPort, String dbName) {
        this.dbHostname = dbHostname;
        this.dbPort = dbPort;
        this.dbName = dbName;
        this.disks = new HashMap<>();
    }

    public void addDisk(String diskName, String hostname, int port, String storagePath, String configFileName) {
        disks.put(diskName, new CloudStorageCluster.Disk(hostname, port, storagePath, configFileName));
    }

    public Map<String, Disk> getAllDisks() {
        return disks;
    }
    public class Disk {

        public String hostname;
        public int port;
        public String storagePath;
        public String configFileName;

        public Disk(String hostname, int port, String storagePath, String configFileName) {
            this.hostname = hostname;
            this.port = port;
            this.storagePath = storagePath;
            this.configFileName = configFileName;
        }
    }
}
