package com.enterprisepro.erp.service;

import com.enterprisepro.erp.dto.CurrencyConversionRequestDto;
import com.enterprisepro.erp.dto.CurrencyConversionResultDto;
import com.enterprisepro.erp.dto.CurrencyDto;
import com.enterprisepro.erp.dto.ExchangeRateDto;
import com.enterprisepro.erp.entity.Currency;
import com.enterprisepro.erp.entity.ExchangeRate;
import com.enterprisepro.erp.repository.CurrencyRepository;
import com.enterprisepro.erp.repository.ExchangeRateRepository;
import com.enterprisepro.erp.service.impl.CurrencyServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class CurrencyServiceTest {

    @Mock
    private CurrencyRepository currencyRepository;

    @Mock
    private ExchangeRateRepository exchangeRateRepository;

    @InjectMocks
    private CurrencyServiceImpl currencyService;

    @Test
    void testGetAllCurrencies() {
        Currency c1 = new Currency("USD", "US Dollar", "$", true, true);
        c1.setId(1L);
        Currency c2 = new Currency("EUR", "Euro", "€", false, true);
        c2.setId(2L);

        when(currencyRepository.findAll()).thenReturn(Arrays.asList(c1, c2));

        List<CurrencyDto> list = currencyService.getAllCurrencies();
        assertNotNull(list);
        assertEquals(2, list.size());
        assertEquals("USD", list.get(0).getCode());
    }

    @Test
    void testConvertCurrencyWithDirectRate() {
        ExchangeRate rate = new ExchangeRate("USD", "EUR", new BigDecimal("0.920000"), LocalDate.now(), "TEST");
        when(exchangeRateRepository.findFirstByFromCurrencyAndToCurrencyOrderByEffectiveDateDesc("USD", "EUR"))
                .thenReturn(Optional.of(rate));

        CurrencyConversionRequestDto req = new CurrencyConversionRequestDto("USD", "EUR", new BigDecimal("100.00"));
        CurrencyConversionResultDto res = currencyService.convertCurrency(req);

        assertNotNull(res);
        assertEquals("USD", res.getFromCurrency());
        assertEquals("EUR", res.getToCurrency());
        assertEquals(new BigDecimal("100.00"), res.getOriginalAmount());
        assertEquals(new BigDecimal("92.0000"), res.getConvertedAmount());
        assertEquals(new BigDecimal("0.920000"), res.getAppliedRate());
    }

    @Test
    void testConvertSameCurrency() {
        CurrencyConversionRequestDto req = new CurrencyConversionRequestDto("USD", "USD", new BigDecimal("250.00"));
        CurrencyConversionResultDto res = currencyService.convertCurrency(req);

        assertNotNull(res);
        assertEquals(new BigDecimal("250.0000"), res.getConvertedAmount());
        assertEquals(new BigDecimal("1.000000"), res.getAppliedRate());
    }

    @Test
    void testSetExchangeRate() {
        ExchangeRate savedRate = new ExchangeRate("USD", "GBP", new BigDecimal("0.785000"), LocalDate.now(), "MANUAL");
        savedRate.setId(5L);

        when(exchangeRateRepository.save(any(ExchangeRate.class))).thenReturn(savedRate);

        ExchangeRateDto input = new ExchangeRateDto(null, "USD", "GBP", new BigDecimal("0.785000"), LocalDate.now(), "MANUAL");
        ExchangeRateDto result = currencyService.setExchangeRate(input);

        assertNotNull(result);
        assertEquals("USD", result.getFromCurrency());
        assertEquals("GBP", result.getToCurrency());
        assertEquals(new BigDecimal("0.785000"), result.getRate());
    }
}
