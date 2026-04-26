package com.rentup.strategy;

import java.time.LocalDate;

public class SubscriptionContext {
    private SubscriptionStrategy strategy;

    public void setStrategy(SubscriptionStrategy strategy) {
        this.strategy = strategy;
    }

    public int getPropertiesLeft() {
        return strategy.getPropertiesLeft();
    }

    public LocalDate getEndDate(LocalDate startDate) {
        return strategy.getEndDate(startDate);
    }
}
