package dot.server.serverApp.model.Definitions;


public enum Category {

    PRE_BENJAMIN("Pre-Benjamin", 6, 7),
    BENJAMIN("Benjamin", 8, 9),
    ALEVIN("Alevin", 10, 11),
    INFANTILE("Infantile", 12, 13),
    CADET("Cadet", 14, 15),
    YOUTH("Youth", 16, 17),
    JUNIOR("Junior", 18, 19),
    ABSOLUTE("Absolute", 20, 39),
    SENIOR("Senior", 40, 99);

    private final String label;
    private final int minAge;
    private final int maxAge;

    Category(String label, int minAge, int maxAge) {
        this.label = label;
        this.minAge = minAge;
        this.maxAge = maxAge;
    }

    public String getLabel() {
        return label;
    }

    public int getMinAge() {
        return minAge;
    }

    public int getMaxAge() {
        return maxAge;
    }

    public static Category fromAge(int age) {
        for (Category category : values()) {
            if (age >= category.minAge && age <= category.maxAge) {
                return category;
            }
        }
        return null;
    }

}
