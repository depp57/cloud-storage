package fr.iofactory.backup.entities;

import org.springframework.stereotype.Component;
import java.util.ArrayList;

@Component
public class Backup {

    private ArrayList<java.io.File> diskUserFiles;
    private java.io.File diskConfFile;
    private java.io.File dbDisks;
    private java.io.File dbFiles;
    private java.io.File dbUsers;

    public void addDiskUserFile(String path) {
        var file = new java.io.File(path);
        diskUserFiles.add(file);
    }

    public void setDiskConfFile(String path) {
        diskConfFile = new java.io.File(path);
    }

    public java.io.File getDiskConfFile() {
        return diskConfFile;
    }
}
