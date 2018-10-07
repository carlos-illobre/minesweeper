# Install

1. Install [nodeJs](https://nodejs.org/en/download/)
2. Clone the project: `git clone https://github.com/carlos-illobre/minesweeper.git`
3. Run: `npm install`
4. Run: `npm start`
5. Open a browser and go to: `http://localhost:8080`
6. To see the API documentation go to: `http://localhost:8080/rest/docs/`

# Commands

### npm start
Executes the application

### npm run nodemon
Executes the application with hot deploy

### npm test
Runs all the unit test using the test memory database


# How to create a new endpoint

To create a new endpoint you just need to create a new file into `minesweeper/app/rest` or in any subfolder.
If the file exports an express Router then the Router will be automatically injected into the express application:

```
// minesweeper/app/rest/v1/my/url/helloworld.js
const { Router } = require('express')

module.exports = Router({mergeParams: true})
.get('/v1/my/url', (req, res, next) => {
    res.send('Hello')
})

```

Now just save it and if the server was started with `npm run nodemon` then the endpoint will be there: http://localhost:8080/api/my/url
(The urls of all the automatic injected Routers will always start with `/api`).
The folder structure should be like the url path, so if the endpoint is `GET /v1/my/url/helloword` then the file should be in `minesweeper/app/rest/v1/my/url/helloworld.js`,


# Logger

Every endpoint will have a logger injected into the `req.logger` parameter:

```
// minesweeper/app/rest/v1/my/url/helloworld.js
const { Router } = require('express');

module.exports = Router({mergeParams: true})
.get('/v1/my/url', async (req, res, next) => {

    req.logger.info('hello');
    const user = await req.db.Uport.findOne({
        username: 'some username',
    });
    res.json(user.toJson());

});
```

The logger is an instance of [Winston](https://github.com/winstonjs/winston) so you can use `info`, `error`, `warn` and all the winston supported methods.


# How to create a test

To create a test you just need to create a new file into `minesweepe/app` or into `minesweeper/models` or into any sub folder. The filename extension must be `.test.js`:

```
const { expect } = require('chai')
const createTestApp = require(`${process.cwd()}/test/createTestApp.js`)

describe('GET /v1/users/{username}', () => {

    let testApp

    beforeEach(async function() {
        testApp = await createTestApp()
    })

    it('return 404 if the user does not exist', async () => {

        const username = 'some name'

        return testApp.get(`/rest/v1/users/${username}`)
        .expect(404, `User ${username} not found.`)

    })

})
```
then just run `npm test`.

The test file should be in the same folder as the file to be tested.

If you want to see the executed queries and the log info just add a `true` parameter to the `createTestApp` function:

```
const { expect } = require('chai')
const createTestApp = require(`${process.cwd()}/test/createTestApp.js`)

describe('GET /v1/users/{username}', () => {

    let testApp

    beforeEach(async function() {
        testApp = await createTestApp(true)
    })

    it('return 404 if the user does not exist', async () => {

        const username = 'some name'

        return testApp.get(`/rest/v1/users/${username}`)
        .expect(404, `User ${username} not found.`)

    })

})
```

# How to create the Swagger documentation:

Just create a file into the endpoint's folder with the extension `.swagger.yaml` like this:
```
/v1/users/{username}:
    get:                       
        tags:                  
            - user         
        summary: Get a user with all his preserved boards
        description: Get a user with all his preserved boards
        produces:              
            - application/json 
        parameters:
        -   name: username
            in: path
            required: true
            type: string
            example: some user
        responses:
            200:
                description: OK
                schema:
                    type: object
                    required:  
                        - username
                        - boards
                    properties:
                        username:
                            type: string
                        boards:                      
                            type: array        
                            items:                          
                                type: object
                                required:
                                    - started
                                    - time
                                    - cells
                                properties:                     
                                    started:                             
                                        type: string
                                        format: datetime
                                        example: 2018-09-29T20:42:54.684Z
                                    time:
                                        type: number
                                        example: 10
                                    cells:
                                        type: array
                                        items:
                                            type: object
                                            required:
                                                - display
                                            properties:
                                                display:
                                                    type: string
                                                    example: 'f'
            404:
                description: User not found
```
You should put an example value to each property.
The file must use the Swagger 2.0 format.


# Intance methods

When you want to avoid duplicate code between enpoints you can put it into an entity instance method like this:
```
const mongoose = require('mongoose')

const userSchema = module.exports = mongoose.Schema({
    username: String,
    boards: [{
        gameover: Boolean,
        started: Date,
        time: Number,
        cells: [
            [{
                display: String,
                mine: Boolean,
            }],
        ],
        preserved: Date,
    }],
})

userSchema.methods.toJson = function() {
    return {
        username: this.username,
        boards: this.boards.map((board, index) => this.boardToJson(index)),
    }
}

```
Now you can use that method from everywhere,


# Error handling

To handle the errors inside the endpoint just create an `Error` instance with the message an add to it a `status` property with the status code:

```
// minesweeper/app/rest/v1/my/url/helloworld.js
const { Router } = require('express');

module.exports = Router({mergeParams: true})
.get('/v1/my/url', async (req, res, next) => {
    try {
        const error = new Error('Some error message');
        error.status = 400;
        throw error;
    } catch(error) {
        next(error);
    }
})
```

If the error does not have a `status` then it will be a 500 error.

# Data validation
When you want to validate the endpoint request we use [Express Validation](https://github.com/AndrewKeig/express-validation) as middleware:

```
// minsweeper/app/rest/v1/users/{username}/boards/createBoard.js
const { Router } = require('express')
const validate = require('express-validation')
const Joi = require('joi')

module.exports = Router({mergeParams: true})
.post('/v1/users/:username/boards', validate({
    body: {
        rows: Joi.number().min(0).required(),
        columns: Joi.number().min(0).required(),
        mines: Joi.number().min(0).required(),
    },
}), async (req, res, next) => {
```
The schema uses [Joi](https://github.com/hapijs/joi) as framework.


# minesweeper-API
API test

We ask that you complete the following challenge to evaluate your development skills. Please use the programming language and framework discussed during your interview to accomplish the following task.

## The Game
Develop the classic game of [Minesweeper](https://en.wikipedia.org/wiki/Minesweeper_(video_game))

## Show your work

1.  Create a Public repository
2.  Commit each step of your process so we can follow your thought process.

## What to build
The following is a list of items (prioritized from most important to least important) we wish to see:
* Design and implement  a documented RESTful API for the game (think of a mobile app for your API)
* Implement an API client library for the API designed above. Ideally, in a different language, of your preference, to the one used for the API
* When a cell with no adjacent mines is revealed, all adjacent squares will be revealed (and repeat)
* Ability to 'flag' a cell with a question mark or red flag
* Detect when game is over
* Persistence
* Time tracking
* Ability to start a new game and preserve/resume the old ones
* Ability to select the game parameters: number of rows, columns, and mines
* Ability to support multiple users/accounts
 
## Deliverables we expect:
* URL where the game can be accessed and played (use any platform of your preference: heroku.com, aws.amazon.com, etc)
* Code in a public Github repo
* README file with the decisions taken and important notes

## Time Spent
You do not need to fully complete the challenge. We suggest not to spend more than 5 hours total, which can be done over the course of 2 days.  Please make commits as often as possible so we can see the time you spent and please do not make one commit.  We will evaluate the code and time spent.
 
What we want to see is how well you handle yourself given the time you spend on the problem, how you think, and how you prioritize when time is insufficient to solve everything.

Please email your solution as soon as you have completed the challenge or the time is up.

