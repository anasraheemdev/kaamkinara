import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Users, Wrench, Shield, Clock, MapPin } from "lucide-react"

export default function HomePage() {
  const services = ["Plumber", "Electrician", "Mason", "Painter", "Carpenter", "Cleaner"]

  const stats = [
    { icon: Users, label: "Active Workers", value: "10,000+" },
    { icon: Wrench, label: "Services Completed", value: "50,000+" },
    { icon: Star, label: "Average Rating", value: "4.8" },
    { icon: Shield, label: "Verified Workers", value: "95%" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wrench className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Kaam Kinara</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">Find Skilled Workers for Any Job</h2>
          <p className="text-xl text-gray-600 mb-8">
            Connect with verified professionals in your area. From plumbing to painting, get quality work done at fair
            prices.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/auth/signup?role=customer">
              <Button size="lg" className="w-full sm:w-auto">
                <Users className="mr-2 h-5 w-5" />I Need a Worker
              </Button>
            </Link>
            <Link href="/auth/signup?role=worker">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <Wrench className="mr-2 h-5 w-5" />I Want to Work
              </Button>
            </Link>
          </div>

          {/* Services */}
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {services.map((service) => (
              <Badge key={service} variant="secondary" className="px-4 py-2">
                {service}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <stat.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">How Kaam Kinara Works</h3>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Customer Flow */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-6 w-6 text-blue-600" />
                  For Customers
                </CardTitle>
                <CardDescription>Get your work done in 3 simple steps</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-semibold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold">Post Your Job</h4>
                    <p className="text-gray-600">Describe what you need and set your budget</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-semibold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold">Choose a Worker</h4>
                    <p className="text-gray-600">Browse profiles, ratings, and prices</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-semibold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold">Get Work Done</h4>
                    <p className="text-gray-600">Track progress and pay securely</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Worker Flow */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wrench className="mr-2 h-6 w-6 text-green-600" />
                  For Workers
                </CardTitle>
                <CardDescription>Start earning in 3 simple steps</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 text-green-600 rounded-full w-8 h-8 flex items-center justify-center font-semibold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold">Create Profile</h4>
                    <p className="text-gray-600">Showcase your skills and experience</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 text-green-600 rounded-full w-8 h-8 flex items-center justify-center font-semibold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold">Get Verified</h4>
                    <p className="text-gray-600">Complete verification process</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 text-green-600 rounded-full w-8 h-8 flex items-center justify-center font-semibold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold">Start Working</h4>
                    <p className="text-gray-600">Accept jobs and build your reputation</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose Kaam Kinara?</h3>

        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <Shield className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Verified Workers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                All workers are verified with ID checks and skill assessments for your safety and quality assurance.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Clock className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Real-time Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Track your worker's location and job progress in real-time for complete transparency.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <MapPin className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Local Workers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Find skilled workers in your neighborhood for quick response and local expertise.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Wrench className="h-6 w-6" />
                <span className="text-xl font-bold">Kaam Kinara</span>
              </div>
              <p className="text-gray-400">Connecting skilled workers with customers across urban areas.</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">For Customers</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/services" className="hover:text-white">
                    Browse Services
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="hover:text-white">
                    How it Works
                  </Link>
                </li>
                <li>
                  <Link href="/safety" className="hover:text-white">
                    Safety
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">For Workers</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/become-worker" className="hover:text-white">
                    Become a Worker
                  </Link>
                </li>
                <li>
                  <Link href="/worker-benefits" className="hover:text-white">
                    Benefits
                  </Link>
                </li>
                <li>
                  <Link href="/training" className="hover:text-white">
                    Training
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Kaam Kinara. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
