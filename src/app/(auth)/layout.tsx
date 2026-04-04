import Link from 'next/link';
import { Building2 } from 'lucide-react';
import Image from 'next/image';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left panel - form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-12 xl:px-16">
        <div className="mx-auto w-full max-w-sm">
          <Link href="/" className="flex items-center gap-2 mb-10">
            <div className="w-9 h-9 rounded-lg gold-gradient flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-xl font-semibold text-foreground">
              Meus<span className="text-primary"> Real Estate</span>
            </span>
          </Link>
          {children}
        </div>
      </div>

      {/* Right panel - image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image
          src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80"
          alt="Dubai luxury property"
          fill
          className="object-cover"
          sizes="50vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 to-slate-900/20" />
        <div className="absolute bottom-8 left-8 right-8 text-white">
          <p className="font-display text-2xl font-semibold mb-2">
            Your Dubai Property Journey Starts Here
          </p>
          <p className="text-white/70 text-sm">
            Join thousands of satisfied clients who found their dream property through Meus Real Estate.
          </p>
        </div>
      </div>
    </div>
  );
}
