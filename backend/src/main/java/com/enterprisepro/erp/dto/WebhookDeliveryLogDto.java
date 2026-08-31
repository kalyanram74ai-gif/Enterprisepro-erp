package com.enterprisepro.erp.dto;

import java.time.LocalDateTime;

public class WebhookDeliveryLogDto {

    private Long id;
    private Long webhookId;
    private String eventType;
    private String payload;
    private int httpStatusCode;
    private boolean success;
    private String responseSummary;
    private LocalDateTime timestamp;

    public WebhookDeliveryLogDto() {}

    public WebhookDeliveryLogDto(Long id, Long webhookId, String eventType, String payload, int httpStatusCode, boolean success, String responseSummary, LocalDateTime timestamp) {
        this.id = id;
        this.webhookId = webhookId;
        this.eventType = eventType;
        this.payload = payload;
        this.httpStatusCode = httpStatusCode;
        this.success = success;
        this.responseSummary = responseSummary;
        this.timestamp = timestamp;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getWebhookId() {
        return webhookId;
    }

    public void setWebhookId(Long webhookId) {
        this.webhookId = webhookId;
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public String getPayload() {
        return payload;
    }

    public void setPayload(String payload) {
        this.payload = payload;
    }

    public int getHttpStatusCode() {
        return httpStatusCode;
    }

    public void setHttpStatusCode(int httpStatusCode) {
        this.httpStatusCode = httpStatusCode;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getResponseSummary() {
        return responseSummary;
    }

    public void setResponseSummary(String responseSummary) {
        this.responseSummary = responseSummary;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
