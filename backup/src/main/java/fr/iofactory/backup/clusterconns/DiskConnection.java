package fr.iofactory.backup.clusterconns;

import java.io.BufferedInputStream;
import java.io.Reader;
import java.util.ArrayList;

public interface DiskConnection {
    boolean testConnection();

    BufferedInputStream getConfigurationFileReader(String filename);

    ArrayList<String> getUserFilesNames();

    BufferedInputStream getUserFileReader(String filename);
}
