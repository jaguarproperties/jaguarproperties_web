# Vercel + MongoDB Atlas Troubleshooting

## Symptom

Production requests fail with messages similar to:

- `Server selection timeout`
- `ReplicaSetNoPrimary`
- `No available servers`
- `PrismaClientInitializationError`
- `P2010`

These usually mean the Vercel function could not reach a healthy Atlas primary, or Atlas rejected the connection before Prisma could run the query.

## 1. Verify Atlas health

1. Open Atlas.
2. Go to `Database` and confirm the cluster is not paused and shows a healthy primary.
3. Open `Metrics` and check for recent primary elections, maintenance, or networking incidents.
4. Open `Alerts` and `Activity Feed` and look for:
   - primary step-down events
   - paused cluster events
   - IP access list changes
   - user/password changes

## 2. Verify Atlas network access

1. Open `Security` -> `Database & Network Access` -> `IP Access List`.
2. If you are on normal Vercel infrastructure, do not depend on a single Vercel IP.
3. For a quick unblock, add `0.0.0.0/0` temporarily and test again.
4. If that fixes production immediately, the root cause is IP allowlisting.
5. For a tighter setup, use Vercel Static IPs or Secure Compute, then allowlist those fixed egress IPs in Atlas.

## 3. Verify the connection string

Preferred Atlas SRV format:

```env
DATABASE_URL="mongodb+srv://USERNAME:PASSWORD@jaguarproperties.gkthseq.mongodb.net/jaguar_properties?retryWrites=true&w=majority&appName=JaguarProperties"
```

If authentication issues appear, add `authSource=admin`:

```env
DATABASE_URL="mongodb+srv://USERNAME:PASSWORD@jaguarproperties.gkthseq.mongodb.net/jaguar_properties?retryWrites=true&w=majority&authSource=admin&appName=JaguarProperties"
```

Only use the long non-SRV host list if Atlas explicitly gave you that format. If you do use it, include TLS and replica set options:

```env
DATABASE_URL="mongodb://USERNAME:PASSWORD@ac-1emppbc-shard-00-00.gkthseq.mongodb.net:27017,ac-1emppbc-shard-00-01.gkthseq.mongodb.net:27017,ac-1emppbc-shard-00-02.gkthseq.mongodb.net:27017/jaguar_properties?ssl=true&replicaSet=atlas-j2igky-shard-0&authSource=admin&retryWrites=true&w=majority"
```

## 4. Verify Vercel settings

1. Open Vercel project settings.
2. Confirm `DATABASE_URL` is present in `Production`.
3. Remove accidental spaces, line breaks, or stale credentials.
4. Redeploy after every secret change.
5. Test the deployed health endpoint:

```text
/api/health/db
```

This endpoint checks both the native MongoDB driver and Prisma from the running app.

## 5. Local validation commands

Test Atlas directly with Mongo shell:

```bash
mongosh "mongodb+srv://USERNAME:PASSWORD@jaguarproperties.gkthseq.mongodb.net/jaguar_properties?retryWrites=true&w=majority"
```

Test Prisma connectivity:

```bash
npx prisma generate
npx prisma db push
```

Prisma Studio is not a reliable validation path for MongoDB projects, so prefer `mongosh`, Atlas Data Explorer, or the app health endpoint.

## 6. App-level checks

After deployment, open:

- `/api/health/db`
- `/admin`
- `/admin/applications`
- `/admin/blog`

If the native driver fails and Prisma fails, this is almost always Atlas access, cluster health, DNS, or TLS.

If the native driver succeeds but Prisma fails, review Prisma version compatibility and regenerate the client in the deployment build.

## 7. Prevention

- Keep one shared `PrismaClient` instance.
- Use the Atlas SRV connection string unless you specifically need the expanded replica host list.
- Add Vercel Static IPs if you want Atlas allowlisting without opening `0.0.0.0/0`.
- Monitor Atlas alerts for elections and connectivity failures.
- Keep a production-only health endpoint for database checks.
