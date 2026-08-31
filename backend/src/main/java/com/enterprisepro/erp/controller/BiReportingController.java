package com.enterprisepro.erp.controller;

import com.enterprisepro.erp.analytics.BiReportingService;
import com.enterprisepro.erp.dto.analytics.BiKpiSummaryDto;
import com.enterprisepro.erp.dto.analytics.InventoryTurnoverMetricDto;
import com.enterprisepro.erp.dto.analytics.ProfitabilityTrendDto;
import com.enterprisepro.erp.dto.analytics.RevenueBreakdownDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/analytics/bi")
@Tag(name = "Business Intelligence", description = "Executive KPI intelligence, revenue attribution, inventory velocity, and profitability trends")
public class BiReportingController {

    @Autowired
    private BiReportingService biReportingService;

    @GetMapping("/kpi-summary")
    @Operation(summary = "Get high-level BI KPI summaries including EBITDA, margins, efficiency and growth rates")
    public ResponseEntity<BiKpiSummaryDto> getBiKpiSummary() {
        return ResponseEntity.ok(biReportingService.getBiKpiSummary());
    }

    @GetMapping("/revenue-breakdown")
    @Operation(summary = "Get multi-channel revenue distribution and category contribution")
    public ResponseEntity<List<RevenueBreakdownDto>> getRevenueBreakdown() {
        return ResponseEntity.ok(biReportingService.getRevenueBreakdownByChannel());
    }

    @GetMapping("/inventory-turnover")
    @Operation(summary = "Get inventory velocity, turnover ratios and carrying duration analytics")
    public ResponseEntity<List<InventoryTurnoverMetricDto>> getInventoryTurnover() {
        return ResponseEntity.ok(biReportingService.getInventoryTurnoverMetrics());
    }

    @GetMapping("/profitability-trends")
    @Operation(summary = "Get monthly and quarterly profitability, EBITDA, and margin trajectories")
    public ResponseEntity<List<ProfitabilityTrendDto>> getProfitabilityTrends() {
        return ResponseEntity.ok(biReportingService.getProfitabilityTrends());
    }
}
