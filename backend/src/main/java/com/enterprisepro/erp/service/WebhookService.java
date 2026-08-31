package com.enterprisepro.erp.service;

import com.enterprisepro.erp.dto.WebhookConfigDto;
import com.enterprisepro.erp.dto.WebhookDeliveryLogDto;
import com.enterprisepro.erp.dto.WebhookTestResultDto;

import java.util.List;

public interface WebhookService {

    List<WebhookConfigDto> getAllWebhooks();

    WebhookConfigDto createWebhook(WebhookConfigDto dto);

    WebhookConfigDto updateWebhook(Long id, WebhookConfigDto dto);

    void deleteWebhook(Long id);

    WebhookTestResultDto testWebhook(Long id);

    List<WebhookDeliveryLogDto> getWebhookLogs(Long webhookId);

    void dispatchEvent(String eventType, Object payload);

    String generateHmacSha256(String payload, String secret);
}
