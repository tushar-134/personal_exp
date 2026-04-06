# Experiment 1: System Requirements

## Problem Statement

The Personal Expense Analyzer helps individuals record, manage, and analyze daily expenses and income. It supports budget tracking, financial reporting, and administrative monitoring.

## User Characteristics

### User

- Registers and logs into the system
- Adds, edits, and deletes expenses
- Adds and manages income records
- Sets weekly or monthly budgets
- Reviews dashboard insights and reports

### Administrator

- Manages user accounts
- Monitors system-wide activity
- Reviews high-level statistics and platform usage

## Functional Requirements

- Secure registration and login using email and password
- Expense management with category, amount, date, description, and payment method
- Income management with source, amount, date, and description
- Budget management for weekly and monthly limits
- Report generation with summaries, charts, and spending analysis
- Notification support for budget overruns and unusual spending
- Admin controls for user management and monitoring

## Non-Functional Requirements

- Privacy: User financial records are protected with authentication and password hashing
- Portability: The application runs as a modern web app with a Node.js backend
- Usability: Interface is simple, responsive, and focused on quick data entry
- Performance: Dashboard and reports respond quickly using MongoDB aggregation

## Data Dictionary

- `UserID`: Unique identifier for a registered user
- `ExpenseID`: Unique identifier for an expense entry
- `IncomeID`: Unique identifier for an income entry
- `BudgetID`: Unique identifier for a budget record
- `Amount`: Monetary value stored as a number
- `Category`: Expense grouping such as Food, Rent, or Travel
- `Report`: Generated monthly financial summary
