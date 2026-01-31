# Phase 6: Deployment

## Mục tiêu
Đưa website lên production với cấu hình hoàn chỉnh.

## Trạng thái: `[ ]` Pending

## Dependencies: Phase 5 hoàn thành

---

## Tasks

### Task 6.1: Setup Vercel project
**Status:** `[ ]` Pending

#### To-Do:
- [ ] Tạo account Vercel (nếu chưa có)
- [ ] Connect GitHub repository
- [ ] Import project vào Vercel
- [ ] Verify build thành công
- [ ] Test preview deployment
- [ ] Cấu hình build settings:
  - Build command: `pnpm build`
  - Output directory: `.next`
  - Install command: `pnpm install`

#### Issues & Notes:
<!-- Ghi lại các vấn đề gặp phải khi implement -->

---

### Task 6.2: Environment variables
**Status:** `[ ]` Pending

#### To-Do:
- [ ] Setup environment variables trên Vercel:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `NEXT_PUBLIC_SITE_URL`
  - Các biến khác nếu có (Resend API key, etc.)
- [ ] Verify variables được inject đúng
- [ ] Tạo `.env.production` template cho documentation
- [ ] Setup different values cho Preview vs Production (nếu cần)

#### Issues & Notes:
<!-- Ghi lại các vấn đề gặp phải khi implement -->

---

### Task 6.3: Domain configuration
**Status:** `[ ]` Pending

#### To-Do:
- [ ] Quyết định domain name
- [ ] Add domain trong Vercel settings
- [ ] Cấu hình DNS records:
  - A record hoặc CNAME
  - Theo hướng dẫn Vercel
- [ ] Wait for DNS propagation
- [ ] Verify domain hoạt động
- [ ] Setup www redirect (nếu cần)

#### Issues & Notes:
<!-- Ghi lại các vấn đề gặp phải khi implement -->

---

### Task 6.4: SSL certificate
**Status:** `[ ]` Pending

#### To-Do:
- [ ] Vercel tự động provision SSL (Let's Encrypt)
- [ ] Verify HTTPS hoạt động
- [ ] Test certificate validity
- [ ] Enable HSTS (HTTP Strict Transport Security) - optional
- [ ] Verify no mixed content warnings

#### Issues & Notes:
<!-- Ghi lại các vấn đề gặp phải khi implement -->

---

### Task 6.5: Analytics & Monitoring setup (Optional)
**Status:** `[ ]` Pending

#### To-Do:
- [ ] Quyết định: Có setup không?
- [ ] Nếu có Google Analytics:
  - [ ] Tạo GA4 property
  - [ ] Add tracking code
  - [ ] Setup conversion goals
- [ ] Vercel Analytics:
  - [ ] Enable trong Vercel dashboard
  - [ ] Install @vercel/analytics
- [ ] Error tracking (Sentry - optional):
  - [ ] Create Sentry project
  - [ ] Install @sentry/nextjs
  - [ ] Setup DSN
- [ ] Uptime monitoring - optional

#### Issues & Notes:
<!-- Ghi lại các vấn đề gặp phải khi implement -->

---

## Deployment Checklist

### Pre-deployment
- [ ] All tests pass
- [ ] Lighthouse scores acceptable
- [ ] No console errors
- [ ] All environment variables documented
- [ ] Database migrations complete
- [ ] Seed data ready (if needed)

### Deployment
- [ ] Push to main branch
- [ ] Verify Vercel build success
- [ ] Test production URL
- [ ] Check all pages render correctly
- [ ] Test checkout flow end-to-end
- [ ] Verify database connections

### Post-deployment
- [ ] Verify SSL working
- [ ] Check analytics tracking
- [ ] Monitor for errors
- [ ] Test on different devices
- [ ] Share with stakeholders for UAT

---

## Deliverables Checklist

- [ ] Website live trên custom domain
- [ ] HTTPS hoạt động
- [ ] All features working in production
- [ ] Analytics tracking (if opted)
- [ ] No critical errors

---

## Production URLs

| Environment | URL |
|-------------|-----|
| Production | https://[your-domain].com |
| Preview | https://[project]-[branch].vercel.app |
| Vercel Dashboard | https://vercel.com/[team]/[project] |
| Supabase Dashboard | https://app.supabase.com/project/[project-id] |

---

## Rollback Plan

Nếu có vấn đề nghiêm trọng sau deploy:

1. **Quick rollback:**
   - Vào Vercel Dashboard → Deployments
   - Tìm deployment trước đó hoạt động tốt
   - Click "..." → "Promote to Production"

2. **Code rollback:**
   ```bash
   git revert HEAD
   git push origin main
   ```

3. **Database rollback:**
   - Có Supabase backups
   - Document migration rollback scripts

---

## Files Created/Modified

```
(Mostly configuration, no new code files)

.env.production.template      # Template for production env vars
vercel.json                   # Vercel configuration (if needed)
```

---

*Last Updated: 2026-01-26*
