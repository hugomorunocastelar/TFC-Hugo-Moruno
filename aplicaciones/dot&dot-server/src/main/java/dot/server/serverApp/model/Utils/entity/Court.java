package dot.server.serverApp.model.Utils.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Court {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    

}
