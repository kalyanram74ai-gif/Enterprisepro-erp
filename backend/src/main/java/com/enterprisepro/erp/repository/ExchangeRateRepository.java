package com.enterprisepro.erp.repository;

import com.enterprisepro.erp.entity.ExchangeRate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ExchangeRateRepository extends JpaRepository<ExchangeRate, Long> {
    
    Optional<ExchangeRate> findFirstByFromCurrencyAndToCurrencyOrderByEffectiveDateDesc(String fromCurrency, String toCurrency);

    List<ExchangeRate> findByEffectiveDate(LocalDate date);
}
