# CS5331 Assignment 1 Project: REST API Development

CS5331 Assignment 1 Project

## Team Members

1. Au-yong Xiang Rong Alwinson
2. Irvin Lim Wei Quan
3. Tan Ngee Joel Jonas
4. Teng Yong Hao

## Screenshots

![Home Page](./img/screen1.png)
![Login Page](./img/screen2.png)
![Diary Entries Page](./img/screen3.png)
![New Diary Entry Page](./img/screen4.png)

## Short Answer Questions

### Question 1: Briefly describe the web technology stack used in your implementation.

#### Frontend

* [_Vue.js_](https://vuejs.org): JavaScript view library for fast prototyping and performance
* [_SCSS_](https://sass-lang.com/): CSS preprocessor
* [_Webpack_](https://webpack.js.org/): Module bundler and development server for hot module reloading
* [_Babel_](https://babeljs.io/): JavaScript transpiler

#### REST API

* [_Express_](https://expressjs.com/): Web framework popular for REST APIs in Node.js
* [_MySQL_](https://www.mysql.com/): Database server

#### Development and deployment

* [_Docker_](https://www.docker.com/): Containerization platform for reproducible and quick builds

### Question 2: Are there any security considerations your team thought about?

Answer: We did not put a lot of security considerations in the project as it is out of the scope of the project, a security consideration we had was to salt the password hashes with the username to prevent rainbow table attacks.

### Question 3: Are there any improvements you would make to the API specification to improve the security of the web application?

Answer: Please replace this sentence with your answer.

### Question 4: Are there any additional features you would like to highlight?

#### Proxying of API server

Due to the Same-Origin policy, most modern browsers do not allow `XMLHttpRequest`s to be made across different origins (i.e. combination of protocol, domain and port number) unless Cross-Origin Resource Sharing (CORS) is explicitly allowed by the cross-origin server that is serving the remote resource.

The reason for this is to prevent unauthorised requests being made on behalf of an unsuspecting user to another website, which would then be able to either extract cookies/session data, or utilise these session data to perform actions on their behalf (e.g. banking sites).

The immediate implication for the frontend application, since it consumes a REST API via XHR, would be that the Same-Origin Policy would prevent API requests from being made, from `http://localhost:80` to `http://localhost:8080`.

The workaround would be to set up a proxy server running on port `80` that proxies any requests prefixed with `/api` to port `8080`, which does not violate the Same-Origin Policy. This was done using `webpack-dev-server`'s [`proxy` mechanism](https://webpack.js.org/configuration/dev-server/#devserver-proxy).

### Question 5: Is your web application vulnerable? If yes, how and why? If not, what measures did you take to secure it?

Answer: Yes, in multiple ways. Firstly our web application is using Http and not Https, meaning any passive sniffer on the same network will be able to view all of the transmission and thus our "secret" diaries are not so secret anymore as it is transferred in cleartext. Our application is also susceptible to session hijacking/user impersonation as our token is sent in cleartext, and eve and mallory can easily impersonate any user that is concurrently using the web application. Our passwords are stored in hash using SHA512 as recommended in the assignment and it is further salted with the user's username, however because we do not have length requirement for username, the salt can be ineffective as opposed to a longer salt and our next iteration of the project would be to use the user's unique uuidv4 as the salt. Likewise we do not have password complexity requirement, and user are highly susceptible to bruteforce attack, our next iteration would be to have a fair password complexity requirement. Most of our user inputs are not sanitised and could be susceptible to injection attacks, and because our front-end and back-end API are seperated, even with a sanitisation at the GUI front-end, a attacker will be able to attack the back-end API by bypassing the GUI filtering using tool like curl. Currently our mongo database is exposed on port 8081 without any password protection, this is to facilitate development and should not be exposed in a real web application.

### Feedback: Is there any other feedback you would like to give?

The REST API specification has a few oddities that are quite different from the standard REST API conventions:

* Error status codes should not be `2xx`, but the more traditional `4xx` or `5xx` codes
* Success status codes are arbitrarily assigned `200` or `201`
* Not all endpoints return the results in a `result` field
* Sending authentication token in `POST` body rather than either cookies or `Authorization` header
* Unable to specify the HTTP method in the endpoint to list all endpoints (`GET /`), resulting in duplicates between `GET` and `POST` endpoints at the same URL

Also, I would have liked to see Docker Compose being allowed in this assignment, since Docker containers are meant to be of a singular, atomic purpose. This allows each of the containers to start in parallel, especially if there are several long build steps within the container.

Finally, the marks weightage for the UI is rather low at 5%, compared to the REST API at 70%, when it takes up quite a fair amount of time regardless of the frontend stack being used.

## Declaration

### Please declare your individual contributions to the assignment:

1. Au-yong Xiang Rong Alwinson
    * Testing and Documentation
2. Irvin Lim Wei Quan
    * Set up `Dockerfile` and Bash scripts
    * Wrote the frontend app
    * Set up the basic structure for the API server
3. Tan Ngee Joel Jonas
4. Teng Yong Hao
