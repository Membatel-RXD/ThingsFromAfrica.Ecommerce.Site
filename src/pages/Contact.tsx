import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    // You could add a success message or redirect here
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-linen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-charcoal mb-2">Contact Us</h1>
          <p className="text-charcoal/70">Get in touch with us for any questions about our crafts or custom orders</p>
        </div>

        {/* Contact Content */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="border-olive-green/20">
            <CardHeader>
              <CardTitle className="text-2xl text-charcoal">Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-charcoal">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-charcoal">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="subject" className="text-charcoal">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="message" className="text-charcoal">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="mt-1"
                  />
                </div>
                <Button onClick={handleSubmit} className="w-full bg-burnt-sienna hover:bg-burnt-sienna/90">
                  Send Message
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="border-olive-green/20">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-burnt-sienna mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-charcoal text-lg mb-1">Address</h3>
                    <p className="text-charcoal/70">123 Craft Street<br />Lilongwe, Malawi</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-olive-green/20">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-burnt-sienna mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-charcoal text-lg mb-1">Phone</h3>
                    <p className="text-charcoal/70">+265 1 234 567</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-olive-green/20">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-burnt-sienna mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-charcoal text-lg mb-1">Email</h3>
                    <p className="text-charcoal/70">info@malawicrafts.com</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-olive-green/20">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Clock className="h-6 w-6 text-burnt-sienna mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-charcoal text-lg mb-1">Business Hours</h3>
                    <p className="text-charcoal/70">
                      Mon - Fri: 8:00 AM - 6:00 PM<br />
                      Sat: 9:00 AM - 4:00 PM<br />
                      Sun: Closed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Info Card */}
            <Card className="border-olive-green/20 bg-gradient-to-br from-olive-green/5 to-burnt-sienna/5">
              <CardContent className="p-6">
                <h3 className="font-bold text-charcoal text-lg mb-3">Visit Our Workshop</h3>
                <p className="text-charcoal/70 mb-4">
                  Come see our artisans at work and discover the stories behind each handcrafted piece. 
                  Workshop visits are available by appointment.
                </p>
                <Button variant="outline" className="border-burnt-sienna text-burnt-sienna hover:bg-burnt-sienna hover:text-white">
                  Schedule a Visit
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;