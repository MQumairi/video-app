# Skeleton Node Project 

Template to use for Typescript based node project, employing PostGres and TypeORM for persistence.

To initialize project, run script.sh by passing node server port number and postgres database name as arguments:

`bash script.sh <Port> <Psql Database Name>`

For example, the following script will create a postgres database named "mydb", and run node server on port 3000:

`bash script.sh 3000 mydb`

To run server use:

`npm run dev`
