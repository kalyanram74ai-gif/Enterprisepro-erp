package com.enterprisepro.erp.dto;

public class CurrencyDto {

    private Long id;
    private String code;
    private String name;
    private String symbol;
    private boolean baseCurrency;
    private boolean active;

    public CurrencyDto() {}

    public CurrencyDto(Long id, String code, String name, String symbol, boolean baseCurrency, boolean active) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.symbol = symbol;
        this.baseCurrency = baseCurrency;
        this.active = active;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public boolean isBaseCurrency() {
        return baseCurrency;
    }

    public void setBaseCurrency(boolean baseCurrency) {
        this.baseCurrency = baseCurrency;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
