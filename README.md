# Frontend

## Running the Frontend

In the proeject directory first install the packages if you never installed them:

```
npm i 
```

Next to run the local server, run:

```
npm run dev
```

# Backend

## Running the Backend

In the backend folder, install all the dependacies with:
```
pip install -r requirements/dev.txt
```

Run the application with:

```
flask run --with-threads
```

Shell
-----

To open the interactive shell, run ::

    flask shell

By default, you will have access to the flask ``app`` and models.


Running Tests
-------------

To run all tests, run ::

    flask test


Migrations
----------

Whenever a database migration needs to be made. Run the following commands ::

    flask db migrate

This will generate a new migration script. Then run ::

    flask db upgrade

To apply the migration.

For a full migration command reference, run ``flask db --help``.
