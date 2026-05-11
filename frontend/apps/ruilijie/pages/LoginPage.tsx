/*
 * 瑞利杰内部端登录注册页配置，复用三端通用认证页面。
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
      logoText="R"
      title="瑞利杰供应链"
      defaultPosition="1"
      positionOptions={[
        { value: '1', label: '员工' },
        { value: '0', label: '老板' }
      ]}
    />
  );
}
