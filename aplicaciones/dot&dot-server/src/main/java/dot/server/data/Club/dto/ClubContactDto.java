package dot.server.data.Club.dto;

import dot.server.data.Club.entity.ClubContact;
import lombok.Data;

@Data
public class ClubContactDto {
    private String directorName;
    private String email;
    private String website;
    private String phone;
    private Integer foundedYear;

    public static ClubContactDto from(ClubContact contact) {
        if (contact == null) return null;

        ClubContactDto dto = new ClubContactDto();
        dto.setDirectorName(contact.getDirectorName());
        dto.setEmail(contact.getEmail());
        dto.setWebsite(contact.getWebsite());
        dto.setPhone(contact.getPhone());
        dto.setFoundedYear(contact.getFoundedYear());
        return dto;
    }

    public static ClubContact to(ClubContactDto dto) {
        if (dto == null) return null;

        ClubContact contact = new ClubContact();
        contact.setDirectorName(dto.getDirectorName());
        contact.setEmail(dto.getEmail());
        contact.setWebsite(dto.getWebsite());
        contact.setPhone(dto.getPhone());
        contact.setFoundedYear(dto.getFoundedYear());
        return contact;
    }
}
