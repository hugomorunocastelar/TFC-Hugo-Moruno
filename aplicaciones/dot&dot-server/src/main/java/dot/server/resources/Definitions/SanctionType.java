package dot.server.resources.Definitions;

public enum SanctionType {

    INDIVIDUAL('I', "Individual"),
    COACH('C', "Coach"),
    ASSISTANT_COACH('A', "Assistant Coach"),
    SUPPORT('T', "Support"),
    IMPROPER('I', "Improper"),
    DELAY('D', "Delay");

    private char code;
    private String name;

    SanctionType(char code, String name){
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
