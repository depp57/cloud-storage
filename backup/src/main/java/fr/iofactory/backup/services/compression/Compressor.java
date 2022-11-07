package fr.iofactory.backup.services.compression;

import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.io.OutputStream;

@Component
public interface Compressor {
    public void compress(InputStream input, OutputStream output);
    public void uncompress(InputStream input, OutputStream output);
}
