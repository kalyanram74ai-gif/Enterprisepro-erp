package com.enterprisepro.erp.dto.analytics;

import java.math.BigDecimal;

public class ProfitabilityTrendDto {

    private String period;
    private BigDecimal grossRevenue;
    private BigDecimal costOfGoodsSold;
    private BigDecimal operatingExpenses;
    private BigDecimal netEbitda;
    private Double netMarginPercent;

    public ProfitabilityTrendDto() {}

    public ProfitabilityTrendDto(String period, BigDecimal grossRevenue, BigDecimal costOfGoodsSold, BigDecimal operatingExpenses, BigDecimal netEbitda, Double netMarginPercent) {
        this.period = period;
        this.grossRevenue = grossRevenue;
        this.costOfGoodsSold = costOfGoodsSold;
        this.operatingExpenses = operatingExpenses;
        this.netEbitda = netEbitda;
        this.netMarginPercent = netMarginPercent;
    }

    public String getPeriod() {
        return period;
    }

    public void setPeriod(String period) {
        this.period = period;
    }

    public BigDecimal getGrossRevenue() {
        return grossRevenue;
    }

    public void setGrossRevenue(BigDecimal grossRevenue) {
        this.grossRevenue = grossRevenue;
    }

    public BigDecimal getCostOfGoodsSold() {
        return costOfGoodsSold;
    }

    public void setCostOfGoodsSold(BigDecimal costOfGoodsSold) {
        this.costOfGoodsSold = costOfGoodsSold;
    }

    public BigDecimal getOperatingExpenses() {
        return operatingExpenses;
    }

    public void setOperatingExpenses(BigDecimal operatingExpenses) {
        this.operatingExpenses = operatingExpenses;
    }

    public BigDecimal getNetEbitda() {
        return netEbitda;
    }

    public void setNetEbitda(BigDecimal netEbitda) {
        this.netEbitda = netEbitda;
    }

    public Double getNetMarginPercent() {
        return netMarginPercent;
    }

    public void setNetMarginPercent(Double netMarginPercent) {
        this.netMarginPercent = netMarginPercent;
    }
}
