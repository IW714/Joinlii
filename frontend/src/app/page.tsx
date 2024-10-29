'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@mantine/core';
import { TypeAnimation } from 'react-type-animation';
import Gradient from './components/Gradient';
import Image from 'next/image';

import { useAuth } from './components/AuthContext';

const HomePage = () => {
  const { isAuthenticated, loading} = useAuth();
  const router = useRouter();
  const redirect = isAuthenticated ? '/dashboard/profile' : '/login';

  useEffect(() => {
    // if (!loading && isAuthenticated) {
    //   // Redirect to profile page if authenticated
    //   // TODO: May be changed to dashboard once implemented
    //   router.push('/profile');
    // }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Image
          src="/assets/joinlii.gif"
          alt="Loading..."
          width={700}
          height={700}
          priority
          unoptimized
        />
      </div>
    );
  }

  return (
    <>
      <Gradient />

        {/* Main Content */}
      <div className="relative flex flex-col items-center justify-center min-h-screen p-4 bg-transparent z-10">
        
        {/* Card Container */}
        <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center justify-center">
          
          {/* Header Section */}
          <div className="flex flex-col items-center justify-center">
            <h1 className="mb-4 text-center text-3xl font-bold text-gray-800 md:text-5xl flex items-center">
              <TypeAnimation
                sequence={[
                  'Welcome to Joinlii!', // Types 'Welcome to Joinlii!'
                  2000, // Waits for 2 seconds
                  'Collaborate Effortlessly.', // Deletes and types new string
                  2000,
                  'Achieve More Together.', // And so on...
                  2000,
                ]}
                wrapper="span"
                cursor={true}
                repeat={Infinity}
                className="inline-block"
              />
            </h1>
            <div className="w-fit rounded-md bg-gradient-to-r from-fuchsia-600 to-pink-600 p-2 px-4 text-3xl font-semibold text-white md:text-5xl">
              Do More Together.
            </div>
          </div>
        
          {/* Description Section */}
          <div className="mx-auto mt-6 max-w-md text-center text-sm text-gray-500 md:max-w-2xl md:text-lg">
            Joinlii enables groups to collaborate seamlessly, whether you're coordinating work projects, sharing schedules with friends, or organizing community activities. Connect and stay productive together through our intuitive web platform, no matter where you are.
          </div>
          
          {/* Call-to-Action Button */}
          <div className="mt-8 flex space-x-4">
            <Button component={Link} href={redirect} size="lg" variant="filled">
              Get Started for Free
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;