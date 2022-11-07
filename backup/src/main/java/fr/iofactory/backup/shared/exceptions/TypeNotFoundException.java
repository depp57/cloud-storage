package fr.iofactory.backup.shared.exceptions;

public class TypeNotFoundException extends Exception {
    public TypeNotFoundException(String type) {
        super("type " + type + " not found");
    }
}
