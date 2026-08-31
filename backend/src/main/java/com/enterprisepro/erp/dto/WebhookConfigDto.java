package com.enterprisepro.erp.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

public class WebhookConfigDto {

    private Long id;

    @NotBlank
    private String name;

    @NotBlank
    private String targetUrl;

    private String secretKey;

    @NotBlank
    private String eventTypes;

    private boolean active = true;
    private int failureCount;
    private LocalDateTime createdAt;
    private LocalDateTime lastTriggeredAt;

    public WebhookConfigDto() {}

    public WebhookConfigDto(Long id, String name, String targetUrl, String secretKey, String eventTypes, boolean active) {
        this.id = id;
        this.name = name;
        this.targetUrl = targetUrl;
        this.secretKey = secretKey;
        this.eventTypes = eventTypes;
        this.active = active;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTargetUrl() {
        return targetUrl;
    }

    public void setTargetUrl(String targetUrl) {
        this.targetUrl = targetUrl;
    }

    public String getSecretKey() {
        return secretKey;
    }

    public void setSecretKey(String secretKey) {
        this.secretKey = secretKey;
    }

    public String getEventTypes() {
        return eventTypes;
    }

    public void setEventTypes(String eventTypes) {
        this.eventTypes = eventTypes;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public int getFailureCount() {
        return failureCount;
    }

    public void setFailureCount(int failureCount) {
        this.failureCount = failureCount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getLastTriggeredAt() {
        return lastTriggeredAt;
    }

    public void setLastTriggeredAt(LocalDateTime lastTriggeredAt) {
        this.lastTriggeredAt = lastTriggeredAt;
    }
}
