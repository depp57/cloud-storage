package fr.iofactory.backup.entities;

public class Disk {
    private String diskName;
    private String ip;
    private int spaceLeft;

    public Disk(String diskName, String ip, int spaceLeft) {
        this.diskName = diskName;
        this.ip = ip;
        this.spaceLeft = spaceLeft;
    }
}
