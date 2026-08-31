package com.enterprisepro.erp.dto.analytics;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class BiKpiSummaryDto {

    private BigDecimal totalGrossRevenue;
    private BigDecimal netOperatingIncome;
    private BigDecimal operatingExpenseTotal;
    private Double grossMarginPercentage;
    private Double operatingMarginPercentage;
    private Double yearOverYearGrowthRate;
    private long totalActiveOrders;
    private long totalActiveCustomers;
    private Double inventoryEfficiencyScore;
    private Double returnOnInventory;
    private Double employeeProductivityIndex;
    private List<Map<String, Object>> quarterlyRevenueTrend;
    private List<Map<String, Object>> departmentPerformanceMetrics;

    public BiKpiSummaryDto() {}

    public BigDecimal getTotalGrossRevenue() {
        return totalGrossRevenue;
    }

    public void setTotalGrossRevenue(BigDecimal totalGrossRevenue) {
        this.totalGrossRevenue = totalGrossRevenue;
    }

    public BigDecimal getNetOperatingIncome() {
        return netOperatingIncome;
    }

    public void setNetOperatingIncome(BigDecimal netOperatingIncome) {
        this.netOperatingIncome = netOperatingIncome;
    }

    public BigDecimal getOperatingExpenseTotal() {
        return operatingExpenseTotal;
    }

    public void setOperatingExpenseTotal(BigDecimal operatingExpenseTotal) {
        this.operatingExpenseTotal = operatingExpenseTotal;
    }

    public Double getGrossMarginPercentage() {
        return grossMarginPercentage;
    }

    public void setGrossMarginPercentage(Double grossMarginPercentage) {
        this.grossMarginPercentage = grossMarginPercentage;
    }

    public Double getOperatingMarginPercentage() {
        return operatingMarginPercentage;
    }

    public void setOperatingMarginPercentage(Double operatingMarginPercentage) {
        this.operatingMarginPercentage = operatingMarginPercentage;
    }

    public Double getYearOverYearGrowthRate() {
        return yearOverYearGrowthRate;
    }

    public void setYearOverYearGrowthRate(Double yearOverYearGrowthRate) {
        this.yearOverYearGrowthRate = yearOverYearGrowthRate;
    }

    public long getTotalActiveOrders() {
        return totalActiveOrders;
    }

    public void setTotalActiveOrders(long totalActiveOrders) {
        this.totalActiveOrders = totalActiveOrders;
    }

    public long getTotalActiveCustomers() {
        return totalActiveCustomers;
    }

    public void setTotalActiveCustomers(long totalActiveCustomers) {
        this.totalActiveCustomers = totalActiveCustomers;
    }

    public Double getInventoryEfficiencyScore() {
        return inventoryEfficiencyScore;
    }

    public void setInventoryEfficiencyScore(Double inventoryEfficiencyScore) {
        this.inventoryEfficiencyScore = inventoryEfficiencyScore;
    }

    public Double getReturnOnInventory() {
        return returnOnInventory;
    }

    public void setReturnOnInventory(Double returnOnInventory) {
        this.returnOnInventory = returnOnInventory;
    }

    public Double getEmployeeProductivityIndex() {
        return employeeProductivityIndex;
    }

    public void setEmployeeProductivityIndex(Double employeeProductivityIndex) {
        this.employeeProductivityIndex = employeeProductivityIndex;
    }

    public List<Map<String, Object>> getQuarterlyRevenueTrend() {
        return quarterlyRevenueTrend;
    }

    public void setQuarterlyRevenueTrend(List<Map<String, Object>> quarterlyRevenueTrend) {
        this.quarterlyRevenueTrend = quarterlyRevenueTrend;
    }

    public List<Map<String, Object>> getDepartmentPerformanceMetrics() {
        return departmentPerformanceMetrics;
    }

    public void setDepartmentPerformanceMetrics(List<Map<String, Object>> departmentPerformanceMetrics) {
        this.departmentPerformanceMetrics = departmentPerformanceMetrics;
    }
}
