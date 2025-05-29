export default function EmailConfirmation() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded shadow max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4 text-blue-600">Check your email 📬</h1>
        <p className="text-gray-700 mb-2">
          A confirmation link has been sent to your email. Please verify your account to continue.
        </p>
        <p className="text-gray-500 text-sm">
          Didn’t get the email? Check your spam folder or try signing up again.
        </p>
      </div>
    </div>
  );
}
