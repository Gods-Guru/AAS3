import AuthForm from "../../components/AuthForm";

const Signup = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <AuthForm type="signup" />
        </div>
    );
};

export default Signup;