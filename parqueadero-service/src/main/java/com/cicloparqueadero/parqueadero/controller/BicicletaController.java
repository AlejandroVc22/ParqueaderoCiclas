package com.cicloparqueadero.parqueadero.controller;

import com.cicloparqueadero.parqueadero.dto.ApiResponse;
import com.cicloparqueadero.parqueadero.dto.BicicletaDTO;
import com.cicloparqueadero.parqueadero.dto.BicicletaRequest;
import com.cicloparqueadero.parqueadero.dto.StatsDTO;
import com.cicloparqueadero.parqueadero.service.BicicletaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bicicletas")
@RequiredArgsConstructor
public class BicicletaController {

    private final BicicletaService service;

    /** USER y ADMIN: estadísticas, listado, detalle. */
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<StatsDTO>> stats() {
        return ResponseEntity.ok(ApiResponse.ok(service.stats()));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<BicicletaDTO>>> list(
            @RequestParam(required = false) String estado,
            @RequestParam(required = false) String search) {
        List<BicicletaDTO> data = service.list(estado, search);
        ApiResponse<List<BicicletaDTO>> resp = ApiResponse.ok(data);
        resp.setTotal(data.size());
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BicicletaDTO>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(service.getById(id)));
    }

    /** Solo ADMIN: crear, editar, eliminar. */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BicicletaDTO>> create(@Valid @RequestBody BicicletaRequest req) {
        BicicletaDTO data = service.create(req);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(data, "Bicicleta registrada exitosamente"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BicicletaDTO>> update(
            @PathVariable Long id,
            @RequestBody BicicletaRequest req) {
        BicicletaDTO data = service.update(id, req);
        return ResponseEntity.ok(ApiResponse.ok(data, "Bicicleta actualizada correctamente"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Bicicleta eliminada correctamente"));
    }
}
