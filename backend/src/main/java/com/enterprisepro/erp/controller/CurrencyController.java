package com.enterprisepro.erp.controller;

import com.enterprisepro.erp.dto.CurrencyConversionRequestDto;
import com.enterprisepro.erp.dto.CurrencyConversionResultDto;
import com.enterprisepro.erp.dto.CurrencyDto;
import com.enterprisepro.erp.dto.ExchangeRateDto;
import com.enterprisepro.erp.service.CurrencyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/finance/currencies")
@Tag(name = "Multi-Currency & FX Rates", description = "Endpoints for managing currencies, foreign exchange rates, and real-time multi-currency conversions")
public class CurrencyController {

    @Autowired
    private CurrencyService currencyService;

    @GetMapping
    @Operation(summary = "Get all active currencies")
    public ResponseEntity<List<CurrencyDto>> getAllCurrencies() {
        return ResponseEntity.ok(currencyService.getAllCurrencies());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER')")
    @Operation(summary = "Register a new currency")
    public ResponseEntity<CurrencyDto> createCurrency(@Valid @RequestBody CurrencyDto dto) {
        return new ResponseEntity<>(currencyService.createCurrency(dto), HttpStatus.CREATED);
    }

    @GetMapping("/exchange-rates")
    @Operation(summary = "Get all exchange rates and FX history")
    public ResponseEntity<List<ExchangeRateDto>> getAllExchangeRates() {
        return ResponseEntity.ok(currencyService.getAllExchangeRates());
    }

    @PostMapping("/exchange-rates")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'FINANCE_MANAGER')")
    @Operation(summary = "Set or update an FX exchange rate")
    public ResponseEntity<ExchangeRateDto> setExchangeRate(@Valid @RequestBody ExchangeRateDto dto) {
        return new ResponseEntity<>(currencyService.setExchangeRate(dto), HttpStatus.CREATED);
    }

    @PostMapping("/convert")
    @Operation(summary = "Calculate real-time currency conversion with historical/live rates")
    public ResponseEntity<CurrencyConversionResultDto> convertCurrency(@Valid @RequestBody CurrencyConversionRequestDto request) {
        return ResponseEntity.ok(currencyService.convertCurrency(request));
    }

    @GetMapping("/rate")
    @Operation(summary = "Get active exchange rate between two currency codes")
    public ResponseEntity<BigDecimal> getRate(
            @RequestParam String from,
            @RequestParam String to) {
        return ResponseEntity.ok(currencyService.getExchangeRate(from, to));
    }
}
