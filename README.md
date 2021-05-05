# Restaurant API

This api has been developed on top of 
#### Pre-requisites for running this api [Sails v1](https://sailsjs.com) framework using [MySQL](https://www.mysql.com/) as a database.

+ [Working copy docker on your system](https://docs.docker.com/engine/install/)
+ A little bit of patience :grimacing:

# Steps to run this repo
+ Ensure no other application is running on port `1337`. This following commands can be used to list and kill processes running on port 1337
```bash
kill -9 $(lsof -t -i:8080)
```
+ Clone this repo
+ Open your favourite terminal and navigate to the folder where above repo is cloned. Make sure you're at the root of the above project.
+ Run the following commands to build the docker images for the DB and Web Server. And then finally, start the server to accept traffic

```bash
docker-compose build --no-cache
docker-compose up
```
---

For api documentation for the API's this project exposes, you can [visit here](https://documenter.getpostman.com/view/15550740/TzRPi95Z).

To try this out on your machine, the collection can be imported in [Postman](https://postman.com) from the file `Food App.postman_collection.json`

---

### Testing and generating test report

+ Unit tests can be run by executing the following command.
```bash
npm run unit
```
The coverage report will be printed out in the terminal. This coverage is also appended to *.coverage* folder. This can be viewed as a HTML file in browser for detailed line by line coverage by opening **.coverage/lcov-report/index.html** in a browser.

### Helpful Links

+ [Sails framework documentation](https://sailsjs.com/documentation)
+ [MySQL documentation](https://dev.mysql.com/doc/)