# Periodic Tables
## Restaurant Reservation System

> Link to live app: https://periodic-tables-frontend-g5bb766k5-keithfrazier98.vercel.app/

### Overview

**Periodic Tables** is designed to help restaurants manage reservations and tables and keep track of customer data on an easy-to-use platform. Users can create and edit reservations, create tables, assign reservations to tables, and search for reservations by a customer's phone number. This basic functionality alleviates a restaurant's need to keep paper documentation of reservations and table availability, by automating these processes. This ensures better management of reservations and keeps a digital record of all information so nothing is lost or forgotten.  

### API Docs

### /Dashboard (/)
The main url will always redirect to the dahsboard which will default to displaying the tables and the current date's as reservations. 
![dashboard](./app-screenshots/Dashboard.png)

<hr>

### /reservations/new
Clicking new reservation in the menu on the left or top of the screen will navigate you to the new reservation page where you can create a new reservation and post to the dashboard. 

![new-reservation](./app-screenshots/NewReservation.png)

Upon submitting a reservation the dashboard will display the reservations for the date of reservation last created. Reservations have a status that defaults to "booked" which allows the user to edit, seat, or cancel a reservation.

<hr>

### reservations/:reservation_id/edit
Clicking the 'edit' button on a reservation will navigate to the edit route which will load the reservations information into a reservation form where it can be edited, saved, or cancelled. 

![edit](./app-screenshots/EditReservation.png)

<hr>

### reservations/:reservation_id/seat
Clicking the seat button on a reservation will navigate to the seat route which will allow the user to select a table from the available tables, and prevents the user from seating a reservation at a table that is too small for the reservations party size. 

![seat](./app-screenshots/seat.png)

Upon submitting, the user will return to the previous page to see the dashboard has been updated, showing the reservation with status "seated" and the selected table with status "occupied". The table will also now have a "Finish" button on it. 

![seated](./app-screenshots/seated.png)

When a reservation has finished, the user can select the "Finish" button on the table to change the status of the table to "free" and the status of the reservation to "finished". Finished reservations are hidden from the dashboard but can be accessed through th search bar. 


<hr>

### tables/new

Clicking the "New Table" button in the menu will navigate the user to the new table screen where they can create a new table. 
![table](./app-screenshots/NewTable.png)

### reservations/search

Clicking the "search" option from the menu will navigate the user to the search screen where they can enter a phone number and search the entire database for that number. 

![search](./app-screenshots/Search.png)


### Backend main stack
- Express
- Knex 
- postgreSQL
- Node.js
-  Heroku

### Frontend main stack
- React 
- HTML
- CSS
- JS
- Node.js
- Heroku


