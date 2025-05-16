# .env

## Generate a secret

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Environment variables

```
PORT=3000
JWT_SECRET=THE GENERATED SECRET
JWT_EXPIRATION=1d
DATABASE_URL="file:./dev.db"
SALT_ROUNDS=YOURSALTROUNDS
```

PS: SALTS_ROUNDS is the number of rounds to generate the salt for the password hash. The higher the number, the more secure it is, but it will take longer to generate the hash. The recommended value is 10.
