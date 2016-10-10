# CHANGELOG

## 2.0.0

- Diff on save
From 2.0.0 on, the default behaviour is to keep a copy of the entire object, and make a diff comparison on all the model keys to try to determine which keys have to be saved
If the object doesn't have an _id, the copy will be empty, allowing the entire object to be saved.

If you wish to disable this change, pass `{force: true}` as an option object to the save method

If you rewrote beforeSave methods, be careful and pass the optional `opts` object to the parents beforeSave method

- BREAKING CHANGES
    - Save behaviour
        If you wish to keep sending all your fields to the server each you save (which you shouldn't). Pass `{force: true}` as options in the `save` method.
    - re-population after save. 
        Until 2.0.0 when you wanted to repopulate an object after saving it (ie making another query), you had to pass it as the first argument of the save method. Now, it has to be given as an options object containing `{populate: whateverYouNeedToPopulate}`
