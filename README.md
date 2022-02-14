# Northcoders News API

To access the environment variables of this repo, you must create two .env files. One for the dev database (eg '.env.nc_news') and another for the test database (eg '.env.nc_news_test'). Then in each of these two files the the PGDATABASE must be set to the database it is referencing, in the dev file for example 'PGDATABASE=nc_news' and in the test file 'PGDATABASE=nc_news_test'. Then double check both these files are in .gitignore.
