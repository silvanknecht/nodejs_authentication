# nodejs_authentication
This is a template for NodeJs applications, it contains local login and google, facebook and github OAuth. All the users are being stored in a MongoDB.

## Getting Started

make sure you have a MongoDB running on port 27017 and make sure to follow the instructions in Prerequisites.

Inside of the server folder:
Install all the necessary node packages
```
npm install
```
start server
```
node app.js
```


### Prerequisites

Before everything works you need to set the enviroment variables definded in the /server/config/customenvironment-variables.json file.

## Tests
to run the thests use 
```
npm test
```
The tests do not include the thirdPartyOAuth yet. I'm looking on possibilites to implement them!

## Documentation

You can find a postman collection in the respository or online --> [Collection](https://documenter.getpostman.com/view/6959951/S17nUqF1#53f482c6-224d-4a09-b2cf-676736c98ebd)

## Built With

* [NodeJs](https://nodejs.org/en/) - Backend
* [MongoDB](https://www.mongodb.com/) - Database

## Authors

* **Silvan Knecht** - *Initial work* - [Silvan Knecht](https://github.com/silvanknecht)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

Since I was new to the authentication topic I could find most of the Information needed in this Tutorial [CodeWorker](https://www.youtube.com/watch?v=zx6jnaLuB9Q&list=PLSpJkDDmpFZ7GowbJE-mvX09zY9zfYatI)

