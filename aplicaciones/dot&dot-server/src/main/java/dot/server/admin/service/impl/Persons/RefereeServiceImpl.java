package dot.server.admin.service.impl.Persons;

import dot.server.admin.service.Persons.RefereeService;
import dot.server.resources.MatchDefinitions.dto.CityDto;
import dot.server.resources.Person.dao.RefereeDao;
import dot.server.resources.Person.dto.PersonDTO;
import dot.server.resources.Person.dto.RefereeDTO;
import dot.server.resources.Person.entity.Referee;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RefereeServiceImpl implements RefereeService {

    private final RefereeDao refereeDao;

    public RefereeServiceImpl(RefereeDao refereeDao) {
        this.refereeDao = refereeDao;
    }

    @Override
    public List<RefereeDTO> findAll() {
        return refereeDao.findAll()
                .stream()
                .map(RefereeDTO::from)
                .toList();
    }

    @Override
    public Optional<RefereeDTO> findById(Long id) {
        return refereeDao.findById(id)
                .map(RefereeDTO::from);
    }

    @Override
    public RefereeDTO save(RefereeDTO refereeDTO) {
        Referee referee = RefereeDTO.to(refereeDTO);
        Referee saved = refereeDao.save(referee);
        return RefereeDTO.from(saved);
    }

    @Override
    public RefereeDTO update(Long id, RefereeDTO refereeDTO) {
        return refereeDao.findById(id)
                .map(existing -> {
                    existing.setNoLicense(refereeDTO.getNoLicense());
                    existing.setLvlLicense(refereeDTO.getLvlLicense());
                    existing.setCity(refereeDTO.getCity() != null ? CityDto.to(refereeDTO.getCity()) : null);
                    existing.setDni(refereeDTO.getDni() != null ? PersonDTO.to(refereeDTO.getDni()) : null);
                    Referee updated = refereeDao.save(existing);
                    return RefereeDTO.from(updated);
                })
                .orElseThrow(() -> new RuntimeException("Referee not found with id " + id));
    }

    @Override
    public void deleteById(Long id) {
        refereeDao.deleteById(id);
    }
}
