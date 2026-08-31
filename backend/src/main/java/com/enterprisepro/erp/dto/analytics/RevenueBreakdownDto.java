package com.enterprisepro.erp.dto.analytics;

import java.math.BigDecimal;

public class RevenueBreakdownDto {

    private String category;
    private BigDecimal amount;
    private Double percentageShare;
    private long transactionCount;

    public RevenueBreakdownDto() {}

    public RevenueBreakdownDto(String category, BigDecimal amount, Double percentageShare, long transactionCount) {
        this.category = category;
        this.amount = amount;
        this.percentageShare = percentageShare;
        this.transactionCount = transactionCount;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public Double getPercentageShare() {
        return percentageShare;
    }

    public void setPercentageShare(Double percentageShare) {
        this.percentageShare = percentageShare;
    }

    public long getTransactionCount() {
        return transactionCount;
    }

    public void setTransactionCount(long transactionCount) {
        this.transactionCount = transactionCount;
    }
}
