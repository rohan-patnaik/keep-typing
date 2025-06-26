import AuthForm from '../components/Auth/AuthForm';

export default function AuthPage() {
  return (
    <div className="flex justify-center items-center mt-10">
      <div className="w-full max-w-md">
        <AuthForm />
      </div>
    </div>
  );
}
