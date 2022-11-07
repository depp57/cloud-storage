package fr.iofactory.backup.services.compression;

public interface CompressorFactory {
    public Compressor getMethod(String compressionMethod);
}
