package com.rentup.strategy;

import java.time.LocalDate;

public class GoldStrategy implements SubscriptionStrategy {

    @Override
    public int getPropertiesLeft() {
        return 35;
    }

    @Override
    public LocalDate getEndDate(LocalDate startDate) {
        return startDate.plusMonths(1);
    }
}
