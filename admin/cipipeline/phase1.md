# Phase 1 CI Pipeline

### Phase 1 CI Diagram

![CI Phase 1 Diagram](./phase1.drawio.png?raw=true "Title")

### Linting and Code Style Enforcement

Linting and Code Style Enforcement is handled by ESLint and Prettier. All of the group members from Group 34 have set up ESLint and Prettier locally in VSCode and have a consistent style (using the Airbnb Style Guide) enforced in it. Once a developer stores their code, ESLint and Prettier will automatically fix everything that is auto-fixable and provides a report for everything that requires a manual review. After that, we will push the code to the local dev branch.

### Documentation Generation via Automation

Documentation is automatically generated using JSDoc after the code is pushed to the dev branch. We have configured JSDoc to generated documents as a Github Action.

### Code Quality via Tool

### Code Quality via Human Review

### Unit Tests via Automation



### Phase 2 Plans