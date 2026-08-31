package com.enterprisepro.erp.dto;

import java.time.LocalDateTime;

public class WebhookTestResultDto {

    private boolean success;
    private int statusCode;
    private String responseMessage;
    private String signatureHeader;
    private String dispatchedPayload;
    private LocalDateTime timestamp;

    public WebhookTestResultDto() {}

    public WebhookTestResultDto(boolean success, int statusCode, String responseMessage, String signatureHeader, String dispatchedPayload) {
        this.success = success;
        this.statusCode = statusCode;
        this.responseMessage = responseMessage;
        this.signatureHeader = signatureHeader;
        this.dispatchedPayload = dispatchedPayload;
        this.timestamp = LocalDateTime.now();
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public int getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(int statusCode) {
        this.statusCode = statusCode;
    }

    public String getResponseMessage() {
        return responseMessage;
    }

    public void setResponseMessage(String responseMessage) {
        this.responseMessage = responseMessage;
    }

    public String getSignatureHeader() {
        return signatureHeader;
    }

    public void setSignatureHeader(String signatureHeader) {
        this.signatureHeader = signatureHeader;
    }

    public String getDispatchedPayload() {
        return dispatchedPayload;
    }

    public void setDispatchedPayload(String dispatchedPayload) {
        this.dispatchedPayload = dispatchedPayload;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
