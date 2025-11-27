package dot.server.data.Definitions.Utilities;

import lombok.Data;

@Data
public class Marker {

    private int localScore;

    private int visitScore;

    public Marker(String score) {
        String[] values = score.split(";");
        this.localScore = Integer.parseInt(values[0]);
        this.visitScore = Integer.parseInt(values[1]);
    }

}
