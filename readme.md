# Event sourcing application (RBAC)

## Customers

- New registration
- Login
- Should be able to view profile data
- Should be able to edit any profile data
- Open new attendance request
- View attendance histories
- Chat in real time with an attendant
- Submit attendance feedback

## Attendants

- Only admin can create new attendants
- Login
- View pending attendances requests
- Init a attendance
- Chat in real time
- Close attendance
- Should have a rating based on customers feedbacks

## Administrators

- Should be able to create a new attendant
- Should be able to delete a attendant

## Attendances

- Should have a number protocol identifier
- Should have messages
- Real time emit message event
- Real time receive message event
- Should have init and close datetime informations
- On close, should send attendance messages history to customer by email

## Node.js pending todolist

- Graceful shutdown
- Errors handle
- Node.js streams for files upload
- Implement pino logger
- Implement database
- Implement review and rating of attendants  

## Steps to run

```
docker-compose down && docker-compose build --no-cache && docker-compose up
(you should add the flag -d to free your terminal)
```
