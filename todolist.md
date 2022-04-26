# Event sourcing application (RBAC)

## Customers

- New registration
- Login
- View attendance histories
- Should be able to view profile data
- Should be able to edit any profile data
- Open new attendance request
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

## Node.js todolist

- Graceful shutdown
- Errors handle
- Node.js streams for files upload
- Install pino logger
