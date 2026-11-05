import { login } from "../actions";
import { ActionForm, SubmitButton } from "../_components/action-form";

export default function LoginPage() {
  return (
    <main className="admin-login">
      <ActionForm action={login} className="admin-card admin-login-card">
        <h1>ადმინ პანელი</h1>
        <label className="admin-field">
          <span>მომხმარებელი</span>
          <input name="username" required autoFocus autoComplete="username" autoCapitalize="none" spellCheck={false} />
        </label>
        <label className="admin-field">
          <span>პაროლი</span>
          <input type="password" name="password" required autoComplete="current-password" />
        </label>
        <SubmitButton>შესვლა</SubmitButton>
      </ActionForm>
    </main>
  );
}
