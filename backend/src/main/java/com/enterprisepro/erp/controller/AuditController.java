package com.enterprisepro.erp.controller;

import com.enterprisepro.erp.dto.AuditFilterCriteriaDto;
import com.enterprisepro.erp.dto.AuditLogDto;
import com.enterprisepro.erp.dto.AuditSeverityDistributionDto;
import com.enterprisepro.erp.service.AuditService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/audit")
@Tag(name = "Audit & Compliance", description = "Endpoints for immutable activity tracking, security logs, user trails and system events")
public class AuditController {

    @Autowired
    private AuditService auditService;

    @GetMapping("/logs")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'AUDITOR')")
    @Operation(summary = "Get audit logs with search, user and module filters")
    public ResponseEntity<Page<AuditLogDto>> getAuditLogs(
            @RequestParam(required = false) String search,
            @PageableDefault(size = 15, sort = "timestamp", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(auditService.getAuditLogs(search, pageable));
    }

    @PostMapping("/search")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'AUDITOR')")
    @Operation(summary = "Filter audit logs with multi-parameter criteria (severity, date range, user, action)")
    public ResponseEntity<Page<AuditLogDto>> searchAuditLogs(
            @RequestBody AuditFilterCriteriaDto criteria,
            @PageableDefault(size = 15, sort = "timestamp", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(auditService.searchAuditLogs(criteria, pageable));
    }

    @GetMapping("/export/csv")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'AUDITOR')")
    @Operation(summary = "Export filtered audit logs as downloadable CSV report")
    public ResponseEntity<byte[]> exportAuditLogsCsv(
            @RequestParam(required = false) String module,
            @RequestParam(required = false) String severity,
            @RequestParam(required = false) String username) {
        AuditFilterCriteriaDto criteria = new AuditFilterCriteriaDto();
        criteria.setModule(module);
        criteria.setSeverity(severity);
        criteria.setUsername(username);

        byte[] csvBytes = auditService.exportAuditLogsToCsv(criteria);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=audit-compliance-report.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csvBytes);
    }

    @GetMapping("/stats/severity-distribution")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'AUDITOR')")
    @Operation(summary = "Get compliance severity distribution metrics (LOW, MEDIUM, HIGH, CRITICAL)")
    public ResponseEntity<AuditSeverityDistributionDto> getSeverityDistribution() {
        return ResponseEntity.ok(auditService.getSeverityDistribution());
    }
}
