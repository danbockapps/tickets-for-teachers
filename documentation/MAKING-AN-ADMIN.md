# Making a user an admin for a domain

Admin status is **not** something the app grants through any UI — there's no
"promote to admin" button. An admin is simply a row in the `admins` table:

| Column    | Meaning                                                                 |
| --------- | ----------------------------------------------------------------------- |
| `user_id` | The `users.id` of an existing, registered user.                         |
| `domains` | A JSON array of domain strings, e.g. `["springfield.edu"]`. The admin's |
|           | dashboard (`AdminView`) is scoped to these domains.                     |

When a user has a row here, `app/page.tsx` renders `AdminView` instead of the
regular logged-in view, and `getAdmin()` in `lib/auth.ts` returns their domains.

## Prerequisites

- The person must **already have registered** (so a `users` row exists). You're
  granting admin to an existing account, not creating one.
- You need their `users.id`. Find it by their login (personal) email.

## Procedure (production)

The database lives on the VPS at
`/var/lib/tickets-for-teachers/database.db` (bind-mounted into the container at
`/app/data/database.db`). Run SQL against it with the `sqlite3` CLI:

```sh
sqlite3 /var/lib/tickets-for-teachers/database.db
```

### 1. Look up the user's id

```sql
SELECT id, email, first_name, last_name FROM users WHERE email = 'teacher@gmail.com';
```

### 2. Grant admin for one or more domains

`domains` is stored as JSON text, so quote it as a JSON array:

```sql
INSERT INTO admins (user_id, domains)
VALUES ('<the-user-id-from-step-1>', '["springfield.edu"]');
```

Multiple domains:

```sql
INSERT INTO admins (user_id, domains)
VALUES ('<the-user-id>', '["springfield.edu","shelbyville.edu"]');
```

### 3. Verify

```sql
SELECT * FROM admins WHERE user_id = '<the-user-id>';
```

The change takes effect on the user's next page load — no restart needed.

## Changing or revoking

Change the domains an existing admin manages:

```sql
UPDATE admins SET domains = '["newdomain.edu"]' WHERE user_id = '<the-user-id>';
```

Revoke admin entirely:

```sql
DELETE FROM admins WHERE user_id = '<the-user-id>';
```

## Doing it locally instead

Against a local dev database you can use Drizzle Studio for a point-and-click
edit of the `admins` table:

```sh
yarn db:studio
```

Add a row with the user's `id` and a `domains` value of `["springfield.edu"]`.
