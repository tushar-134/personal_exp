# Experiment 3: Structured Design

## Aim

To convert the DFD into a hierarchical module design for implementation.

## Module Hierarchy

```mermaid
flowchart TD
    SYS["Personal Expense Analyzer"] --> UI["Frontend UI Layer"]
    SYS --> API["Backend API Layer"]
    SYS --> DB["MongoDB Data Layer"]

    UI --> AUTHUI["Auth Module"]
    UI --> DASHUI["Dashboard Module"]
    UI --> EXPUI["Expense Module"]
    UI --> INCUI["Income Module"]
    UI --> BUDUI["Budget Module"]
    UI --> REPUI["Report Module"]
    UI --> ADMUI["Admin Module"]

    API --> AUTHAPI["Auth API"]
    API --> EXPAPI["Expense API"]
    API --> INCAPI["Income API"]
    API --> BUDAPI["Budget API"]
    API --> REPAPI["Report API"]
    API --> NOTIAPI["Notification API"]
    API --> ADMAPI["Admin API"]

    DB --> USERS[("Users")]
    DB --> EXPENSES[("Expenses")]
    DB --> INCOMES[("Income Records")]
    DB --> BUDGETS[("Budgets")]
    DB --> NOTIFICATIONS[("Notifications")]
```

## Module Description

- User Module: Handles registration, login, and session validation
- Expense Module: Stores, updates, and deletes expense records
- Income Module: Stores and manages income records
- Budget Module: Saves weekly and monthly limits and checks spending
- Report Module: Generates summaries, trends, and category analysis
- Notification Module: Sends alerts for budget limits and unusual activity
- Admin Module: Manages user roles and system-wide monitoring
- Database Module: Persists all core records in MongoDB

## Result

The project is structured into clear frontend, backend, and database layers with dedicated modules for each core responsibility.
