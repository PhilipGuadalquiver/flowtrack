# MongoDB Connection Error Fix

## Error You're Seeing

```
Server selection timeout: No available servers
received fatal alert: InternalError
```

This means your application cannot connect to MongoDB Atlas.

## Common Causes & Solutions

### 1. MongoDB Atlas IP Whitelist (Most Common Issue)

MongoDB Atlas blocks connections that aren't from whitelisted IP addresses.

**Solution:**
1. Go to MongoDB Atlas: https://cloud.mongodb.com/
2. Sign in to your account
3. Click on **Network Access** (in the left sidebar)
4. Click **+ ADD IP ADDRESS**
5. Add one of these:
   - **For Development (Local):** Click **"Add Current IP Address"** button
   - **For Railway/Production:** Click **"ALLOW ACCESS FROM ANYWHERE"** button
     - This adds `0.0.0.0/0` (allows all IPs)
     - ⚠️ Only do this for production if you trust your connection string security

6. Click **Confirm**
7. Wait 1-2 minutes for changes to propagate

### 2. Check Connection String Format

Your connection string should use the `mongodb+srv://` format (not `mongodb://`).

**Correct format:**
```
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

**Check your DATABASE_URL:**
- ✅ Should start with `mongodb+srv://`
- ✅ Should include your username and password
- ✅ Should include the cluster name
- ✅ Should include the database name
- ✅ Should have connection options: `?retryWrites=true&w=majority`

### 3. Verify Database User Credentials

1. Go to MongoDB Atlas → **Database Access** (left sidebar)
2. Check your database user exists
3. Make sure the password is correct
4. If needed, reset the password and update your connection string

### 4. Check Database Name

The error shows the connection is trying to connect. Make sure:
- The database name in your connection string exists
- Or it will be created automatically when you first write data

### 5. Test Connection from Atlas

1. Go to MongoDB Atlas → **Clusters**
2. Click **Connect** on your cluster
3. Choose **Connect your application**
4. Copy the connection string shown there
5. Compare it with your DATABASE_URL

### 6. Check if Running Locally vs Production

**For Local Development:**
- Make sure your IP is whitelisted in MongoDB Atlas
- Test connection: Try connecting from MongoDB Compass or Atlas interface

**For Railway/Production:**
- Add `0.0.0.0/0` to IP whitelist (allows all IPs)
- Make sure DATABASE_URL environment variable is set correctly in Railway

## Quick Fix Steps

1. **Whitelist IP in MongoDB Atlas:**
   - Network Access → Add IP Address → "Add Current IP Address" (for local)
   - Or "ALLOW ACCESS FROM ANYWHERE" for production

2. **Verify Connection String:**
   - Check DATABASE_URL in your `.env` file
   - Should match format: `mongodb+srv://user:pass@cluster.mongodb.net/dbname?retryWrites=true&w=majority`

3. **Wait 1-2 minutes** after whitelisting IP

4. **Restart your server:**
   ```bash
   # Stop your server (Ctrl+C)
   # Then restart
   npm run dev
   ```

## Example Connection String Format

```
mongodb+srv://guadalquiverphilip_db_user:tSiNiyoTiaHza1qZ@cluster1.oldbgde.mongodb.net/flowtrack?retryWrites=true&w=majority
```

Breakdown:
- `mongodb+srv://` - Protocol
- `guadalquiverphilip_db_user` - Username
- `tSiNiyoTiaHza1qZ` - Password
- `cluster1.oldbgde.mongodb.net` - Cluster address
- `flowtrack` - Database name
- `?retryWrites=true&w=majority` - Connection options

## For Railway Deployment

If this error happens on Railway:

1. **Check Railway Environment Variables:**
   - Go to Railway → Variables tab
   - Make sure `DATABASE_URL` is set correctly
   - Remove any quotes around the value

2. **Whitelist Railway IPs:**
   - MongoDB Atlas → Network Access
   - Add `0.0.0.0/0` (allows all IPs) for production

3. **Verify Connection String:**
   - No quotes around DATABASE_URL value
   - Full connection string is present
   - Password is correct

## Still Having Issues?

1. **Test connection string directly:**
   - Use MongoDB Compass desktop app
   - Or use MongoDB Atlas's built-in connection tester

2. **Check MongoDB Atlas status:**
   - Make sure your cluster is running (not paused)
   - Check for any service alerts

3. **Verify credentials:**
   - Try resetting database user password
   - Update connection string with new password

4. **Check firewall/network:**
   - Some corporate networks block MongoDB connections
   - Try from a different network (mobile hotspot)

## Expected Result

After fixing:
- ✅ Server starts without connection errors
- ✅ Database queries work
- ✅ Login functionality works
- ✅ API endpoints return data
