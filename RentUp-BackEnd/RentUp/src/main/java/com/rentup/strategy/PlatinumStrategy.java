package com.rentup.strategy;

import java.time.LocalDate;

public class PlatinumStrategy implements SubscriptionStrategy {

    @Override
    public int getPropertiesLeft() {
        return Integer.MAX_VALUE;
    }

    @Override
    public LocalDate getEndDate(LocalDate startDate) {
        return startDate.plusMonths(1);
    }
}
