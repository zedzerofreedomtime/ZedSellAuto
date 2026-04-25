import { AuthShell } from "@/components/auth/auth-shell";
import { getDefaultAdminCredentials } from "@/lib/auth-storage";

export default function LoginPage() {
  const adminCredentials = getDefaultAdminCredentials();

  return (
    <AuthShell
      alternateHref="/signup"
      alternateLabel="สมัครสมาชิก"
      alternateText="ยังไม่มีบัญชี?"
      audience="any"
      description="เข้าสู่ระบบด้วยบัญชีเดียว ระบบจะตรวจ role ให้อัตโนมัติ ถ้าเป็นแอดมินจะพาไปหน้าจัดการหลังบ้าน และถ้าเป็นผู้ใช้ทั่วไปจะพาไปหน้าบัญชีของคุณ"
      footerText="กรอกอีเมลและรหัสผ่านเพื่อเข้าสู่ระบบ"
      helperNote={`บัญชีแอดมินทดสอบ: ${adminCredentials.email} / ${adminCredentials.password}`}
      mode="login"
      passwordLabel="รหัสผ่าน"
      submitLabel="เข้าสู่ระบบ"
      title="เข้าสู่ระบบ"
      eyebrow="Login"
    />
  );
}
