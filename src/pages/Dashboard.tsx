import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LogOut, User, Mail, Calendar, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Header } from "@/components/Header";

interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
  createdAt: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('authToken');

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('https://wizary.windexs.ru/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (data.success) {
          setUser(data.user);
        } else {
          localStorage.removeItem('authToken');
          toast.error('Сессия истекла. Пожалуйста, войдите снова.');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        localStorage.removeItem('authToken');
        toast.error('Произошла ошибка при загрузке профиля');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    toast.success('Вы успешно вышли из системы');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
      <Header />

      <div className="pt-24 px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Добро пожаловать, <span className="gradient-text">{user.name}</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Ваш личный кабинет
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="card-gradient border border-border/50">
                <CardHeader className="text-center">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-2xl">{user.name}</CardTitle>
                  <CardDescription>
                    {user.role === 'admin' ? 'Администратор системы' : 'Пользователь системы'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                    <Mail className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Дата регистрации</p>
                      <p className="text-sm text-muted-foreground">{formatDate(user.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                    <User className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Статус</p>
                      <div className="flex gap-2">
                        <Badge variant={user.role === 'admin' ? "default" : "secondary"} className="text-xs">
                          {user.role === 'admin' ? 'Администратор' : 'Активный'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="card-gradient border border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Быстрые действия
                  </CardTitle>
                  <CardDescription>
                    Управляйте своим аккаунтом
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" disabled>
                    <Settings className="w-4 h-4 mr-2" />
                    Настройки профиля
                    <Badge variant="outline" className="ml-auto text-xs">Скоро</Badge>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" disabled>
                    <Mail className="w-4 h-4 mr-2" />
                    История заказов
                    <Badge variant="outline" className="ml-auto text-xs">Скоро</Badge>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" disabled>
                    <User className="w-4 h-4 mr-2" />
                    Поддержка
                    <Badge variant="outline" className="ml-auto text-xs">Скоро</Badge>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="card-gradient border border-border/50">
                <CardHeader>
                  <CardTitle>Статистика</CardTitle>
                  <CardDescription>
                    Ваша активность в системе
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-secondary/50 rounded-lg">
                    <div className="text-3xl font-bold gradient-text">
                      {Math.max(1, Math.floor((new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)))}
                    </div>
                    <p className="text-sm text-muted-foreground">Дней в системе</p>
                  </div>
                  <div className="text-center p-4 bg-secondary/50 rounded-lg">
                    <div className="text-3xl font-bold gradient-text">
                      {user.role === 'admin' ? '15' : '2'}
                    </div>
                    <p className="text-sm text-muted-foreground">Заказов</p>
                  </div>
                  <div className="text-center p-4 bg-secondary/50 rounded-lg">
                    <div className="text-3xl font-bold gradient-text">
                      {user.role === 'admin' ? '850' : '125'}
                    </div>
                    <p className="text-sm text-muted-foreground">Баллов лояльности</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Logout Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <Card className="card-gradient border border-border/50 max-w-md mx-auto">
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4">
                  Хотите выйти из системы?
                </p>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Выйти из аккаунта
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;