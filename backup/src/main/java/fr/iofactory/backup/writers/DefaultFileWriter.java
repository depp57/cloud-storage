package fr.iofactory.backup.writers;

import java.io.*;

public class DefaultFileWriter implements Writer {

    private FileOutputStream file;

    public DefaultFileWriter(String filename) throws FileNotFoundException {
        file = new FileOutputStream(filename);
    }

    @Override
    public void write(BufferedInputStream input) throws IOException {
        var output = new BufferedOutputStream(file);
        int count;
        byte[] buffer = new byte[8192];

        while ((count = input.read(buffer)) > 0)
        {
            output.write(buffer, 0, count);
        }
    }

    @Override
    public void close() throws IOException {
        file.close();
    }
}
