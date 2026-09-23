# Reference Implementation Contract

## D08 — Permit to Work

D08 اولین Vertical Slice مرجع و الگوی اجرایی کل پلتفرم است.

Person/Workforce → Qualification → Training/Examination → Operational Authorization → Permit Role → Scope → Risk → Permit → Isolation/LOTO → Gas Test/Evidence → Approval → Issue → Activation → Suspension/Resume → Closure → Audit/Reporting

Promotion فقط وقتی انجام می‌شود که Architecture → Target Schema → Runtime → Authorization/Scope → Workflow → Evidence/Audit → Historical Import → Tests → Gate همگی عبور کنند.

پس از Promotion، هیچ Domain حق کپی‌کردن موتورهای D08 یا ساخت Master موازی ندارد.

Missing Group/Module catalogue detail باید از Frozen Target Registry بازیابی شود؛ برای پرکردن عدد، قابلیت یا Placeholder جعلی ساخته نمی‌شود.