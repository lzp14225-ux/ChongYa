/*
 * 瑞利杰内部端登录和注册页，负责采集账号信息并提交后端认证接口。
 */

import { BriefcaseBusiness, LockKeyhole, Phone, UserRound } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { AppButton } from '../../../src/components/form/AppButton';

type RegisterPayload = {
  phone: string;
  username: string;
  password: string;
  position: string;
};

type LoginPageProps = {
  loading: boolean;
  error: string;
  onSubmit: (phone: string, password: string) => Promise<void>;
  onRegister: (payload: RegisterPayload) => Promise<void>;
};

export function LoginPage({ loading, error, onSubmit, onRegister }: LoginPageProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [position, setPosition] = useState('1');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (mode === 'login') {
      await onSubmit(phone.trim(), password);
      return;
    }
    await onRegister({
      phone: phone.trim(),
      username: username.trim(),
      password,
      position
    });
  };

  return (
    <main className="login-page">
      <section className="login-panel">
        <div className="login-brand">
          <div className="logo">R</div>
          <div>
            <h1>瑞利杰供应链</h1>
            <p>内部管理端{mode === 'login' ? '登录' : '注册'}</p>
          </div>
        </div>
        <div className="login-tabs">
          <button className={mode === 'login' ? 'active' : ''} type="button" onClick={() => setMode('login')}>
            登录
          </button>
          <button className={mode === 'register' ? 'active' : ''} type="button" onClick={() => setMode('register')}>
            注册
          </button>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            <span>手机号</span>
            <div className="login-input">
              <Phone size={18} />
              <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="请输入手机号" autoComplete="username" />
            </div>
          </label>
          {mode === 'register' && (
            <>
              <label>
                <span>用户名</span>
                <div className="login-input">
                  <UserRound size={18} />
                  <input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="请输入用户名" />
                </div>
              </label>
              <label>
                <span>职位</span>
                <div className="login-input">
                  <BriefcaseBusiness size={18} />
                  <select value={position} onChange={(event) => setPosition(event.target.value)}>
                    <option value="1">员工</option>
                    <option value="0">老板</option>
                  </select>
                </div>
              </label>
            </>
          )}
          <label>
            <span>密码</span>
            <div className="login-input">
              <LockKeyhole size={18} />
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="请输入密码"
                type="password"
                autoComplete="current-password"
              />
            </div>
          </label>
          {error && <div className="login-error">{error}</div>}
          <AppButton variant="primary">{loading ? '提交中...' : mode === 'login' ? '登录' : '注册并登录'}</AppButton>
        </form>
      </section>
    </main>
  );
}
