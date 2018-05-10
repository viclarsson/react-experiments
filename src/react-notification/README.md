React Notifications
==========

The base idea is to make a notification system that is:
* efficient
* intuitive
* easy to add to an existing project

The result is a React Context based system with the possibility to easily create notifications to containers,
and easily display them in the UI. The system can easily be hooked up to Redux by adding the store as a prop
and use the following actions:
  - `@@notification/REGISTER`
  - `@@notification/REMOVE`

*The API is used the exact same way for when using Redux.*

Common scenarios that this approach tries to cover:
* notifications that are informative and are removed automatically
* dismissable notifications
* custom notification content
* unrestricted design choices and placements

## Testing
Based on `create-react-app`. Clone the repository and run `yarn install && yarn start`.
