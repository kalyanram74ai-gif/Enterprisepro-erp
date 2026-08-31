package com.enterprisepro.erp.dto.analytics;

import java.math.BigDecimal;

public class InventoryTurnoverMetricDto {

    private String productCategory;
    private Double turnoverRatio;
    private Integer averageDaysInInventory;
    private BigDecimal stockValuation;
    private String efficiencyRating;

    public InventoryTurnoverMetricDto() {}

    public InventoryTurnoverMetricDto(String productCategory, Double turnoverRatio, Integer averageDaysInInventory, BigDecimal stockValuation, String efficiencyRating) {
        this.productCategory = productCategory;
        this.turnoverRatio = turnoverRatio;
        this.averageDaysInInventory = averageDaysInInventory;
        this.stockValuation = stockValuation;
        this.efficiencyRating = efficiencyRating;
    }

    public String getProductCategory() {
        return productCategory;
    }

    public void setProductCategory(String productCategory) {
        this.productCategory = productCategory;
    }

    public Double getTurnoverRatio() {
        return turnoverRatio;
    }

    public void setTurnoverRatio(Double turnoverRatio) {
        this.turnoverRatio = turnoverRatio;
    }

    public Integer getAverageDaysInInventory() {
        return averageDaysInInventory;
    }

    public void setAverageDaysInInventory(Integer averageDaysInInventory) {
        this.averageDaysInInventory = averageDaysInInventory;
    }

    public BigDecimal getStockValuation() {
        return stockValuation;
    }

    public void setStockValuation(BigDecimal stockValuation) {
        this.stockValuation = stockValuation;
    }

    public String getEfficiencyRating() {
        return efficiencyRating;
    }

    public void setEfficiencyRating(String efficiencyRating) {
        this.efficiencyRating = efficiencyRating;
    }
}
