React Hotkeys
==========

Hotkeys makes an web application feel modern and responsive, but the handling and implementation must be scalable. The idea is to create a system for handling UI hotkeys without making assumptions about how it will be implemented in a react application, meaning pure stand-alone and no complex dependencies.

The base idea is to make a hotkey system that is:
* efficient
* intuitive
* easy to add to an existing project

The result is a React Context based system with the possibility to easily create state-based hotkeys.

Common scenarios that this approach tries to cover:
* `Enter` to proceed
* `ESC` to close in a certain order
* Custom key binding dependent on router or state
* Adding, removing and moving around in a list

## Testing
Based on `create-react-app`. Clone the repository and run `yarn install && yarn start`.
