# Spotify User Recent Tracks

Spotify User Recent Tracks is a web application that allows the user to see a list of his recently played tracks.

![alt text](/src/assets/avatars/listen-1.jpg)

![alt text](/src/assets/avatars/listen-2.jpg)
## Tech stack and libraries

- [React](https://pt-br.reactjs.org/)
- [Bootstrap5](https://getbootstrap.com/docs/5.0/getting-started/introduction/)
- [SASS](https://sass-lang.com/)

## Core features: 
- The user should login with his Spotify credentials;
- The user should see a list of a User's Recently Played Tracks;
- The user should mark a track has seen and be able to reorder the list;
- The user should be able to search for tracks by inserting keys on a text field;

## Authorization flow - How to run the project:

### Development mode:

As the project itself is configured for development purposes, it hasn't been turned public the access for everyone.
If the authentication, anytime, needs to be public, for everyone that comes and use this project, please take a look at the extended quota mode topic below.

If needed to authenticate any new e-mail for testing login purposes, please log in at our dummy test user at this test user:

```
- habittestuser01@gmail.com
- user01habit
```

And manually add the permission (the e-mail that you will try to login the application),
following the [instructions of Spotify's authorization topic](https://developer.spotify.com/documentation/general/guides/authorization/app-settings/).

# Extended quota mode

If your app is meant to be used by many or any Spotify users at the same time then you should apply for extended quota mode.
Apps in this mode have a rate limit that is much higher than apps in development mode, the default mode for new apps. 
You can apply for a quota extension by opening your app detail page in the Developer Dashboard and tapping on the Request Extension link.

To extend the quota mode, please follow the instructions of https://developer.spotify.com/documentation/general/guides/authorization/app-settings/

# Initial steps:
 `yarn install`

 `yarn start`


# Author

### Daniel Chaves

