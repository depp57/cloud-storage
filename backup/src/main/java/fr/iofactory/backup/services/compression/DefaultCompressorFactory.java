package fr.iofactory.backup.services.compression;

import org.springframework.stereotype.Component;

@Component
public class DefaultCompressorFactory implements CompressorFactory {

    public Compressor getMethod(String compressionMethod) {
        return null; //TODO
    }
}
