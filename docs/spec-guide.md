# SPEC Guide

How to write effective SPECs.

## Format

```markdown
# Project Name

- [ ] First task
- [ ] Second task
- [ ] Third task
```

That's it. Ralphie reads `SPEC.md`, picks the next unchecked task, implements it, checks it off.

## Creating a SPEC

```bash
ralphie spec "REST API with user auth"    # AI interviews you
ralphie spec --auto "Todo app"            # Autonomous, no interaction
```

Or write `SPEC.md` manually.

## Good Tasks

### One thing per checkbox

```markdown
# Good
- [ ] Create User model with bcrypt
- [ ] Add /auth/register endpoint
- [ ] Add /auth/login endpoint

# Bad
- [ ] Create User model, add password hashing, and create auth endpoints
```

### Clear completion criteria

```markdown
# Good
- [ ] Add JWT token generation returning { token, expiresAt }

# Bad
- [ ] Improve authentication
```

### Right-sized

Too small (overhead per task):
```markdown
- [ ] Create src directory
- [ ] Create index.ts file
```

Too large (AI struggles):
```markdown
- [ ] Build complete auth system with registration, login, password reset, OAuth
```

Just right:
```markdown
- [ ] Set up Express server with TypeScript
- [ ] Create User model with password hashing
- [ ] Add /auth/register with validation
- [ ] Add /auth/login returning JWT
```

### Ordered by dependency

```markdown
- [ ] Set up project with TypeScript
- [ ] Create database connection
- [ ] Create User model
- [ ] Add user endpoints
- [ ] Add auth middleware
- [ ] Add protected routes
```

## Example

```markdown
# Task API

- [ ] Set up Express + TypeScript
- [ ] Configure PostgreSQL with Prisma
- [ ] Create User model (email, passwordHash)
- [ ] Add /auth/register endpoint
- [ ] Add /auth/login returning JWT
- [ ] Create auth middleware
- [ ] Create Task model (title, status, userId)
- [ ] Add CRUD endpoints for /tasks
- [ ] Add tests
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Stuck on same task | Use `- [ ]` format, run `ralphie validate` |
| Tasks too vague | Split into smaller, concrete tasks |
| Progress slow | Try `--greedy` mode or smaller tasks |
