import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const About = () => {
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">About Agri-Setu</h1>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground">
                Agri-Setu was founded in 2019 with a simple mission: to connect local farmers directly with consumers, 
                ensuring fair prices for farmers and fresh, organic produce for customers.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>What We Do</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground">
                We provide a platform where local farmers can list their fresh produce and customers can order 
                directly from them. Every purchase on Agri-Setu directly supports local agriculture and helps 
                build sustainable farming communities.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Why Choose Us</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>• 100% organic and fresh produce</li>
                <li>• Direct from farm to your doorstep</li>
                <li>• Fair prices for farmers</li>
                <li>• Supporting local agriculture</li>
                <li>• Fast and reliable delivery</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground">
                Have questions? Agri-Setu is here for you. Reach out to us anytime and we'll be happy to help.
              </p>
              <p className="mt-4">
                <strong>Email:</strong> info@goutam.kushwah2003@gmail.com
                </p>
                <p>
                <strong>Email:</strong> info@sensapna250@gmail.com
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;
