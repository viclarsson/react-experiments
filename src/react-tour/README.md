React Tour
==========

Tours should be easy to scale as it is usually from a UX or design perspective where A/B testing is common.

The base idea is to make a hotkey system that is:
* efficient
* intuitive
* easy to add to an existing project

The result is a React Context based system with the possibility to easily create tours. The system can easily be hooked up to Redux by adding the store as a prop and use the following actions:
  - `@@tour/START`
  - `@@tour/NEXT`
  - `@@tour/PREVIOUS`
  - `@@tour/SKIP`
  - `@@tour/DONE`

## Testing
Based on `create-react-app`. Clone the repository and run `yarn install && yarn start`.
