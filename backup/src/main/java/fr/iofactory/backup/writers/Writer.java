package fr.iofactory.backup.writers;

import java.io.BufferedInputStream;
import java.io.IOException;

public interface Writer {
    public void write(BufferedInputStream input) throws IOException;
    public void close() throws IOException;
}
