# Using what data structures for better search performance of labels

* Status: proposed <!-- optional -->

## Context and Problem Statement

We want our label search to be quick so that user can efficiently find the associated dates with labels, but how should we select datastructures became a problem.


## Considered Options

* Using ternary search tree to search for labels.
* Use HashMaps to create <date, labels> and <label, dates> mapping.
* … <!-- numbers of options can vary -->

## Decision Outcome

TBD

## Pros and Cons of the Options <!-- optional -->

###  Using ternary search tree to search for labels.

* Good, because it is quick O(nlogn) and doesn't require much space.
* Bad, because it may not be that useful since usually the number of labels wouldn't be too much. And each label's word may not be too long. Thus, this datastructure may be overcomplicated.
* … <!-- numbers of pros and cons can vary -->

### Use HashMaps to create <date, labels> and <label, dates> mapping.

* Good, because thereotically Hashtables have O(1) search, insert, and delete time. So it is very fast.
* Good, because mapping date and labels together would increase the codes' readability.
* Bad, because we cannot always trust users, and they can mess up our app's overall performance by creating tons of trush labels.
* … <!-- numbers of pros and cons can vary -->

