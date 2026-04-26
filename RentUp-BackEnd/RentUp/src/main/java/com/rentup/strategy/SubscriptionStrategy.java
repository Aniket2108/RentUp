package com.rentup.strategy;

import java.time.LocalDate;

public interface SubscriptionStrategy {
    int getPropertiesLeft();
    LocalDate getEndDate(LocalDate startDate);
}
