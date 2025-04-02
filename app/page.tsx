import { Button } from "@/components/ui/button";
import { BookOpenCheck } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Transform Your API Documentation
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Generate beautiful, structured API documentation from your Postman collections using AI.
              Perfect for teams that want professional documentation without the hassle.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/auth/signup">
                <Button size="lg" className="text-lg">
                  Get Started
                  <BookOpenCheck className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" size="lg" className="text-lg">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-muted py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary">Faster Documentation</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to document your API
            </p>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Upload your Postman collection and let AI do the heavy lifting. Get professional documentation in minutes, not hours.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.name} className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7">
                    <feature.icon className="h-5 w-5 flex-none text-primary" aria-hidden="true" />
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    name: 'AI-Powered Documentation',
    description: 'Our AI analyzes your Postman collection and generates comprehensive documentation that follows best practices.',
    icon: BookOpenCheck,
  },
  {
    name: 'Beautiful Templates',
    description: 'Documentation that looks and feels like official React and Next.js docs, complete with dark mode support.',
    icon: BookOpenCheck,
  },
  {
    name: 'Easy Integration',
    description: "Simply upload your Postman collection JSON file and we'll handle the rest. No complex setup required.",
    icon: BookOpenCheck,
  },
];