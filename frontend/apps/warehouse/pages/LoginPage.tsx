/*
 * 仓库 H5 备用端登录注册页配置，复用三端通用认证页面。
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
      logoText="W"
      title="仓库作业端"
      defaultPosition="warehouse_staff"
      positionOptions={[
        { value: 'warehouse_staff', label: '仓库收货员' },
        { value: 'warehouse_admin', label: '仓库主管' }
      ]}
    />
  );
}
