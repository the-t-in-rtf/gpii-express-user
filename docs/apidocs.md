# User Management API

This system provides a handful of API functions to allow you to work with local user accounts, groups, and memberships.

## /api/user

The following API endpoints are used to manage user information, and to sign in to the system.

### `GET /api/user/`

Returns the documentation for this page (what you're seeing now).

### `GET /api/user/current`

Returns details about the current user if they are logged in, as in:

```json
  {
    "user": {
      "username": "sample",
      "email": "sample@acme.com"
    }
  }
```

Returns an error message if the user is not currently logged in, as in:

```json
{
    "isError": true,
    "message": "You are not currently logged in."
  }
```

### `POST /api/user/login`

Log a user in. Requires both a `username` and `password`, as in:

```json
  {
    "username": "sample",
    "password": "secret"
  }
```

Returns a confirmation message indicating whether the login was successful, as in:

```json
  {
    "message": "You are now logged in."
  }
```

Note that only users with verified email addresses are allowed to log in.  For details, see `GET /api/user/verify/:code`
below.

### `GET /api/user/logout`

Immediately logs the current user out and returns a confirmation message, as in:

```json
  {
    "message": "You are now logged out."
  }
```

### `POST /api/user`

Create a new user.   Anyone can create a user, but the account cannot be used until the email address is verified (see
`GET /api/verify/:code`).

Requires a `username`, valid `password`, and a `confirm` field with the same password.  Optionally accepts arbitrary
`profile` data.  Here is an example:

```json
  {
    "username": "sample",
    "email": "sample@acme.com",
    "password": "secret",
    "confirm": "secret"
  }
```

Returns a confirmation message indicating whether the response was successful, as in:

```json
  {
    "isError": true,
    "message": "A user with this email address already exists."
  }
```

### `GET /api/user/verify/:code`

When a new account is created, an email is sent to the address associated with the account.  The email contains a link
to this API and includes a single-use `:code` used only for this user.

Visiting this link confirms that the user has supplied a valid email address and that the recipient wishes to use their
account.  A successful response should look something like:

```json
  {
    "message": "Your email address has been verified and you can now use your account to log in."
  }
```

### `POST /api/user/verify/resend/:email`

If a user loses their initial verification email, they can ask for it to be sent again by supplying the `email` address
they used when signing up, as in:

```json
  {
    "email": "valid.email@legit.company.com"
  }
```

Returns a confirmation message indicating whether the response was successful.

### `GET /api/user/forgot/:email`

Users can request a link that can be used to reset their password.  This is a three step process.  The first step
(handled by this endpoint) sends a message to the supplied `email` address.  For the second step, see `GET
/api/user/reset/:code` below.

Returns a confirmation message indicating whether the response was successful.

### `GET /api/user/reset/:code`

If a user has requested that their password be reset using the `GET /api/user/forgot/:email` API endpoint (see above),
they will receive an email message that contains a link to this endpoint.

By visiting this link, they are presented with a form that will allow them update their password using the `POST
/api/user/reset/:code` endpoint (see below)

### `POST /api/user/reset/:code`

Allows a user to reset their password using a `code` received via email (see `GET /api/user/forgot/:email`).  The user
is required to enter a valid `password` and to enter the same password in a `confirm` field, as in:

```json
  {
    "password": "newPassword1",
    "confirm":  "newPassword1"
  }
```

Returns a confirmation of whether the response was successful.

## /api/group

The following endpoints are used to manage groups.  All parts of the group API require the user to be an administrator.

### `GET /api/group/:group`

Displays the group metadata as well as the `username` of all members of `:group`.

### `POST /api/group/:group`

Create a new group named `:group`. A group is required to have a valid (URL-safe) `name`, and may optionally include a
list of `members`, each of which is expected to be valid `username`, as in:

```json
  {
    "name": "pets",
    "members": ["cat", "dog"]
  }
```

Returns a confirmation of whether the response was successful.

### `DELETE /api/group/:group`

Delete the group named `:group`. Returns a confirmation of whether the response was successful.

## /api/memberships

The following endpoints are used to manage the membership of users in one or more groups.  An individual user can only
view their own memberships, using `GET /api/memberships/:username` (see below).

### `GET /api/memberships/:username`

Displays a list of group memberships for the given `:username`.  If `:username` is omitted, the memberships for the
current user are displayed.  For a list of users in a single group, see `GET /api/group/:group` above.

### `POST /api/memberships/:username/:group`

Add `:username` to `:group`.  Does not expect and will ignore any JSON data you send.  Returns a confirmation of whether
the response was successful.

### `DELETE /api/memberships/:username/:group`

Remove `:username` from `:group`.  Returns a confirmation of whether the response was successful.
