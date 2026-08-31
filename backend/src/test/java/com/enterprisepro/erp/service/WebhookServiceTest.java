package com.enterprisepro.erp.service;

import com.enterprisepro.erp.dto.WebhookConfigDto;
import com.enterprisepro.erp.dto.WebhookTestResultDto;
import com.enterprisepro.erp.entity.WebhookConfig;
import com.enterprisepro.erp.entity.WebhookDeliveryLog;
import com.enterprisepro.erp.repository.WebhookConfigRepository;
import com.enterprisepro.erp.repository.WebhookDeliveryLogRepository;
import com.enterprisepro.erp.service.impl.WebhookServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class WebhookServiceTest {

    @Mock
    private WebhookConfigRepository webhookConfigRepository;

    @Mock
    private WebhookDeliveryLogRepository webhookDeliveryLogRepository;

    @InjectMocks
    private WebhookServiceImpl webhookService;

    @Test
    void testHmacSha256Generation() {
        String payload = "{\"event\":\"TEST\"}";
        String secret = "my_super_secret_key_123";

        String signature = webhookService.generateHmacSha256(payload, secret);
        assertNotNull(signature);
        assertFalse(signature.isBlank());
        assertEquals(64, signature.length()); // SHA-256 in hex is 64 characters
    }

    @Test
    void testGetAllWebhooks() {
        WebhookConfig w1 = new WebhookConfig("Slack Bot", "https://slack.com/hook", "sec1", "ORDER_CREATED", true);
        w1.setId(1L);
        WebhookConfig w2 = new WebhookConfig("Teams Bot", "https://teams.com/hook", "sec2", "INVOICE_PAID", true);
        w2.setId(2L);

        when(webhookConfigRepository.findAll()).thenReturn(Arrays.asList(w1, w2));

        List<WebhookConfigDto> list = webhookService.getAllWebhooks();
        assertNotNull(list);
        assertEquals(2, list.size());
        assertEquals("Slack Bot", list.get(0).getName());
    }

    @Test
    void testTestWebhookExecution() {
        WebhookConfig config = new WebhookConfig("Zapier Hook", "https://hooks.zapier.com/test", "sec_zapier", "LOW_STOCK", true);
        config.setId(10L);

        when(webhookConfigRepository.findById(10L)).thenReturn(Optional.of(config));
        when(webhookDeliveryLogRepository.save(any(WebhookDeliveryLog.class))).thenAnswer(i -> i.getArgument(0));

        WebhookTestResultDto result = webhookService.testWebhook(10L);

        assertNotNull(result);
        assertTrue(result.isSuccess());
        assertEquals(200, result.getStatusCode());
        assertTrue(result.getSignatureHeader().startsWith("sha256="));
    }
}
