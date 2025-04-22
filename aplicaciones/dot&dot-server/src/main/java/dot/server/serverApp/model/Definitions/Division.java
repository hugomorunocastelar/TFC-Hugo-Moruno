package dot.server.serverApp.model.Definitions;

public enum Division {

    MIXED('X', "Mixed"),
    FEMININE('F', "Feminine"),
    MASCULINE('M', "Masculine");

    private char code;

    private String name;

    Division(char code, String name) {
        this.code = code;
        this.name = name;
    }

    public char getCode() {
        return code;
    }

    public String getName() {
        return name;
    }
}
