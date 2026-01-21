import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Header } from "@/components/Header";
import {
  Users,
  FileText,
  Activity,
  BarChart3,
  Search,
  Shield,
  LogOut,
  Eye,
  Trash2,
  RefreshCw,
  UserCheck,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface Application {
  id: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: string;
  createdAt: string;
  userId?: number;
}

interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  userId?: number;
  ip: string;
}

const Admin = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("users");
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      navigate('/');
      return;
    }

    try {
      // Check if user is admin
      const profileResponse = await fetch('http://localhost:3001/api/auth/profile', {
        headers: {
          'Authorization': token
        }
      });

      const profileData = await profileResponse.json();

      if (!profileData.success) {
        localStorage.removeItem('authToken');
        navigate('/');
        return;
      }

      // Mock admin check - in real app would check user role
      if (profileData.user.email !== 'admin@windexs.com') {
        toast.error('У вас нет прав доступа к админ-панели');
        navigate('/');
        return;
      }

      setCurrentUser(profileData.user);
      await loadInitialData();
    } catch (error) {
      console.error('Admin access check error:', error);
      localStorage.removeItem('authToken');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const loadInitialData = async () => {
    try {
      await Promise.all([
        loadUsers(),
        loadApplications(),
        loadLogs()
      ]);
    } catch (error) {
      console.error('Error loading initial data:', error);
      toast.error('Ошибка загрузки данных');
    }
  };

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3001/api/admin/users', {
        headers: {
          'Authorization': token
        }
      });

      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadApplications = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3001/api/admin/applications', {
        headers: {
          'Authorization': token
        }
      });

      const data = await response.json();
      if (data.success) {
        setApplications(data.applications);
      }
    } catch (error) {
      console.error('Error loading applications:', error);
    }
  };

  const loadLogs = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3001/api/admin/logs', {
        headers: {
          'Authorization': token
        }
      });

      const data = await response.json();
      if (data.success) {
        setLogs(data.logs);
      }
    } catch (error) {
      console.error('Error loading logs:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      await loadUsers();
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3001/api/admin/users?search=${encodeURIComponent(searchQuery)}`, {
        headers: {
          'Authorization': token
        }
      });

      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error searching users:', error);
      toast.error('Ошибка поиска');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      new: <Badge variant="default">Новый</Badge>,
      'in-progress': <Badge variant="secondary">В работе</Badge>,
      completed: <Badge variant="outline" className="border-green-500 text-green-600">Завершен</Badge>
    };
    return variants[status as keyof typeof variants] || <Badge variant="outline">{status}</Badge>;
  };

  const getLogLevelBadge = (level: string) => {
    const variants = {
      info: <Badge variant="default">Info</Badge>,
      warn: <Badge variant="secondary">Warning</Badge>,
      error: <Badge variant="destructive">Error</Badge>
    };
    return variants[level as keyof typeof variants] || <Badge variant="outline">{level}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
      <Header />

      <div className="pt-24 px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Админ <span className="gradient-text">Панель</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Управление системой и мониторинг пользователей
            </p>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <Card className="card-gradient border border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Пользователей</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.length}</div>
              </CardContent>
            </Card>

            <Card className="card-gradient border border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Заявок</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{applications.length}</div>
              </CardContent>
            </Card>

            <Card className="card-gradient border border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Активных</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {applications.filter(app => app.status === 'in-progress').length}
                </div>
              </CardContent>
            </Card>

            <Card className="card-gradient border border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Завершенных</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {applications.filter(app => app.status === 'completed').length}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="users">Пользователи</TabsTrigger>
                <TabsTrigger value="applications">Заявки</TabsTrigger>
                <TabsTrigger value="logs">Логи</TabsTrigger>
                <TabsTrigger value="analytics">Аналитика</TabsTrigger>
              </TabsList>

              {/* Users Tab */}
              <TabsContent value="users" className="space-y-6">
                <Card className="card-gradient border border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Управление пользователями
                    </CardTitle>
                    <CardDescription>
                      Поиск и управление учетными записями пользователей
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Search */}
                    <div className="flex gap-4 mb-6">
                      <div className="flex-1">
                        <Input
                          placeholder="Поиск по имени, email или ID..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        />
                      </div>
                      <Button onClick={handleSearch}>
                        <Search className="w-4 h-4 mr-2" />
                        Найти
                      </Button>
                      <Button variant="outline" onClick={loadUsers}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Обновить
                      </Button>
                    </div>

                    {/* Users Table */}
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Имя</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Роль</TableHead>
                            <TableHead>Дата регистрации</TableHead>
                            <TableHead>Действия</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {users.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell className="font-mono text-sm">{user.id}</TableCell>
                              <TableCell className="font-medium">{user.name}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>
                                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                  {user.role === 'admin' ? 'Админ' : 'Пользователь'}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {formatDate(user.createdAt)}
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <BarChart3 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Applications Tab */}
              <TabsContent value="applications" className="space-y-6">
                <Card className="card-gradient border border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Заявки пользователей
                    </CardTitle>
                    <CardDescription>
                      Все контактные формы и заявки на услуги
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {applications.map((application) => (
                        <Card key={application.id} className="border border-border/50">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-lg">{application.name}</CardTitle>
                                <CardDescription className="flex items-center gap-4 mt-1">
                                  <span>{application.email}</span>
                                  {application.phone && <span>{application.phone}</span>}
                                  <span className="text-xs">{formatDate(application.createdAt)}</span>
                                </CardDescription>
                              </div>
                              {getStatusBadge(application.status)}
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                              {application.message}
                            </p>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4 mr-2" />
                                Просмотр
                              </Button>
                              <Button variant="outline" size="sm">
                                Ответить
                              </Button>
                              <Button variant="outline" size="sm">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Удалить
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Logs Tab */}
              <TabsContent value="logs" className="space-y-6">
                <Card className="card-gradient border border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      Системные логи
                    </CardTitle>
                    <CardDescription>
                      Журнал событий и действий в системе
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {logs.map((log, index) => (
                        <div key={index} className="flex items-start gap-4 p-3 border rounded-lg">
                          <div className="flex-shrink-0">
                            {getLogLevelBadge(log.level)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium">{log.message}</span>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(log.timestamp)}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {log.userId && <span>User ID: {log.userId} • </span>}
                              <span>IP: {log.ip}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="card-gradient border border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" />
                        Общая статистика
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Всего пользователей</span>
                        <span className="font-bold">{users.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Всего заявок</span>
                        <span className="font-bold">{applications.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Активных заявок</span>
                        <span className="font-bold">
                          {applications.filter(app => app.status === 'in-progress').length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Завершенных заявок</span>
                        <span className="font-bold">
                          {applications.filter(app => app.status === 'completed').length}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="card-gradient border border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        Системные оповещения
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                          <p className="text-sm text-green-800 dark:text-green-200">
                            ✅ Система работает нормально
                          </p>
                        </div>
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <p className="text-sm text-blue-800 dark:text-blue-200">
                            ℹ️ 3 новых пользователя за сегодня
                          </p>
                        </div>
                        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                          <p className="text-sm text-yellow-800 dark:text-yellow-200">
                            ⚠️ 2 заявки требуют внимания
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Admin;