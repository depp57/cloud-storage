package fr.iofactory.backup.services;

import fr.iofactory.backup.clusterconns.DiskConnection;
import fr.iofactory.backup.clusterconns.DiskConnectionFactory;
import fr.iofactory.backup.entities.Backup;
import fr.iofactory.backup.entities.CloudStorageCluster;
import fr.iofactory.backup.clusterconns.exceptions.ConnectionFailedException;
import fr.iofactory.backup.services.compression.Compressor;
import fr.iofactory.backup.services.compression.CompressorFactory;
import fr.iofactory.backup.shared.exceptions.TypeNotFoundException;
import fr.iofactory.backup.writers.Writer;
import fr.iofactory.backup.writers.WriterFactory;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;

@Service
public class BackupCreator {

    private CloudStorageCluster cluster;
    private final DiskConnectionFactory diskConnectionFactory;
    private final WriterFactory writerFactory;
    private final CompressorFactory compressorFactory;

    public BackupCreator(CloudStorageCluster cluster, DiskConnectionFactory diskConnectionFactory, WriterFactory writerFactory, CompressorFactory compressorFactory) {
        this.diskConnectionFactory = diskConnectionFactory;
        this.compressorFactory = compressorFactory;
        this.writerFactory = writerFactory;
        this.cluster = cluster;
    }

    public void save(String path, String name) {
        Backup backup = new Backup();


    }

    public void saveDiskConfFile(Backup backup, CloudStorageCluster.Disk disk, String connectionMethod, String compressionMethod) throws IOException, ConnectionFailedException, TypeNotFoundException {
        Writer writer = writerFactory.getWriter(disk.configFileName);
        DiskConnection diskConnection = diskConnectionFactory.getConnection(connectionMethod, disk.hostname, disk.port, disk.storagePath);

        if (! diskConnection.testConnection())
            throw new ConnectionFailedException();

        var diskConnReader = diskConnection.getConfigurationFileReader(disk.configFileName);

        writer.write(diskConnReader);

        diskConnReader.close();
        writer.close();

        compressFile(disk.configFileName, compressionMethod);
        backup.setDiskConfFile(disk.configFileName);
    }

    public void saveDiskUserFiles(Backup backup, CloudStorageCluster.Disk disk, String connectionMethod, String compressionMethod) throws ConnectionFailedException, IOException, TypeNotFoundException {
        DiskConnection diskConnection = diskConnectionFactory.getConnection(connectionMethod, disk.hostname, disk.port, disk.storagePath);

        if (! diskConnection.testConnection())
            throw new ConnectionFailedException();

        for (String userFile : diskConnection.getUserFilesNames()) {
            Writer writer = writerFactory.getWriter(userFile);
            var diskConnReader = diskConnection.getUserFileReader(disk.configFileName);

            writer.write(diskConnReader);

            diskConnReader.close();
            writer.close();

            compressFile(userFile, compressionMethod);
            backup.addDiskUserFile(userFile);
        }
    }

    private void compressFile(String filename, String compressionMethod) throws IOException {
        Compressor compressor = compressorFactory.getMethod(compressionMethod);
        if (compressor == null) {
            throw new IOException("ffff"); //TODO
        }

        FileInputStream fileInput = new FileInputStream(filename);
        FileOutputStream fileOutput = new FileOutputStream(filename+"_compressed");

        compressor.compress(fileInput, fileOutput);

        fileInput.close();
        fileOutput.close();

        Files.delete(Path.of(filename));
        Files.move(Path.of(filename+"_compressed"), Path.of(filename));
    }
}
