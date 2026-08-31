package com.enterprisepro.erp.analytics;

import com.enterprisepro.erp.dto.analytics.BiKpiSummaryDto;
import com.enterprisepro.erp.dto.analytics.InventoryTurnoverMetricDto;
import com.enterprisepro.erp.dto.analytics.ProfitabilityTrendDto;
import com.enterprisepro.erp.dto.analytics.RevenueBreakdownDto;
import com.enterprisepro.erp.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class BiReportingServiceTest {

    @Mock
    private SalesInvoiceRepository salesInvoiceRepository;

    @Mock
    private SalesOrderRepository salesOrderRepository;

    @Mock
    private ExpenseRepository expenseRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private DepartmentRepository departmentRepository;

    @InjectMocks
    private BiReportingServiceImpl biReportingService;

    @Test
    void testGetBiKpiSummary() {
        when(salesInvoiceRepository.sumTotalInvoicedBetween(any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(BigDecimal.valueOf(500000.00));
        when(expenseRepository.sumExpensesBetween(any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(BigDecimal.valueOf(200000.00));
        when(salesOrderRepository.count()).thenReturn(150L);
        when(customerRepository.count()).thenReturn(90L);
        when(employeeRepository.count()).thenReturn(20L);
        when(departmentRepository.findAll()).thenReturn(Collections.emptyList());

        BiKpiSummaryDto summary = biReportingService.getBiKpiSummary();

        assertNotNull(summary);
        assertEquals(BigDecimal.valueOf(500000.00), summary.getTotalGrossRevenue());
        assertEquals(BigDecimal.valueOf(200000.00), summary.getOperatingExpenseTotal());
        assertEquals(BigDecimal.valueOf(300000.00), summary.getNetOperatingIncome());
        assertEquals(60.0, summary.getGrossMarginPercentage());
        assertEquals(150L, summary.getTotalActiveOrders());
        assertEquals(90L, summary.getTotalActiveCustomers());
        assertFalse(summary.getQuarterlyRevenueTrend().isEmpty());
    }

    @Test
    void testGetRevenueBreakdownByChannel() {
        List<RevenueBreakdownDto> breakdown = biReportingService.getRevenueBreakdownByChannel();
        assertNotNull(breakdown);
        assertFalse(breakdown.isEmpty());
        assertEquals(4, breakdown.size());
    }

    @Test
    void testGetInventoryTurnoverMetrics() {
        List<InventoryTurnoverMetricDto> metrics = biReportingService.getInventoryTurnoverMetrics();
        assertNotNull(metrics);
        assertEquals(4, metrics.size());
    }

    @Test
    void testGetProfitabilityTrends() {
        List<ProfitabilityTrendDto> trends = biReportingService.getProfitabilityTrends();
        assertNotNull(trends);
        assertEquals(4, trends.size());
    }
}
