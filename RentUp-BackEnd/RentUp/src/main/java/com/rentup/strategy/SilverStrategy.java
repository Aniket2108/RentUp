package com.rentup.strategy;

import java.time.LocalDate;

public class SilverStrategy implements SubscriptionStrategy {

    @Override
    public int getPropertiesLeft() {
        return 15;
    }

    @Override
    public LocalDate getEndDate(LocalDate startDate) {
        return startDate.plusMonths(1);
    }
}
