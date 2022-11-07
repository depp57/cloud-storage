package fr.iofactory.backup.writers;

import java.io.FileNotFoundException;

public class DefaultWriterFactory implements WriterFactory {

    @Override
    public Writer getWriter(String filename) throws FileNotFoundException {
        return new DefaultFileWriter(filename);
    }
}
