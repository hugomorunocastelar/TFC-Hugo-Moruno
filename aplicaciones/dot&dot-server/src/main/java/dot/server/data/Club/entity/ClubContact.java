package dot.server.data.Club.entity;

import jakarta.persistence.*;
import lombok.Data;

@Embeddable
@Data
public class ClubContact {

    @Column(length = 100)
    private String directorName;

    @Column(length = 100)
    private String email;

    @Column(length = 255)
    private String website;

    @Column(length = 20)
    private String phone;

    @Column
    private Integer foundedYear;

}
