package com.enterprisepro.erp.service;

import com.enterprisepro.erp.dto.AuditFilterCriteriaDto;
import com.enterprisepro.erp.dto.AuditLogDto;
import com.enterprisepro.erp.dto.AuditSeverityDistributionDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AuditService {
    Page<AuditLogDto> getAuditLogs(String search, Pageable pageable);
    Page<AuditLogDto> searchAuditLogs(AuditFilterCriteriaDto criteria, Pageable pageable);
    byte[] exportAuditLogsToCsv(AuditFilterCriteriaDto criteria);
    AuditSeverityDistributionDto getSeverityDistribution();
    void logActivity(String username, String action, String module, String description, String ipAddress);
    void logActivity(String username, String action, String module, String description, String ipAddress, String severity);
}
