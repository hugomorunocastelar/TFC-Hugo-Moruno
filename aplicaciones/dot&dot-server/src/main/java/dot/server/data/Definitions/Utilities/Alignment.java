package dot.server.data.Definitions.Utilities;

import java.util.Map;

public class Alignment {

    private String play1;
    private String play2;
    private String play3;
    private String play4;
    private String play5;
    private String play6;

    private Map<String, String> changes;

    public Alignment(String align) {
        String[] players = align.split("/")[0].split(":");
        this.play1 = players[0];
        this.play2 = players[1];
        this.play3 = players[2];
        this.play4 = players[3];
        this.play5 = players[4];
        this.play6 = players[5];

        String[] changesSaved = align.split("/")[1].split(";");

        if (!(changesSaved.length == 0)) {
            for (String change : changesSaved) {
                String[] numbers = change.split("-");
                changes.put(numbers[0], numbers[1]);
            }
        }
    }

    public String getPlay1() {
        return play1;
    }

    public void setPlay1(String play1) {
        this.play1 = play1;
    }

    public String getPlay2() {
        return play2;
    }

    public void setPlay2(String play2) {
        this.play2 = play2;
    }

    public String getPlay3() {
        return play3;
    }

    public void setPlay3(String play3) {
        this.play3 = play3;
    }

    public String getPlay4() {
        return play4;
    }

    public void setPlay4(String play4) {
        this.play4 = play4;
    }

    public String getPlay5() {
        return play5;
    }

    public void setPlay5(String play5) {
        this.play5 = play5;
    }

    public String getPlay6() {
        return play6;
    }

    public void setPlay6(String play6) {
        this.play6 = play6;
    }

    public Map<String, String> getChanges() {
        return changes;
    }

    public void setChanges(Map<String, String> changes) {
        this.changes = changes;
    }

    @Override
    public String toString() {
        StringBuilder string = new StringBuilder();
        string.append(play1).append(":");
        string.append(play2).append(":");
        string.append(play3).append(":");
        string.append(play4).append(":");
        string.append(play5).append(":");
        string.append(play6).append("/");
        if (!changes.isEmpty()) {
            changes.forEach((s, s2) -> {
                string.append(s).append("-").append(s2).append(";");
            });
        }
        return string.toString();
    }
}
