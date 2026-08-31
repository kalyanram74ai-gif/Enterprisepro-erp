package com.enterprisepro.erp.service.impl;

import com.enterprisepro.erp.dto.CurrencyConversionRequestDto;
import com.enterprisepro.erp.dto.CurrencyConversionResultDto;
import com.enterprisepro.erp.dto.CurrencyDto;
import com.enterprisepro.erp.dto.ExchangeRateDto;
import com.enterprisepro.erp.entity.Currency;
import com.enterprisepro.erp.entity.ExchangeRate;
import com.enterprisepro.erp.repository.CurrencyRepository;
import com.enterprisepro.erp.repository.ExchangeRateRepository;
import com.enterprisepro.erp.service.CurrencyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CurrencyServiceImpl implements CurrencyService {

    @Autowired
    private CurrencyRepository currencyRepository;

    @Autowired
    private ExchangeRateRepository exchangeRateRepository;

    private static final Map<String, BigDecimal> DEFAULT_USD_RATES = new HashMap<>();

    static {
        DEFAULT_USD_RATES.put("USD", BigDecimal.ONE);
        DEFAULT_USD_RATES.put("EUR", new BigDecimal("0.920000"));
        DEFAULT_USD_RATES.put("GBP", new BigDecimal("0.785000"));
        DEFAULT_USD_RATES.put("INR", new BigDecimal("83.250000"));
        DEFAULT_USD_RATES.put("JPY", new BigDecimal("155.400000"));
        DEFAULT_USD_RATES.put("CAD", new BigDecimal("1.365000"));
        DEFAULT_USD_RATES.put("AUD", new BigDecimal("1.520000"));
        DEFAULT_USD_RATES.put("CHF", new BigDecimal("0.905000"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<CurrencyDto> getAllCurrencies() {
        List<Currency> list = currencyRepository.findAll();
        if (list.isEmpty()) {
            return getDefaultCurrencies();
        }
        return list.stream().map(this::mapToCurrencyDto).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CurrencyDto createCurrency(CurrencyDto dto) {
        Currency c = new Currency();
        c.setCode(dto.getCode().toUpperCase());
        c.setName(dto.getName());
        c.setSymbol(dto.getSymbol());
        c.setBaseCurrency(dto.isBaseCurrency());
        c.setActive(dto.isActive());
        Currency saved = currencyRepository.save(c);
        return mapToCurrencyDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExchangeRateDto> getAllExchangeRates() {
        List<ExchangeRate> rates = exchangeRateRepository.findAll();
        if (rates.isEmpty()) {
            return getDefaultExchangeRates();
        }
        return rates.stream().map(this::mapToRateDto).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ExchangeRateDto setExchangeRate(ExchangeRateDto dto) {
        ExchangeRate rate = new ExchangeRate();
        rate.setFromCurrency(dto.getFromCurrency().toUpperCase());
        rate.setToCurrency(dto.getToCurrency().toUpperCase());
        rate.setRate(dto.getRate());
        rate.setEffectiveDate(dto.getEffectiveDate() != null ? dto.getEffectiveDate() : LocalDate.now());
        rate.setSource(dto.getSource() != null ? dto.getSource() : "MANUAL_OVERRIDE");
        ExchangeRate saved = exchangeRateRepository.save(rate);
        return mapToRateDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public CurrencyConversionResultDto convertCurrency(CurrencyConversionRequestDto request) {
        String from = request.getFromCurrency().toUpperCase();
        String to = request.getToCurrency().toUpperCase();
        BigDecimal amount = request.getAmount();

        BigDecimal rate = getExchangeRate(from, to);
        BigDecimal convertedAmount = amount.multiply(rate).setScale(4, RoundingMode.HALF_UP);

        return new CurrencyConversionResultDto(from, to, amount, convertedAmount, rate);
    }

    @Override
    @Transactional(readOnly = true)
    public BigDecimal getExchangeRate(String from, String to) {
        from = from.toUpperCase();
        to = to.toUpperCase();

        if (from.equals(to)) {
            return BigDecimal.ONE.setScale(6, RoundingMode.HALF_UP);
        }

        // Check direct rate in database
        Optional<ExchangeRate> directRate = exchangeRateRepository.findFirstByFromCurrencyAndToCurrencyOrderByEffectiveDateDesc(from, to);
        if (directRate.isPresent()) {
            return directRate.get().getRate();
        }

        // Check inverse rate in database
        Optional<ExchangeRate> inverseRate = exchangeRateRepository.findFirstByFromCurrencyAndToCurrencyOrderByEffectiveDateDesc(to, from);
        if (inverseRate.isPresent() && inverseRate.get().getRate().compareTo(BigDecimal.ZERO) > 0) {
            return BigDecimal.ONE.divide(inverseRate.get().getRate(), 6, RoundingMode.HALF_UP);
        }

        // Triangulate using USD standard fallback
        BigDecimal fromToUsd = DEFAULT_USD_RATES.getOrDefault(from, BigDecimal.ONE);
        BigDecimal toToUsd = DEFAULT_USD_RATES.getOrDefault(to, BigDecimal.ONE);

        // Rate = (1 / fromToUsd) * toToUsd
        return toToUsd.divide(fromToUsd, 6, RoundingMode.HALF_UP);
    }

    private CurrencyDto mapToCurrencyDto(Currency c) {
        return new CurrencyDto(c.getId(), c.getCode(), c.getName(), c.getSymbol(), c.isBaseCurrency(), c.isActive());
    }

    private ExchangeRateDto mapToRateDto(ExchangeRate r) {
        ExchangeRateDto dto = new ExchangeRateDto(r.getId(), r.getFromCurrency(), r.getToCurrency(), r.getRate(), r.getEffectiveDate(), r.getSource());
        dto.setUpdatedAt(r.getUpdatedAt());
        return dto;
    }

    private List<CurrencyDto> getDefaultCurrencies() {
        return Arrays.asList(
                new CurrencyDto(1L, "USD", "US Dollar", "$", true, true),
                new CurrencyDto(2L, "EUR", "Euro", "€", false, true),
                new CurrencyDto(3L, "GBP", "British Pound", "£", false, true),
                new CurrencyDto(4L, "INR", "Indian Rupee", "₹", false, true),
                new CurrencyDto(5L, "JPY", "Japanese Yen", "¥", false, true),
                new CurrencyDto(6L, "CAD", "Canadian Dollar", "CA$", false, true)
        );
    }

    private List<ExchangeRateDto> getDefaultExchangeRates() {
        List<ExchangeRateDto> list = new ArrayList<>();
        LocalDate today = LocalDate.now();
        DEFAULT_USD_RATES.forEach((code, rate) -> {
            if (!code.equals("USD")) {
                list.add(new ExchangeRateDto(null, "USD", code, rate, today, "CENTRAL_BANK"));
            }
        });
        return list;
    }
}
