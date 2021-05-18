# Phase 1 CI Pipeline

## Phase 1 CI Diagram

![CI Phase 1 Diagram](./phase1.png?raw=true "Title")

## Linting and Code Style Enforcement

Linting and Code Style Enforcement is handled by ESLint and Prettier. All of the group members from Group 34 have set up ESLint and Prettier locally in VSCode and have a consistent style (using the Airbnb Style Guide) enforced in it. Once a developer stores their code, ESLint and Prettier will automatically fix everything that is auto-fixable and provides a report for everything that requires a manual review.

## Documentation Generation via Automation

Documentation is automatically generated using JSDoc after the code is pushed to the dev branch. We have configured JSDoc locally through VSCode to generate documents automatically. We are trying to generate the documents as a Github Action, but thus far, we have not been able to successfully complete this task. We will try to do it before Phase 2. For now, we push the code to the dev branch after the documents are generated.

## Unit Tests via Automation

Jest is used for making Unit Tests that will be run as a Github Action. When code is pushed to the dev branch, these unit tests are run. Once these unit tests are run successfully, we proceed to check Code Quality via Tool. 

## Code Quality via Tool

We are using Codacy to check Code Quality and Complexity. The repo is set to be checked by Codacy completely. If we find anything that is required to be fixed, local changes are made and this starts the cycle again.

## Code Quality via Human Review

Once all the above steps are done and passed successfully, another teammate who had not worked on this specific branch is manually called upon to review the code in this branch. Since private repos in organizations cannot have branch protection, we have communicated within ourselves to enforce this rule before a branch can be merged to the main branch. Once the groupmate has completed their review, the code is ready to be merged to the main branch.



## Phase 2 Plans

- Firstly, we have to implement JSDocs through Github Actions. It is not working correctly as of right now. The build is complete, but, the documentation is not available anywhere in the repo. This needs to be fixed in Phase 2.

- Secondly, we have to write more unit tests to cover most of the code being written. We expect this to take a considerable amount of time and hence deferred it to Phase 2.

- Thirdly, we are intending to write integration tests for our project. We are hoping for time to permit us to complete this task.