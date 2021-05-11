# Using what data structures for better search performance of labels

* Status: deferred

## Context and Problem Statement

We want our label search to be quick so that user can efficiently find the associated dates with labels, but how should we select data structures became a problem.


## Considered Options

* Using ternary search tree to search for labels.
* Use HashMaps to create <date, labels> and <label, dates> mapping.

## Decision Outcome

Decision to be made at a later point in time. We have identified this as an additional feature to be implemented only after the main functionalities are completed as it can be both time-consuming and error prone.

## Pros and Cons of the Options

###  Using ternary search tree to search for labels.

* Good, because it is quick O(nlogn) and doesn't require much space.
* Bad, because it may not be that useful since usually the number of labels wouldn't be too much. And each label's word may not be too long. Thus, this datastructure may be overcomplicated.

### Use HashMaps to create <date, labels> and <label, dates> mapping.

* Good, because thereotically Hashtables have O(1) search, insert, and delete time. So it is very fast.
* Good, because mapping date and labels together would increase the codes' readability.
* Bad, because we cannot always trust users, and they can mess up our app's overall performance by creating tons of trush labels.

