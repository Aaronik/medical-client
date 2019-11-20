Client for the Milli Health Web App

https://millihealth.atlassian.net/jira/software/projects/MDD/boards/8


### Install
1. `git clone https://github.com/MilliHealth/millimed.git millimed`
2. `cd millimed`
3. `npm install`

### Run
1. `npm start`
2. nav to localhost:3000

### Dev
1. `npm start`
2. nav to localhost:3000
3. Any changes will be detected and reload the page automatically

### File Structure

We're breaking things down generally into 4 categories

1. Pages    -- These gernerally consist of components and styles. They represent
               a full page you see on the screen, sans any things that live across
               all pages like the navbar and gutter nav.

2. Applets  -- These are in depth views that that have reducers and actions
               as well as components and styles. They're "sub-views", not a whole
               page in and of themselves, but a smaller, self contained view unit
               that can be used in different pages.

3. Concerns -- These have only actions and reducers. They represent a logical concern
               of the application, but one that doesn't have any views itself.

4. Common   -- Here are utilities, small, reusable components with no store state,
               and global, reusable styles. Also other common things like the store
               and action keys.

#### Action type naming conventions:
Consider the following flow:
* Something happens in a view. This is phrased in past tense, like "A user clicked the button."
* That view calls an appropriate action, which is not coupled to the view knowledge, e.g. "updateTheThing".
 Note that "updateTheThing" has nothing to do with the button.
* That action performs some calculations or async fetches or whatever, and then emits a dispatch event.
 The event type has to do with what the action did. If the action generated a thing, the type would be
 THING_GENERATED. The action has no knowledge of the store and what the store will do with the data,
 so it would never be something imperative like SAVE_NEW_THING. The action doesn't know the store
 needs to "save" something.

