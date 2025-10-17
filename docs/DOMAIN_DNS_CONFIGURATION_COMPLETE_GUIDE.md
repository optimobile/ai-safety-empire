# 🌐 DOMAIN & DNS CONFIGURATION - COMPLETE GUIDE

**Your Domains:** 11 AI Safety Platforms  
**Registrar:** Namecheap  
**Hosting:** Vercel  
**Time Required:** 30 minutes  
**DNS Propagation:** 24-48 hours

---

## 📋 YOUR 11 DOMAINS

1. **councilof.ai** → Council of 12 AIs (Main platform)
2. **proofof.ai** → Deepfake Detection
3. **asisecurity.ai** → AI Security Guardian
4. **agisafe.ai** → AGI Safety Monitor
5. **suicidestop.ai** → Mental Health Guardian
6. **transparencyof.ai** → Transparency Enforcer
7. **ethicalgovernanceof.ai** → Ethics Auditor
8. **safetyof.ai** → Safety Validator
9. **accountabilityof.ai** → Accountability Tracker
10. **biasdetectionof.ai** → Bias Detector
11. **dataprivacyof.ai** → Privacy Guardian

---

## 🎯 STEP-BY-STEP CONFIGURATION

### STEP 1: Get Vercel Project URLs (Already Done)

Each platform has a Vercel URL:

```
councilof.ai → councilof-l65cb6a2d-niks-projects-0a2ef942.vercel.app
proofof.ai → proofof-5hemfa7tx-niks-projects-0a2ef942.vercel.app
asisecurity.ai → asisecurity-flqbxnw6g-niks-projects-0a2ef942.vercel.app
agisafe.ai → agisafe-e0yb2zmp0-niks-projects-0a2ef942.vercel.app
suicidestop.ai → suicidestop-buey9p8lp-niks-projects-0a2ef942.vercel.app
transparencyof.ai → transparencyof-70yte94ko-niks-projects-0a2ef942.vercel.app
ethicalgovernanceof.ai → ethicalgovernanceof-5h4s27lbh-niks-projects-0a2ef942.vercel.app
safetyof.ai → safetyof-bcazkjh3x-niks-projects-0a2ef942.vercel.app
accountabilityof.ai → accountabilityof-9gz7tkhc1-niks-projects-0a2ef942.vercel.app
biasdetectionof.ai → biasdetectionof-asngavsln-niks-projects-0a2ef942.vercel.app
dataprivacyof.ai → dataprivacyof-5zano4lag-niks-projects-0a2ef942.vercel.app
```

---

### STEP 2: Add Custom Domains in Vercel (15 minutes)

**For EACH of the 11 platforms:**

1. **Go to Vercel Dashboard**
   - https://vercel.com/dashboard

2. **Select Project**
   - Click on the project (e.g., "councilof-ai")

3. **Go to Settings → Domains**
   - Click "Settings" tab
   - Click "Domains" in sidebar

4. **Add Domain**
   - Click "Add"
   - Enter domain: `councilof.ai`
   - Click "Add"

5. **Add WWW Subdomain**
   - Click "Add" again
   - Enter: `www.councilof.ai`
   - Click "Add"
   - Select "Redirect to councilof.ai"

6. **Note the DNS Records**
   - Vercel will show you DNS records to add
   - Usually:
     - **A Record:** `76.76.21.21`
     - **CNAME:** `cname.vercel-dns.com`

7. **Repeat for All 11 Domains**

---

### STEP 3: Configure DNS in Namecheap (15 minutes)

**For EACH of the 11 domains:**

1. **Login to Namecheap**
   - https://www.namecheap.com/myaccount/login/

2. **Go to Domain List**
   - Click "Domain List" in sidebar

3. **Click "Manage" next to domain**
   - Find domain (e.g., councilof.ai)
   - Click "Manage" button

4. **Advanced DNS Settings**
   - Click "Advanced DNS" tab

5. **Add A Record**
   ```
   Type: A Record
   Host: @
   Value: 76.76.21.21
   TTL: Automatic
   ```
   - Click "Add New Record"

6. **Add CNAME Record for WWW**
   ```
   Type: CNAME Record
   Host: www
   Value: cname.vercel-dns.com
   TTL: Automatic
   ```
   - Click "Add New Record"

7. **Delete Default Records** (if any)
   - Remove any existing A or CNAME records
   - Keep only the Vercel ones

8. **Save Changes**
   - Click "Save All Changes"

9. **Repeat for All 11 Domains**

---

## 📊 DNS CONFIGURATION TABLE

| Domain | A Record (@) | CNAME (www) | Status |
|--------|--------------|-------------|--------|
| councilof.ai | 76.76.21.21 | cname.vercel-dns.com | ⏳ Pending |
| proofof.ai | 76.76.21.21 | cname.vercel-dns.com | ⏳ Pending |
| asisecurity.ai | 76.76.21.21 | cname.vercel-dns.com | ⏳ Pending |
| agisafe.ai | 76.76.21.21 | cname.vercel-dns.com | ⏳ Pending |
| suicidestop.ai | 76.76.21.21 | cname.vercel-dns.com | ⏳ Pending |
| transparencyof.ai | 76.76.21.21 | cname.vercel-dns.com | ⏳ Pending |
| ethicalgovernanceof.ai | 76.76.21.21 | cname.vercel-dns.com | ⏳ Pending |
| safetyof.ai | 76.76.21.21 | cname.vercel-dns.com | ⏳ Pending |
| accountabilityof.ai | 76.76.21.21 | cname.vercel-dns.com | ⏳ Pending |
| biasdetectionof.ai | 76.76.21.21 | cname.vercel-dns.com | ⏳ Pending |
| dataprivacyof.ai | 76.76.21.21 | cname.vercel-dns.com | ⏳ Pending |

---

## 🔍 VERIFICATION

### Check DNS Propagation

**Use these tools:**

1. **DNS Checker**
   - https://dnschecker.org/
   - Enter domain: `councilof.ai`
   - Select "A" record type
   - Should show: `76.76.21.21`

2. **WhatsMyDNS**
   - https://www.whatsmydns.net/
   - Enter domain: `councilof.ai`
   - Should show: `76.76.21.21` globally

3. **Command Line** (Mac/Linux)
   ```bash
   dig councilof.ai
   # Should show: 76.76.21.21
   
   dig www.councilof.ai
   # Should show: CNAME to Vercel
   ```

4. **Command Line** (Windows)
   ```cmd
   nslookup councilof.ai
   # Should show: 76.76.21.21
   ```

---

## ⏱️ TIMELINE

**Immediate (0-5 minutes):**
- DNS records updated in Namecheap
- Vercel shows "Pending Verification"

**5-30 minutes:**
- Some DNS servers updated
- Domain may work intermittently

**1-4 hours:**
- Most DNS servers updated
- Domain works for most users

**24-48 hours:**
- All DNS servers updated globally
- Domain works for 100% of users
- SSL certificate issued by Vercel

---

## 🔐 SSL CERTIFICATES

**Automatic by Vercel:**
- Vercel automatically issues SSL certificates
- Uses Let's Encrypt
- Renews automatically
- No action needed from you!

**Verification:**
- Once DNS propagates, visit: `https://councilof.ai`
- Should show 🔒 padlock in browser
- Certificate valid for 90 days (auto-renewed)

---

## 📧 EMAIL FORWARDING (Optional but Recommended)

**Set up email forwarding for each domain:**

### In Namecheap:

1. **Go to Domain → Email Forwarding**
2. **Add Email Forward**
   ```
   Alias: support@councilof.ai
   Forward to: nicholastempleman@gmail.com
   ```

3. **Add More Aliases**
   ```
   hello@councilof.ai → nicholastempleman@gmail.com
   contact@councilof.ai → nicholastempleman@gmail.com
   info@councilof.ai → nicholastempleman@gmail.com
   sales@councilof.ai → nicholastempleman@gmail.com
   ```

4. **Repeat for All 11 Domains**

**Benefits:**
- Professional email addresses
- All forwarded to your Gmail
- No need for separate email hosting

---

## 🚨 TROUBLESHOOTING

### Problem: Domain not resolving after 24 hours

**Solution:**
1. Check DNS records in Namecheap
2. Verify A record is `76.76.21.21`
3. Verify CNAME is `cname.vercel-dns.com`
4. Clear browser cache
5. Try incognito mode
6. Try different browser
7. Contact Vercel support

### Problem: SSL certificate not issued

**Solution:**
1. Wait 24-48 hours for DNS propagation
2. Verify domain in Vercel dashboard
3. Click "Refresh" in Vercel Domains settings
4. Contact Vercel support if still failing

### Problem: WWW not redirecting

**Solution:**
1. Verify CNAME record for www
2. Check Vercel redirect settings
3. Wait for DNS propagation
4. Clear browser cache

### Problem: Email forwarding not working

**Solution:**
1. Verify email forward in Namecheap
2. Check Gmail spam folder
3. Verify domain DNS is working
4. Wait 24 hours for propagation
5. Test with different email address

---

## ✅ VERIFICATION CHECKLIST

**For EACH domain, verify:**

- [ ] A Record added in Namecheap
- [ ] CNAME Record added in Namecheap
- [ ] Domain added in Vercel
- [ ] WWW redirect configured in Vercel
- [ ] DNS propagation checked
- [ ] HTTPS working (🔒 padlock)
- [ ] Website loads correctly
- [ ] Email forwarding configured
- [ ] Test email sent and received

**Repeat for all 11 domains!**

---

## 📊 QUICK REFERENCE

### Vercel DNS Settings
```
A Record: 76.76.21.21
CNAME: cname.vercel-dns.com
```

### Namecheap DNS Configuration
```
Type: A Record
Host: @
Value: 76.76.21.21
TTL: Automatic

Type: CNAME Record
Host: www
Value: cname.vercel-dns.com
TTL: Automatic
```

### Email Forwarding
```
support@[domain] → nicholastempleman@gmail.com
hello@[domain] → nicholastempleman@gmail.com
contact@[domain] → nicholastempleman@gmail.com
```

---

## 🎯 FINAL STEPS

**After DNS Propagation (24-48 hours):**

1. **Test All Domains**
   - Visit each domain
   - Verify HTTPS working
   - Check website loads
   - Test email forwarding

2. **Update Marketing Materials**
   - Use custom domains in all content
   - Update social media bios
   - Update email signatures
   - Update business cards

3. **SEO Setup**
   - Submit to Google Search Console
   - Submit to Bing Webmaster Tools
   - Create sitemap.xml
   - Set up Google Analytics

4. **Monitor**
   - Check uptime (UptimeRobot)
   - Monitor traffic (Google Analytics)
   - Track conversions (Mixpanel)
   - Review errors (Sentry)

---

## 💡 PRO TIPS

1. **Use a Spreadsheet**
   - Track all 11 domains
   - Mark completion status
   - Note any issues

2. **Do in Batches**
   - Configure 3-4 domains at a time
   - Verify before moving to next batch
   - Reduces errors

3. **Screenshot Everything**
   - Take screenshots of DNS settings
   - Save Vercel configuration
   - Document for future reference

4. **Test Immediately**
   - Don't wait 24 hours to test
   - Check every few hours
   - Catch issues early

5. **Backup DNS Settings**
   - Export DNS records from Namecheap
   - Save Vercel project settings
   - Keep documentation updated

---

## 📞 SUPPORT CONTACTS

**Namecheap Support:**
- Live Chat: https://www.namecheap.com/support/live-chat/
- Email: support@namecheap.com
- Phone: +1.866.349.0313

**Vercel Support:**
- Help Center: https://vercel.com/help
- Email: support@vercel.com
- Twitter: @vercel

---

## 🚀 YOU'RE READY!

**Once DNS is configured:**
- ✅ All 11 platforms live on custom domains
- ✅ Professional branding
- ✅ HTTPS security
- ✅ Email forwarding
- ✅ Ready to launch!

**Time to configure:** 30 minutes  
**Time to propagate:** 24-48 hours  
**Result:** Professional, global presence! 🌍

**LET'S DO THIS! 🔥**

