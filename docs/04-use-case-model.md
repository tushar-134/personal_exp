# Experiment 4: UML Use Case Model

## Aim

To identify actors and system interactions for the Personal Expense Analyzer.

## Actors

- User
- Admin

## Use Case Diagram

```mermaid
flowchart LR
    User["User"]
    Admin["Admin"]

    UC1(("Register / Login"))
    UC2(("Add Expense"))
    UC3(("Add Income"))
    UC4(("Set Budget"))
    UC5(("View Reports"))
    UC6(("Analyze Spending"))
    UC7(("Manage Users"))
    UC8(("Monitor System"))

    User --> UC1
    User --> UC2
    User --> UC3
    User --> UC4
    User --> UC5
    User --> UC6

    Admin --> UC1
    Admin --> UC5
    Admin --> UC7
    Admin --> UC8
```

## Use Case Summary

### User

- Register or log into the system
- Add and manage expense entries
- Add and manage income records
- Set weekly or monthly budgets
- View reports and analyze spending trends

### Admin

- Log into the system
- Review reports and system health
- Manage users and roles
- Monitor usage activity
