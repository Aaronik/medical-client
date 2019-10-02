Core UX for the Milli Doctor Dashboard.

https://millihealth.atlassian.net/jira/software/projects/MDD/boards/8


Folder organization follows the general react layout with a few customizations
for the millimed application domain.

### Do we want to have a component folder in each area?

  - __src__
    - __common__
      - __assets__
    - __dashboard__
      - __assets__
    - __survey__
      - __PHI__
      - __PII__
      - __assets__
    - __timeline__
      - __assets__



### Creating dev env
1. git clone https://github.com/MilliHealth/millimed.git millimed
2. cd millimed
3. npm install


### Action type naming conventions:
Consider the following flow:
* Something happens in a view. This is phrased in past tense, like "A user clicked the button."
* That view calls an appropriate action, which is not coupled to the view knowledge, e.g. "updateTheThing".
 Note that "updateTheThing" has nothing to do with the button.
* That action performs some calculations or async fetches or whatever, and then emits a dispatch event.
 The event type has to do with what the action did. If the action generated a thing, the type would be
 THING_GENERATED. The action has no knowledge of the store and what the store will do with the data,
 so it would never be something imperative like SAVE_NEW_THING. The action doesn't know the store
 needs to "save" something.

