# Finding Falcone

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.0.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Building code to deploy to static file server
Run `ng build` to build files for production. 

## Running unit tests

Run `ng test` to execute the unit


# Notes

## Programming languages
* Typescript
* Stylus for stylesheets
* PugJS for templating


## Application architecture

The webapp has 3 main component.

* **Console** - Main part of the site where 4 destination selector are located
* **Destination selector** - Includes ability to add or modify planet/vehicle
* **Result View** - Shows success/fail state
* Other components include navigation header and footer

The webapp has 2 services

* **Webservices** - A small wrapper on top of HttpClient for easier API handling.
* **StateManagerService** - A tiny service to hold program data and uses observable to notify subscribers of state changes.

## Technical

* The project was written using Angular 8.
* No additional JS library or CSS frameworks are used.
* Third party state management libraries aren't used for this demo.
* A simple custom state management service was created for the project.
* Unit tests aren't complete due to time restriction. There are 28 unit tests in total but not all parts of code is tested at the moment.
* The UI is mobile responsive


## Assumptions
* Total time calculation are done imagining all vehicles take off at the same time. Hence, total time isn't the addition of individual vehicle's time.
* JSON with negative vehicle speed is treated as positive speed.
* Some invalid json responses such as negative number of available vehicles are normalised to show 0.


## Unit test image
![Unit test image] (screenshot.png)