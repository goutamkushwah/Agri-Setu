import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Package, ShoppingCart, TrendingUp, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, ordersRes, chatsRes] = await Promise.all([
        axios.get('/api/v1/admin/stats'),
        axios.get('/api/v1/admin/users'),
        axios.get('/api/v1/admin/orders'),
        axios.get('/api/v1/admin/chats')
      ]);
      setStats(statsRes.data.data);
      setUsers(usersRes.data.data.users);
      setOrders(ordersRes.data.data.orders);
      setChats(chatsRes.data.data.sessions);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openChat = async (sessionId) => {
    try {
      const { data } = await axios.get(`/api/v1/chat/sessions/${sessionId}`);
      setSelectedChat(data.data.session);
      setChatMessages(data.data.messages);
    } catch {
      toast.error('Failed to load chat');
    }
  };

  const formatDate = (d) => (d ? new Date(d).toLocaleString() : '—');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground mb-8">System overview and management</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers ?? 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.customers ?? 0} customers, {stats?.farmers ?? 0} farmers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalProducts ?? 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalOrders ?? 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{Number(stats?.revenue || 0).toLocaleString('en-IN')}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chat Sessions</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalChatSessions ?? 0}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="registrations" className="w-full">
          <TabsList>
            <TabsTrigger value="registrations">Registrations</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="chats">Chatbot Chats</TabsTrigger>
          </TabsList>

          <TabsContent value="registrations" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>User Registrations</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Registered</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                          No registrations yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((u) => (
                        <TableRow key={u.id}>
                          <TableCell>{u.name}</TableCell>
                          <TableCell>{u.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{u.role}</Badge>
                          </TableCell>
                          <TableCell>{u.phone}</TableCell>
                          <TableCell>{formatDate(u.createdAt)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>All Orders</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Farmer</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                          No orders yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      orders.map((o) => (
                        <TableRow key={o.id}>
                          <TableCell>{o.orderNumber}</TableCell>
                          <TableCell>{o.customerName || '—'}</TableCell>
                          <TableCell>{o.farmerName || '—'}</TableCell>
                          <TableCell>₹{Number(o.totalAmount).toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge>{o.status}</Badge>
                          </TableCell>
                          <TableCell>{formatDate(o.createdAt)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chats" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Chat Sessions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 max-h-[480px] overflow-y-auto">
                  {chats.length === 0 ? (
                    <p className="text-muted-foreground">No chat sessions yet</p>
                  ) : (
                    chats.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => openChat(c.id)}
                        className={`w-full text-left rounded-lg border p-3 hover:bg-muted/50 ${
                          selectedChat?.id === c.id ? 'border-primary bg-muted/30' : ''
                        }`}
                      >
                        <p className="font-medium">{c.displayName}</p>
                        <p className="text-xs text-muted-foreground truncate">{c.lastMessage}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {c.messageCount} messages · {formatDate(c.updatedAt)}
                        </p>
                      </button>
                    ))
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Conversation</CardTitle>
                  {selectedChat && (
                    <Button variant="ghost" size="sm" onClick={() => { setSelectedChat(null); setChatMessages([]); }}>
                      Clear
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="max-h-[480px] overflow-y-auto space-y-3">
                  {!selectedChat ? (
                    <p className="text-muted-foreground">Select a session to view messages</p>
                  ) : chatMessages.length === 0 ? (
                    <p className="text-muted-foreground">No messages in this session</p>
                  ) : (
                    chatMessages.map((m) => (
                      <div
                        key={m.id}
                        className={`rounded-lg px-3 py-2 text-sm ${
                          m.role === 'user' ? 'bg-primary/10' : 'bg-muted'
                        }`}
                      >
                        <p className="text-xs font-medium mb-1 capitalize">{m.role}</p>
                        <p>{m.content}</p>
                        <p className="text-xs text-muted-foreground mt-1">{formatDate(m.createdAt)}</p>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
