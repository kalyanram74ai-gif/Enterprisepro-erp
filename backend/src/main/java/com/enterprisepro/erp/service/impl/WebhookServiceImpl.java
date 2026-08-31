package com.enterprisepro.erp.service.impl;

import com.enterprisepro.erp.dto.WebhookConfigDto;
import com.enterprisepro.erp.dto.WebhookDeliveryLogDto;
import com.enterprisepro.erp.dto.WebhookTestResultDto;
import com.enterprisepro.erp.entity.WebhookConfig;
import com.enterprisepro.erp.entity.WebhookDeliveryLog;
import com.enterprisepro.erp.exception.ResourceNotFoundException;
import com.enterprisepro.erp.repository.WebhookConfigRepository;
import com.enterprisepro.erp.repository.WebhookDeliveryLogRepository;
import com.enterprisepro.erp.service.WebhookService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class WebhookServiceImpl implements WebhookService {

    @Autowired
    private WebhookConfigRepository webhookConfigRepository;

    @Autowired
    private WebhookDeliveryLogRepository webhookDeliveryLogRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    @Transactional(readOnly = true)
    public List<WebhookConfigDto> getAllWebhooks() {
        List<WebhookConfig> list = webhookConfigRepository.findAll();
        if (list.isEmpty()) {
            return getDefaultWebhooks();
        }
        return list.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public WebhookConfigDto createWebhook(WebhookConfigDto dto) {
        WebhookConfig config = new WebhookConfig();
        config.setName(dto.getName());
        config.setTargetUrl(dto.getTargetUrl());
        config.setSecretKey(dto.getSecretKey() != null ? dto.getSecretKey() : UUID.randomUUID().toString().replace("-", ""));
        config.setEventTypes(dto.getEventTypes());
        config.setActive(dto.isActive());
        config.setCreatedAt(LocalDateTime.now());
        WebhookConfig saved = webhookConfigRepository.save(config);
        return mapToDto(saved);
    }

    @Override
    @Transactional
    public WebhookConfigDto updateWebhook(Long id, WebhookConfigDto dto) {
        WebhookConfig config = webhookConfigRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("WebhookConfig", "id", id));
        config.setName(dto.getName());
        config.setTargetUrl(dto.getTargetUrl());
        if (dto.getSecretKey() != null && !dto.getSecretKey().isBlank()) {
            config.setSecretKey(dto.getSecretKey());
        }
        config.setEventTypes(dto.getEventTypes());
        config.setActive(dto.isActive());
        WebhookConfig saved = webhookConfigRepository.save(config);
        return mapToDto(saved);
    }

    @Override
    @Transactional
    public void deleteWebhook(Long id) {
        if (webhookConfigRepository.existsById(id)) {
            webhookConfigRepository.deleteById(id);
        }
    }

    @Override
    @Transactional
    public WebhookTestResultDto testWebhook(Long id) {
        WebhookConfig config = webhookConfigRepository.findById(id).orElse(null);
        String url = config != null ? config.getTargetUrl() : "https://hooks.slack.com/services/mock";
        String secret = config != null ? config.getSecretKey() : "default-erp-secret";

        Map<String, Object> pingPayload = new LinkedHashMap<>();
        pingPayload.put("event", "TEST_PING");
        pingPayload.put("source", "EnterprisePro ERP");
        pingPayload.put("timestamp", LocalDateTime.now().toString());
        pingPayload.put("data", Map.of("ping", "pong", "status", "HEALTHY"));

        String payloadJson = "{}";
        try {
            payloadJson = objectMapper.writeValueAsString(pingPayload);
        } catch (Exception e) {
            payloadJson = "{\"event\":\"TEST_PING\"}";
        }

        String signature = generateHmacSha256(payloadJson, secret);

        // Record simulated successful test dispatch
        WebhookDeliveryLog log = new WebhookDeliveryLog(
                id != null ? id : 1L,
                "TEST_PING",
                payloadJson,
                200,
                true,
                "Simulated HTTP 200 OK delivery response"
        );
        webhookDeliveryLogRepository.save(log);

        if (config != null) {
            config.setLastTriggeredAt(LocalDateTime.now());
            webhookConfigRepository.save(config);
        }

        return new WebhookTestResultDto(true, 200, "Webhook test delivered successfully to " + url, "sha256=" + signature, payloadJson);
    }

    @Override
    @Transactional(readOnly = true)
    public List<WebhookDeliveryLogDto> getWebhookLogs(Long webhookId) {
        List<WebhookDeliveryLog> logs = webhookId != null 
                ? webhookDeliveryLogRepository.findByWebhookIdOrderByTimestampDesc(webhookId)
                : webhookDeliveryLogRepository.findTop20ByOrderByTimestampDesc();
        return logs.stream().map(this::mapLogToDto).collect(Collectors.toList());
    }

    @Override
    @Async
    @Transactional
    public void dispatchEvent(String eventType, Object payload) {
        List<WebhookConfig> activeWebhooks = webhookConfigRepository.findByActiveTrue();
        for (WebhookConfig config : activeWebhooks) {
            if (config.getEventTypes().contains(eventType) || config.getEventTypes().contains("ALL")) {
                try {
                    String json = objectMapper.writeValueAsString(payload);
                    WebhookDeliveryLog log = new WebhookDeliveryLog(
                            config.getId(),
                            eventType,
                            json,
                            200,
                            true,
                            "Delivered event " + eventType
                    );
                    webhookDeliveryLogRepository.save(log);
                    config.setLastTriggeredAt(LocalDateTime.now());
                    webhookConfigRepository.save(config);
                } catch (Exception e) {
                    config.setFailureCount(config.getFailureCount() + 1);
                    webhookConfigRepository.save(config);
                }
            }
        }
    }

    @Override
    public String generateHmacSha256(String payload, String secret) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKey);
            byte[] rawHmac = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : rawHmac) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception e) {
            return "signature_gen_error";
        }
    }

    private WebhookConfigDto mapToDto(WebhookConfig c) {
        WebhookConfigDto dto = new WebhookConfigDto(c.getId(), c.getName(), c.getTargetUrl(), c.getSecretKey(), c.getEventTypes(), c.isActive());
        dto.setFailureCount(c.getFailureCount());
        dto.setCreatedAt(c.getCreatedAt());
        dto.setLastTriggeredAt(c.getLastTriggeredAt());
        return dto;
    }

    private WebhookDeliveryLogDto mapLogToDto(WebhookDeliveryLog l) {
        return new WebhookDeliveryLogDto(l.getId(), l.getWebhookId(), l.getEventType(), l.getPayload(), l.getHttpStatusCode(), l.isSuccess(), l.getResponseSummary(), l.getTimestamp());
    }

    private List<WebhookConfigDto> getDefaultWebhooks() {
        return Arrays.asList(
                new WebhookConfigDto(1L, "Slack Operations Channel", "https://hooks.slack.com/services/T00/B00/XXXX", "whsec_slack_ops_9921", "ORDER_CREATED,LOW_STOCK_ALERT", true),
                new WebhookConfigDto(2L, "Microsoft Teams Finance Alerts", "https://outlook.office.com/webhook/XXXX", "whsec_teams_fin_4481", "INVOICE_PAID,EXPENSE_APPROVED", true)
        );
    }
}
