# nodejs_authentication
This is a template for NodeJs applications, it contains local login and google, facebook and github OAuth. All the users are being stored in a MongoDB.

## Getting Started

make sure you have a MongoDB running on port 27017

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

Before everything works you need to create the files or env Variables that contain the sensitive data, which allowes to use OAuth. 
1) Create a new folder and name it conf
2) Create a file and name it index.js
3) Copy this template and fill it with your own data

```
if (process.env.NODE_ENV === 'test') {
  module.exports = {
    JWT_SECRET: '',
    oauth: {
      google: {
        clientID: 'number',
        clientSecret: 'string',
      },
      facebook: {
        clientID: 'number',
        clientSecret: 'string',
      },
      github: {
        clientID: 'number',
        clientSecret: 'string',
      }
    }
  };
} else {
  module.exports = {
    JWT_SECRET: '',
    oauth: {
      google: {
        clientID: '',
        clientSecret: '',
      },
      facebook: {
        clientID: '',
        clientSecret: '',
      },
      github: {
        clientID: '',
        clientSecret: '',
      }
    }
  };
}
```


## Built With

* [NodeJs](https://nodejs.org/en/) - Backend
* [MongoDB](https://www.mongodb.com/) - Database

## Authors

* **Silvan Knecht** - *Initial work* - [Silvan Knecht](https://github.com/silvanknecht)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

Since I was new to the authentication topic I could find most of the Information needed in this Tutorial [CodeWorker](https://www.youtube.com/watch?v=zx6jnaLuB9Q&list=PLSpJkDDmpFZ7GowbJE-mvX09zY9zfYatI)

