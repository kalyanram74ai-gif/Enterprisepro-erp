package com.enterprisepro.erp.repository;

import com.enterprisepro.erp.entity.WebhookDeliveryLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WebhookDeliveryLogRepository extends JpaRepository<WebhookDeliveryLog, Long> {
    List<WebhookDeliveryLog> findByWebhookIdOrderByTimestampDesc(Long webhookId);
    List<WebhookDeliveryLog> findTop20ByOrderByTimestampDesc();
}
