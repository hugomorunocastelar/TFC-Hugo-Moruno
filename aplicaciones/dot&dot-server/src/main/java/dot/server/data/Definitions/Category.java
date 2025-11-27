package dot.server.data.Definitions;


import lombok.Getter;

@Getter
public enum Category {

    PRE_BENJAMIN(0, "Pre-Benjamin", 6, 7),
    BENJAMIN(1, "Benjamin", 8, 9),
    ALEVIN(2, "Alevin", 10, 11),
    INFANTILE(3, "Infantile", 12, 13),
    CADET(4, "Cadet", 14, 15),
    YOUTH(5, "Youth", 16, 17),
    JUNIOR(6, "Junior", 18, 19),
    ABSOLUTE(7, "Absolute", 20, 39),
    SENIOR(8, "Senior", 40, 99);

    private final int index;
    private final String label;
    private final int minAge;
    private final int maxAge;

    Category(int index, String label, int minAge, int maxAge) {
        this.index = index;
        this.label = label;
        this.minAge = minAge;
        this.maxAge = maxAge;
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
