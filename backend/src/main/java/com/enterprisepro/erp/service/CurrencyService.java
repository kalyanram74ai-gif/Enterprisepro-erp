package com.enterprisepro.erp.service;

import com.enterprisepro.erp.dto.CurrencyConversionRequestDto;
import com.enterprisepro.erp.dto.CurrencyConversionResultDto;
import com.enterprisepro.erp.dto.CurrencyDto;
import com.enterprisepro.erp.dto.ExchangeRateDto;

import java.math.BigDecimal;
import java.util.List;

public interface CurrencyService {

    List<CurrencyDto> getAllCurrencies();

    CurrencyDto createCurrency(CurrencyDto currencyDto);

    List<ExchangeRateDto> getAllExchangeRates();

    ExchangeRateDto setExchangeRate(ExchangeRateDto rateDto);

    CurrencyConversionResultDto convertCurrency(CurrencyConversionRequestDto request);

    BigDecimal getExchangeRate(String from, String to);
}
