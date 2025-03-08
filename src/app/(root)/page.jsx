import { getCurrentUser } from "src/actions/users/users.actions";
import HomePageContent from "./home-page-content";
import Link from "next/link";

const HomePage = async () => {
  const currentUser = await getCurrentUser();

  return (
    <div className="relative min-h-screen font-serif">
      {/* Content Overlay */}

      {!currentUser ? (
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center bg-black/40">
          {/* Background Video */}
          <video
            autoPlay
            muted
            loop
            className="absolute inset-0 object-cover w-full h-full"
          >
            <source
              src="/assets/images/videos/lilia-auth-background.mov"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold mb-4 text-center text-white">
              Welcome to Lilia <br /> The Smart Garden
            </h1>
            <p className="text-gray-300 mb-4">
              Please sign up or log in to access your dashboard.
            </p>
            <Link
              href="/flow/auth/login"
              className="rounded-full bg-[#00A35B] px-6 py-2 text-white hover:bg-[#029b56]"
            >
              Log In
            </Link>
          </div>
        </div>
      ) : (
        <HomePageContent currentUser={currentUser} />
      )}
    </div>
  );
};

export default HomePage;
