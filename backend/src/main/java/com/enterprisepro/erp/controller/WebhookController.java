package com.enterprisepro.erp.controller;

import com.enterprisepro.erp.dto.WebhookConfigDto;
import com.enterprisepro.erp.dto.WebhookDeliveryLogDto;
import com.enterprisepro.erp.dto.WebhookTestResultDto;
import com.enterprisepro.erp.service.WebhookService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications/webhooks")
@Tag(name = "Event Webhooks & Subscriptions", description = "Endpoints for subscribing external endpoints (Slack, Teams, Zapier) to real-time ERP business events with HMAC signatures")
public class WebhookController {

    @Autowired
    private WebhookService webhookService;

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @Operation(summary = "Get all configured webhook endpoints")
    public ResponseEntity<List<WebhookConfigDto>> getAllWebhooks() {
        return ResponseEntity.ok(webhookService.getAllWebhooks());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @Operation(summary = "Register a new webhook subscription endpoint")
    public ResponseEntity<WebhookConfigDto> createWebhook(@Valid @RequestBody WebhookConfigDto dto) {
        return new ResponseEntity<>(webhookService.createWebhook(dto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @Operation(summary = "Update webhook configuration or event triggers")
    public ResponseEntity<WebhookConfigDto> updateWebhook(@PathVariable Long id, @Valid @RequestBody WebhookConfigDto dto) {
        return ResponseEntity.ok(webhookService.updateWebhook(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @Operation(summary = "Delete a webhook configuration")
    public ResponseEntity<Void> deleteWebhook(@PathVariable Long id) {
        webhookService.deleteWebhook(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/test")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @Operation(summary = "Trigger a simulated test ping payload to verify endpoint connectivity and HMAC signature")
    public ResponseEntity<WebhookTestResultDto> testWebhook(@PathVariable Long id) {
        return ResponseEntity.ok(webhookService.testWebhook(id));
    }

    @GetMapping("/{id}/logs")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @Operation(summary = "Get delivery audit logs and response codes for a webhook")
    public ResponseEntity<List<WebhookDeliveryLogDto>> getWebhookLogs(@PathVariable Long id) {
        return ResponseEntity.ok(webhookService.getWebhookLogs(id));
    }
}
