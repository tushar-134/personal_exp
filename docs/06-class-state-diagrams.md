# Experiment 6: Class and State Diagrams

## Class Diagram

```mermaid
classDiagram
    class User {
      +String name
      +String email
      +String password
      +String role
      +register()
      +login()
    }

    class Expense {
      +Number amount
      +String category
      +Date date
      +String description
      +addExpense()
      +deleteExpense()
    }

    class Income {
      +Number amount
      +String source
      +Date date
      +String description
      +addIncome()
    }

    class Budget {
      +Number amount
      +String category
      +String period
      +setBudget()
      +checkLimit()
    }

    class Report {
      +Number totalExpense
      +Number totalIncome
      +Object categoryData
      +generateReport()
    }

    class Notification {
      +String title
      +String message
      +String type
      +Boolean isRead
      +createAlert()
    }

    class Admin {
      +manageUsers()
      +monitorSystem()
    }

    User "1" --> "*" Expense : owns
    User "1" --> "*" Income : owns
    User "1" --> "*" Budget : sets
    User "1" --> "*" Notification : receives
    Report ..> Expense : aggregates
    Report ..> Income : aggregates
    Report ..> Budget : checks
    Admin --|> User
```

## State Diagram: Expense Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Draft
    Draft --> Validated: submit details
    Validated --> Saved: store in database
    Saved --> BudgetChecked: compare with budget
    BudgetChecked --> NotificationRaised: limit exceeded or unusual spend
    BudgetChecked --> Archived: within limit
    NotificationRaised --> Archived
    Archived --> [*]
```

## Result

The class diagram defines the structure of the system entities, while the state diagram shows how an expense record moves through validation, storage, budget checking, and alert generation.
