package com.enterprisepro.erp.service.impl;

import com.enterprisepro.erp.dto.AuditFilterCriteriaDto;
import com.enterprisepro.erp.dto.AuditLogDto;
import com.enterprisepro.erp.dto.AuditSeverityDistributionDto;
import com.enterprisepro.erp.entity.AuditLog;
import com.enterprisepro.erp.repository.AuditLogRepository;
import com.enterprisepro.erp.service.AuditService;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuditServiceImpl implements AuditService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<AuditLogDto> getAuditLogs(String search, Pageable pageable) {
        if (StringUtils.hasText(search)) {
            return auditLogRepository.findByUsernameContainingIgnoreCaseOrModuleContainingIgnoreCaseOrActionContainingIgnoreCase(
                    search, search, search, pageable).map(this::mapToDto);
        }
        return auditLogRepository.findAllByOrderByTimestampDesc(pageable).map(this::mapToDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AuditLogDto> searchAuditLogs(AuditFilterCriteriaDto criteria, Pageable pageable) {
        List<AuditLog> allLogs = auditLogRepository.findAll();
        List<AuditLogDto> filtered = allLogs.stream()
                .filter(log -> matchesCriteria(log, criteria))
                .sorted((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()))
                .map(this::mapToDto)
                .collect(Collectors.toList());

        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), filtered.size());
        List<AuditLogDto> pageContent = (start <= end && start < filtered.size()) ? filtered.subList(start, end) : List.of();
        return new PageImpl<>(pageContent, pageable, filtered.size());
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] exportAuditLogsToCsv(AuditFilterCriteriaDto criteria) {
        List<AuditLog> logs = auditLogRepository.findAll().stream()
                .filter(log -> matchesCriteria(log, criteria))
                .sorted((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()))
                .collect(Collectors.toList());

        try (ByteArrayOutputStream out = new ByteArrayOutputStream();
             CSVPrinter csvPrinter = new CSVPrinter(new PrintWriter(out, true, StandardCharsets.UTF_8),
                     CSVFormat.DEFAULT.builder().setHeader("Log ID", "Timestamp", "Username", "Action", "Module", "Severity", "Description", "IP Address").build())) {

            for (AuditLog log : logs) {
                csvPrinter.printRecord(
                        log.getId(),
                        log.getTimestamp(),
                        log.getUsername(),
                        log.getAction(),
                        log.getModule(),
                        log.getSeverity(),
                        log.getDescription(),
                        log.getIpAddress()
                );
            }
            csvPrinter.flush();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to export audit logs to CSV", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public AuditSeverityDistributionDto getSeverityDistribution() {
        List<AuditLog> logs = auditLogRepository.findAll();
        long total = logs.size();
        long low = logs.stream().filter(l -> "LOW".equalsIgnoreCase(l.getSeverity())).count();
        long medium = logs.stream().filter(l -> "MEDIUM".equalsIgnoreCase(l.getSeverity())).count();
        long high = logs.stream().filter(l -> "HIGH".equalsIgnoreCase(l.getSeverity())).count();
        long critical = logs.stream().filter(l -> "CRITICAL".equalsIgnoreCase(l.getSeverity())).count();
        return new AuditSeverityDistributionDto(total, low, medium, high, critical);
    }

    @Override
    @Async
    @Transactional
    public void logActivity(String username, String action, String module, String description, String ipAddress) {
        logActivity(username, action, module, description, ipAddress, "LOW");
    }

    @Override
    @Async
    @Transactional
    public void logActivity(String username, String action, String module, String description, String ipAddress, String severity) {
        AuditLog log = new AuditLog();
        log.setUsername(username != null ? username : "SYSTEM");
        log.setAction(action);
        log.setModule(module);
        log.setDescription(description);
        log.setIpAddress(ipAddress != null ? ipAddress : "127.0.0.1");
        log.setSeverity(severity != null ? severity.toUpperCase() : "LOW");
        log.setTimestamp(LocalDateTime.now());
        auditLogRepository.save(log);
    }

    private boolean matchesCriteria(AuditLog log, AuditFilterCriteriaDto criteria) {
        if (criteria == null) return true;
        if (StringUtils.hasText(criteria.getUsername()) && !log.getUsername().toLowerCase().contains(criteria.getUsername().toLowerCase())) {
            return false;
        }
        if (StringUtils.hasText(criteria.getModule()) && !log.getModule().equalsIgnoreCase(criteria.getModule())) {
            return false;
        }
        if (StringUtils.hasText(criteria.getAction()) && !log.getAction().equalsIgnoreCase(criteria.getAction())) {
            return false;
        }
        if (StringUtils.hasText(criteria.getSeverity()) && !log.getSeverity().equalsIgnoreCase(criteria.getSeverity())) {
            return false;
        }
        if (criteria.getStartDate() != null && log.getTimestamp().isBefore(criteria.getStartDate())) {
            return false;
        }
        if (criteria.getEndDate() != null && log.getTimestamp().isAfter(criteria.getEndDate())) {
            return false;
        }
        return true;
    }

    private AuditLogDto mapToDto(AuditLog log) {
        AuditLogDto dto = new AuditLogDto();
        dto.setId(log.getId());
        dto.setUsername(log.getUsername());
        dto.setAction(log.getAction());
        dto.setModule(log.getModule());
        dto.setDescription(log.getDescription());
        dto.setIpAddress(log.getIpAddress());
        dto.setUserAgent(log.getUserAgent());
        dto.setSeverity(log.getSeverity());
        dto.setTimestamp(log.getTimestamp());
        return dto;
    }
}
