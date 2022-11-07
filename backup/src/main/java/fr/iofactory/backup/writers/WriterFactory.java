package fr.iofactory.backup.writers;

import java.io.FileNotFoundException;

public interface WriterFactory {
    public Writer getWriter(String filename) throws FileNotFoundException;
}
