# The labels are associated with date

* Status: Approved

## Context and Problem Statement

We were uncertain about whether to use local storage or a database in the cloud to store the journal entries. Whichever option is chosen, it should be easy enough to implement and not hurt the user experience.

## Considered Options

* Local Storage
* Database Stored in the Cloud

## Decision Outcome

Chosen Option: Local Storage, because

- Easier to implement
- Easier to create, read, update and delete journal entries
- Easier to implement the current labeling system
- Better security as private information cannot be accessed due to data breaches in the cloud 