# JournalTrawler

Journal Trawler is designed to textmine metadata from various journals. It utilised CROSSREF, DOAJ and other APIS to do this.
This express application utilises good manners when using these services. 
It creates an elasticsearch database containing all information mined from these services. 
it is built in Typescript, with ES6. 

# Configuration

Example configuration located in .env.example
To send backups of the database to your gmail you will have to set up an application password for this account - see https://support.google.com/accounts/answer/185833?hl=en
To enable authentication you will require to set up an auth0 Account.
# Required Services

MongoDB, ElasticSearch and Redis services are needed in order to run. Example set ups are contained in /docker. To run please run

`cd /docker && sudo docker-compose up -d`

# API documentation

