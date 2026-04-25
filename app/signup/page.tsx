import { AuthShell } from "@/components/auth/auth-shell";

export default function SignupPage() {
  return (
    <AuthShell
      alternateHref="/login"
      alternateLabel="เข้าสู่ระบบ"
      alternateText="มีบัญชีอยู่แล้ว?"
      audience="user"
      description="สร้างบัญชีเพื่อรับข้อเสนอพิเศษ บันทึกรถที่สนใจ และเริ่มกระบวนการซื้อขายรถกับ Zed Auto ได้ง่ายขึ้น"
      footerText="เริ่มต้นด้วยอีเมลและรหัสผ่านสำหรับบัญชีใหม่"
      mode="signup"
      passwordLabel="สร้างรหัสผ่าน"
      submitLabel="สมัครสมาชิก"
      title="สมัครสมาชิก"
      eyebrow="Account"
    />
  );
}
