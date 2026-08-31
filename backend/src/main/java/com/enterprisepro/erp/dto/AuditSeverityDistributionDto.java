package com.enterprisepro.erp.dto;

public class AuditSeverityDistributionDto {

    private long totalEvents;
    private long lowCount;
    private long mediumCount;
    private long highCount;
    private long criticalCount;

    public AuditSeverityDistributionDto() {}

    public AuditSeverityDistributionDto(long totalEvents, long lowCount, long mediumCount, long highCount, long criticalCount) {
        this.totalEvents = totalEvents;
        this.lowCount = lowCount;
        this.mediumCount = mediumCount;
        this.highCount = highCount;
        this.criticalCount = criticalCount;
    }

    public long getTotalEvents() {
        return totalEvents;
    }

    public void setTotalEvents(long totalEvents) {
        this.totalEvents = totalEvents;
    }

    public long getLowCount() {
        return lowCount;
    }

    public void setLowCount(long lowCount) {
        this.lowCount = lowCount;
    }

    public long getMediumCount() {
        return mediumCount;
    }

    public void setMediumCount(long mediumCount) {
        this.mediumCount = mediumCount;
    }

    public long getHighCount() {
        return highCount;
    }

    public void setHighCount(long highCount) {
        this.highCount = highCount;
    }

    public long getCriticalCount() {
        return criticalCount;
    }

    public void setCriticalCount(long criticalCount) {
        this.criticalCount = criticalCount;
    }
}
