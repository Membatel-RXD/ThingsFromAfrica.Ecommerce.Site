import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { authService } from '../services/authService';
import { 
  MessageCircle, 
  Search, 
  Filter, 
  Send, 
  Reply, 
  Trash2, 
  CheckCircle,
  AlertCircle,
  User,
  Mail,
  Star,
  StarOff
} from 'lucide-react';
import AccountSidebar from '@/components/LeftSidebarNav';

interface Message {
  id: string;
  subject: string;
  content: string;
  sender: string;
  senderType: 'system' | 'support' | 'seller' | 'admin';
  timestamp: string;
  isRead: boolean;
  isStarred: boolean;
  priority: 'low' | 'medium' | 'high';
  category: 'order' | 'payment' | 'shipping' | 'account' | 'general';
  hasAttachment: boolean;
}

const MessageCenter: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isComposeModalOpen, setIsComposeModalOpen] = useState(false);
  const [composeSubject, setComposeSubject] = useState('');
  const [composeContent, setComposeContent] = useState('');
  const [composeCategory, setComposeCategory] = useState('general');
  const navigate = useNavigate();

  // Mock data - replace with actual API call
  const mockMessages: Message[] = [
    {
      id: '1',
      subject: 'Your Order #12345 has been shipped',
      content: 'Great news! Your order #12345 has been shipped and is on its way to you. You can track your package using the tracking number provided in your order details.',
      sender: 'System',
      senderType: 'system',
      timestamp: '2024-01-15T10:30:00Z',
      isRead: false,
      isStarred: true,
      priority: 'medium',
      category: 'shipping',
      hasAttachment: false
    },
    {
      id: '2',
      subject: 'Payment Confirmation - Order #12344',
      content: 'Thank you for your payment. Your order #12344 has been confirmed and is being processed. You will receive another notification once it ships.',
      sender: 'Payment Team',
      senderType: 'system',
      timestamp: '2024-01-14T14:22:00Z',
      isRead: true,
      isStarred: false,
      priority: 'low',
      category: 'payment',
      hasAttachment: true
    },
    {
      id: '3',
      subject: 'Welcome to our platform!',
      content: 'Welcome to our marketplace! We are excited to have you join our community. Here are some tips to get you started...',
      sender: 'Support Team',
      senderType: 'support',
      timestamp: '2024-01-13T09:15:00Z',
      isRead: true,
      isStarred: false,
      priority: 'low',
      category: 'account',
      hasAttachment: false
    },
    {
      id: '4',
      subject: 'Account Security Alert',
      content: 'We noticed a login attempt from a new device. If this was you, no action is needed. If not, please secure your account immediately.',
      sender: 'Security Team',
      senderType: 'system',
      timestamp: '2024-01-12T16:45:00Z',
      isRead: false,
      isStarred: true,
      priority: 'high',
      category: 'account',
      hasAttachment: false
    },
    {
      id: '5',
      subject: 'New products in your wishlist category',
      content: 'Check out these new products that match your interests! We have added some exciting new items to categories you follow.',
      sender: 'Marketing Team',
      senderType: 'system',
      timestamp: '2024-01-11T11:30:00Z',
      isRead: true,
      isStarred: false,
      priority: 'low',
      category: 'general',
      hasAttachment: false
    }
  ];

  useEffect(() => {
    const loadMessages = async () => {
      const isAuthenticated = await authService.checkSession();
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }

      try {
        // Replace with actual API call
        // const response = await apiService.get<Message[]>('messages');
        setMessages(mockMessages);
        setFilteredMessages(mockMessages);
      } catch (error) {
        console.error('Failed to load messages:', error);
        setMessages(mockMessages);
        setFilteredMessages(mockMessages);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [navigate]);

  useEffect(() => {
    let filtered = messages;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(message => 
        message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.sender.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter(message => message.category === filterCategory);
    }

    // Filter by status
    if (filterStatus === 'unread') {
      filtered = filtered.filter(message => !message.isRead);
    } else if (filterStatus === 'read') {
      filtered = filtered.filter(message => message.isRead);
    } else if (filterStatus === 'starred') {
      filtered = filtered.filter(message => message.isStarred);
    }

    setFilteredMessages(filtered);
  }, [searchTerm, filterCategory, filterStatus, messages]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSenderIcon = (senderType: string) => {
    switch (senderType) {
      case 'system':
        return <AlertCircle className="h-4 w-4" />;
      case 'support':
        return <MessageCircle className="h-4 w-4" />;
      case 'seller':
        return <User className="h-4 w-4" />;
      case 'admin':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  };

  const handleViewMessage = (message: Message) => {
    setSelectedMessage(message);
    setIsMessageModalOpen(true);
    
    // Mark as read
    if (!message.isRead) {
      setMessages(prev => prev.map(msg => 
        msg.id === message.id ? { ...msg, isRead: true } : msg
      ));
    }
  };

  const handleStarMessage = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isStarred: !msg.isStarred } : msg
    ));
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  };

  const handleSendMessage = () => {
    if (!composeSubject.trim() || !composeContent.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      subject: composeSubject,
      content: composeContent,
      sender: 'You',
      senderType: 'system',
      timestamp: new Date().toISOString(),
      isRead: true,
      isStarred: false,
      priority: 'medium',
      category: composeCategory as any,
      hasAttachment: false
    };

    setMessages(prev => [newMessage, ...prev]);
    setComposeSubject('');
    setComposeContent('');
    setComposeCategory('general');
    setIsComposeModalOpen(false);
  };

  const unreadCount = messages.filter(msg => !msg.isRead).length;
  const starredCount = messages.filter(msg => msg.isStarred).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex gap-6">
          <AccountSidebar activePath="/messages" />

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-black mb-2">Message Center</h1>
                  <p className="text-gray-700">Stay connected with important updates and communications</p>
                </div>
                <Button 
                  onClick={() => setIsComposeModalOpen(true)}
                  className="bg-black text-white hover:bg-gray-800"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Compose Message
                </Button>
              </div>

              {/* Message Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card className="border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Messages</p>
                        <p className="text-2xl font-bold text-black">{messages.length}</p>
                      </div>
                      <MessageCircle className="h-8 w-8 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Unread</p>
                        <p className="text-2xl font-bold text-black">{unreadCount}</p>
                      </div>
                      <Mail className="h-8 w-8 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Starred</p>
                        <p className="text-2xl font-bold text-black">{starredCount}</p>
                      </div>
                      <Star className="h-8 w-8 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">High Priority</p>
                        <p className="text-2xl font-bold text-black">
                          {messages.filter(msg => msg.priority === 'high').length}
                        </p>
                      </div>
                      <AlertCircle className="h-8 w-8 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="order">Orders</SelectItem>
                      <SelectItem value="payment">Payments</SelectItem>
                      <SelectItem value="shipping">Shipping</SelectItem>
                      <SelectItem value="account">Account</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Messages</SelectItem>
                      <SelectItem value="unread">Unread</SelectItem>
                      <SelectItem value="read">Read</SelectItem>
                      <SelectItem value="starred">Starred</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Messages List */}
            <div className="space-y-4">
              {filteredMessages.length === 0 ? (
                <Card className="border-gray-200">
                  <CardContent className="p-8 text-center">
                    <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No messages found</h3>
                    <p className="text-gray-600 mb-4">
                      {searchTerm || filterCategory !== 'all' || filterStatus !== 'all'
                        ? 'Try adjusting your search or filter criteria'
                        : 'You don\'t have any messages yet'
                      }
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredMessages.map((message) => (
                  <Card 
                    key={message.id} 
                    className={`border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                      !message.isRead ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                    onClick={() => handleViewMessage(message)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="flex items-center space-x-2">
                            {getSenderIcon(message.senderType)}
                            <span className="font-medium text-sm text-gray-600">{message.sender}</span>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className={`text-lg truncate ${!message.isRead ? 'font-bold' : 'font-semibold'}`}>
                                {message.subject}
                              </h3>
                              <Badge className={getPriorityColor(message.priority)}>
                                {message.priority}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {message.category}
                              </Badge>
                              {message.hasAttachment && (
                                <Badge variant="outline" className="text-xs">
                                  📎
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm truncate">{message.content}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-500">
                            {formatDate(message.timestamp)}
                          </span>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStarMessage(message.id);
                              }}
                            >
                              {message.isStarred ? 
                                <Star className="h-4 w-4 text-yellow-500 fill-current" /> : 
                                <StarOff className="h-4 w-4 text-gray-400" />
                              }
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteMessage(message.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-gray-400" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Message Details Modal */}
      <Dialog open={isMessageModalOpen} onOpenChange={setIsMessageModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedMessage?.subject}</span>
              <div className="flex items-center space-x-2">
                <Badge className={getPriorityColor(selectedMessage?.priority || 'low')}>
                  {selectedMessage?.priority}
                </Badge>
                <Badge variant="outline">
                  {selectedMessage?.category}
                </Badge>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {selectedMessage && (
            <div className="space-y-6">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  {getSenderIcon(selectedMessage.senderType)}
                  <span>From: {selectedMessage.sender}</span>
                </div>
                <span>{formatDate(selectedMessage.timestamp)}</span>
              </div>
              
              <div className="prose max-w-none">
                <p className="text-gray-800 leading-relaxed">{selectedMessage.content}</p>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsMessageModalOpen(false)}>
                  Close
                </Button>
                <Button className="bg-black text-white hover:bg-gray-800">
                  <Reply className="h-4 w-4 mr-2" />
                  Reply
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Compose Message Modal */}
      <Dialog open={isComposeModalOpen} onOpenChange={setIsComposeModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Compose New Message</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <Select value={composeCategory} onValueChange={setComposeCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="order">Order Inquiry</SelectItem>
                  <SelectItem value="payment">Payment Issue</SelectItem>
                  <SelectItem value="shipping">Shipping Question</SelectItem>
                  <SelectItem value="account">Account Support</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <Input
                value={composeSubject}
                onChange={(e) => setComposeSubject(e.target.value)}
                placeholder="Enter message subject"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <Textarea
                value={composeContent}
                onChange={(e) => setComposeContent(e.target.value)}
                placeholder="Type your message here..."
                rows={6}
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsComposeModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSendMessage}
                disabled={!composeSubject.trim() || !composeContent.trim()}
                className="bg-black text-white hover:bg-gray-800"
              >
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default MessageCenter;