import { AuthShell } from "@/components/auth/auth-shell";

export default function LoginPage() {
  return (
    <AuthShell
      alternateHref="/signup"
      alternateLabel="สมัครสมาชิก"
      alternateText="ยังไม่มีบัญชี?"
      description="เข้าสู่ระบบเพื่อบันทึกรถที่สนใจ นัดทดลองขับ ติดตามไฟแนนซ์ และจัดการทุกขั้นตอนการซื้อรถในที่เดียว"
      footerText="กรอกอีเมลและรหัสผ่านเพื่อเข้าสู่บัญชีของคุณ"
      passwordLabel="รหัสผ่าน"
      submitLabel="Login"
      title="เข้าสู่ระบบ"
    />
  );
}
