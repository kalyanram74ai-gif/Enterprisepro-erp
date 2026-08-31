package com.enterprisepro.erp.service;

import com.enterprisepro.erp.dto.AuditFilterCriteriaDto;
import com.enterprisepro.erp.dto.AuditLogDto;
import com.enterprisepro.erp.dto.AuditSeverityDistributionDto;
import com.enterprisepro.erp.entity.AuditLog;
import com.enterprisepro.erp.repository.AuditLogRepository;
import com.enterprisepro.erp.service.impl.AuditServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AuditExportServiceTest {

    @Mock
    private AuditLogRepository auditLogRepository;

    @InjectMocks
    private AuditServiceImpl auditService;

    @Test
    void testExportAuditLogsToCsv() {
        AuditLog log1 = new AuditLog("admin", "CREATE", "FINANCE", "Created invoice INV-001", "192.168.1.10");
        log1.setId(1L);
        log1.setSeverity("LOW");
        log1.setTimestamp(LocalDateTime.now());

        AuditLog log2 = new AuditLog("admin", "DELETE", "SECURITY", "Revoked user access", "192.168.1.10");
        log2.setId(2L);
        log2.setSeverity("CRITICAL");
        log2.setTimestamp(LocalDateTime.now());

        when(auditLogRepository.findAll()).thenReturn(Arrays.asList(log1, log2));

        AuditFilterCriteriaDto criteria = new AuditFilterCriteriaDto();
        byte[] csvBytes = auditService.exportAuditLogsToCsv(criteria);

        assertNotNull(csvBytes);
        String csvContent = new String(csvBytes, StandardCharsets.UTF_8);
        assertTrue(csvContent.contains("Log ID"));
        assertTrue(csvContent.contains("admin"));
        assertTrue(csvContent.contains("FINANCE"));
        assertTrue(csvContent.contains("CRITICAL"));
    }

    @Test
    void testSearchAuditLogsFiltered() {
        AuditLog log1 = new AuditLog("john.doe", "LOGIN", "AUTH", "User login success", "10.0.0.1");
        log1.setId(10L);
        log1.setSeverity("LOW");
        log1.setTimestamp(LocalDateTime.now());

        AuditLog log2 = new AuditLog("admin", "UPDATE", "HR", "Updated employee record", "10.0.0.2");
        log2.setId(11L);
        log2.setSeverity("MEDIUM");
        log2.setTimestamp(LocalDateTime.now());

        when(auditLogRepository.findAll()).thenReturn(Arrays.asList(log1, log2));

        AuditFilterCriteriaDto criteria = new AuditFilterCriteriaDto();
        criteria.setModule("HR");

        Page<AuditLogDto> result = auditService.searchAuditLogs(criteria, PageRequest.of(0, 10));

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("HR", result.getContent().get(0).getModule());
    }

    @Test
    void testGetSeverityDistribution() {
        AuditLog log1 = new AuditLog("admin", "LOGIN", "AUTH", "Login", "127.0.0.1");
        log1.setSeverity("LOW");
        AuditLog log2 = new AuditLog("admin", "PASSWORD_CHANGE", "AUTH", "Change pwd", "127.0.0.1");
        log2.setSeverity("HIGH");
        AuditLog log3 = new AuditLog("admin", "DATA_PURGE", "SYSTEM", "Purge temp", "127.0.0.1");
        log3.setSeverity("CRITICAL");

        when(auditLogRepository.findAll()).thenReturn(Arrays.asList(log1, log2, log3));

        AuditSeverityDistributionDto dist = auditService.getSeverityDistribution();

        assertNotNull(dist);
        assertEquals(3, dist.getTotalEvents());
        assertEquals(1, dist.getLowCount());
        assertEquals(1, dist.getHighCount());
        assertEquals(1, dist.getCriticalCount());
    }
}
