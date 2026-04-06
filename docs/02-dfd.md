# Experiment 2: Data Flow Diagram

## Aim

To represent how data moves through the Personal Expense Analyzer system.

## Level 0 DFD

```mermaid
flowchart LR
    U["User"] -->|"Register, login, add expense, add income, set budget, request report"| S["Personal Expense Analyzer System"]
    A["Admin"] -->|"Manage users, monitor system"| S
    S -->|"Dashboard, reports, alerts"| U
    S -->|"User lists, system overview"| A
```

## Explanation

At Level 0, the entire application is shown as a single process. Users provide financial data and request reports, while the system responds with analytics, reports, and notifications. Administrators interact with the same system for monitoring and control.

## Level 1 DFD

```mermaid
flowchart TD
    U["User"] --> UM["1.0 User Management"]
    U --> EM["2.0 Expense Management"]
    U --> IM["3.0 Income Management"]
    U --> BM["4.0 Budget Management"]
    U --> RM["5.0 Report Generation"]
    A["Admin"] --> AM["6.0 Admin Management"]

    UM --> UD[("User Store")]
    EM --> ED[("Expense Store")]
    IM --> ID[("Income Store")]
    BM --> BD[("Budget Store")]
    RM --> RD[("Report Engine")]
    RM --> ND[("Notification Store")]
    AM --> UD
    AM --> ND
    ED --> RD
    ID --> RD
    BD --> RD
    RD --> U
    RD --> A
```

## Explanation

The Level 1 DFD splits the system into the main processing modules. User registration and login flow through user management, financial entries are stored through expense and income modules, budgets are tracked independently, and reports combine stored data to create analysis and notifications.
