# 🌐 DOMAIN SETUP GUIDE - VERCEL CUSTOM DOMAINS
**Complete guide for configuring custom domains on Vercel**

---

## 📊 DOMAIN OPTIONS

### Option A: Custom Domain (Recommended)
- **Example**: `clientdomain.com`
- **Cost**: $12-15/year (client pays)
- **Pros**: Professional, brandable, client owns it
- **Cons**: Requires DNS configuration, 5-30 min propagation

### Option B: Nevermiss Lead Subdomain (FREE)
- **Example**: `client-slug.nevermisslead.com`
- **Cost**: FREE
- **Pros**: No DNS config, instant SSL, no propagation wait
- **Cons**: Less professional, you own the domain

---

## 🚀 SETUP: CUSTOM DOMAIN (Option A)

### ☐ Step 1: Add Domain to Vercel
1. Log in to Vercel: https://vercel.com
2. Select client's project
3. Go to: Settings → Domains
4. Click "Add"
5. Enter domain: `clientdomain.com`
6. Click "Add"
7. Vercel will show DNS records needed
8. **Time: 1 min**

### ☐ Step 2: Configure DNS Records

**Send these instructions to client** (copy/paste):

```
DOMAIN DNS CONFIGURATION

Please log in to your domain registrar (GoDaddy, Namecheap, Google Domains, etc.) and add these DNS records:

FOR ROOT DOMAIN (clientdomain.com):
Type: A
Name: @
Value: 76.76.19.19
TTL: Auto or 3600

FOR WWW SUBDOMAIN (www.clientdomain.com):
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: Auto or 3600

IMPORTANT:
- Remove any existing A or CNAME records for @ and www first
- DNS propagation takes 5-30 minutes
- We'll notify you when your site is live
```

**Time: Client does this (1-5 min depending on registrar)**

### ☐ Step 3: Verify DNS Propagation
1. Wait 5-30 minutes
2. Check DNS propagation:
   ```bash
   dig clientdomain.com
   # Should show: 76.76.19.19

   dig www.clientdomain.com
   # Should show: cname.vercel-dns.com
   ```
3. Or use: https://dnschecker.org
4. **Time: 5-30 min wait**

### ☐ Step 4: Verify SSL Certificate
1. Vercel auto-issues SSL certificate when DNS propagates
2. Visit: `https://clientdomain.com`
3. **Expected**: Site loads with lock icon (SSL)
4. If not ready: Wait 5 more minutes, refresh
5. **Time: Auto (included in DNS propagation)**

### ☐ Step 5: Update Database
```sql
UPDATE clients
SET custom_domain = 'clientdomain.com'
WHERE slug = 'client-slug';
```

**✅ Custom Domain Setup Complete**

---

## 🆓 SETUP: NEVERMISSLEAD SUBDOMAIN (Option B)

### ☐ Step 1: Add Subdomain to Vercel
1. Log in to Vercel
2. Select client's project
3. Go to: Settings → Domains
4. Click "Add"
5. Enter: `client-slug.nevermisslead.com`
6. Click "Add"
7. **Vercel automatically configures DNS**
8. **Time: 1 min**

### ☐ Step 2: Configure DNS (One-Time Setup)
**YOU** need to add wildcard DNS for `*.nevermisslead.com`:

1. Log in to nevermisslead.com DNS provider
2. Add CNAME record:
   ```
   Type: CNAME
   Name: *
   Value: cname.vercel-dns.com
   TTL: 3600
   ```
3. **Note**: This is one-time setup, works for ALL subdomains
4. **Time: 2 min** (if not already done)

### ☐ Step 3: Verify Subdomain
1. Visit: `https://client-slug.nevermisslead.com`
2. **Expected**: Site loads immediately with SSL
3. **Time: Instant** (no propagation wait)

### ☐ Step 4: Update Database
```sql
UPDATE clients
SET custom_domain = 'client-slug.nevermisslead.com'
WHERE slug = 'client-slug';
```

**✅ Subdomain Setup Complete**

---

## 🔧 COMMON REGISTRAR INSTRUCTIONS

### GoDaddy
1. Log in: https://dcc.godaddy.com
2. My Products → DNS → Manage Zones
3. Add Record → Type: A, Name: @, Value: 76.76.19.19
4. Add Record → Type: CNAME, Name: www, Value: cname.vercel-dns.com
5. Save

### Namecheap
1. Log in: https://namecheap.com
2. Domain List → Manage → Advanced DNS
3. Add Record → Type: A, Host: @, Value: 76.76.19.19
4. Add Record → Type: CNAME, Host: www, Value: cname.vercel-dns.com
5. Save

### Google Domains
1. Log in: https://domains.google.com
2. My Domains → Manage → DNS
3. Custom Records → Add:
   - Type: A, Name: @, Data: 76.76.19.19
   - Type: CNAME, Name: www, Data: cname.vercel-dns.com
4. Save

### Cloudflare
1. Log in: https://dash.cloudflare.com
2. Select domain → DNS → Records
3. Add Record:
   - Type: A, Name: @, Content: 76.76.19.19, Proxy: OFF
   - Type: CNAME, Name: www, Content: cname.vercel-dns.com, Proxy: OFF
4. **Important**: Turn OFF Cloudflare proxy (gray cloud)
5. Save

---

## 🚨 TROUBLESHOOTING

### Issue: DNS not propagating after 30 minutes
**Check**:
```bash
dig clientdomain.com
# Should show: 76.76.19.19
```
**Solutions**:
1. Verify A record is correct: `@` → `76.76.19.19`
2. Check TTL isn't set too high (max 3600 recommended)
3. Clear DNS cache:
   ```bash
   # Mac
   sudo dscacheutil -flushcache

   # Windows
   ipconfig /flushdns
   ```
4. Use different DNS checker: https://dnschecker.org

### Issue: "Invalid Configuration" in Vercel
**Cause**: Domain already used on another Vercel account
**Solution**:
1. Remove domain from old Vercel account first
2. Or use subdomain instead

### Issue: SSL certificate not issuing
**Cause**: DNS not fully propagated or CAA records blocking
**Solution**:
1. Wait 5 more minutes
2. Check CAA records:
   ```bash
   dig CAA clientdomain.com
   ```
3. If CAA exists, add: `0 issue "letsencrypt.org"`

### Issue: Site loads but shows wrong content
**Cause**: Browser cache or Vercel deployment issue
**Solution**:
1. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. Try incognito/private window
3. Check Vercel deployment is latest version

---

## ✅ SUMMARY CHECKLIST

**Custom Domain**:
- [ ] Add domain to Vercel project
- [ ] Send DNS instructions to client
- [ ] Client adds A record (@→76.76.19.19)
- [ ] Client adds CNAME record (www→cname.vercel-dns.com)
- [ ] Wait 5-30 min for DNS propagation
- [ ] Verify site loads with SSL
- [ ] Update database with custom domain

**Subdomain (FREE)**:
- [ ] Add subdomain to Vercel project
- [ ] Configure wildcard DNS (one-time)
- [ ] Verify site loads immediately
- [ ] Update database with subdomain

**Total Time**:
- Custom domain: 1 min (you) + 2 min (client) + 5-30 min (propagation)
- Subdomain: 1 min (instant)

---

**Last Updated**: November 22, 2025
**Vercel SSL**: Auto-issued via Let's Encrypt
**DNS Propagation**: Typically 5-30 minutes
