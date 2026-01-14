# Prisma Database Guide

This guide explains how to work with Prisma and MongoDB in this project.

## Prisma with MongoDB

**Important:** This project uses **MongoDB** (not PostgreSQL). MongoDB doesn't use traditional migrations. Instead, we use `prisma db push` to sync the schema directly to the database.

## Prisma Commands

All Prisma commands should be run from the `backend` directory.

### 1. Generate Prisma Client

Generate or regenerate the Prisma Client after schema changes:

```bash
cd backend
npm run prisma:generate
```

This command:
- Reads the `schema.prisma` file
- Generates the Prisma Client in `node_modules/@prisma/client`
- Updates TypeScript types for your models

**When to use:** After any changes to `schema.prisma` file.

### 2. Push Schema to Database

Push schema changes to MongoDB (creates/updates collections):

```bash
cd backend
npm run prisma:push
```

This command:
- Syncs your Prisma schema to the MongoDB database
- Creates new collections if they don't exist
- Updates existing collections with schema changes
- **Important:** This is non-destructive (won't delete data)

**When to use:** After modifying `schema.prisma` and before generating the client.

### Complete Workflow After Schema Changes

1. **Make changes** to `prisma/schema.prisma`
2. **Push schema** to database:
   ```bash
   npm run prisma:push
   ```
3. **Generate Prisma Client**:
   ```bash
   npm run prisma:generate
   ```

**Note:** You can run `prisma:push` and `prisma:generate` in either order, but it's recommended to push first, then generate.

### 3. Prisma Studio (Database GUI)

Open Prisma Studio to view and edit your database in a visual interface:

```bash
cd backend
npm run prisma:studio
```

This opens a web interface at `http://localhost:5555` where you can:
- View all collections (tables)
- Browse and edit data
- Add, update, or delete records
- Useful for development and debugging

### 4. Seed Database (Optional)

Seed the database with initial/sample data:

```bash
cd backend
npm run prisma:seed
```

**Warning:** This will delete existing data and recreate it with seed data. Use only in development!

### 5. Reset Database (Development Only)

Reset the database (deletes all data):

```bash
cd backend
npm run prisma:reset
```

**Warning:** This will delete all data in your database! Use only in development.

## Current Database Models

The schema includes the following models:

- **User** - System users with authentication
- **Project** - Projects in the system
- **ProjectMember** - Many-to-many relationship between users and projects
- **Issue** - Tasks, bugs, stories, and epics
- **Sprint** - Development sprints
- **Comment** - Comments/remarks on issues

## Schema File Location

The Prisma schema file is located at:
```
backend/prisma/schema.prisma
```

## Environment Configuration

Make sure your `.env` file in the `backend` directory contains:

```env
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority"
```

The `DATABASE_URL` should point to your MongoDB database (MongoDB Atlas or local instance).

## Common Tasks

### Adding a New Model

1. Add the model to `schema.prisma`
2. Run `npm run prisma:push` to create the collection
3. Run `npm run prisma:generate` to update the client
4. Restart your server if it's running

### Modifying an Existing Model

1. Update the model in `schema.prisma`
2. Run `npm run prisma:push` to sync changes
3. Run `npm run prisma:generate` to update the client
4. Restart your server if it's running

### Viewing Database Data

Use Prisma Studio:
```bash
npm run prisma:studio
```

Then open `http://localhost:5555` in your browser.

## Troubleshooting

### Schema is out of sync

If you get errors about schema being out of sync:
1. Run `npm run prisma:push` to sync schema
2. Run `npm run prisma:generate` to regenerate client

### Prisma Client errors

If you get "Prisma Client not generated" errors:
```bash
npm run prisma:generate
```

### Connection errors

Check your `DATABASE_URL` in `.env` file:
- Make sure it's correct
- Make sure MongoDB is accessible
- Check network/firewall settings for MongoDB Atlas

## Best Practices

1. **Always push schema changes before generating client** (recommended workflow)
2. **Backup data before schema changes** in production
3. **Test schema changes in development first**
4. **Use Prisma Studio** for quick data inspection
5. **Don't use `prisma:reset` in production**

## Additional Resources

- [Prisma MongoDB Documentation](https://www.prisma.io/docs/concepts/database-connectors/mongodb)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client API Reference](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
