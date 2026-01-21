import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import {
  FileText,
  Plus,
  Target,
  Users,
  TrendingUp,
  DollarSign,
  Calendar,
  MapPin,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

interface Scenario {
  id: number;
  title: string;
  description: string;
  category: string;
  targetAudience: string;
  goals: string[];
  budget: string;
  duration: string;
  location: string;
  createdAt: string;
  status: 'draft' | 'active' | 'completed';
}

const Scenarios = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [scenarios, setScenarios] = useState<Scenario[]>([
    {
      id: 1,
      title: "Реклама нового продукта",
      description: "Запуск рекламной кампании для нового продукта в сфере технологий",
      category: "product",
      targetAudience: "tech-savvy-millennials",
      goals: ["brand-awareness", "lead-generation"],
      budget: "50000",
      duration: "30",
      location: "moscow",
      createdAt: new Date().toISOString(),
      status: "draft"
    }
  ]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    targetAudience: "",
    goals: [] as string[],
    budget: "",
    duration: "",
    location: ""
  });

  const categories = [
    { value: "product", label: "Продукт" },
    { value: "service", label: "Услуга" },
    { value: "brand", label: "Бренд" },
    { value: "event", label: "Мероприятие" },
    { value: "promotion", label: "Акция" }
  ];

  const targetAudiences = [
    { value: "young-adults", label: "Молодежь (18-25 лет)" },
    { value: "adults", label: "Взрослые (25-40 лет)" },
    { value: "families", label: "Семьи" },
    { value: "business", label: "Бизнес" },
    { value: "tech-savvy-millennials", label: "Технически подкованная молодежь" }
  ];

  const goals = [
    { value: "brand-awareness", label: "Узнаваемость бренда" },
    { value: "lead-generation", label: "Генерация лидов" },
    { value: "sales-increase", label: "Увеличение продаж" },
    { value: "website-traffic", label: "Трафик на сайт" },
    { value: "app-downloads", label: "Скачивания приложения" }
  ];

  const locations = [
    { value: "moscow", label: "Москва" },
    { value: "spb", label: "Санкт-Петербург" },
    { value: "regions", label: "Регионы" },
    { value: "online", label: "Онлайн" },
    { value: "international", label: "Международный" }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGoalToggle = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.category) {
      toast.error("Пожалуйста, заполните обязательные поля");
      return;
    }

    // Mock save scenario
    const newScenario: Scenario = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toISOString(),
      status: "draft"
    };

    setScenarios(prev => [newScenario, ...prev]);

    toast.success("Сценарий успешно создан!");

    // Reset form
    setFormData({
      title: "",
      description: "",
      category: "",
      targetAudience: "",
      goals: [],
      budget: "",
      duration: "",
      location: ""
    });

    setIsCreating(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Активный';
      case 'completed': return 'Завершен';
      default: return 'Черновик';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
      <Header />

      <div className="pt-24 px-4 pb-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Рекламные <span className="gradient-text">Сценарии</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Создавайте и управляйте сценариями рекламных кампаний для вашего бизнеса
            </p>
          </motion.div>

          {/* Create Scenario Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Button
              onClick={() => setIsCreating(!isCreating)}
              className="w-full md:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              {isCreating ? 'Отменить создание' : 'Создать новый сценарий'}
            </Button>
          </motion.div>

          {/* Create Scenario Form */}
          {isCreating && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <Card className="card-gradient border border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Новый рекламный сценарий
                  </CardTitle>
                  <CardDescription>
                    Опишите ваш продукт/услугу и цели рекламной кампании
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="title">Название сценария *</Label>
                        <Input
                          id="title"
                          placeholder="Например: Запуск нового продукта"
                          value={formData.title}
                          onChange={(e) => handleInputChange("title", e.target.value)}
                          className="bg-secondary/50 border-border/50 focus:border-primary"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category">Категория *</Label>
                        <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                          <SelectTrigger className="bg-secondary/50 border-border/50 focus:border-primary">
                            <SelectValue placeholder="Выберите категорию" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Описание *</Label>
                      <Textarea
                        id="description"
                        placeholder="Подробно опишите ваш продукт, услугу или бренд, который вы хотите рекламировать..."
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        className="bg-secondary/50 border-border/50 focus:border-primary min-h-32"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="targetAudience">Целевая аудитория</Label>
                        <Select value={formData.targetAudience} onValueChange={(value) => handleInputChange("targetAudience", value)}>
                          <SelectTrigger className="bg-secondary/50 border-border/50 focus:border-primary">
                            <SelectValue placeholder="Выберите аудиторию" />
                          </SelectTrigger>
                          <SelectContent>
                            {targetAudiences.map((audience) => (
                              <SelectItem key={audience.value} value={audience.value}>
                                {audience.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location">География</Label>
                        <Select value={formData.location} onValueChange={(value) => handleInputChange("location", value)}>
                          <SelectTrigger className="bg-secondary/50 border-border/50 focus:border-primary">
                            <SelectValue placeholder="Выберите географию" />
                          </SelectTrigger>
                          <SelectContent>
                            {locations.map((location) => (
                              <SelectItem key={location.value} value={location.value}>
                                {location.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Цели кампании</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {goals.map((goal) => (
                          <Button
                            key={goal.value}
                            type="button"
                            variant={formData.goals.includes(goal.value) ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleGoalToggle(goal.value)}
                            className="justify-start"
                          >
                            {formData.goals.includes(goal.value) && <CheckCircle className="w-3 h-3 mr-1" />}
                            {goal.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="budget">Бюджет (₽)</Label>
                        <Input
                          id="budget"
                          type="number"
                          placeholder="50000"
                          value={formData.budget}
                          onChange={(e) => handleInputChange("budget", e.target.value)}
                          className="bg-secondary/50 border-border/50 focus:border-primary"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="duration">Длительность (дни)</Label>
                        <Input
                          id="duration"
                          type="number"
                          placeholder="30"
                          value={formData.duration}
                          onChange={(e) => handleInputChange("duration", e.target.value)}
                          className="bg-secondary/50 border-border/50 focus:border-primary"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button type="submit" className="flex-1">
                        <FileText className="w-4 h-4 mr-2" />
                        Создать сценарий
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsCreating(false)}
                      >
                        Отмена
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Scenarios List */}
          <div className="grid gap-6">
            {scenarios.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Нет созданных сценариев</h3>
                <p className="text-muted-foreground mb-6">
                  Создайте свой первый рекламный сценарий, чтобы начать планировать кампанию
                </p>
                <Button onClick={() => setIsCreating(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Создать сценарий
                </Button>
              </motion.div>
            ) : (
              scenarios.map((scenario, index) => (
                <motion.div
                  key={scenario.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="card-gradient border border-border/50 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-2 mb-2">
                            <FileText className="w-5 h-5" />
                            {scenario.title}
                          </CardTitle>
                          <CardDescription className="mb-3">
                            {scenario.description}
                          </CardDescription>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Target className="w-4 h-4" />
                              {categories.find(c => c.value === scenario.category)?.label}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {targetAudiences.find(a => a.value === scenario.targetAudience)?.label}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {locations.find(l => l.value === scenario.location)?.label}
                            </span>
                          </div>
                        </div>
                        <Badge variant="secondary" className={`${getStatusColor(scenario.status)} text-white`}>
                          {getStatusText(scenario.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-green-500" />
                          <span className="text-sm">
                            Бюджет: {scenario.budget ? `${scenario.budget} ₽` : 'Не указан'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          <span className="text-sm">
                            Длительность: {scenario.duration ? `${scenario.duration} дней` : 'Не указана'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-purple-500" />
                          <span className="text-sm">
                            Целей: {scenario.goals.length}
                          </span>
                        </div>
                      </div>

                      {scenario.goals.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium mb-2">Цели кампании:</p>
                          <div className="flex flex-wrap gap-1">
                            {scenario.goals.map((goal) => (
                              <Badge key={goal} variant="outline" className="text-xs">
                                {goals.find(g => g.value === goal)?.label}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2 pt-4 border-t border-border/50">
                        <Button variant="outline" size="sm">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          Просмотр
                        </Button>
                        <Button variant="outline" size="sm">
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Аналитика
                        </Button>
                        <Button variant="outline" size="sm">
                          Правка
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scenarios;