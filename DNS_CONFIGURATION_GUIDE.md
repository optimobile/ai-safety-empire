# 🌐 DNS Configuration Guide for All Platforms

After deploying to Vercel, you need to configure DNS for each custom domain in Namecheap.

---

## 📋 Quick Reference

For **each domain**, add these DNS records in Namecheap:

### A Record
```
Type: A Record
Host: @
Value: 76.76.21.21
TTL: Automatic
```

### CNAME Record (www subdomain)
```
Type: CNAME
Host: www
Value: cname.vercel-dns.com
TTL: Automatic
```

---

## 🚀 Step-by-Step for Each Domain

### 1. councilof.ai

1. Go to Namecheap → Domain List → councilof.ai → Manage
2. Click "Advanced DNS"
3. Add A Record:
   - Type: **A Record**
   - Host: **@**
   - Value: **76.76.21.21**
   - TTL: **Automatic**
4. Add CNAME Record:
   - Type: **CNAME Record**
   - Host: **www**
   - Value: **cname.vercel-dns.com**
   - TTL: **Automatic**
5. Click "Save All Changes"

---

### 2. proofof.ai

1. Go to Namecheap → Domain List → proofof.ai → Manage
2. Click "Advanced DNS"
3. Add A Record:
   - Type: **A Record**
   - Host: **@**
   - Value: **76.76.21.21**
   - TTL: **Automatic**
4. Add CNAME Record:
   - Type: **CNAME Record**
   - Host: **www**
   - Value: **cname.vercel-dns.com**
   - TTL: **Automatic**
5. Click "Save All Changes"

---

### 3. asisecurity.ai

1. Go to Namecheap → Domain List → asisecurity.ai → Manage
2. Click "Advanced DNS"
3. Add A Record:
   - Type: **A Record**
   - Host: **@**
   - Value: **76.76.21.21**
   - TTL: **Automatic**
4. Add CNAME Record:
   - Type: **CNAME Record**
   - Host: **www**
   - Value: **cname.vercel-dns.com**
   - TTL: **Automatic**
5. Click "Save All Changes"

---

### 4. agisafe.ai

1. Go to Namecheap → Domain List → agisafe.ai → Manage
2. Click "Advanced DNS"
3. Add A Record:
   - Type: **A Record**
   - Host: **@**
   - Value: **76.76.21.21**
   - TTL: **Automatic**
4. Add CNAME Record:
   - Type: **CNAME Record**
   - Host: **www**
   - Value: **cname.vercel-dns.com**
   - TTL: **Automatic**
5. Click "Save All Changes"

---

### 5. suicidestop.ai

1. Go to Namecheap → Domain List → suicidestop.ai → Manage
2. Click "Advanced DNS"
3. Add A Record:
   - Type: **A Record**
   - Host: **@**
   - Value: **76.76.21.21**
   - TTL: **Automatic**
4. Add CNAME Record:
   - Type: **CNAME Record**
   - Host: **www**
   - Value: **cname.vercel-dns.com**
   - TTL: **Automatic**
5. Click "Save All Changes"

---

### 6. transparencyof.ai

1. Go to Namecheap → Domain List → transparencyof.ai → Manage
2. Click "Advanced DNS"
3. Add A Record:
   - Type: **A Record**
   - Host: **@**
   - Value: **76.76.21.21**
   - TTL: **Automatic**
4. Add CNAME Record:
   - Type: **CNAME Record**
   - Host: **www**
   - Value: **cname.vercel-dns.com**
   - TTL: **Automatic**
5. Click "Save All Changes"

---

### 7. ethicalgovernanceof.ai

1. Go to Namecheap → Domain List → ethicalgovernanceof.ai → Manage
2. Click "Advanced DNS"
3. Add A Record:
   - Type: **A Record**
   - Host: **@**
   - Value: **76.76.21.21**
   - TTL: **Automatic**
4. Add CNAME Record:
   - Type: **CNAME Record**
   - Host: **www**
   - Value: **cname.vercel-dns.com**
   - TTL: **Automatic**
5. Click "Save All Changes"

---

### 8. safetyof.ai

1. Go to Namecheap → Domain List → safetyof.ai → Manage
2. Click "Advanced DNS"
3. Add A Record:
   - Type: **A Record**
   - Host: **@**
   - Value: **76.76.21.21**
   - TTL: **Automatic**
4. Add CNAME Record:
   - Type: **CNAME Record**
   - Host: **www**
   - Value: **cname.vercel-dns.com**
   - TTL: **Automatic**
5. Click "Save All Changes"

---

### 9. accountabilityof.ai

1. Go to Namecheap → Domain List → accountabilityof.ai → Manage
2. Click "Advanced DNS"
3. Add A Record:
   - Type: **A Record**
   - Host: **@**
   - Value: **76.76.21.21**
   - TTL: **Automatic**
4. Add CNAME Record:
   - Type: **CNAME Record**
   - Host: **www**
   - Value: **cname.vercel-dns.com**
   - TTL: **Automatic**
5. Click "Save All Changes"

---

### 10. biasdetectionof.ai

1. Go to Namecheap → Domain List → biasdetectionof.ai → Manage
2. Click "Advanced DNS"
3. Add A Record:
   - Type: **A Record**
   - Host: **@**
   - Value: **76.76.21.21**
   - TTL: **Automatic**
4. Add CNAME Record:
   - Type: **CNAME Record**
   - Host: **www**
   - Value: **cname.vercel-dns.com**
   - TTL: **Automatic**
5. Click "Save All Changes"

---

### 11. dataprivacyof.ai

1. Go to Namecheap → Domain List → dataprivacyof.ai → Manage
2. Click "Advanced DNS"
3. Add A Record:
   - Type: **A Record**
   - Host: **@**
   - Value: **76.76.21.21**
   - TTL: **Automatic**
4. Add CNAME Record:
   - Type: **CNAME Record**
   - Host: **www**
   - Value: **cname.vercel-dns.com**
   - TTL: **Automatic**
5. Click "Save All Changes"

---

## ⏱️ DNS Propagation

After configuring DNS:
- **Propagation time:** 5-10 minutes (usually)
- **Maximum:** Up to 24 hours (rare)
- **Check status:** https://dnschecker.org/

---

## ✅ Verification

### Check DNS Records

```bash
# Check A record
dig councilof.ai +short
# Should return: 76.76.21.21

# Check CNAME record
dig www.councilof.ai +short
# Should return: cname.vercel-dns.com
```

### Check SSL Certificate

1. Visit https://councilof.ai
2. Click padlock icon in browser
3. Verify certificate is valid
4. Issued by: Vercel

---

## 🚨 Troubleshooting

### Issue: DNS not propagating

**Solution:**
1. Clear DNS cache: `sudo systemd-resolve --flush-caches`
2. Use different DNS: 8.8.8.8 (Google) or 1.1.1.1 (Cloudflare)
3. Wait longer (up to 24 hours)

### Issue: SSL certificate not working

**Solution:**
1. Wait 5-10 minutes after DNS propagation
2. Vercel auto-generates SSL certificates
3. Check Vercel dashboard for certificate status

### Issue: Domain shows "Domain Not Found"

**Solution:**
1. Verify domain is added in Vercel dashboard
2. Check DNS records are correct
3. Ensure no conflicting records exist

---

## 📊 DNS Configuration Checklist

- [ ] councilof.ai - A Record + CNAME
- [ ] proofof.ai - A Record + CNAME
- [ ] asisecurity.ai - A Record + CNAME
- [ ] agisafe.ai - A Record + CNAME
- [ ] suicidestop.ai - A Record + CNAME
- [ ] transparencyof.ai - A Record + CNAME
- [ ] ethicalgovernanceof.ai - A Record + CNAME
- [ ] safetyof.ai - A Record + CNAME
- [ ] accountabilityof.ai - A Record + CNAME
- [ ] biasdetectionof.ai - A Record + CNAME
- [ ] dataprivacyof.ai - A Record + CNAME

---

## 🎯 Quick Copy-Paste Values

**For all domains:**

```
A Record:
  Host: @
  Value: 76.76.21.21

CNAME Record:
  Host: www
  Value: cname.vercel-dns.com
```

---

## 📞 Support

If you encounter issues:
1. Check Vercel documentation: https://vercel.com/docs/custom-domains
2. Check Namecheap support: https://www.namecheap.com/support/
3. Use DNS checker: https://dnschecker.org/

---

**Status:** Ready to configure  
**Time required:** ~5 minutes per domain  
**Total time:** ~1 hour for all 11 domains

