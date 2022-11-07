package fr.iofactory.backup;

import fr.iofactory.backup.clusterconns.exceptions.ConnectionFailedException;
import fr.iofactory.backup.entities.Backup;
import fr.iofactory.backup.entities.CloudStorageCluster;
import fr.iofactory.backup.services.BackupCreator;
import fr.iofactory.backup.clusterconns.DiskConnection;
import fr.iofactory.backup.clusterconns.DiskConnectionFactory;
import fr.iofactory.backup.services.compression.Compressor;
import fr.iofactory.backup.services.compression.CompressorFactory;
import fr.iofactory.backup.shared.exceptions.TypeNotFoundException;
import fr.iofactory.backup.writers.Writer;
import fr.iofactory.backup.writers.WriterFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.*;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BackupCreatorTests {
    @Mock
    private DiskConnectionFactory diskConnectionFactory;
    @Mock
    private DiskConnection diskConnection;
    @Mock
    private WriterFactory writerFactory;
    @Mock
    private Writer writer;
    @Mock
    private CompressorFactory compressorFactory;
    @Mock
    private Compressor compressor;

    private BackupCreator backupCreator;
    private CloudStorageCluster cluster;

    @BeforeEach
    void init() {


        cluster = new CloudStorageCluster("db-hostname", 3306, "db-name");
        cluster.addDisk("disk-01", "disk-hostname", 8009, "/disk", "confFile.txt");
        backupCreator = new BackupCreator(cluster, diskConnectionFactory, writerFactory, compressorFactory);
    }

    @Test
    void saveDiskConfFileTest() throws TypeNotFoundException, IOException, ConnectionFailedException {
        // given
        var backup = new Backup();
        var stream = new BufferedInputStream(new ByteArrayInputStream("data".getBytes()));

        when(diskConnectionFactory.getConnection(eq("ssh"), any(String.class), any(Integer.class), any(String.class)))
                .thenReturn(diskConnection);
        when(diskConnection.testConnection()).thenReturn(true);
        when(diskConnection.getConfigurationFileReader("confFile.txt"))
                .thenReturn(stream);
        when(compressorFactory.getMethod("zip"))
                .thenReturn(compressor);
        when(writerFactory.getWriter("confFile.txt")).thenReturn(writer);

        // when
        backupCreator.saveDiskConfFile(backup, cluster.getAllDisks().get("disk-01"), "ssh", "zip");

        // then
        verify(writer).write(stream);
    }
}
