package com.cicloparqueadero.parqueadero.repository;

import com.cicloparqueadero.parqueadero.entity.Bicicleta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BicicletaRepository extends JpaRepository<Bicicleta, Long> {

    long countByEstado(Bicicleta.Estado estado);

    @Query("""
            SELECT b FROM Bicicleta b
            WHERE (:estado IS NULL OR b.estado = :estado)
              AND (:search IS NULL OR :search = ''
                   OR LOWER(b.propietario)    LIKE LOWER(CONCAT('%', :search, '%'))
                   OR LOWER(b.documento)      LIKE LOWER(CONCAT('%', :search, '%'))
                   OR LOWER(b.tipoBicicleta)  LIKE LOWER(CONCAT('%', :search, '%'))
                   OR LOWER(b.color)          LIKE LOWER(CONCAT('%', :search, '%')))
            ORDER BY b.createdAt DESC
            """)
    List<Bicicleta> search(@Param("estado") Bicicleta.Estado estado,
                           @Param("search") String search);
}
