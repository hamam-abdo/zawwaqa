export function authErrorToArabic(message: string) {
  const errors: Record<string, string> = {
    // ✅ تسجيل الدخول
    "Invalid login credentials": "بيانات تسجيل الدخول غير صحيحة",
    "Email not confirmed": "يجب تأكيد البريد الإلكتروني قبل تسجيل الدخول",
    "Email not found": "البريد الإلكتروني غير موجود",
    "Invalid email": "البريد الإلكتروني غير صالح",


    // ✅ التسجيل (SignUp)
    "User already registered": "هذا البريد الإلكتروني مسجل بالفعل",
    "Password should be at least 6 characters.":
      "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
    "Weak Password": "كلمة المرور ضعيفة جدًا",
    "Email rate limit exceeded": "لقد قمت بمحاولات كثيرة، حاول مرة أخرى لاحقًا",

    // ✅ أكواد جديدة قد تظهر
    "Over request quota": "تم تجاوز الحد المسموح للطلبات",
    "Bad Request": "طلب غير صحيح",
  };

  return errors[message] || "حدث خطأ غير متوقع، حاول مرة أخرى";
}
