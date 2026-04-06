# Experiment 5: UML Behavioral Diagrams

## Use Case: Add Expense

- Precondition: User is logged in
- Flow: User enters expense details, system validates input, expense is stored, budget is checked
- Post-condition: Expense is saved and notifications may be generated

## Activity Diagram: Add Expense

```mermaid
flowchart TD
    A["Start"] --> B["User logs in"]
    B --> C["Enter expense details"]
    C --> D["Validate data"]
    D --> E["Save expense to database"]
    E --> F["Check matching budgets"]
    F --> G["Generate notification if needed"]
    G --> H["End"]
```

## Activity Diagram: Budget Check

```mermaid
flowchart TD
    A["Start"] --> B["Expense recorded"]
    B --> C["Find active budget"]
    C --> D{"Limit exceeded?"}
    D -- "Yes" --> E["Create budget alert"]
    D -- "No" --> F["Continue normally"]
    E --> G["End"]
    F --> G
```

## Activity Diagram: Generate Report

```mermaid
flowchart TD
    A["Start"] --> B["Fetch expense and income data"]
    B --> C["Aggregate totals"]
    C --> D["Analyze categories and trends"]
    D --> E["Generate charts and insights"]
    E --> F["Display report"]
    F --> G["End"]
```

## Sequence Diagram: Add Expense

```mermaid
sequenceDiagram
    actor User
    participant UI as React UI
    participant API as Express API
    participant DB as MongoDB

    User->>UI: Enter expense details
    UI->>API: POST /api/expenses
    API->>DB: Save expense
    DB-->>API: Expense stored
    API->>DB: Check budgets and recent expenses
    DB-->>API: Budget and history data
    API-->>UI: Expense created + alerts if any
    UI-->>User: Updated ledger and dashboard
```

## Sequence Diagram: View Report

```mermaid
sequenceDiagram
    actor User
    participant UI as React UI
    participant API as Express API
    participant DB as MongoDB

    User->>UI: Request monthly report
    UI->>API: GET /api/reports/dashboard
    API->>DB: Aggregate income, expenses, budgets
    DB-->>API: Financial data
    API-->>UI: Summary, charts, insights
    UI-->>User: Render report view
```

## Collaboration Diagram

```mermaid
flowchart LR
    U["User"] --> EXP["Expense Module"]
    U --> INC["Income Module"]
    U --> BUD["Budget Module"]
    U --> REP["Report Module"]
    EXP --> DB[("MongoDB")]
    INC --> DB
    BUD --> DB
    REP --> DB
    EXP --> NOTI["Notification Logic"]
    BUD --> NOTI
    NOTI --> U
```
