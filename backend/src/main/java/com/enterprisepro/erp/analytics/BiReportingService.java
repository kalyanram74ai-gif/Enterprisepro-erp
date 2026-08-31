package com.enterprisepro.erp.analytics;

import com.enterprisepro.erp.dto.analytics.BiKpiSummaryDto;
import com.enterprisepro.erp.dto.analytics.InventoryTurnoverMetricDto;
import com.enterprisepro.erp.dto.analytics.ProfitabilityTrendDto;
import com.enterprisepro.erp.dto.analytics.RevenueBreakdownDto;

import java.util.List;

public interface BiReportingService {

    BiKpiSummaryDto getBiKpiSummary();

    List<RevenueBreakdownDto> getRevenueBreakdownByChannel();

    List<InventoryTurnoverMetricDto> getInventoryTurnoverMetrics();

    List<ProfitabilityTrendDto> getProfitabilityTrends();
}
