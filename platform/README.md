# اجرای سریع

این نسخه برای دیدن پلتفرم بدون نصب Backend ساخته شده است.

## روش 1 — GitHub Pages
محتویات پوشه platform به‌عنوان سایت استاتیک قابل انتشار است.

## روش 2 — اجرای محلی
در پوشه platform یک web server ساده اجرا کنید، سپس index.html را در مرورگر باز کنید.

مثال:
python -m http.server 8080
سپس: http://localhost:8080

## معماری داده
UI ← JSON Contract ← Runtime/Domain

JSON فقط لایه داده/دمو است؛ Source of Truth معماری نیست و جایگزین Registry هدف نمی‌شود.
