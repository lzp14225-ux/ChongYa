/*
 * 供应商端登录注册页配置，复用三端通用认证页面。
 */

import { AuthPage, type RegisterPayload } from '../../../src/components/auth/AuthPage';

type LoginPageProps = {
  loading: boolean;
  error: string;
  onSubmit: (phone: string, password: string) => Promise<void>;
  onRegister: (payload: RegisterPayload) => Promise<void>;
};

export function LoginPage(props: LoginPageProps) {
  return (
    <AuthPage
      {...props}
      logoText="S"
      logoClassName="green"
      title="供应商门户"
      defaultPosition="supplier_staff"
      positionOptions={[
        { value: 'supplier_staff', label: '供应商员工' },
        { value: 'supplier_admin', label: '供应商管理员' }
      ]}
    />
  );
}
